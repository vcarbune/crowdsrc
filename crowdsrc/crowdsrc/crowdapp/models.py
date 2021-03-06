import os
from datetime import datetime
from random import randint

from django.conf import settings
from django.db import models
from django.contrib.auth.models import User

from const import *
    
class Qualification(models.Model):
    name = models.CharField(max_length=200)
    
    def __unicode__(self):
        return self.name

class CustomUser(User):
    class Meta:
        permissions = (
            ('is_worker', 'Worker access'),
            ('is_task_creator', 'Task creator access'),
        )

class UserProfile(models.Model):
    
    user = models.OneToOneField(CustomUser)    
    last_login = models.DateTimeField(default=datetime.now)

    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    
    gender = models.CharField(max_length=1, choices=GENDERS)
    birth_date = models.DateField()
    education_field = models.SmallIntegerField(choices=EDUCATION_FIELDS) 
    birth_place = models.CharField(max_length=2, choices=COUNTRIES, default='CH')
    current_country = models.CharField(max_length=2, choices=COUNTRIES, default='CH')
    
    qualifications = models.ManyToManyField(Qualification, null=True, blank=True)
    
    def can_solve(self, task):
        if self.is_qualified(task) == False:
            return False
        times_solved = Solution.objects.filter(worker=self, task=task).exclude(status=0).count()
        return task.can_be_solved(times_solved)

    def is_qualified(self, task):
        task_qualifs = set(task.qualifications.all())
        user_qualifs = set(self.qualifications.all())
        if task_qualifs.issubset(user_qualifs):
            return True
        return False
    
    def __unicode__(self):
        return self.first_name + " " + self.last_name

class Task(models.Model):
    creator = models.ForeignKey(UserProfile)
    name = models.CharField(max_length=200)
    content = models.TextField()
    is_active = models.BooleanField(default=False)
    cost = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(default=datetime.now()) 
    resources_per_task = models.SmallIntegerField(default=0)
    solutions_auto_approved = models.BooleanField(default=True)
 
    qualifications = models.ManyToManyField(Qualification, blank=True) 
    
    def get_random_access_path(self): 
        # returns a random access path from all created for the task
        access_paths = self.accesspath_set.all()
        if len(access_paths) == 0:
            return None
        idx = randint(0, len(access_paths)-1)
        return access_paths[idx]
  
    def get_random_resources(self, user):
        # get set of all resources for this task
        resources = self.resource_set.all()
        
        # if the content is not variable return all resources
        if len(resources) <= self.resources_per_task:
            return resources
       
        # get resources ids of each previous solution (for this task and worker)
        res_prev_sols = [list(sol.resources.all().values_list('id', flat = True)) for sol in Solution.objects.filter(task=self, worker=user).exclude(resources=None)]
        # sort resource ids for each solution
        for res_list in res_prev_sols:
            res_list.sort()

        # generate resource set candidate
        # assume maximum 100 tries are needed
        for iter in range(100):
            selected_resources = []  
            ids = []
            k = 0
            while k < self.resources_per_task:
                idx = randint(0, len(resources)-1)
                if resources[idx].id not in ids:
                    selected_resources.append(resources[idx])
                    ids.append(resources[idx].id)
                    k = k+1
        # check resource set was not solved previously by the worker
            ids.sort()
            if ids not in res_prev_sols:
                return selected_resources
        return []
    
    # returns number of times a worker can solve the task
    # counts number of distinct resource sets a worker can get
    def can_be_solved(self, times_solved):
        if self.resources_per_task == 0:
            return times_solved < 1
        total_res = Resource.objects.filter(task = self).count()
        if total_res == self.resources_per_task:
            return times_solved < 1
        k = min(self.resources_per_task, total_res - self.resources_per_task)
        total_times = 1L
        for i in range(k):
          total_times *= (total_res-i)/(i+1)
          if total_times > times_solved:
            return True
        return False

    def __unicode__(self):
        return self.name
    
def resources_upload_path(instance, filename):
    return os.path.join('resources', str(instance.task.id), filename)
    
class Resource(models.Model):
    task = models.ForeignKey(Task)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to = resources_upload_path, null=True, blank = True)
    index = models.SmallIntegerField(null=True, blank=True)
    
    def get_absolute_image_url(self):
        import socket
        return '%s%s' % (settings.SERVER_URL, self.image.url)
    
    def __unicode__(self):
        return self.name

class AccessPath(models.Model):
    task = models.ForeignKey(Task)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    cost = models.SmallIntegerField(default=0)
    error = models.FloatField(default=0)
    
    def __unicode__(self):
        return self.name
    
class Solution(models.Model):
    worker = models.ForeignKey(UserProfile)
    task = models.ForeignKey(Task)
    access_path = models.ForeignKey(AccessPath, null=True)
    resources = models.ManyToManyField(Resource)
    status = models.SmallIntegerField(choices=STATUSES, default=0)
    created_at = models.DateTimeField(default=datetime.now())
    
    def __unicode__(self):
        return self.task.name + " [" + self.worker.__unicode__() + "]"
    
class TaskInput(models.Model):
    task = models.ForeignKey(Task)
    type = models.SmallIntegerField(default=0)
    index = models.SmallIntegerField(default=0)
    
    def __unicode__(self):
        return "Input " + str(self.index)
    
class TaskInputValue(models.Model):
    solution = models.ForeignKey(Solution)
    taskinput = models.ForeignKey(TaskInput)
    value = models.CharField(max_length=200)
    
    def __unicode__(self):
        return self.taskinput.__unicode__() + ": " + self.value

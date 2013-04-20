import os
from datetime import datetime
from random import randint

from django.db import models
from django.contrib.auth.models import User

from const import *

    
class Qualification(models.Model):
    name = models.CharField(max_length=200)
    
    def __unicode__(self):
        return self.name

class UserProfile(models.Model):
    
    user = models.OneToOneField(User)    
    last_login = models.DateTimeField(default=datetime.now)

    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    
    gender = models.CharField(max_length=1, choices=GENDERS)
    birth_date = models.DateField()
    education_field = models.SmallIntegerField(choices=EDUCATION_FIELDS) 
    birth_place = models.CharField(max_length=2, choices=COUNTRIES, default='CH')
    current_country = models.CharField(max_length=2, choices=COUNTRIES, default='CH')
    
    qualifications = models.ManyToManyField(Qualification, null=True, blank=True)
    
    is_taskcreator = models.BooleanField(default=False)
    
    def __unicode__(self):
        return self.first_name + " " + self.last_name
    

class Task(models.Model):
    creator = models.ForeignKey(UserProfile)
    name = models.CharField(max_length=200)
    html = models.TextField()
    is_active = models.BooleanField(default=False)
    cost = models.SmallIntegerField(default=0)
    created_at = models.DateField(default=datetime.now()) 
    
    qualifications = models.ManyToManyField(Qualification, blank=True) 
    
    def get_random_access_path(self): # returns a random access path from all created for the task
        access_paths = self.accesspath_set.all()
        if len(access_paths) == 0:
            return None
        idx = randint(0, len(access_paths)-1)
        return access_paths[idx]
    
    def get_random_resources(self, num_res):
        resources = self.resources_set.all()
        selected_resources = []
        res_ids = []
        k = 0
        
        if len(resources) < num_res:
            return resources
        
        while k < num_res:
            idx = randint(0, len(resources)-1)
            if not res_ids.contains(idx):
                res_ids.append(idx)
                selected_resources.append(resources[idx])
        return selected_resources
    
    def __unicode__(self):
        return self.name
    
def resources_upload_path(instance, filename):
    return os.path.join('uploads' , 'resources', str(instance.task.id), filename)
    
class Resource(models.Model):
    task = models.ForeignKey(Task)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to = resources_upload_path, null=True, blank = True)
    index = models.SmallIntegerField(null=True, blank=True)
    
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
    created_at = models.DateField()
    
    def __unicode__(self):
        return self.task.name + " [" + self.worker.__unicode__() + "]"
    
class TaskInput(models.Model):
    task = models.ForeignKey(Task)
    type = models.SmallIntegerField(choices=ANSWER_TYPES, default=0)
    index = models.SmallIntegerField(default=0)
    
    def __unicode__(self):
        return "Input " + str(self.index)
    
class TaskInputValue(models.Model):
    taskinput = models.ForeignKey(TaskInput)
    value = models.CharField(max_length=200)
    
    def __unicode__(self):
        return answer.__unicode__ + ": " + value
    
    
    
    


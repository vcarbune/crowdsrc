from datetime import datetime
from random import randint

from django.db import models
from django.contrib.auth.models import User

from const import *

class Language(models.Model):
    name = models.CharField(max_length=30)
    
    def __unicode__(self):
        return self.name
    
class Qualification(models.Model):
    name = models.CharField(max_length=100)
    
    def __unicode__(self):
        return self.name
    
class Badge(models.Model):
    name = models.CharField(max_length=100)
    
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
    
    languages = models.ManyToManyField(Language, null=True, blank=True)
    qualifications = models.ManyToManyField(Qualification, null=True, blank=True)
    badges = models.ManyToManyField(Badge, null=True, blank=True)
    
    current_country = models.CharField(max_length=2, choices=COUNTRIES, default='CH')
    
    is_taskcreator = models.BooleanField(default=False)
    
    def __unicode__(self):
        return self.first_name + " " + self.last_name
    

class Task(models.Model):
    creator = models.ForeignKey(UserProfile)
    name = models.CharField(max_length=200)
    html = models.CharField(max_length=1000000)
    is_active = models.BooleanField(default=False)
    cost = models.SmallIntegerField(default=0)
    created_at = models.DateField(default=datetime.now())  
    
    def get_random_access_path(self): # returns a random access path from all created for the task
        access_paths = self.accesspath_set.all()
        if len(access_paths) == 0:
            return None
        idx = randint(0, len(access_paths)-1)
        return access_paths[idx]
    
    def __unicode__(self):
        return self.name
    
class Resource(models.Model):
    task = models.ForeignKey(Task)
    name = models.CharField(max_length=100)
    index = models.SmallIntegerField(null=True, blank=True)
    
    def __unicode__(self):
        return self.name

class AccessPath(models.Model):
    task = models.ForeignKey(Task)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=400)
    cost = models.SmallIntegerField(default=0)
    error = models.FloatField(default=0)
    
    def __unicode__(self):
        return self.name
    
class Solution(models.Model):
    worker = models.ForeignKey(UserProfile)
    task = models.ForeignKey(Task)
    access_path = models.ForeignKey(AccessPath, null=True)
    status = models.SmallIntegerField(choices=STATUSES, default=0)
    created_at = models.DateField()
    
    def __unicode__(self):
        return self.task.name + " [" + self.worker.__unicode__() + "]"
    
class Answer(models.Model):
    solution = models.ForeignKey(Solution)
    type = models.SmallIntegerField(choices=ANSWER_TYPES, default=0)
    value = models.CharField(max_length=30)
    index = models.SmallIntegerField(default=0)
    
    def __unicode__(self):
        return "Answer " + str(self.index)
    
    
    
    
    
    


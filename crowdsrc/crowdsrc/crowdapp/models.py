from datetime import datetime

from django.db import models
from django.contrib.auth.models import User

from const import *

class Language(models.Model):
    name = models.CharField(max_length=30)
    
class Qualification(models.Model):
    name = models.CharField(max_length=100)
    
class Badge(models.Model):
    name = models.CharField(max_length=100)


class UserProfile(models.Model):
    
    user = models.OneToOneField(User)    
    last_login = models.DateTimeField(default=datetime.now)

    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    
    gender = models.CharField(max_length=1, choices=GENDERS)
    birth_date = models.DateField()
    education_field = models.SmallIntegerField(choices=EDUCATION_FIELDS) 
    
    birth_place = models.CharField(max_length=2, choices=COUNTRIES, default='CH')
    
    languages = models.ManyToManyField(Language)
    qualifications = models.ManyToManyField(Qualification)
    badges = models.ManyToManyField(Badge)
    
    current_country = models.CharField(max_length=2, choices=COUNTRIES, default='CH')
    
    is_taskcreator = models.BooleanField(default=False)
    

class Task(models.Model):
    creator = models.ForeignKey(UserProfile)    
    name = models.CharField(max_length=200)
    html = models.CharField(max_length=1000)
    is_active = models.BooleanField(default=False)
    cost = models.SmallIntegerField(default=0)
    
class Resource(models.Model):
    task = models.ForeignKey(Task)
    name = models.CharField(max_length=100)
    index = models.SmallIntegerField(null=True, blank=True)

class AccessPath(models.Model):
    task = models.ForeignKey(Task)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=400)
    cost = models.SmallIntegerField(default=0)
    error = models.FloatField(default=0)
    

class Solution(models.Model):
    worker = models.ForeignKey(UserProfile)
    access_path = models.ForeignKey(AccessPath)
    status = models.SmallIntegerField(choices=STATUSES, default=0)
    
class Answer(models.Model):
    solution = models.ForeignKey(Solution)
    type = models.SmallIntegerField(choices=ANSWER_TYPES, default=0)
    value = models.CharField(max_length=30)
    index = models.SmallIntegerField(default=0)
    
    
    
    
    
    
    


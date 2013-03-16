from datetime import datetime

from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User)    
    last_login = models.DateTimeField(default=datetime.now)

    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    
    #...

class Task(models.Model):
    creator = models.ForeignKey(UserProfile)    
    name = models.CharField(max_length=200)


from django import forms
from django.contrib import admin
from django.contrib.admin import site

from crowdapp.models import *

# Testing the admin interface

class UserProfileAdmin(admin.ModelAdmin):
    fields = ('user','first_name', 'last_name', 'birth_date', 'birth_place', 'gender', 'education_field')
    
admin.site.register(UserProfile, UserProfileAdmin)

class LanguageAdmin(admin.ModelAdmin):
    fields = ('name',)
    
admin.site.register(Language, LanguageAdmin)

class QualificationAdmin(admin.ModelAdmin):
    fields = ('name',)
    
admin.site.register(Qualification, QualificationAdmin)

class BadgeAdmin(admin.ModelAdmin):
    fields = ('name',)
    
admin.site.register(Badge, BadgeAdmin)
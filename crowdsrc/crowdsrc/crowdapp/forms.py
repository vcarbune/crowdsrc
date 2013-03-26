from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, SetPasswordForm
from django.forms import ModelForm
from django.forms.extras.widgets import SelectDateWidget
from django.forms.util import ErrorList
from django.utils.safestring import mark_safe

from models import *

class UserCreateForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super(UserCreateForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user

class ProfileForm(ModelForm):
    birth_date = forms.fields.DateField(widget=SelectDateWidget(years=range(2013, 1920, -1)))

    class Meta:
        model = UserProfile
        exclude = ('user', 'last_login', 'is_taskcreator', 'badges')

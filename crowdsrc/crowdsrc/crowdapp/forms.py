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
        
class CreateTaskForm(ModelForm):
    name = forms.CharField(label="Title")
    is_active = forms.BooleanField(label="Active", required=False)
    
    class Meta:
        model = Task
        fields = ('name', 'html', 'is_active', 'cost')
        
class TaskAdminForm(ModelForm):
    html = forms.CharField(widget=forms.Textarea)
    
    class Meta:
        model = Task
        
class AccessPathForm(ModelForm):
    description = forms.CharField(widget=forms.Textarea(attrs={'rows':'3'}))

    class Meta:
        model = AccessPath
        fields = ('name', 'description', 'cost', 'error')

AccessPathFormSet = forms.models.inlineformset_factory(Task, AccessPath, form=AccessPathForm, extra=1, max_num=4, can_delete=True)

        
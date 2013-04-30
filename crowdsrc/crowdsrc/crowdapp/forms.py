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
        model = CustomUser
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
    solutions_auto_approved = forms.BooleanField(label="Auto approve solutions?", required=False);
    
    content = forms.CharField(widget=forms.HiddenInput())
    
    class Meta:
        model = Task
        fields = ('name', 'content', 'is_active', 'cost', 'solutions_auto_approved', 'qualifications')
 
class TaskAdminForm(ModelForm):
    html = forms.CharField(widget=forms.Textarea)
    
    class Meta:
        model = Task
        
class AccessPathForm(ModelForm):
    description = forms.CharField(widget=forms.Textarea(attrs={'rows':'3'}))

    class Meta:
        model = AccessPath
        fields = ('name', 'description', 'cost', 'error')

AccessPathFormSet = forms.models.modelformset_factory(AccessPath, form=AccessPathForm, extra=0, max_num=4, can_delete=True)
AccessPathFormSetWithExtra = forms.models.modelformset_factory(AccessPath, form=AccessPathForm, extra=1, max_num=4, can_delete=True)

def get_accesspath_formset(task):
    if task and len(task.accesspath_set.all()) > 0:
        ap_formset = AccessPathFormSet(queryset=task.accesspath_set.all(), prefix='accesspath')
        ap_formset.is_empty = False
    else:
        ap_formset = AccessPathFormSetWithExtra(queryset=AccessPath.objects.none(), prefix='accesspath')
        ap_formset.is_empty = True
    return ap_formset
    
        
        

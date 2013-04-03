from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect, HttpRequest, Http404
from django.shortcuts import render, redirect, render_to_response, get_object_or_404
from django.template import RequestContext
from django.conf import settings

from models import *
from forms import *
from helpers import *

@login_required
def index(request):
    return render(request, 'home.html')
     
     
def register(request):     
    if request.method == 'POST':
        user_form = UserCreateForm(data=request.POST, prefix='user')
        profile_form = ProfileForm(data=request.POST, prefix='profile')
        if user_form.is_valid() and profile_form.is_valid():
            user = user_form.save()
            profile = profile_form.save(commit=False)
            profile.user = user
            profile.save()
            
            new_user = authenticate(username=request.POST['user-username'],
                                    password=request.POST['user-password1'])
            login(request, new_user)
            return redirect(reverse('crowdapp.views.index'))
    else:
        user_form = UserCreateForm(prefix='user')
        profile_form = ProfileForm(prefix='profile')
        
    return render(request, 'auth/register.html', {'user_form': user_form, 'profile_form': profile_form})


@login_required
def create_task(request):
    if request.method == 'POST':
        # FIXME: save task code goes here.
        return redirect('/')

    return render(request, 'task/create.html')

@login_required
def complete_task(request, task_id):
    profile = get_profile(request.user)
    task = Task.objects.get(id=task_id)
    
    if request.method == 'POST':
        solution, created = Solution.objects.get_or_create(worker=profile, task=task)
        if created:
            solution.access_path = AccessPath.objects.get(id=request.POST['access_path_id'])
        # Extract inputs
        val_list = []
        for key in request.POST.keys():
            if key.startswith("task_"):
                #print key + ":" + request.POST[key]
                val_list.append(request.POST[key])
        if check_solution_values(val_list):
            solution.status = 1
            for i in range(0, len(val_list), 1):
                answer, created = Answer.objects.get_or_create(solution=solution, index = i+1) 
                answer.value = val_list[i]
                answer.type = 0     # TODO: set type
                answer.save()
        else:
            solution.status = 0
        solution.save()
    else:
        solution, created = Solution.objects.get_or_create(worker=profile, task=task)
        if created:
            solution.access_path = task.get_random_access_path()
        
    return render(request, 'task/complete.html', {'solution': solution})


def tasks(request):
    return render(request, 'task/list.html')



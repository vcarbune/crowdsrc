from datetime import datetime

from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect, HttpRequest, Http404
from django.shortcuts import render, redirect, render_to_response, get_object_or_404
from django.template import RequestContext
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

from models import *
from forms import *
from helpers import *

import json
import urllib

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
def edit_task(request, task_id=None):
    profile = get_profile(request.user)
    if task_id:
        try:
            task = Task.objects.get(id=task_id)
        except ObjectDoesNotExist:
            raise Http404
    else:
        task = None
    
    if request.method == 'POST':
        task_form = CreateTaskForm(instance=task, data=request.POST, prefix='task')
        accesspath_formset = AccessPathFormSet(instance=task, data=request.POST, prefix='accesspath')
        
        if task_form.is_valid() and accesspath_formset.is_valid():
            task = task_form.save(commit=False)
            task.creator = get_profile(request.user)
            task.save()
            
            accesspaths = accesspath_formset.save(commit=False)
            for ap in accesspaths:
                ap.task = task
                ap.save()
               
            if task.is_active:
                return redirect(reverse('crowdapp.views.my_tasks'))
            else:
                accesspath_formset = AccessPathFormSet(instance=task, prefix='accesspath')
    else:
        task_form = CreateTaskForm(instance=task, prefix='task')
        accesspath_formset = AccessPathFormSet(instance=task, prefix='accesspath')
    return render(request, 'task/create.html', {'task_form': task_form, 'accesspath_formset': accesspath_formset})

@login_required
def view_task(request, task_id):
    try:
        profile = get_profile(request.user)
        task = Task.objects.get(id=task_id)
    except ObjectDoesNotExist:
        raise Http404

    if task.creator.id != profile.id:
        raise Http404
    

@login_required
def complete_task(request, task_id):
    try:
        profile = get_profile(request.user)
        task = Task.objects.get(id=task_id)
    except ObjectDoesNotExist:
        raise Http404
    
    if request.method == 'POST':
        solution, created = Solution.objects.get_or_create(worker=profile, task=task)
        if created:
            if 'access_path_id' in request.POST:
                solution.access_path = AccessPath.objects.get(id=request.POST['access_path_id'])
            else:
                solution.access_path = None
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
            solution.save()
            return redirect(reverse('crowdapp.views.view_solution', args=[solution.id]))
        else:
            solution.status = 0
            solution.save()
            message = "You have errors in your solution."
    else:
        solution, created = Solution.objects.get_or_create(worker=profile, task=task, created_at=datetime.now())
        if created:
            solution.access_path = task.get_random_access_path()
            solution.save()
        
    return render(request, 'task/complete.html', {'solution': solution, 'message': message})

@login_required
def get_solution_resources(solution_id, num_res):
    try:
        profile = get_profile(request.user)
        solution = Solution.objects.get(id=task_id)
    except ObjectDoesNotExist:
        raise Http404
    
    resources = solution.task.get_random_resources(num_res)
    
    return HttpResponse(json.dumps({"resources": resources}), mimetype="application/json")

@login_required
def my_tasks(request):
    try:
        profile = get_profile(request.user)
        tasks = Task.objects.filter(creator=profile)
    except ObjectDoesNotExist:
        raise Http404
    return render(request, 'task/mylist.html', {'tasks': tasks})

@login_required
def all_tasks(request):
    try:
        profile = get_profile(request.user)
        user_qualifs = set(profile.qualifications.all())
        all_tasks = Task.objects.filter(is_active=True)
        good_tasks = []
        for task in all_tasks:
            task_qualifs = set(task.qualifications.all())
            if task_qualifs.issubset(user_qualifs):
                good_tasks.append(task)
    except ObjectDoesNotExist:
        raise Http404
    return render(request, 'task/list.html', {'tasks': good_tasks})

@login_required
def view_solution(request, solution_id):
    try:
        solution = Solution.objects.get(id=solution_id)
    except ObjectDoesNotExist:
        raise Http404
    
    profile = get_profile(request.user)
    if solution.worker.id != profile.id and solution.task.creator.id != profile.id:
        raise Http404
    
    return render(request, 'solution/solution.html', {'solution': solution})

@login_required
def process_solution(request, solution_id, approved):
    try:
        solution = Solution.objects.get(id=solution_id)
        profile = get_profile(request.user)
    except ObjectDoesNotExist:
        raise Http404

    if solution.task.creator.id != profile.id:
        raise Http404
    
    if int(approved) == 1:
        solution.status = 2
    else:
        solution.status = 3
    solution.save()
    
    # TODO: do other stuff
    
    return redirect('crowdapp.views.view_solution', solution_id=solution.id)

@login_required
def my_solutions(request):
    
    profile = get_profile(request.user)
    solutions = Solution.objects.filter(worker=profile)
    
    return render(request, 'solution/my_solutions.html', {'solutions': solutions })

@login_required
def task_solutions(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        profile = get_profile(request.user)
        if task.creator != profile:
            raise Http404
    except ObjectDoesNotExist:
        raise Http404
    
    return render(request, 'solution/task_solutions.html', {'task': task })
    
def toolbox_dev(request):
    return render(request, 'dev/toolbox.html');

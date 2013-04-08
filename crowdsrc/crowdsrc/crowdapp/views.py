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
def create_task(request):
    if request.method == 'POST':
        profile = get_profile(request.user)
        task_params = json.loads(request.body)

        # FIXME: what's the default?
        request_cost = 30;
        if 'cost' in request:
            request_cost = task_params['cost'];

        task = Task.objects.create(
                creator=profile,
                name=task_params['name'],
                html=urllib.unquote(task_params['html']),
                is_active=task_params['is_active'],
                cost=request_cost,
                created_at=datetime.now());

        data = {
            "task_id": task.id,
        }

        return HttpResponse(json.dumps(data), content_type="application/json")

    return render(request, 'task/create.html', {'post': '... no request!'})

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
        else:
            solution.status = 0
        solution.save()
    else:
        solution, created = Solution.objects.get_or_create(worker=profile, task=task, created_at=datetime.now())
        if created:
            solution.access_path = task.get_random_access_path()
        
    return render(request, 'task/complete.html', {'solution': solution})

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
        tasks = Task.objects.filter(is_active=True)
    except ObjectDoesNotExist:
        raise Http404
    return render(request, 'task/list.html', {'tasks': tasks})

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
    
    
    
    


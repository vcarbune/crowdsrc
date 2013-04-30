import os
import uuid

from datetime import datetime

from django.core.urlresolvers import reverse
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.models import User, Permission
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect, HttpRequest, Http404
from django.shortcuts import render, redirect, render_to_response, get_object_or_404
from django.template import RequestContext
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt

from models import *
from forms import *
from helpers import *
from stats import *

import json
import urllib

@login_required
def index(request):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    return render(request, 'home.html')
     
def register(request):     
    if request.method == 'POST':
        user_form = UserCreateForm(data=request.POST, prefix='user')
        profile_form = ProfileForm(data=request.POST, prefix='profile')
        if user_form.is_valid() and profile_form.is_valid():
            user = user_form.save()
            profile = profile_form.save(commit=False)
            profile.user = user
            profile.user.user_permissions.add(Permission.objects.get(codename="is_worker"))
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
def account(request):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    try:
        profile = get_profile(request.user)
    except ObjectDoesNotExist:
        raise Http404
    if request.method == 'POST':
        profile_form = ProfileForm(data=request.POST, prefix='profile', instance=profile)
        if profile_form.is_valid():
            profile_form.save()  
    else :
        profile_form = ProfileForm(prefix='profile', instance=profile)
    return render(request, 'auth/account.html', {'profile_form': profile_form})

@permission_required('crowdapp.is_task_creator', raise_exception=True)
def edit_task(request, task_id=None):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    if task_id:
        try:
            task = Task.objects.get(id=task_id)
            profile = get_profile(request.user)
        except ObjectDoesNotExist:
            raise Http404
        if task.creator != profile:
            raise PermissionDenied
    else:
        task = None
        
    if request.method == 'POST':
        task_form = CreateTaskForm(instance=task, data=request.POST, prefix='task')
        accesspath_formset = AccessPathFormSet(data=request.POST, prefix='accesspath')
        
        if task_form.is_valid() and accesspath_formset.is_valid():
            # save task
            task = task_form.save(commit=False)
            task.creator = get_profile(request.user)
            task.save()
            
            # create resources from uploaded images
            for img in request.FILES.getlist('resource_files'):
                resource = Resource(task=task, index=1, image = img, name=get_pretty_name(img.name))
                resource.save()
                
            # create task input objects
            items = json.loads(task.content)
            task.taskinput_set.all().delete()
            for i in range(0, len(items), 1):
                input_type = get_input_type(items[i]['type'])
                if input_type != None:
                    task_input = TaskInput(task = task, index=i, type=input_type)
                    task_input.save()
            # get number of resources
                if items[i]['type'] == 'imageGroup':
                    task.resources_per_task = int(items[i]['nrImagesPerTask'])
                    task.save()
               
            # save access paths
            accesspaths = accesspath_formset.save(commit=False)
            for ap in accesspaths:
                ap.task = task
                ap.save()
               
            if task.is_active:
                return redirect(reverse('crowdapp.views.my_tasks'))
            else:
                return redirect(reverse('crowdapp.views.edit_task', args=[task.id]))
        else:
            if len(accesspath_formset.forms) > 0:
                accesspath_formset.is_empty = False
    else:
        task_form = CreateTaskForm(instance=task, prefix='task')
        accesspath_formset = get_accesspath_formset(task)
    return render(request, 'task/edit.html', {'task_form': task_form, 'accesspath_formset': accesspath_formset})

@login_required
def delete_task(request, task_id):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    try:
        task = Task.objects.get(id=task_id)
        profile = get_profile(request.user)
    except ObjectDoesNotExist:
        raise Http404
    if task.creator != profile:
        raise PermissionDenied
    
    task.delete()
    
    return redirect(reverse('crowdapp.views.my_tasks'))

@login_required
def complete_task(request, task_id, solution_id=0):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    message = ""

    if request.method == 'POST':
        try:
          solution = Solution.objects.get(id=solution_id)
        except ObjectDoesNotExist:
          raise Http404
        # Extract input values
        task_inputs = json.loads(request.POST['inputs'])
        
        if check_solution_values(task_inputs): # TODO: validate input
            solution.status = 1

            # Solutions might be auto-approved
            if Task.objects.get(id=task_id).solutions_auto_approved:
                solution.status = 2

            solution.save()
            
            for input_val_dict in task_inputs:
                try:
                    task_input = TaskInput.objects.get(task=solution.task, index=input_val_dict['id'])
                    input_value = TaskInputValue(solution=solution, taskinput=task_input, value=input_val_dict['value'])
                    input_value.save()
                except:
                    pass
            
            return redirect(reverse('crowdapp.views.view_solution', args=[solution.id]))
        else:
            solution.status = 0
            solution.save()
            message = "You have errors in your solution." # TODO: get descriptive errors from validation
    else:
        try:
          profile = get_profile(request.user)
          task = Task.objects.get(id=task_id)
        except ObjectDoesNotExist:
          raise Http404
        if profile.can_solve(task) == False:
          raise PermissionDenied
        try:
          solution = Solution.objects.get(worker=profile, task=task, status=0)
        except ObjectDoesNotExist:
          solution = Solution(worker=profile, task=task, access_path=task.get_random_access_path(), created_at=datetime.now())
          solution.status = 0
          solution.save()

        solution.resources = task.get_random_resources(profile)
        
    return render(request, 'task/complete.html', {'solution': solution, 'message': message})

@login_required
def get_solution_resources(request, solution_id, num_res):
    try:
        profile = get_profile(request.user)
        solution = Solution.objects.get(id=solution_id)
    except ObjectDoesNotExist:
        raise Http404
    
    if len(solution.resources.all()) == 0:
        resources = solution.task.get_random_resources(int(num_res))
        solution.resources = resources
        solution.save()
    
    simple_resources = []
    for res in solution.resources.all():
        simple_resources.append({'index': res.index, 'name': res.name, 'url': res.get_absolute_image_url()})
        
    return HttpResponse(json.dumps({"resources": simple_resources}), mimetype="application/json")

@login_required
def my_tasks(request):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    try:
        profile = get_profile(request.user)
        tasks = Task.objects.filter(creator=profile).order_by('-created_at')
    except ObjectDoesNotExist:
        raise Http404
    return render(request, 'task/mylist.html', {'tasks': tasks})

@login_required
def all_tasks(request):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    try:
        profile = get_profile(request.user)
        user_qualifs = set(profile.qualifications.all())
        all_tasks = Task.objects.filter(is_active=True, ).exclude(creator=profile).order_by('-created_at')
        good_tasks = []
        for task in all_tasks:
            if profile.is_qualified(task):
                task.can_solve = profile.can_solve(task)
                good_tasks.append(task)
    except ObjectDoesNotExist:
        raise Http404
    return render(request, 'task/list.html', {'tasks': good_tasks})

@login_required
def view_solution(request, solution_id):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    try:
        solution = Solution.objects.get(id=solution_id)
        profile = get_profile(request.user)
    except ObjectDoesNotExist:
        raise Http404
    
    if solution.worker.id != profile.id and solution.task.creator.id != profile.id:
        raise PermissionDenied

    # Inject values in the json for the task    
    task_items = json.loads(solution.task.content)
    
    for i in range(0, len(task_items), 1):
        task_input_values = solution.taskinputvalue_set.filter(taskinput__index=i)
        if len(task_input_values) > 0:
            task_items[i]['inputValue'] = task_input_values[0].value
        
    task_items = json.dumps(task_items)
    
    return render(request, 'solution/solution.html', {'solution': solution, 'task_items': task_items})

@permission_required('crowdapp.is_task_creator', raise_exception=True)
def process_solution(request, solution_id, approved):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    try:
        solution = Solution.objects.get(id=solution_id)
        profile = get_profile(request.user)
    except ObjectDoesNotExist:
        raise Http404

    if solution.task.creator.id != profile.id:
        raise PermissionDenied
    
    if int(approved) == 1:
        solution.status = 2
    else:
        solution.status = 3
    solution.save()
    
    # TODO: do other stuff
    
    return redirect('crowdapp.views.view_solution', solution_id=solution.id)

@login_required
def my_solutions(request):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    profile = get_profile(request.user)
    solutions = Solution.objects.filter(worker=profile).exclude(status=0).order_by('-created_at')
    
    return render(request, 'solution/my_solutions.html', {'solutions': solutions })

@permission_required('crowdapp.is_task_creator', raise_exception=True)
def task_solutions(request, task_id):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    try:
        task = Task.objects.get(id=task_id)
        profile = get_profile(request.user)
        if task.creator != profile:
            raise PermissionDenied
        solutions = Solution.objects.filter(task=task).exclude(status=0).order_by('-created_at')
    except ObjectDoesNotExist:
        raise Http404
    
    return render(request, 'solution/task_solutions.html', {'task': task, 'solutions': solutions })

@permission_required('crowdapp.is_task_creator', raise_exception=True)
def task_statistics(request, task_id):
    request.user.is_task_creator = request.user.has_perm('crowdapp.is_task_creator')
    try:
        task = Task.objects.get(id=task_id)
        profile = get_profile(request.user)
        if task.creator != profile:
            raise PermissionDenied
    except ObjectDoesNotExist:
        raise Http404
    
    total_stats, ap_stats_map = get_task_stats(task)
    
    num_sol = len(task.solution_set.all())
    num_sol_per_ap = {}
    aps = task.accesspath_set.all()
    
    for ap in aps:
        num_sol_per_ap[ap.id] = len(ap.solution_set.all())
    
    return render(request, 'task/statistics.html', {'task': task,
                                                    'num_sol': num_sol, 'num_sol_per_ap': num_sol_per_ap,
                                                    'total_stats': total_stats, 'ap_stats_map': ap_stats_map })
    
def toolbox_dev(request):
    return render(request, 'dev/toolbox.html');




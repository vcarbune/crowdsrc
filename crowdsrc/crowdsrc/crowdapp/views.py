from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect, HttpRequest, Http404
from django.shortcuts import render, redirect, render_to_response, get_object_or_404
from django.template import RequestContext
from django.conf import settings

from models import *


# starting page
def index(request):
    #TODO: if the user is logged in, redirect to home
    return redirect(reverse('crowdapp.views.login'))

# login page     
def login(request):
    return render(request, 'auth/login.html')
    
# register page     
def register(request):
    return render(request, 'auth/register.html')
    
# home page for authenticated users
def home(request):
    return render(request, 'home.html')
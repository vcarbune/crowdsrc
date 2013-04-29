from django.conf.urls import patterns, include, url
from django.views.generic import RedirectView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', "crowdapp.views.index"),
    
    # Authentication urls
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'auth/login.html'}),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
    url(r'^register/$', 'crowdapp.views.register'),
    url(r'^accounts/profile/$', RedirectView.as_view(url='/', permanent=True)),
    url(r'^account/$', 'crowdapp.views.account'), 

    # Task related urls
    url(r'^create_task/$', 'crowdapp.views.edit_task'),
    url(r'^edit_task/(?P<task_id>\d+)/$', 'crowdapp.views.edit_task'),
    url(r'^delete_task/(?P<task_id>\d+)/$', 'crowdapp.views.delete_task'),
    
    url(r'^complete_task/(?P<task_id>\d+)/$', 'crowdapp.views.complete_task'),
    url(r'^complete_task/(?P<task_id>\d+)/(?P<solution_id>\d+)$', 'crowdapp.views.complete_task'),
    url(r'^my_tasks/$', 'crowdapp.views.my_tasks'),
    url(r'^all_tasks/$', 'crowdapp.views.all_tasks'),
    
    url(r'^get_solution_resources/(?P<solution_id>\d+)/(?P<num_res>\d+)/$', 'crowdapp.views.get_solution_resources'),
    
    url(r'^my_solutions/$', 'crowdapp.views.my_solutions'),
    url(r'^view_solution/(?P<solution_id>\d+)/$', 'crowdapp.views.view_solution'),
    
    url(r'^task_statistics/(?P<task_id>\d+)/$', 'crowdapp.views.task_statistics'),
    url(r'^task_solutions/(?P<task_id>\d+)/$', 'crowdapp.views.task_solutions'),
    url(r'^process_solution/(?P<solution_id>\d+)/(?P<approved>\d+)/$', 'crowdapp.views.process_solution'),
    
    # Task management urls
    
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # Toolbox development URL
    url(r'^toolbox/$', 'crowdapp.views.toolbox_dev'),
)

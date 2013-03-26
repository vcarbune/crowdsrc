from django.conf.urls import patterns, include, url
from django.views.generic.simple import redirect_to

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', "crowdapp.views.index"),
    
    # Authentication urls
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'auth/login.html'}),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
    url(r'^register/$', 'crowdapp.views.register'),

    # Task related urls
    url(r'^create_task/$', 'crowdapp.views.create_task'),
    url(r'^tasks/$', 'crowdapp.views.tasks'),

    url(r'^accounts/profile/$', redirect_to, {'url': '/'}),
    
    # Task management urls
    
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

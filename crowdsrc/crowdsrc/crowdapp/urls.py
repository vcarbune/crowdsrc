from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', "crowdapp.views.index"),
    
    # Authentication urls
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'auth/login.html'}),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
    url(r'^register/$', 'crowdapp.views.register'),
    
    # Task management urls
    
)

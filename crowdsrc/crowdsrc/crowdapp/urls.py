from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', "crowdapp.views.index"),
    
    # Authentication urls
    url(r'^login/$', "crowdapp.views.login"),
    url(r'^register/$', "crowdapp.views.register"),
    
    # User urls
    url(r'^home/$', "crowdapp.views.home"),
    
    # Task management urls
    
)

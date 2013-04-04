from django import template

from crowdapp.models import *

register = template.Library()

@register.filter
def profile(user):
    try:
        return UserProfile.objects.get(user__id = user.id)
    except ObjectDoesNotExist:
        return None
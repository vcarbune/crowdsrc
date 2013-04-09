from django import template
from django.core.exceptions import ObjectDoesNotExist

from crowdapp.models import *

register = template.Library()

@register.filter
def profile(user):
    try:
        return UserProfile.objects.get(user__id = user.id)
    except ObjectDoesNotExist:
        return None

@register.filter
def solved(user, task):
    try:
        solution = Solution.objects.get(worker=user,task=task)
        if solution.status != 0:
            return True
        else:
            return False
    except ObjectDoesNotExist:
        return False

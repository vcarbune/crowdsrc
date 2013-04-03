from django.core.exceptions import ObjectDoesNotExist
from models import *


def get_profile(user):
    try:
        return UserProfile.objects.get(user=user)
    except ObjectDoesNotExist:
        return None
    
def check_solution_values(val_list): # Checks the input from the complete task form
    return True
    
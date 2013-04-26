from django.core.exceptions import ObjectDoesNotExist
from models import *
from const import INPUT_TYPES


def get_profile(user):
    try:
        return UserProfile.objects.get(user__id = user.id)
    except ObjectDoesNotExist:
        return None
    
def check_solution_values(item_list): 
    # Checks the input from the complete task form
    for item in item_list:
      if item['type'] == 'text' and ('value' not in item or item['value'] == False):
        return False
      if item['type'] == 'boolean' and 'value' not in item:
        item['value'] = False
      if item['type'] == 'integer' and 'value' not in item:
        return False
      if item['type'] == 'ranking' and ('value' not in item or item['value'] == False):
        return False
    return True

def get_input_type(type):
    if type in INPUT_TYPES:
        return INPUT_TYPES[type]
    else:
        return None

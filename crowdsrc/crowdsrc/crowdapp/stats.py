from models import *
from helpers import *

def get_task_stats(task):
    
    task_inputs = task.taskinput_set.all()
    
    total_stats = []
    ap_stats_map = {}
    
    access_paths = task.accesspath_set.all()
    num_ap = len(access_paths)
    
    for ap in access_paths:
        ap_stats_map[ap.id] = []
    
    num_solutions = len(task.solution_set.all())
    
    if num_solutions == 0:
        return None
    
    for task_input in task_inputs:
        task_input_values = task_input.taskinputvalue_set.all()
        
        if task_input.type == INPUT_TYPES['ranking']:
            num_elems = len(task_input_values[0].value.strip().split(' '))
            
            total_scores = [0] * num_elems  
            total_squared_scores = [0] * num_elems
            
            ap_scores_map = {}
            ap_squared_scores_map = {}
            for ap in access_paths:
                ap_scores_map[ap.id] = [0] * num_elems
                ap_squared_scores_map[ap.id] = [0] * num_elems  
            
            for input_value in task_input_values:
                
                ap = input_value.solution.access_path if input_value.solution.access_path else None
                
                elems = input_value.value.strip().split(' ')
                print "A ranking value: " + str(elems)
                
                for i in range(0, num_elems, 1):
                    elems[i] = int(elems[i])
                    weight = num_elems - i # TODO: create the weights somewhere else, with other values
                    total_scores[elems[i]-1] += weight
                    total_squared_scores[elems[i]-1] += weight * weight
                    
                    if ap:
                        ap_scores_map[ap.id][elems[i]-1] += weight
                        ap_squared_scores_map[ap.id][elems[i]-1] += weight * weight
                    
            total_mean_scores = [0] * num_elems
            total_var_scores = [0] * num_elems
            for i in range(0, num_elems, 1):
                total_mean_scores[i] = total_scores[i] / float(num_solutions)
                total_var_scores[i] = (total_squared_scores[i] / float(num_solutions)) - (total_mean_scores[i] * total_mean_scores[i])
                
            print "Total"
            print "Ranking score means:" + str(total_mean_scores)
            print "Ranking score variances: " + str(total_var_scores)
            
            total_stats.append({'task_input': task_input, 
                                'stats': {'mean_scores': total_mean_scores, 'var_scores': total_var_scores}})
            
            for ap in access_paths:
                ap_mean_scores = [0] * num_elems
                ap_var_scores = [0] * num_elems
                for i in range(0, num_elems, 1):
                    ap_mean_scores[i] = ap_scores_map[ap.id][i] / float(num_solutions)
                    ap_var_scores[i] = (ap_squared_scores_map[ap.id][i] / float(num_solutions)) - (ap_mean_scores[i] * ap_mean_scores[i])
                
                print "Access path: " + str(ap)
                print "Ranking score means:" + str(ap_mean_scores)
                print "Ranking score variances: " + str(ap_var_scores)
                
                ap_stats_map[ap.id].append({'task_input': task_input, 
                                            'stats': {'mean_scores': ap_mean_scores, 'var_scores': ap_var_scores}})
                
                
        elif task_input.type == INPUT_TYPES['radioGroup']:
            total_value_counts = {}
            ap_value_counts_map = {}
            for ap in access_paths:
                ap_value_counts_map[ap.id] = {}
            
            for input_value in task_input_values:
                print "A radio value: " + input_value.value
                val = int(input_value.value)
                if val in total_value_counts:
                    total_value_counts[val] += 1
                else:
                    total_value_counts[val] = 1
                    
                ap = input_value.solution.access_path if input_value.solution.access_path else None
                if ap:
                    if val in ap_value_counts_map[ap.id]:
                        ap_value_counts_map[ap.id][val] += 1
                    else:
                        ap_value_counts_map[ap.id][val] = 1
                
            print "Total"        
            print "Radio value counts: " + str(total_value_counts)
            total_stats.append({'task_input': task_input, 'stats': {'counts': total_value_counts}})
            
            for ap in access_paths:
                print "Access path: " + str(ap)
                print "Radio value counts:" + str(ap_value_counts_map[ap.id])
                ap_stats_map[ap.id].append({'task_input': task_input, 
                                            'stats': {'counts': ap_value_counts_map[ap.id]}})
        
    return total_stats, ap_stats_map

                        

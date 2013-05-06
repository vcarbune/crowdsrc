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
    
    num_solutions = len(task.solution_set.exclude(status=0))
    
    if num_solutions == 0:
        return None, None
    
    for task_input in task_inputs:
        task_input_values = task_input.taskinputvalue_set.all()
        
        # if the input is a number field
        if task_input.type == INPUT_TYPES['numberField']:
            total_sum = 0
            total_sum_squared = 0 # Useful for computing the variance
            ap_sum_map = {}
            ap_sum_squared_map = {}
            ap_count_map = {}
            
            for ap in access_paths:
                ap_sum_map[ap.id] = 0
                ap_sum_squared_map[ap.id] = 0
                ap_count_map[ap.id] = 0
            
            for input_value in task_input_values:
                val = int(input_value.value)
                total_sum += val
                total_sum_squared += val * val
                
                ap = input_value.solution.access_path if input_value.solution.access_path else None
                if ap:
                    ap_sum_map[ap.id] += val
                    ap_sum_squared_map[ap.id] += val * val
                    ap_count_map[ap.id] += 1
            
            total_mean = total_sum / float(num_solutions)
            total_variance = total_sum_squared / float(num_solutions) - (total_mean * total_mean)
            
            total_stats.append({'task_input': task_input, 
                                'stats': {'mean': total_mean, 'variance': total_variance}})
            
            for ap in access_paths:
                ap_mean = 0
                if ap_count_map[ap.id] != 0:
                    ap_mean = ap_sum_map[ap.id] / float(ap_count_map[ap.id])

                ap_variance = 0
                if float(ap_count_map[ap.id]) != ap_mean * ap_mean:
                    ap_variance = ap_sum_squared_map[ap.id] / float(ap_count_map[ap.id]) - (ap_mean * ap_mean)
                
                ap_stats_map[ap.id].append({'task_input': task_input, 
                                            'stats': {'mean': ap_mean, 'variance': ap_variance}})
        # if the input is a checkbox
        elif task_input.type == INPUT_TYPES['checkbox']:
            total_counts = [0,0]
            ap_counts_map = {}
            for ap in access_paths:
                ap_counts_map[ap.id] = [0,0]
            for input_value in task_input_values:
                if input_value.value == 'True':
                    total_counts[1] += 1
                else:
                    total_counts[0] += 1
                ap = input_value.solution.access_path if input_value.solution.access_path else None
                if ap:
                    if input_value.value == 'True':
                        ap_counts_map[ap.id][1] += 1
                    else:
                        ap_counts_map[ap.id][0] += 1
            total_stats.append({'task_input': task_input, 'stats': {'counts': total_counts}})
            for ap in access_paths:
                ap_stats_map[ap.id].append({'task_input': task_input, 
                                            'stats': {'counts': ap_counts_map[ap.id]}})
        # if the input is a radio button group       
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
        # if the input is a ranking component
        elif task_input.type == INPUT_TYPES['ranking']:
            num_elems = len(task_input_values[0].value.strip().split(' '))
            
            total_scores = [0] * num_elems  
            total_squared_scores = [0] * num_elems # useful for computing the variances
            
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
                                'stats': { 'scores' : zip(total_mean_scores, total_var_scores)}})
            
            for ap in access_paths:
                num_sols_ap = len(ap.solution_set.all())
                ap_mean_scores = [0] * num_elems
                ap_var_scores = [0] * num_elems
                for i in range(0, num_elems, 1):
                    ap_mean_scores[i] = ap_scores_map[ap.id][i] / float(num_sols_ap)
                    ap_var_scores[i] = (ap_squared_scores_map[ap.id][i] / float(num_sols_ap)) - (ap_mean_scores[i] * ap_mean_scores[i])
                
                print "Access path: " + str(ap)
                print "Ranking score means:" + str(ap_mean_scores)
                print "Ranking score variances: " + str(ap_var_scores)
                
                ap_stats_map[ap.id].append({'task_input': task_input, 
                                            'stats': {'scores': zip(ap_mean_scores, ap_var_scores)}})
                
        
            
    return total_stats, ap_stats_map

                        

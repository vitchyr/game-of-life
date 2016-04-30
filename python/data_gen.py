import json
import numpy as np
import random

def get_rand_array():
    return [[random.randint(0, 1) for i in range(8)] for j in range(8)]

data = [get_rand_array() for i in range(10)]

with open('data/template.json', 'w') as outfile:
    json.dump(data, outfile)

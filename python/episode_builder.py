import numpy as np
import json
from episode import Episode
from state import State

class EpisodeBuilder:
    def __init__(self, file_path):
        self.file_path = file_path

    def get_episode(self):
        arrays = self.get_file_arrays()
        arrays = self.convert_arrays_to_states(arrays)

        return Episode(arrays)

    def get_file_arrays(self):
        arrays = None
        with open(self.file_path) as stream:
            arrays = json.load(stream)
        return arrays

    def convert_arrays_to_states(self, arrays):
        states = []
        for arr in arrays:
            states.append(State(np.array(arr)))
        return states

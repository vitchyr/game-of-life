import numpy as np
from episode import Episode
import json

class EpisodeBuilder:
    def __init__(self, file_path):
        self.file_path = file_path

    def get_episode(self):
        lines = self.get_file_lines()
        arrays = self.convert_lines_to_arrays(lines)

        return Episode(arrays)

    def get_file_lines(self):
        lines = None
        with open(self.file_path) as stream:
            lines = json.load(stream)
        return lines

    def convert_lines_to_arrays(self, lines):
        arrays = []
        for arr in lines:
            arrays.append(np.array(arr))
        return arrays

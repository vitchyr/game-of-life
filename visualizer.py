class Visualizer:
    def __init__(self, episode):
        self.episode = episode

    def visualize(self):
        for state in self.episode:
            print(state.get_array())
        return

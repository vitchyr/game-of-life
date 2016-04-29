from state import Episode

class Episode:
    def __init__(self, arrays):
        self.t = 0
        self.arrays = arrays
        self.max_t = len(arrays)
        self.episode_is_done = False
        return

    def step(self):
        if self.t == self.max_t:
            self.episode_is_done = True
            return
        self.t += 1

    def get_state(self):
        array = self.arrays[self.t]
        return State(array)

    def is_done(self):
        return self.episode_is_done

    def __iter__(self):
        return self

    def next(self):
        if self.t < self.max_t:
            self.t += 1
            array = self.arrays[self.t]
            return State(array)
        else:
            raise StopIteration()

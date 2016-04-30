class Episode:
    def __init__(self, states):
        self.t = 0
        self.states = states
        self.max_t = len(states)
        self.episode_is_done = False
        return

    def step(self):
        if self.t == self.max_t:
            self.episode_is_done = True
            return
        self.t += 1

    def get_state(self):
        return self.states[self.t]

    def is_done(self):
        return self.episode_is_done

    # Alternatively, just use Episode instance as a list
    def __iter__(self):
        return self

    def next(self):
        if self.t < self.max_t:
            state = self.states[self.t]
            self.t += 1
            return state
        else:
            raise StopIteration()

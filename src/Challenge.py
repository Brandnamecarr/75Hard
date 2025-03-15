import logging as log

from src import ChallengeDay

class Challenge:

    challenge_id = 0

    dailyTasks = [ChallengeDay] 

    #TODO: Add other data. 

    def __init__(self):
        self.log = log.getLogger(self.__class__.__name__)
        self.log.error('Challenge.init() -> implement CLASS')
    
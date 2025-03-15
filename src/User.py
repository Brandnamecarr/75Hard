import json
import os
import logging as log
from src.Challenge import Challenge

class User:

    uuid = ''
    email = ''

    account_config_filepath = ''
    account_data = {}
    known_ips = []
   
    challenges_completed = 0
    aggregated_challenge_data = {}


    def __init__(self, uuid, email):
        self.log = log.getLogger(self.__class__.__name__)

        self.uuid = uuid
        self.email = email

        self.account_config_filepath = f"./{self.uuid}/account_config.json"
    

    def check_user_directory(self) -> bool:
        self.user_directory = r"./user/{}".format(self.uuid)
        if os.path.exists(f'./users/{self.uuid}'):
            return True
        return False
    
    def load_account_config(self):
        try:
            with open(self.account_config_filepath, 'r') as file:
                self.account_data = json.load(file)
        except Exception as e:
            self.log.error(f'User.py.load_account_config() -> error parsing {self.account_config_filepath}')
            self.log.error(f'exception: {e}')
            return None
        
    def parse_account_config(self):
        self.challenges_completed = self.account_data['challenges_completed']
        self.known_ips = self.account_data['known_ips']

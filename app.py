# python imports
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging as log
import uuid
import os
import random
from enum import Enum

# app-specific imports
from src.postgres_adapter import PgAdapter
from src.User import User

app = Flask(__name__)
# Enable CORS for all routes and origins by default
# CORS = Cross origin resource sharing
CORS(app)  

# set up logging
log.basicConfig(
    level=log.DEBUG,
     format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            log.FileHandler("app.log")
        ]
)

# setup postgres 
postgres_config_filename = './configs/pg_configs.json'
pg_adapter = PgAdapter(postgres_config_filename, logger=log)
if pg_adapter == None:
    log.error('app.init() -> error creating pg_adapter. exiting.')
    
#############################################       ROUTES      #############################################

# test route
@app.route('/test', methods=['GET', 'POST'])
def test_react_routes():
    results = pg_adapter.get_all_users()

    if results is not False:
        returning_ = {
            'Status': 'Success',
            'data': results
        }
        log.info(
            f'app.py.test_react_routes() -> returning {returning_}'
        )
        return jsonify(returning_)
    else:
        return jsonify({
            'Status': ' Fail'
        })


# to handle login to system
@app.route('/login', methods=['GET', 'POST'])
def handle_login():
    
    if request.method == 'GET':
        return jsonify({"Status": "fail"})
    
    elif request.method == 'POST':
        data = request.json
        email = data.get('email')
        password = data.get('password')

        response, uuid = authenticate_user(email, password)
        if response:
            log.info(f'app.handle_login() -> uuid received: {uuid}')
            return jsonify({"Status": "Success", "uuid": uuid})
        else:
            log.error('app.handle_login() -> failed to get data from db.')
            return jsonify({"Status": "Fail"})
    
    else:
        return jsonify({"Status": "Fail"})

# to handle account creation
# TODO: remove GET method ?
@app.route('/createUser', methods=['GET', 'POST'])
def create_user():
    
    if request.method == 'GET':
        log.error('app.py.create_user() -> this method not allowed for this endpoint')
        return
    else:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        new_uuid = uuid.uuid4()

        if create_new_user(email, password, new_uuid):
            if setup_user_directory(new_uuid):
                return jsonify({"Status": "Success"})
            else:
                return jsonify({'Status': 'Fail'})
        else:
            return jsonify({"Status": "Fail"})

# to handle account deletion
# TODO: remove GET method ?
@app.route('/deleteUser', methods=['GET', 'POST'])
def delete_user():
    
    if request.method == 'GET':
        log.error('app.py.create_user() -> this method not allowed for this endpoint')
        return
    else:
        data = request.json
        email = data.get('email')
        log.info(f'app.py.delete_user() -> going to remove email: {email}')
        response = delete_user_record(email)
        log.info(f'app.py.delete_user() -> got back response from delete_user_record: {response}')
        if response:
            response_data = {
                "Status": "Success"
            }
            log.info('app.py.delete_user() -> returning success')
            return jsonify(response_data)
        else:
            log.info('app.py.delete_user() -> returning fail')
            return jsonify({"Status": "Fail"})
        
# TODO: Implement Update
@app.route('/updateUser', methods=['GET', 'POST'])
def updateUser():

    data = None
    if request.method == 'POST':
        data = request.json
        const_uuid = data.get('uuid')
        email = data.get('email')
        password = data.get('password')

        values = {
            'uuid': const_uuid,
            'email': email,
            'password': password
        }

        log.info(f'app.py.updateUser() values to be updated in db: {values}')

        response = pg_adapter.update_user_account(values)

        if response:
            return jsonify({"Status": "Success"})
        else:
            return jsonify({"Status": "Fail"})

# loads user record from DB.
@app.route('/api/getUserRecords', methods=['GET', 'POST'])
def load_user_records():
    
    data = request.json
    try:
        uuid = data.get('uuid')
        log.debug(f"app.py.load_user_record() -> fetching data for uuid: {uuid}")
        user_record = get_user_record(uuid)
        if user_record is not None:
            log.debug(f"app.pg.load_user_record() -> user_record: {user_record}")
            return jsonify(user_record)
        else:
            log.error("app.py.load_user_record() -> failed to retrieve data")
            return jsonify({'Status': 'Fail'})
    except:
        log.error(f'app.py.load_user_records() -> error getting user records for uuid: {uuid}')
        return jsonify({'Status': 'Fail'})


#############################################       FUNCTIONALITY      #############################################

# takes in a user and pw and determines if user can enter the application
def authenticate_user(email, password) -> bool:
    # make kwargs
    values = {
        'email': email,
        'password': password
    }

    # get response from query function
    response, uuid = pg_adapter.do_user_auth(values)

    if response:
        return True, uuid
    else:
        return False, None

# makes a new user account
def create_new_user(email, password, uuid) -> bool:
    values = {
        'email': email,
        'password': password,
        'uuid': uuid
    }
    
    response = pg_adapter.do_user_create(values)

    if response:
        return True
    else:
        return False

def delete_user_record(email) -> bool:
    values = {
        'email': email,
    }
    log.info(f'app.py.delete_user_record() -> going to delete {email}')
    response = pg_adapter.do_user_delete(values)

    if response:
        return True
    else:
        return False

# gets all user records from db.
def get_user_record(uuid: str) -> dict:
    
    response = pg_adapter.load_user_record(uuid)

    log.debug('app.py.get_user_records() -> response from PgAdapter:')
    log.debug(response)
    if response is not None:
        returning_ = {
            "Status": "Success",
            "data": response
        }
        log.debug('app.py.get_user_records() -> successfully retrieved data from DB.')
        return returning_
    else:
        log.error('app.py.get_user_records() -> error retrieving user records from DB.')
        return None
    
# handle local user directory creation
def setup_user_directory(uuid) -> bool:
    
    if uuid in os.listdir('./users'):
        log.error('app.py.setup_user_directory() -> user already has directory created.')
        return False
    
    else:
        
        try:
            os.mkdir(f'./users/{uuid}')
            log.debug(f'app.py.setup_user_directory() -> created an directory for uuid: {uuid}')
            return True
        except:
            log.error(f'app.py.setup_user_directory() -> failed to create user dir for uuid: {uuid}')
            return False


if __name__ == '__main__':
    app.run(debug=True)
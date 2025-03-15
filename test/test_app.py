import requests
import json
import uuid
import os
from datetime import datetime, timedelta
import sys
print(os.getcwd())
from src import postgres_adapter, User

url = "http://localhost:5000/"


def add75Days(start_date: str) -> str:
    start_date_obj = datetime.strptime(start_date, '%m/%d/%Y')
    end_date = start_date_obj + timedelta(days=75)
    end_date_str = end_date.strftime('%m/%d/%Y')
    return end_date_str


def test_postgres_connection():
    pg_adapter = PgAdapter('pg_configs.json')

    connection = pg_adapter.connection()

    if connection is None:
        print('Connection is none.')
        
    else:
        print('Connected')
        print(pg_adapter.QUERIES)

        cursor = connection.cursor()

        sql_query = pg_adapter.QUERIES['User::Select']

        cursor.execute(sql_query)

        results = cursor.fetchall()

        print("RESULTS OF QUERY:")
        print(results)


def test_login_endpoint() -> bool:

    # set up test data
    data = {
        'email': 'brandon@admin.com',
        'password': 'blackjack'
    }

    # send to server
    response = requests.post(url+'login', json=data)

    if response == 200:
        print(response.status_code)
        print(response.json)

    else:
        print('error!')

def test_create_user_endpoint() -> bool:
    # set up test data
    uuid_val = str(uuid.uuid4())
    data = {
        'uuid': uuid_val,
        'email': 'bruno@gmail.com',
        'password': 'blackjack'
    }

    # send to server
    response = requests.post(url+'createUser', json=data)

    if response:
        print(response.status_code)
        print(response.json)

    else:
        print('error!')

def load_user_challenge_size():
    uuid = 'd66a2767-9899-4a5f-b444-213cbd535c36'
    filepath = r"users/{}/1-{}.json".format(uuid, uuid)
    
    challenge_data = None
    if os.path.exists(filepath):
        challenge_file = open(filepath, 'r')
        challenge_data = json.load(challenge_file)

    sizeof = sys.getsizeof(challenge_data)
    print(f"Size of data: {sizeof} bytes")

def parse_user_data_test():
    user = User('test', 'test')
    print(type(user))

def update_user_test():
    postgres = postgres_adapter.PgAdapter()

    # need a connection
    connection = postgres.connection()

    # need a cursor
    cursor = connection.cursor()

    # generate the data
    user = User('4ae0e4d9-5b7d-4ac9-af99-58c8a62b4603', 'Esteban@admin.com')
    password = 'blackjack'

    query = postgres.QUERIES['User::UpdatePostgres']
    tuplified = (user.uuid, user.email, password,)
    # execute query
    try:
        result = cursor.execute(query, tuplified)
        print(f'got back: {result}')
    except:
        print('error executing query')


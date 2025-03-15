import json
from test_app import add75Days

HEADER = [
    'challenge_number',
    'uuid',
    'start_date',
    'projected_end_date'
]

DAY_DATA = [
    
]

def generate_fake_challenge_data():
    day_id = 1
    drankWater, exercised, diet, learn, bodyPhoto, cheatMeal = False, False, False, False, False, False

    data = {}
    data['challenge_number'] = 1
    data['uuid'] = 'd66a2767-9899-4a5f-b444-213cbd535c36'
    data['start_date'] = '11/26/2024'
    data['projected_end_date'] = add75Days('11/26/2024')
    days = []
    while day_id <= 75:
        day = {
            'id': day_id,
            'water': drankWater,
            'exercised': exercised,
            'diet': diet,
            'learn': learn,
            'bodyPhoto': bodyPhoto,
            'cheatMeal': cheatMeal,
            'comments': ''
        }
        days.append(day)
        day_id += 1
    data['days'] = days

    with open(r"users\d66a2767-9899-4a5f-b444-213cbd535c36\1-d66a2767-9899-4a5f-b444-213cbd535c36.json", 'w') as file:
        json.dump(data, file, indent=4)
    
    print('done')
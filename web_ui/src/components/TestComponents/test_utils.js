//test_utils.js
// called by functions in the TestPage react component.


// wrapper function for post requests
// endpoint must contain leading character ('/').. EXACT MATCH to server route.
async function sendPostRequest(endpoint, data) {
    const url = 'http://127.0.0.1:5000';

    try {
        var serverURL = url + endpoint;
        console.log('pinging: ', serverURL);
        const response = await fetch(serverURL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.log('HTTP ERROR! Status: ', response.Status);
            return false;
        }

        const responseData = await response.json();

        if (endpoint != '/api/getUserRecords')
        {
            // if Status == 'Success' return true
            if (responseData.Status == 'Success' && (endpoint != '/test' && endpoint != '/login')) {
                return true;
            }
            else if (responseData.Status == 'Success' && (endpoint == '/login')) {

                return responseData;
            }
            else if (responseData.Status == 'Success' && (endpoint == '/test')) {
                return responseData.data;
            }
            // else if Status == 'Fail' return false
            else {
                return false;
            }
        } // if //
        else {
            if (responseData.data) {
                return responseData.data;
            }
            else {
                return null;
            }
        } // else //
    } // try //

    catch (error) {
        return false;
    } // catch //

} // sendPostRequest //

// gets back a Status: Success or a Status: Failed from server
// sendPostRequest returns TRUE if SUCCESS or FALSE if Failed
export async function test_UserAuthentication() {
    var userEmail = 'brandon@admin.com';
    var userPassword = 'blackjack';

    const data = {
        'email': userEmail,
        'password': userPassword
    };

    var postResponse = await sendPostRequest('/login', data);

    if (postResponse) {
        return true;
    }
    return false;
}

// is called in the runUserCreate function in the TestPage.js component
export function test_UserCreation(email, password) {

    const data = {
        'email': email,
        'password': password
    };

    var postResponse = sendPostRequest('/createUser', data);

    if (postResponse) {
        return true;
    }
    return false;
}

export function test_UserUpdate() {
    var userEmail = 'brandon@admin.com';
    var userPassword = 'blackjack';

    var targetPassword = 'test';

    const data = {
        'current_email': userEmail,
        'current_password': userPassword,
        'new_password': targetPassword
    };

    var postResponse = sendPostRequest('/updateUser', data);

    if (postResponse) {
        return true;
    }
    return false;
}

export async function test_UserDelete(email) {

    const data= {
        'email': email
    };

    var postResponse = await sendPostRequest('/deleteUser', data);
    
    if (postResponse) {
        return true;
    }
    return false;
}

export async function test_UserDataFetch(uuid) {

    const data = {
        'uuid': uuid
    };

    var postResponse = await sendPostRequest('/api/getUserRecords', data);

    if (postResponse != null)
    {
        return postResponse;
    }
    return null;
}

// returns all users from the postgres db.
export async function selectAllUsers() {
    var postResponse = await sendPostRequest('/test');
    if (postResponse)
    {
        return postResponse;
    }
}

export function update_user_account(data) {

    var response = sendPostRequest('/updateUser', data);
    
    if (response) {
        return true;
    }
    else {
        return false;
    }
}
import React, { useState, useEffect } from "react";

import UserTable from "./UserTable";
import UpdateUserModal from "./UpdateUserModal";
import UserDataModal from "./UserDataModal";

import { Test } from "./Test";
import { test_UserAuthentication, test_UserCreation, test_UserDelete, test_UserUpdate, test_UserDataFetch, selectAllUsers, update_user_account } from "./test_utils";

const TestPage = () => {
    
    // user create result
    const [createUserTest, setCreateUserTest] = useState(false);
    // user delete result
    const [userDeleteTest, setUserDeleteTest] = useState(false);
    //user auth result
    const [userAuthTest, setUserAuthTest] = useState(false);

    // user fetch information
    const [userDataFetched, setUserDataFetched] = useState(null);
    const [showUserDataModal, setShowUserDataModal] = useState(false);

    // load user modal states
    const [showModal, setShowModal] = useState(false);
    const [records, setRecords] = useState([]);

    // update user states
    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
    const [uuidList, setUuidList] = useState([]);
    const [userDataToUpdate, setUserDataToUpdate] = useState({'email': '', 'password': ''});

     // This effect will run whenever uuidList changes
    useEffect(() => {
        if (uuidList.length > 0) {
            setShowUpdateUserModal(true);
        } else {
            console.log('uuidList.length = ', uuidList.length);
        }
    }, [uuidList]); // The effect depends on uuidList


    // tests account creation
    const runUserCreate = () => {
        const handleCreateTextForm = () => {
            const email = prompt("Enter your test email:");
            const password = prompt("Enter your test password:");

            if (email && password) {
                //test_UserCreation is called in the test_utils.js utility file.
                return test_UserCreation(email, password);
                 
            }
            else {
                return false;
            }
        };
       var result = handleCreateTextForm();
       if (result) {
        setCreateUserTest(true);
       }
       return result;
    };

    // tests account update
    const runUserUpdate = async () => {
        var user_list = await selectAllUsers();
        extract_values(user_list);
        var result = true;
        return result;
    };

    const extract_values = (user_list) => {
        let uuids = [];
        
        for(let i = 0; i < user_list.length; i++)
        {
            var tempUuid = user_list[i][0];
            uuids.push(tempUuid);
        }
        handleUpdateUuidList(uuids || []);
    };

    const handleUpdateUuidList = (uuids) => {
        setUuidList(uuids || []);
    };

    // tests account deletion
    const runUserDelete = async () => {

        const email = prompt("Enter your test email:");
        const password = prompt("Enter your test password:");
        var tempResult;
        if (email && password) {
            //test_UserDelete is called in the test_utils.js utility file.
            tempResult = await test_UserDelete(email);
            console.log('runUserDelete() -> tempResult is: ', tempResult);
        }

        var result = tempResult;
        console.log(result);
        if(result)
        {
            console.log('runUserDelete() -> result is true');
            setUserDeleteTest(true);
        }
        else 
        {
            console.log('runUserDelete() -> result is false');
        }
        return result;
    };

    // tests get account data
    const runUserDataFetch = async () => {
        const uuid = '77033109-ace3-4aac-80c1-b6292e2f1770';
        var result = await test_UserDataFetch(uuid);
        if (result != null) {
            setUserDataFetched(result);
        }
        return result;
    };

    // open userDataModal
    const handleOpenUserDataModal = () => {
        runUserDataFetch();
        setShowUserDataModal(true);
    };

    // close userDataModal
    const handleCloseUserDataModal = () => {
        setShowUserDataModal(false);
    };

    // tests user authentication
    const runUserAuth = async () => {
        var result = await test_UserAuthentication();
        if (result) 
        {
            console.log('runUserauth() -> 118 got back:');
            console.log(result);
            setUserAuthTest(true);
        }
        else {
            setUserAuthTest(false);
        }
        return result;
    };

    const runSelectAllUsers = async () => {
        try {
            const result = await selectAllUsers();
            setRecords(result || []);
            setShowModal(true);
        } catch (error) {
            console.error('Error getting the user records: ', error);
        }
    };

    // closes select all user modal
    const handleClose = () => setShowModal(false);

    // closes the updateUserModal
    const closeUpdateUserModal = (data) => {
        if (data) {
            setUserDataToUpdate(data);
            update_user_account(data);
        }
        setShowUpdateUserModal(false);
    ;}
  
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
          }}>
            <h1>Unit Test Results</h1>
   
            {/* <!-- Create User --> */}
            <button onClick={runUserCreate} style={{ padding: '10px 20px' }}>
                Run Create User Test
            </button>
                <div style={{ fontSize: '50px' }}>
                    {createUserTest ? (
                      <span style={{ color: 'green' }}>✔️</span>
                    ) : (
                      <span style={{ color: 'red' }}>❌</span>
                    )}
                </div>

            {/* <!-- Update User --> */}
            <button onClick={runUserUpdate} style={{ padding: '10px 20px' }}>
                Run Update User
            </button>
            <UpdateUserModal
                isOpen={showUpdateUserModal}
                onClose={closeUpdateUserModal}
                uuids={uuidList}
            />

            <br></br>

            {/* <!-- Delete User --> */}
            <button onClick={runUserDelete} style={{ padding: '10px 20px' }}>
                Run Delete User Test
            </button>
                <div style={{ fontSize: '50px' }}>
                    {userDeleteTest ? (
                      <span style={{ color: 'green' }}>✔️</span>
                    ) : (
                      <span style={{ color: 'red' }}>❌</span>
                    )}
                </div>

            {/* <!-- Authorize User --> */}
            <button onClick={runUserAuth} style={{ padding: '10px 20px' }}>
                Run User Auth Test
            </button>
                <div style={{ fontSize: '50px' }}>
                    {userAuthTest ? (
                      <span style={{ color: 'green' }}>✔️</span>
                    ) : (
                      <span style={{ color: 'red' }}>❌</span>
                    )}
                </div>

            {/* <!-- View All Users --> */}
            <button onClick={runSelectAllUsers} style={{ padding: '10px 20px' }}>
                Load All Users
            </button>
                <UserTable
                    records={records}
                    showModal={showModal}
                    handleClose={handleClose}
                />
                <br></br>

            {/* <!-- Load All Records for brandon@admin.com (test account). --> */}
            <div className="userDataTest">
                <button onClick={handleOpenUserDataModal} style={{ padding: '10px 20px' }}>
                    Fetch Data for "brandon@admin.com"
                </button>
                {showUserDataModal && 
                    <UserDataModal 
                        data={userDataFetched} 
                        onClose={handleCloseUserDataModal}
                    />
                }
            </div>
          </div>
        );
      };

export default TestPage;
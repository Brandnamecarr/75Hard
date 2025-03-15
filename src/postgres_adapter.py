###################### IMPORTS ######################
import psycopg2 as pg
import json
import logging as log
import xml.etree.ElementTree as ET
import os
import shutil

"""
    Database class to handle storing of data.
"""
class PgAdapter:
    user = ''
    pw = ''
    host = ''
    port = ''
    database = ''
    queries_config = None
    QUERIES = {}

#############################################       INIT      #############################################

    def __init__(self, config_file, logger):
        self.log = logger

        try:
            config_details = self.parseConfigFile(config_file)['postgres']
            self.user = config_details['user']
            self.pw = config_details['pass']
            self.host = config_details['ip']
            self.port = config_details['port']
            self.database = config_details['table']
            self.log.debug('PgAdapter.init() -> read in values from pg config file')
        except:
            self.log.error('PgAdapter.init() -> error initializing pg config data')
            return None

#############################################       CONFIGS      #############################################
    def parseConfigFile(self, config_file):
        try:
            with open(config_file, 'r') as file:
                data = json.load(file)
                self.queries_config = data['query_file']['file_location']
                self.log.info(f'PgAdapter.parseConfigFile() -> reading {self.queries_config}')
                self.parseQueriesFile()
                return data
        except:
            self.log.error("PgAdapter.parseConfigFile() -> error reading config file")
            return None
    
    # reads the queries file and the associated sql then puts into a dictionary
    def parseQueriesFile(self):
        self.log.info(f'PgAdapter.parseQueriesFile() -> reading: {self.queries_config}')

        tree = None
        try:
            
            tree = ET.parse(self.queries_config)
        except FileNotFoundError:
            self.log.error(f"PgAdapter.parseQueriesFile() -> {self.queries_config} not found.")
            return None
        except Exception as e:
            self.log.error(f'PgAdapter.parseQueriesFile() -> Exception raised: {e}')
            return None

        if tree is None:
            self.log.error('PgAdapter.parseQueriesFile() -> error with root of XMLtree')
            return False
        
        root = tree.getroot()
        if root is None:
            self.log.error('PgAdapter.parseQueriesFile() -> error reading xml file')
            return False

        for queryElem in root.findall('query'):
            queryName = queryElem.attrib['name']
            sqlQuery = queryElem.find('sql').text.strip()
            self.QUERIES[queryName] = sqlQuery

#############################################       Postgress Ops      #############################################
    def connection(self):
        try:
            connection = pg.connect(user=self.user, password=self.pw, host=self.host, port=self.port, database=self.database)
            self.log.info('PgAdapter.connection() -> connected to Postgres')
            return connection
        except:
            self.log.error('PgAdapter.connection() -> error connecting to Postgres Db.')


    def setDatabaseTable(self, table_name):
        self.database = table_name


    # general wrapper for the query functionality
    # def query(self, query_type, kwargs: dict):
    #     self.log.info(f'PgAdapter.query() -> executing query type: {query_type}')

    #     if query_type == 'User::Auth':
    #         return self.do_user_auth(query_type, kwargs)
    #     elif query_type == 'User::Create':
    #         return self.do_user_create(query_type, kwargs)

#############################################       Query Functions      #############################################

    # returns T if user has been authenticated
    # returns F if user has not been authenticated
    def do_user_auth(self, data: dict):
        connection = self.connection()

        self.log.info('PgAdapter.do_user_auth() -> data recv: {}'.format(data))

        if connection is None:
            self.log.error('PgAdapter.do_user_auth() -> trouble making connection to postgres')
            return False
        
        try:
            cursor = connection.cursor()
            
            try:
               type = "User::Auth"
               tuplified = (data['email'],)
               cursor.execute(self.QUERIES[type], tuplified)
               results = cursor.fetchall()
               if len(results) == 0:
                   self.log.info("PgAdapter.do_user_auth() -> user not found in database")
                   return False
               elif len(results) > 1:
                   self.log.info('PgAdapter.do_user_auth() -> more than 1 result found.')
                   # TODO: Send alert to administrator. 
                   return False
               self.log.info(f'PgAdapter.do_user_auth() -> found {len(results)} record in postgres')
               if results[0][2] != data['password']:
                   self.log.info(f"PgAdapter.do_user_auth() -> passwords don't match for uuid: {results[0][0]} ---- user DENIED entry.")
                   return False
               self.log.info(f"PgAdapter.do_user_auth() -> passwords match for uuid: {results[0][0]} ---- user AUTHENTICATED successfully")
               return True, results[0][0]
            except:
                self.log.error('PgAdapter.do_user_auth() -> error fetching information from db.')
                return False
        
        except:
            self.log.error('PgAdapter.do_user_auth() -> error creating connection/cursor in db.')
            return False

    def do_user_create(self, data: dict) -> bool:
        connection = self.connection()

        self.log.info('PgAdapter.do_user_create() -> data recv: {}'.format(data))

        if connection is None:
            self.log.error('PgAdapter.do_user_create() -> trouble making connection to postgres')
            return False
        
        try:
            cursor = connection.cursor()

            try:
                type = "User::Create"
                tuplified = (str(data['uuid']), data['email'], data['password'])
                self.log.info(f'PgAdapter.do_user_create() -> entering: {tuplified}')
                cursor.execute(self.QUERIES[type], tuplified)
                result = cursor.fetchone()[0]
                self.log.info(f'PgAdapter.do_user_create() -> got back {result}')
                if str(data['uuid']) == result:
                    self.log.info(f'PgAdapter.do_user_create() -> user created & added to postgres')
                    connection.commit()
                    return True
                self.log.info(f'PgAdapter.do_user_create() -> user not created not added to postgres')
                connection.rollback()
                return False
            
            except:
                self.log.error('PgAdapter.do_user_create() -> error inserting record into postgres')
                return False
        
        except:
            self.log.error('PgAdapter.do_user_create() -> error creating connection/cursor in db.')
            return False
    
    # not stored in postgres DB, stored in ./users/{uuid}
    # loads the requested data by uuid from the users directory.
    def load_user_record(self, uuid) -> dict:

        self.log.debug(f"PgAdapter.load_user_record() -> going to retrieve data for uuid: {uuid}")

        if uuid not in os.listdir('./users'):
            self.log.error('PgAdapter.load_user_record() -> uuid not found in ./users. Unable to load data')
            return False

        returning_data_ = {}
        self.log.info(f'PgAdapter.load_user_record() -> found directory with user {uuid}')

        # load user account_config
        user_config_data_ = None
        user_directory = f"./users/{uuid}/"
        user_config_data_filepath_ = user_directory + "account_config.json"
        self.log.debug(f"PgAdapter.load_user_record() -> loading account_config file from: {user_config_data_filepath_}")
        try:
            with open(user_config_data_filepath_, 'r') as inFile:
                user_config_data_ = json.load(inFile)
                self.log.debug(f"PgAdapter.load_user_record() -> loaded the data")
                self.log.debug(f"{user_config_data_}")
                # TODO: Extract more data here. Maybe intialize user object?
        except FileNotFoundError as e:
            self.log.error(f"PgAdapter.load_user_record() -> file not found: {user_config_data_filepath_}")
            return None

        # load the user record from postgres and set some fields from the account_config file
        number_of_challenges = user_config_data_['challenges_completed']
        user_record_ = self.load_user_by_uuid(uuid)
        self.log.debug(f'PgAdapter.load_user_record() got back: {user_record_}')
        self.log.debug(f'PgAdapter.load_user_record() email: {user_record_[0][0]}')

        # then separately parse the challenge files to extract the data
        user_files = os.listdir(user_directory)
        cleaned_filenames = []
        if "account_config.json" in user_files:
            user_files.remove("account_config.json")
            self.log.debug("PgAdapter.load_user_record() -> just removed the config file")
        
        formatted_data = {}
        index = 1
        for challenge_file in user_files:
            self.log.debug(f"PgAdapter.load_user_record() -> parse: {challenge_file}")
            full_filepath_for_parsing = user_directory + challenge_file
            cleaned_filenames.append(full_filepath_for_parsing)
            parsed_data_dict_ = self.parse_config_file_return_formatted(full_filepath_for_parsing)
            formatted_data[index] = parsed_data_dict_
            index += 1
        

        returning_data_ = {
            "uuid": uuid,
            "email": user_record_[0][0],
            "number of challenges": number_of_challenges,
            "challenge records": cleaned_filenames,
            "challenge data": formatted_data
        }

        self.log.debug(f'PgAdapter.load_user_record() -> returning the data from the record:')
        self.log.debug(returning_data_)
        return returning_data_

    def parse_config_file_return_formatted(self, filename) -> dict:
        self.log.debug('PgAdapter.parse_config_file_return_formatted() -> inside the function')
        data = None
        if os.path.exists(filename):
            self.log.debug('PgAdapter.parse_config_file_return_formatted() -> file exists')
        else:
            self.log.error(f'PgAdapter.parse_config_file_return_formatted() -> file DNE {filename}')
        with open(filename, 'r') as challenge_file:
            try:
                self.log.debug('PgAdapter.parse_config_file_return_formatted() -> going to read the file')
                data = json.load(challenge_file)
                self.log.debug(f'PgAdapter.parse_config_file_return_formatted() -> got data: {data}')
                return data
            except FileNotFoundError:
                self.log.error(f'PgAdapter.parse_config_file_return_formatted() -> error finding file: {challenge_file}')
                return None
            except:
                self.log.error('PgAdapter.parse_config_file_return_formatted() -> something went wrong')
                return None

    def do_user_delete(self, email: dict) -> bool:
        # Note: need to delete postgres record and their record in ./users
        connection = self.connection()

        removeFromPg = False

        if connection is None:
            self.log.error('PgAdapter.do_user_create() -> trouble making connection to postgres')
            return False
        
        try:
            cursor = connection.cursor()

            try:
                email_value = email['email']
                type = "User::Delete"
                tuplified = (email_value,)
                self.log.info(f'PgAdapter.do_user_delete() -> {tuplified}')
                cursor.execute(self.QUERIES[type], tuplified)
                result = cursor.fetchone()[0]
                uuid_ = result
                self.log.info(f'PgAdapter.do_user_delete() -> got back {uuid_}')
                connection.commit()
                if uuid_ in os.listdir('./users'):
                    removeFromPg = True
                else:
                    self.log.info('PgAdapter.do_user_delete() -> skipped user delete cuz uuid not in ./users')
                    return True
            except:
                self.log.error('PgAdapter.do_user_delete() -> error removing from postgres')
                return False
        
        except:
            self.log.error('PgAdapter.do_user_delete() -> error creating connection/cursor in db.')
            return False

        # if successfully removed from Postgres, 
        # also clean up data from ./users folder:
        if removeFromPg and (uuid_ is not None):
            user_directory = f"./users/{uuid_}"
            try:
                shutil.rmtree(user_directory)
                return True
            except Exception as e:
                self.log.error(f'PgAdapter.do_user_delete() -> an error occurred while removing user data: {e}')
                return False
        
        else:
            self.log.error('PgAdapter.do_user_delete() -> error removing user data')
            return False
        
    def get_all_users(self):

        connection = self.connection()

        if connection is None:
            self.log.error('PgAdapter.get_all_users() -> trouble making connection to postgres')
            return False
        
        try:
            cursor = connection.cursor()

            try:
                type = "User::Select"
                cursor.execute(self.QUERIES[type])
                result = cursor.fetchall()
                self.log.info(f'PgAdapter.get_all_users() -> got back {len(result)} users from query.')
                return result
            except:
                self.log.error('PgAdapter.get_all_users() -> error executing select query from postgres')
                return False
        
        except:
            self.log.error('PgAdapter.get_all_users() -> error creating connection/cursor in db.')
            return False
    
    def load_user_by_uuid(self, uuid):

        connection = self.connection()

        if connection is None:
            self.log.error('PgAdapter.load_user_by_uuid() -> trouble making connection to postgres')
            return False

        try:
            cursor = connection.cursor()

            try:
                type = "User::SelectByUUID"
                tuplified = (uuid,)
                cursor.execute(self.QUERIES[type], tuplified)
                result = cursor.fetchall()
                self.log.info(f'PgAdapter.load_user_by_uuid() -> got back {result} from query.')
                self.log.info('returning record...')
                return result
            except:
                self.log.error('PgAdapter.load_user_by_uuid() -> error executing query in DB')
                return None
        except:
            self.log.error('PgAdapter.load_user_by_uuid() -> error creating connection/cursor in postgres')
            return None
    
    def update_user_account(self, data) -> bool:
        self.log.info(f"PgAdapter.update_user_account() -> data received: {data}")
        if 'uuid' not in data.keys():
            self.log.error(f'PgAdapter.update_user_account() -> uuid not in data, cant update')
            return False
        
        # get the user to be modified
        user_record = self.load_user_by_uuid(data['uuid'])
        _email_from_recrd_ = user_record[0][0]
        _pw_from_recrd_ = user_record[0][1]

        # checks whats different
        updated_data = {
            'uuid': data['uuid']
        }

        postgres_update_required = False

        if _email_from_recrd_ != data['email']:
            updated_data['email'] = data['email']
            updated_data['password'] = data['password']
            self.log.info('PgAdapter.update_user_account() -> changing the users email')
            postgres_update_required = True
        
        if _pw_from_recrd_ != data['password']:
            updated_data['email'] = data['email']
            updated_data['password'] = data['password']
            self.log.info('PgAdapter.update_user_account() -> will update user password')
            postgres_update_required = True
        
        if postgres_update_required:
            if self.update_user_record(updated_data):
                return True
            return False

    def update_user_record(self, data) -> bool:
        connection = self.connection()

        if connection is None:
            self.log.error('PgAdapter.update_user_record() -> trouble making connection to postgres')
            return False

        try:
            cursor = connection.cursor()

            try:
                type = "User::UpdatePostgres"
                try:
                    cursor.execute(self.QUERIES[type], data)
                except pg.OperationalError as e:
                    self.log.error(f'PgAdapter.update_user_record() -> error: {e}')
                    return False
                except pg.ProgrammingError as e:
                    self.log.error(f'PgAdapter.update_user_record() -> error: {e}')
                    return False
                except pg.IntegrityError as e:
                    self.log.error(f'PgAdapter.update_user_record() -> error: {e}')
                    return False
                except pg.DataError as e:
                    self.log.error(f'PgAdapter.update_user_record() -> error: {e}')
                    return False
                except pg.DatabaseError as e:
                    self.log.error(f'PgAdapter.update_user_record() -> error: {e}')
                    return False
                except Exception as e:
                    self.log.error('erroring right here')

                result = cursor.fetchall()
                self.log.info(f'PgAdapter.update_user_record() -> got back {result} from query.')
                connection.commit()
                return True
            except pg.ProgrammingError as e:
                self.log.error(f'PgAdapter.update_user_record() -> error in sql code: {e}')
                return False
            except pg.DatabaseError as e:
                self.log.error(f'PgAdapter.update_user_record() -> error when executing {e}')
                return False
        except:
            self.log.error('PgAdapter.update_user_record() -> error creating connection/cursor in postgres')
            return False
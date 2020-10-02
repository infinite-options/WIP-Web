# import stripe
from flask import Flask, request, render_template, url_for, redirect
from flask_restful import Resource, Api
from flask_cors import CORS
from datetime import datetime
# from flask_mail import Mail, Message  # used for email
# used for serializer email and error handling
# from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature


from werkzeug.exceptions import BadRequest, NotFound

from dateutil.relativedelta import *
from decimal import Decimal
from datetime import datetime, date, timedelta
from hashlib import sha512
from math import ceil
import string
import random

# BING API KEY
# Import Bing API key into bing_api_key.py

from wip_env_keys import BING_API_KEY, RDS_PW

import decimal
import sys
import json
import pytz
from tzlocal import get_localzone # $ pip install tzlocal
import pymysql
import requests

RDS_HOST = 'pm-mysqldb.cxjnrciilyjq.us-west-1.rds.amazonaws.com'
RDS_PORT = 3306
RDS_USER = 'admin'
RDS_DB = 'wipSchema'

app = Flask(__name__)

# --------------- Stripe Variables ------------------
# these key are using for testing. Customer should use their stripe account's keys instead
# stripe_public_key = 'pk_test_6RSoSd9tJgB2fN2hGkEDHCXp00MQdrK3Tw'
# stripe_secret_key = 'sk_test_fe99fW2owhFEGTACgW3qaykd006gHUwj1j'

# this is a testing key using ptydtesting's stripe account.
# stripe_public_key = "pk_test_51H0sExEDOlfePYdd9TVlnhVDOCmmnmdxAxyAmgW4x7OI0CR7tTrGE2AyrTk8VjftoigEOhv2RTUv5F8yJrfp4jWQ00Q6KGXDHV"
# stripe_secret_key = "sk_test_51H0sExEDOlfePYdd9UQDxfp8yoY7On272hCR9ti12WSNbIGTysaJI8K2W8NhCKqdBOEhiNj4vFOtQu6goliov8vF00cvqfWG6d"

# stripe.api_key = stripe_secret_key
# Allow cross-origin resource sharing
cors = CORS(app, resources={r'/api/*': {'origins': '*'}})

# Set this to false when deploying to live application
app.config['DEBUG'] = True

# Adding for email testing
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'ptydtesting@gmail.com'
app.config['MAIL_PASSWORD'] = 'ptydtesting06282020'
app.config['MAIL_DEFAULT_SENDER'] = 'ptydtesting@gmail.com'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
# app.config['MAIL_DEBUG'] = True
# app.config['MAIL_SUPPRESS_SEND'] = False
# app.config['TESTING'] = False

# mail = Mail(app)

# API
api = Api(app)

# convert to UTC time zone when testing in local time zone
utc = pytz.utc
def getToday(): return datetime.strftime(datetime.now(utc), "%Y-%m-%d")
def getNow(): return datetime.strftime(datetime.now(utc), "%Y-%m-%d %H:%M:%S")
def getNowTime(): return datetime.strftime(datetime.now(utc), "%H:%M:%S")

# def getToday(): return datetime.strftime(date.today(), "%Y-%m-%d")
# def getNow(): return datetime.strftime(datetime.now(), "%Y-%m-%d %H:%M:%S")

# Connect to MySQL database (API v2)
def connect():
    global RDS_PW
    global RDS_HOST
    global RDS_PORT
    global RDS_USER
    global RDS_DB

    print("Trying to connect to RDS (API v2)...")
    try:
        conn = pymysql.connect(RDS_HOST,
                               user=RDS_USER,
                               port=RDS_PORT,
                               passwd=RDS_PW,
                               db=RDS_DB,
                               cursorclass=pymysql.cursors.DictCursor)
        print("Successfully connected to RDS. (API v2)")
        return conn
    except:
        print("Could not connect to RDS. (API v2)")
        raise Exception("RDS Connection failed. (API v2)")


# Disconnect from MySQL database (API v2)
def disconnect(conn):
    try:
        conn.close()
        print("Successfully disconnected from MySQL database. (API v2)")
    except:
        print("Could not properly disconnect from MySQL database. (API v2)")
        raise Exception("Failure disconnecting from MySQL database. (API v2)")


# Serialize JSON
def serializeResponse(response):
    try:
        for row in response:
            for key in row:
                if type(row[key]) is Decimal:
                    row[key] = float(row[key])
                elif type(row[key]) is date or type(row[key]) is datetime:
                    print(row[key])
                    row[key] = row[key].strftime("%Y-%m-%d %H:%M:%S")
                elif type(row[key]) is timedelta:
                    # print(row[key])
                    row[key] = str(row[key])
        return response
    except:
        raise Exception("Bad query JSON")


# Execute an SQL command (API v2)
# Set cmd parameter to 'get' or 'post'
# Set conn parameter to connection object
# OPTIONAL: Set skipSerialization to True to skip default JSON response serialization
def execute(sql, cmd, conn, skipSerialization=False):
    response = {}
    try:
        with conn.cursor() as cur:
            print(sql)
            cur.execute(sql)
            if cmd is 'get':
                result = cur.fetchall()
                response['message'] = 'Successfully executed SQL query.'
                # Return status code of 280 for successful GET request
                response['code'] = 280
                if not skipSerialization:
                    result = serializeResponse(result)
                response['result'] = result
                # print(response)
            elif cmd in 'post':
                conn.commit()
                response['message'] = 'Successfully committed SQL command.'
                # Return status code of 281 for successful POST request
                response['code'] = 281
            else:
                response['message'] = 'Request failed. Unknown or ambiguous instruction given for MySQL command.'
                # Return status code of 480 for unknown HTTP method
                response['code'] = 480
    except:
        response['message'] = 'Request failed, could not execute MySQL command.'
        # Return status code of 490 for unsuccessful HTTP request
        response['code'] = 490
    finally:
        # response['sql'] = sql
        return response

#  ************************** WIP APIs **************************


"""Gets the data for existing users

Returns
-------
Json response
    an array of user data in json format and response code
"""


class All_Users(Resource):
    def get(self):
        try:
            conn = connect()

            result = execute("""
                SELECT * FROM customer
                """, 'get', conn)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'All_Users Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/all_users
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/all_users
# Example: http://localhost:4000/api/v2/all_users


"""Gets the data for existing venues in the database

Returns
-------
Json response
    an array of venue data in json format and response code
"""


class All_Venues(Resource):
    def get(self):
        try:
            conn = connect()

            result = execute("""
                SELECT * FROM
                venue
                """, 'get', conn)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'All_Venue Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/all_venues
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/all_venues
# Example: http://localhost:4000/api/v2/all_venues


"""Gets all the distinct venue categories in the databse

Returns
-------
Json response
    an array of venue categories in json format and response code
"""


class All_venue_categories(Resource):
    def get(self):
        try:
            conn = connect()
            result = execute("""
                SELECT DISTINCT category from venue
                """, 'get', conn, True)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                ' All_venue_categories failed, please try again later')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/get_categories
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/get_categories
# Example: http://localhost:4000/api/v2/get_categories


"""Gets the customer tickets with their appropriate venues


Returns
-------
Json response
    an array of ticket data in json format and response code
"""


class All_Tickets(Resource):
    def get(self):
        try:
            conn = connect()

            result = execute("""
                SELECT * FROM ticket
                """, 'get', conn)

            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'All_Ticket Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/all_tickets
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/all_tickets
# Example: http://localhost:4000/api/v2/all_tickets


# """Gets the complete customer ticket information with their appropriate venues

# Returns
# -------
# Json response
#     an array of ticket data in json format and response code
# """


# class Ticket_Info(Resource):
#     def get(self):
#         try:
#             conn = connect()

#             result = execute("""
#                 SELECT t1.ticket_id AS ticket_id,
#                 t1.created_at AS createdAt,
#                 t2.name AS venueName,
#                 t2.category AS VenueCategory,
#                 t2.queue_head AS queueHead,
#                 t2.closing_time AS closingTime,
#                 t3.customer_id AS customerID,
#                 t3.name AS customerName,
#                 t3.phone AS cusomerPhoneNumber,
#                 t3.email AS customerEmailAddress
#                 FROM ticket t1 LEFT JOIN venue t2 ON t2.venue_id = t1.venue_id LEFT JOIN customer t3 ON t3.customer_id = t1.user_id
#                 """, 'get', conn)
#             # print(result)
#             response = {}
#             response["result"] = result["result"]
#             return response, 200
#         except:
#             raise BadRequest(
#                 'Ticket_info Request failed, please try again later.')
#         finally:
#             disconnect(conn)


"""Gets a particular venue information

Parameters
----------
venue_id : int
    the venue id

Returns
-------
Json response
    an array of venue data in json format and response code
"""


# class Get_venue(Resource):
#     def get(self, id):
#         try:
#             conn = connect()

#             result = execute("""SELECT venue.venue_uid, venue.venue_id, venue.street, venue.city, venue.state, venue.zip, venue.latitude, venue.longitude,
#             SEC_TO_TIME(AVG(TIME_TO_SEC(subtime(exit_time, entry_time)))) as wait_time
#             FROM ticket
#             right JOIN venue
#             ON ticket.venue_uid=venue.venue_uid and venue.venue_id = {} where venue.venue_id = {} and date(ticket_created_at) = curdate()
#             GROUP BY venue.venue_uid """.format(id, id), 'get', conn)

#             # print(result)
#             # queue_size = execute(
#             #     """ select venue.venue_uid, count(ticket.venue_uid) as queue_size from ticket RIGHT join venue on ticket.venue_uid = venue.venue_uid where venue.venue_id = {} and ticket.status = 'waiting'
#             #         group by venue.venue_uid """.format(id), 'get', conn)
#             # queue_size = execute(
#             #     """ select venue.venue_id, ticket.venue_uid,ticket.status, count(ticket.venue_uid) as queue_size
#             #         from wip.venue
#             #         left join wip.ticket
#             #         on venue.venue_uid = ticket.venue_uid
#             #         where venue.venue_id = {} and ticket.status = 'waiting' or ticket.status is null and venue.venue_id = {}
#             #         group by venue.venue_uid,
#             #         ticket.status """.format(id, id), 'get', conn)

#             queue_size = execute(
#                 """select venue.venue_id, ticket.venue_uid,ticket.status, venue.queue_cap as queue_size
#                     from venue
#                     left join ticket
#                     on venue.venue_uid = ticket.venue_uid
#                     where venue.venue_id = {}
#                     group by venue.venue_uid """.format(id), 'get', conn)

#             if (len(result['result']) == 0):
#                 result_when_no_ticket = execute(""" select venue.venue_uid, venue.venue_id, venue.street, venue.city, venue.state, venue.zip, venue.latitude, venue.longitude
#                                                 from venue where venue_id = {} """.format(id), 'get', conn)

#                 for itm in result_when_no_ticket['result']:
#                     itm['wait_time'] = None
#                     itm['queue_size'] = 0

#             print(queue_size)
#             print(len(result['result']))
            
#             response = {}

#             for itm2 in queue_size['result']:
#                 # print(itm2)
#                 for itm1 in result['result']:
#                     # print(itm1)
#                     if itm2['venue_uid'] == itm1['venue_uid'] and itm2['venue_id'] == itm1['venue_id']:
#                         itm1['queue_size'] = itm2['queue_size']
            
#             for itm in result['result']:
#                 itm.setdefault('queue_size', 0)

#             if(len(result['result']) == 0):
#                 response["result"] = result_when_no_ticket["result"]
#             else:
#                 response["result"] = result["result"]

#             return response, 200
#         except:
#             raise BadRequest(
#                 'All_Users Request failed, please try again later.')
#         finally:
#             disconnect(conn)
class Get_venue(Resource):
    def get(self, id):
        try:
            conn = connect()

            get_venues = execute("""SELECT venue.venue_uid, venue.venue_id, venue.street, venue.city, venue.state, venue.zip, venue.latitude, venue.longitude
                                from venue where venue_id = {} """.format(id), 'get', conn)

            print(get_venues)
            for itm in get_venues['result']:

                v_uid = itm['venue_uid']
                var  = "@wait"
                opening_at = "@open_time"
                closing_at = "@close_time"
                #if the store is currently open or not
                status = "@openornot"

                get_queue_size  = execute(""" select queue_cap from venue where venue_uid = {} """.format(v_uid), 'get', conn )
                get_wait_time  = execute(""" call send_approx_wait_time( {}, null , {} ) """.format(v_uid, var), 'get', conn )

                get_business_hours = execute( """ call is_store_open({}, {}, {}, {} ) """.format( v_uid, status, opening_at, closing_at ), 'get', conn )
                print(get_business_hours)
                # print(get_queue_size)
                # print(get_wait_time)
                itm['queue_size'] = get_queue_size['result'][0]['queue_cap']
                waitTime = execute(""" select @wait """,'get', conn)
                open_at = execute( """ select @open_time """, 'get', conn)
                close_at = execute( """ select @close_time """, 'get', conn)
                # print(waitTime)
                itm['wait_time'] = waitTime['result'][0]['@wait']

                itm['open_at'] = open_at['result'][0]['@open_time']           
                     
                itm['close_at'] = close_at['result'][0]['@close_time'] 
            response = {}

            
            response["result"] = get_venues["result"]

            return response, 200
        except:
            raise BadRequest(
                'All_Users Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/get_venue/<int:id>
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/get_venue/<int:id>
# Requires venue_id. Example: http://localhost:4000/api/v2/get_venue/10


"""Gets all venues that belongs to a particular category

Parameters
----------
venue category: string
    the venue id

Returns
-------
Json response
    an array of venue data in json format and response code
"""


class Get_category_venue(Resource):
    def get(self, name):
        try:
            conn = connect()
            result = execute("""
                select distinct venue_name, venue_id from venue where category= {}
             """.format(name), 'get', conn)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'All_Users Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/get_venue/<string:name>
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/get_venue/<string:name>
# Requires Category name. Example: http://localhost:4000/api/v2/get_venue/"Grocery"


"""Gets a particular user data

Parameters
----------
customer id: Int
    the venue id

Returns
-------
Json response
    an array of customer data in json format and response code
"""


class Get_user(Resource):
    def get(self, id):
        try:
            conn = connect()

            result = execute("""
                SELECT customer_id, name, email, phone FROM customer WHERE customer_id = {}
             """.format(id), 'get', conn)

            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'Get_user Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/get_user/<int:id>
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/get_user/<int:id>
# Requires customer_id. Example: http://localhost:4000/api/v2/get_user/10


"""Gets the size  and average waititnf time of the queue for a particular venue
Returns
-------
Json response with the updated average wait time , number of people standing in the queue of a particular venue and the status code
"""


class Queue_info(Resource):
    def get(self, id):
        try:
            conn = connect()

            queue_len = execute("""
                select queue_cap as queue_len from venue where venue_uid={} ;
                """.format(id), 'get', conn)

            wait_time = execute(
                """ select SEC_TO_TIME(AVG(TIME_TO_SEC(subtime(exit_time, entry_time)))) as wait_time from ticket where venue_uid={} and date(ticket_created_at) = curdate() """.format(id), 'get', conn)
            # print(result)
            response = {}
            queue_len["result"].append(wait_time["result"][0])
            response["result"] = queue_len["result"]
            # print(queue_len)
            return response, 200
        except:
            raise BadRequest(
                'Queue_info Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/queue/<int:id>
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/queue/<int:id>
# Requires venue_uid. Example: http://localhost:4000/api/v2/queue/10

"""Update the exit_time of a particular customer for a particular venue  (when a user scans the barcode to exit the venue)
Returns
-------
Json response with the updated average time of a particular venue and the status code
"""


# class Update_queue_info(Resource):
#     def put(self):
#         response = {}
#         try:
#             _json = request.json
#             _user_id = _json['user_id']
#             _uid = _json['venue_uid']
#             _exit_time = _json['exit_time']

#             conn = connect()
#             # reduced the in-store capacity of that venue
#             reduce_in_store_cap = """ update venue as a inner join venue as b on a.venue_uid = b.venue_uid
#                                         set a.in_store_cap = 
#                                         case when a.in_store_cap = 0 then a.in_store_cap 
#                                         else 
#                                         b.in_store_cap-1 
#                                         end
#                                         where a.venue_uid = {} """.format( _uid)
            
#             # assigned the entry tome to the person who was waiting at the head of the queue
#             update_que_head_entry_time = """ update ticket set entry_time = '{}', status = 'in-store'
#                                              where token_number = (select queue_head from venue where venue_uid = {})
#                                              and venue_uid = {} and date(ticket_created_at) = curdate();
#              """.format(
#                  _exit_time, _uid, _uid)

#             # set the exit time of the person who just left
#             set_exit_time = """ update ticket set exit_time = '{}', status = 'exit', duration = subtime(exit_time , entry_time)
#                                  where venue_uid = {} and user_id = {} and date(ticket_created_at) = curdate()
#              """.format(
#                 _exit_time, _uid, _user_id)

            

#             # increase the instore cap if there's someone standing in the queue
#             incrs_in_store_cap = """ update venue as a inner join venue as b on a.venue_uid = b.venue_uid
#                                      set a.in_store_cap = case when b.queue_cap > 0 then
#                                      b.in_store_cap+1 else b.in_store_cap end where a.venue_uid = {} """.format(_uid)

#             # reduced the capacity of the queue
#             # using inner join since we cannot update a column with a value that's coming from the same value
#             reduce_que_cap = """ update venue as a inner join venue as b on a.venue_uid = b.venue_uid
#                                     set a.queue_cap = case when a.queue_cap = 0
#                                     then a.queue_cap else b.queue_cap-1 end
#                                     where a.venue_uid = {} """.format(_uid)
            
#             # set_exit_status = """ update ticket set status = 'exit' where venue_uid = {} and user_id = {} """.format(
#                 # _uid, _user_id)

#             updt_venue_queue_head = """ update venue as a inner join venue as b on a.venue_uid = b.venue_uid
#                                         set a.queue_head = case when a.queue_cap = 0 
#                                         then a.queue_head else a.queue_head+1 end 
#                                         where a.venue_uid= {} """.format( _uid)

#             # updt_user_duration = """ update ticket set duration = subtime(exit_time , entry_time) where user_id = {} and venue_uid = {} """.format(_user_id, _uid)

#             print(execute(reduce_in_store_cap, 'post', conn))
#             print(execute(set_exit_time, 'post', conn))
#             cursor = conn.cursor()
#             bindData = (_user_id, _uid, _exit_time)
#             cursor.callproc('update_leaving_time', bindData)
#             conn.commit()
            
#             print(execute(incrs_in_store_cap, 'post', conn))
#             print(execute(reduce_que_cap, 'post', conn))
#             print(execute(update_que_head_entry_time, 'post', conn))            
#             # print(execute(set_exit_status, 'post', conn))            
#             print(execute(updt_venue_queue_head, 'post', conn))
#             # print(execute(updt_user_duration, 'post', conn))



#             wait_time = execute(
#                 """ select SEC_TO_TIME(AVG(TIME_TO_SEC(subtime(exit_time, entry_time)))) as wait_time from ticket where venue_uid={} """.format(_uid), 'get', conn)
#             response = {}
#             response["result"] = wait_time["result"]
            
#             return response, 200
#         except:
#             raise BadRequest(
#                 'Queue_update_info Request failed, please try again later.')
#         finally:
#             disconnect(conn)

# PUT ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/update_queue
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/update_queue
# "user_id": 1,
# "venue_uid": 2, 
# "exit_time": "09:05:00"

class Update_queue_info(Resource):
    def put(self):
        response = {}
        try:
            _json = request.json
            _user_id = _json['usr_id']
            _uid = _json['vnu_uid']
            # _exit_time = _json['ext_time']
            
            if request.method == 'PUT':
                exit_time = getNowTime()
                bindData = (_user_id, _uid, exit_time)

                conn = connect()
                cursor = conn.cursor()

                cursor.callproc('update_exit_time', bindData)
                conn.commit()
                response["result"] = "Succesfully updated the queue info"
                return response, 200
            else:
                response['message'] = "error adding ticket data"
                return response, 500
        except:
            raise BadRequest(
                'Update_queue_info Request failed, please try again later.')
        finally:
            disconnect(conn)


"""Update the entry_time of a particular customer for a particular venue (when a user scans the barcode to enter the venue)
Returns
-------
Json response with the updated average time of a particular venue and the status code
"""

class Update_entry_time(Resource):
    def put(self):
        response = {}
        try:
            _json = request.json
            _user_id = _json['user_id']
            _uid = _json['venue_uid']
            # _entry_time = _json['entry_time']

            conn = connect()
            # print(type(_entry_time))
            entry_time = getNowTime()
            # print(type(entry_time))
            existing_entry_time = execute(""" select entry_time from ticket 
                                                where user_id = {} and venue_uid = {} and status = 'Entering' and date(ticket_created_at) = utc_date() """.format(
                                                _user_id, _uid ) ,  'get', conn)
            
            
            # if(  existing_entry_time['result'][0]['entry_time'] <= entry_time  ):
            #     print(entry_time)
            #     print(existing_entry_time['result'][0]['entry_time'])
            query = """ update ticket set entry_time = '{}', status = 'In-store' where venue_uid = {} and user_id = {}
            and date(ticket_created_at) = utc_date() and `status` <> 'exit' """.format(
                entry_time, _uid, _user_id)
            result = execute(query, 'post', conn)
            

            wait_time = execute(
                """ select SEC_TO_TIME(AVG(TIME_TO_SEC(subtime(exit_time, entry_time)))) as wait_time from ticket where venue_uid={} """.format(_uid), 'get', conn)
            response = {}
            response["result"] = wait_time["result"]
        
            return response, 200
        except:
            raise BadRequest(
                'Queue_update_info Request failed, please try again later.')
        finally:
            disconnect(conn)

# PUT ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/entry_time_button
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/entry_time_button
# "user_id": 1,
# "venue_uid": 2, 
# "entry_time": "09:05:00"

"""Update the entry_time and of a particular customer for a particular venue (when a user presses get out of line button for a particular venue)
Returns
-------
Json response with the updated average time of a particular venue and the status code
"""

class get_out(Resource):
    def put(self):
        response = {}
        try:
            _json = request.json
            _user_id = _json['usr_id']
            _uid = _json['vnu_uid']
            # _entry_time = _json['entry_time']

            if request.method == 'PUT':
                bindData = (_user_id, _uid)

                conn = connect()
                cursor = conn.cursor()

                cursor.callproc('get_out_of_line', bindData)
                conn.commit()
                response["result"] = "Succesfully executed get out of the line"
                return response, 200
            else:
                response['message'] = "error executing get out of the line"
                return response, 500
        except:
            raise BadRequest(
                'get_out Request failed, please try again later.')
        finally:
            disconnect(conn)

# PUT ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/entry_time_button
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/entry_time_button
# "user_id": 1,
# "venue_uid": 2, 
# "entry_time": "09:05:00"

"""post the data for a new venue


Returns
-------
    Json response message and code
"""


class Add_venue(Resource):
    def post(self):
        response = {}
        try:
            _json = request.json
            # _uid = _json['v_venue_uid']
            _name = _json['v_name']
            _id = _json['v_id']
            _category = _json['v_category']
            _max_cap = _json['v_max_cap']
            _in_store_cap = _json['v_in_store_cap']
            _queue_cap = _json['v_queue_cap']
            _current_token = _json['v_current_token']
            _queue_head = _json['v_queue_head']
            _business_hours = _json["v_business_hours"]
            _street = _json['v_street']
            _city = _json['v_city']
            _email = _json['v_email']
            _state = _json['v_state']
            _zip = _json['v_zip']
            _phone = _json['v_phone']
            _latitude = _json['v_latitude']
            _longitude = _json['v_longitude']
            _time_spent = _json['v_default_time_spent']
            if request.method == 'POST':
                bindData = ( _name, _id, _category, _max_cap,_in_store_cap, _queue_cap,_current_token, _queue_head,
                           _business_hours, _street, _city, _state, _zip, _phone, _email, _latitude, _longitude, _time_spent)
                print(bindData)
                conn = connect()
                cursor = conn.cursor()

                cursor.callproc('CreateVenue', bindData)
                conn.commit()

                response["result"] = "Succesfully added the venue"
                return response, 200
            else:
                response['message'] = "error adding venue data"
                return response, 500
        except:
            raise BadRequest(
                'Add_venue Request failed, please try again later.')
        finally:
            disconnect(conn)

# POST ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/add_venue
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/add_venue
# {
#     "v_name": "Safeway",
#     "v_id": null/10,
#     "v_category": "Grocery",
#     "v_max_cap": 3,
#     "v_in_store_cap": 0,
#     "v_queue_cap": 0,
#     "v_current_token": 0,
#     "v_queue_head": 0,
#     "v_business_hours": "{\"F\": [\"9:00:00\", \"24:00:00\"], \"M\": [\"9:00:00\", \"24:00:00\"], \"S\": [\"9:00:00\", \"24:00:00\"], \"T\": [\"9:00:00\", \"24:00:00\"], \"W\": [\"9:00:00\", \"24:00:00\"], \"Su\": [\"10:00:00\", \"24:00:00\"], \"Th\": [\"9:00:00\", \"24:00:00\"]}",
#     "v_street": "2558 Berryessa Rd",
#     "v_city": "San Jose",
#     "v_state": "CA",
#     "v_zip": "95132",
#     "v_phone": "(719) 7428466",
#     "v_email": "info@safeway.org",
#     "v_latitude": "37.388219",
#     "v_longitude": "-121.857762",
#     "v_default_time_spent": "00:21:00"
#   }



"""post the data for a new customer


Returns
-------
    Json response message and code
"""


class Add_customer(Resource):
    def post(self):
        response = {}
        try:
            _json = request.get_json(force=True)

            _name = _json['name']
            _email = _json['email']
            _phone = _json['phone']
            _long = _json['current_long']
            _latt = _json['current_lat']

            query =  '''
                    INSERT INTO  customer
                    SET name = \'''' + _name + '''\',
                        email = \'''' + _email + '''\',
                        phone = \'''' + _phone + '''\',
	                    current_long = \'''' + _long + '''\',
	                    current_lat = \'''' + _latt + '''\';
                    '''

            # sqlQuery = """
            #              INSERT INTO customer (name, email, phone, current_long, current_lat)
            #              VALUES('{}', '{}', '{}', {}, {})""".format(_name, _email, _phone, _latt, _longi)
            conn = connect()
            result = execute(query, 'post', conn)
            if result['code'] == 281:
                response["result"] = "Succesfully added the customer"
                return response, 200
            else:
                response['message'] = "error adding customer data"
                return response, 500
        except:
            raise BadRequest(
                'Add_customer Request failed, please try again later.')
        finally:
            disconnect(conn)

# POST ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/add_customer
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/add_customer
# {"name": "John Doe",
#  "email": "johndoe@gmail.com", 
# "phone": "123-353-4567", 
# "current_long": 12.9989,
#  "current_lat": -10.34232 }


"""post the data for a new ticket

Returns
-------
    Json response message and code
"""


class Add_ticket(Resource):
    def post(self):
        response = {}
        try:
            _json = request.json
            _user_id = _json['t_user_id']
            _uid = _json['t_uid']
            _comm_time = _json['commute_time']
            # _entry_time = _json["t_entry_time"]
            # _scheduled_time = _json["t_scheduled_time"]
            
            if request.method == 'POST':
                bindData = (_user_id, _uid, _comm_time)

                conn = connect()
                cursor = conn.cursor()

                cursor.callproc('AddTicket', bindData)
                conn.commit()
                response["result"] = "Succesfully added the ticket"
                return response, 200
            else:
                response['message'] = "error adding ticket data"
                return response, 500
        except:
            raise BadRequest(
                'Add_ticket Request failed, please try again later.')
        finally:
            disconnect(conn)

# POST ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/add_ticket
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/add_ticket
# {"t_user_id": 12,
#  "t_uid": 10
#  "t_entry_time": "12:12:00" }


class Update_customer_coordinates(Resource):
    def put(self):
        response = {}
        try:
            _json = request.json
            _customer_id = _json['customer_id']
            _long = _json['current_long']
            _latt = _json['current_lat']

            query = """ update customer set current_long = {}, current_lat = {} where customer_id = {} """.format(
                _long, _latt, _customer_id)

            conn = connect()
            result = execute(query, 'post', conn)
            print(result)
            if result['code'] == 281:
                response["result"] = "Succesfully update the lattitude and longitude of the customer"
                return response, 200
            else:
                response['message'] = "error updating the the lattitude and longitude of the customer"
                return response, 500
        except:
            raise BadRequest(
                'Update_customer_coordinates Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/update_customer_coords
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/update_customer_coords
# {"customer_id": 12,
#  "current_long": -116.244
#  "current_lat": 43.4599 }


"""Delete a particular ticket

Parameters
----------
ticket_id : int
    The ticket unique id

Returns
-------
Json response message and code
"""


class Delete_ticket(Resource):
    def delete(self, id):
        response = {}
        try:
            sqlQuery = """ DELETE FROM ticket WHERE ticket_id = {} """.format(
                id)

            conn = connect()
            result = execute(sqlQuery, 'post', conn)
            if result['code'] == 281:
                response["result"] = "Succesfully deleted the ticket"
                return response, 200
            else:
                response['message'] = "error deleting ticket data"
                return response, 500
        except:
            raise BadRequest(
                'delete_ticket Request failed, please try again later.')
        finally:
            disconnect(conn)


class Get_user_id(Resource):
    def get(self, phone):
        try:
            conn = connect()
            result = execute("""
                select customer_id from customer where phone = {}
             """.format(phone), 'get', conn)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'All_Users Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/get_customer_id/<string:phone>
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/get_customer_id/<string:phone>
# Requires  customer phone number. Example: http://localhost:4000/api/v2/get_customer_id/"123-456-7878"

class Get_customer_token(Resource):
    def get(self, user_id, venue_uid):
        try:
            conn = connect()
            result = execute("""
                select token_number from ticket where user_id = {} and venue_uid = {} and `status` <> 'exit' and date(ticket_created_at) = utc_date()
             """.format(user_id, venue_uid), 'get', conn)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'Get_customer_token Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/customer_token/<int:user_id>/<int:venue_uid>
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/customer_token/<int:user_id>/<int:venue_uid>
# Requires user_id and venue_uid. Example: http://localhost:4000/api/v2/customer_token/10/12

""" ****************** ADMIN PAGE ENDPOINTS ****************** """


class Queue_info_admin(Resource):
    def get(self, id):
        try:
            conn = connect()

            queue_info = execute("""
                select default_time_spent, max_cap from venue where venue_uid={}
                """.format(id), 'get', conn)

            # wait_time = execute(
            #     """ select count(status) as cur_in_store from ticket where status = 'In-store' and venue_uid={} """.format(id), 'get', conn)
            
            wait_time = execute(
                """ select in_store_cap as cur_in_store from venue where venue_uid={} """.format(id), 'get', conn)


            # in_queue = execute(
            #     """ select count(venue_uid) as In_queue from ticket where venue_uid={} and status = 'waiting' """.format(id), 'get', conn)
            in_queue = execute(
                """ select queue_cap as In_queue from venue where venue_uid={} """.format(id), 'get', conn)

            response = {}
            queue_info["result"].append(wait_time["result"][0])
            queue_info["result"].append(in_queue["result"][0])
            response["result"] = queue_info["result"]
            # print(queue_len)
            return response, 200
        except:
            raise BadRequest(
                'Queue_info Request failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/queue_admin/<int:id>
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/queue_admin/<int:id>
# Requires venue_uid. Example: http://localhost:4000/api/v2/venue_info_admin/11


class Update_venue_default_time(Resource):
    def put(self):
        response = {}
        try:
            _json = request.json

            _uid = _json['venue_uid']
            _def_time = _json['default_time']

            query = """ update venue set default_time_spent = '{}' where venue_uid = {} """.format(
                _def_time, _uid)

            conn = connect()
            result = execute(query, 'post', conn)
            print(result)
            if result['code'] == 281:
                response["result"] = "Succesfully update the default_time of the venue"
                return response, 200
            else:
                response['message'] = "error updating the default time of the venue"
                return response, 500
        except:
            raise BadRequest(
                'Update_venue_default_time Request failed, please try again later.')
        finally:
            disconnect(conn)
# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/venue_def_time_update
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/venue_def_time_update
# {"venue_uid": 12,
# "default_time": "00:02:00" }


class Update_venue_max_cap(Resource):
    def put(self):
        response = {}
        try:
            _json = request.json
            _uid = _json['venue_uid']
            _new_max_cap = _json['max_cap']

            query = """ update venue set max_cap = {} where venue_uid = {} """.format(
                _new_max_cap, _uid)
            conn = connect()
            result = execute(query, 'post', conn)
            print(result)
            if result['code'] == 281:
                response["result"] = "Succesfully update the max capacity of the venue"
                return response, 200
            else:
                response['message'] = "error updating the max capacity of the venue"
                return response, 500
        except:
            raise BadRequest(
                'Update_venue_max_cap Request failed, please try again later.')
        finally:
            disconnect(conn)
# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/venue_max_cap_admin
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/venue_max_cap_admin
# {"venue_uid": 12,
# "max_cap": 20 }


class Get_venue_info_admin(Resource):
    def get(self, id):
        try:
            conn = connect()
            
            result = execute("""SELECT ticket.token_number, ticket.entry_time, customer.name, customer.customer_id, ticket.ticket_created_at, ticket.status, customer.phone as customer_number
            FROM ticket 
			JOIN customer 
            ON ticket.user_id = customer.customer_id and ticket.venue_uid = {} """.format(id), 'get', conn)

            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                ' Get_venue_info_admin failed, please try again later.')
        finally:
            disconnect(conn)

# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/venue_info_admin/<int:id>
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/venue_info_admin/<int:id>
# Requires venue_uid. Example: http://localhost:4000/api/v2/venue_info_admin/11


class Get_business_hours_admin(Resource):
    def get(self, id):
        try:
            conn = connect()
            result = execute(
                """SELECT business_hours from venue where venue_uid = {} """.format(id), 'get', conn, True)
            print((result['result'][0]['business_hours']))
            response = {}
            business_hours = result["result"][0]["business_hours"].replace(
                "\\", "")
            print((business_hours))
            # result['result'] = result["result"].replace("\", "")
            response["result"] = business_hours
            return response, 200
        except:
            raise BadRequest(
                'Get_business_hours_admin failed, please try again later.')
        finally:
            disconnect(conn)
# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/business_hours_admin/<int:id>
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/business_hours_admin/<int:id>
# Requires venu_uid. Example: http://localhost:4000/api/v2/business_hours_admin/11


class update_business_hours_admin(Resource):
    def put(self):
        response = {}
        try:
            _json = request.json

            _uid = _json['venue_uid']
            _new_business_hours = _json['new_business_hours']

            query = """ update venue set business_hours = '{}' where venue_uid = {} """.format(
                _new_business_hours, _uid)
            conn = connect()
            result = execute(query, 'post', conn)
            print(result)
            if result['code'] == 281:
                response["result"] = "Succesfully update the business hours of the venue"
                return response, 200
            else:
                response['message'] = "error updating the max business hours of the venue"
                return response, 500
        except:
            raise BadRequest(
                'update_business_hours_admin Request failed, please try again later.')
        finally:
            disconnect(conn)
# ENDPOINT AND JSON OBJECT THAT WORKS
# http://localhost:4000/api/v2/business_hours_update
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev/api/v2/business_hours_update
# {"venue_uid":12,
# "new_business_hours":
# "{\"F\": [\"9:00:00\", \"21:00:00\"], \"M\": [\"9:00:00\", \"24:00:00\"], \"S\": [\"9:00:00\", \"21:00:00\"], \"T\": [\"9:00:00\", \"24:00:00\"], \"W\": [\"9:00:00\", \"24:00:00\"], \"Su\": [\"9:00:00\", \"18:00:00\"], \"Th\": [\"9:00:00\", \"24:00:00\"]}"



# Define API routes
# Customer page
# https://61vdohhos4.execute-api.us-west-1.amazonaws.com/dev
api.add_resource(All_Users, '/api/v2/all_users')
api.add_resource(All_Venues, '/api/v2/all_venues')
api.add_resource(All_Tickets, '/api/v2/all_tickets')
api.add_resource(Get_user, '/api/v2/get_user/<int:id>')
api.add_resource(Get_venue, '/api/v2/get_venue/<int:id>')
api.add_resource(Get_category_venue, '/api/v2/get_venue/<string:name>')
api.add_resource(Add_venue, '/api/v2/add_venue')
api.add_resource(Add_customer, '/api/v2/add_customer')
api.add_resource(All_venue_categories, '/api/v2/get_categories')
# api.add_resource(Ticket_Info, '/api/v2/tickets')
api.add_resource(Add_ticket, '/api/v2/add_ticket')
api.add_resource(Delete_ticket, '/api/v2/delete_ticket/<int:id>')
api.add_resource(Queue_info, '/api/v2/queue/<int:id>')
api.add_resource(Update_queue_info, '/api/v2/update_queue') #to EXIT the store 
api.add_resource(Update_entry_time, '/api/v2/entry_time_button') # to ENTER the store
api.add_resource(get_out, '/api/v2/get_out') # to get out of the line
api.add_resource(
    Get_user_id, '/api/v2/get_customer_id/<string:phone>')
api.add_resource(Update_customer_coordinates, '/api/v2/update_customer_coords')
api.add_resource(Get_customer_token,
                 '/api/v2/customer_token/<int:user_id>/<int:venue_uid>')


# ADMIN page routes
api.add_resource(Queue_info_admin, '/api/v2/queue_admin/<int:id>')
api.add_resource(Update_venue_default_time,
                 '/api/v2/venue_def_time_update')
api.add_resource(Update_venue_max_cap, '/api/v2/venue_max_cap_admin')
api.add_resource(Get_venue_info_admin, '/api/v2/venue_info_admin/<int:id>')
api.add_resource(Get_business_hours_admin,
                 '/api/v2/business_hours_admin/<int:id>')
api.add_resource(update_business_hours_admin, '/api/v2/business_hours_update')


# Run on below IP address and port
# Make sure port number is unused (i.e. don't use numbers 0-1023)
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=2000, debug=True)

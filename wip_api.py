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
import pymysql
import requests

RDS_HOST = 'pm-mysqldb.cxjnrciilyjq.us-west-1.rds.amazonaws.com'
RDS_PORT = 3306
RDS_USER = 'admin'
RDS_DB = 'wip'

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
                    row[key] = row[key].strftime("%Y-%m-%d")
                elif type(row[key]) is timedelta:
                    print(row[key])
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

# WIP APIs

# Function get is in Class All_Users


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
            # print(result)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'All_Ticket Request failed, please try again later.')
        finally:
            disconnect(conn)


"""Gets the complete customer ticket information with their appropriate venues

Returns
-------
Json response
    an array of ticket data in json format and response code
"""


class Ticket_Info(Resource):
    def get(self):
        try:
            conn = connect()

            result = execute("""
                SELECT t1.ticket_id AS ticket_id,
                t1.created_at AS createdAt,
                t2.name AS venueName,
                t2.category AS VenueCategory,
                t2.queue_head AS queueHead,
                t2.closing_time AS closingTime,
                t3.customer_id AS customerID,
                t3.name AS customerName,
                t3.phone AS cusomerPhoneNumber,
                t3.email AS customerEmailAddress,
                t3.eta AS estimatedTimeArrival
                FROM ticket t1 LEFT JOIN venue t2 ON t2.venue_id = t1.venue_id LEFT JOIN customer t3 ON t3.customer_id = t1.user_id
                """, 'get', conn)
            # print(result)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'Ticket_info Request failed, please try again later.')
        finally:
            disconnect(conn)


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


class Get_venue(Resource):
    def get(self, id):
        try:
            conn = connect()
            result = execute("""
                select * from venue where venue_id={}
             """.format(id), 'get', conn)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'All_Users Request failed, please try again later.')
        finally:
            disconnect(conn)


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
                select distinct venue_name, venue_id, uid from venue where category= {}
             """.format(name), 'get', conn)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'All_Users Request failed, please try again later.')
        finally:
            disconnect(conn)

# get a particular user
# @app.route('/user/<int:id>')


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
                SELECT customer_id, name, email, phone, address FROM customer WHERE customer_id = {}
             """.format(id), 'get', conn)
            response = {}
            response["result"] = result["result"]
            return response, 200
        except:
            raise BadRequest(
                'All_Users Request failed, please try again later.')
        finally:
            disconnect(conn)


"""Gets the size  and average waititnf time of the queue for a particular venue
Returns
-------
Json response
"""


class Queue_info(Resource):
    def get(self, id):
        try:
            conn = connect()

            queue_len = execute("""
                select count(uid) as queue_len from ticket where uid={};
                """.format(id), 'get', conn)

            wait_time = execute(
                """ select SEC_TO_TIME(AVG(TIME_TO_SEC(time_spent))) as wait_time from ticket where uid={} """.format(id), 'get', conn)
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


"""Update the exit_time of a particular customer for a particular venue
Returns
-------
Json response
"""


class Update_queue_info(Resource):
    def put(self):
        response = {}
        try:
            _json = request.json
            _user_id = _json['user_id']
            _uid = _json['uid']
            _exit_time = ['exit_time']
            conn = connect()

            query = execute(
                """ update ticket set exit_time = {} where uid = {} and user_id = {} """.format(_exit_time, _uid, _user_id), 'post', conn)
            # print(result)
            response = {}
            response["result"] = query["result"]
            # print(queue_len)
            return response, 200
        except:
            raise BadRequest(
                'Queue_update_info Request failed, please try again later.')
        finally:
            disconnect(conn)


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
            _name = _json['v_name']
            _id = _json['v_id']
            _category = _json['v_category']
            _max_cap = _json['v_max_cap']
            _current_cap = _json['v_current_cap']
            _queue_head = _json['v_queue_head']
            _opening_time = _json['v_opening_time']
            _closing_time = _json['v_closing_time']
            _street = _json['a_street']
            _city = _json['a_city']
            _state = _json['a_state']
            _zip = _json['a_zip']
            _country = _json['a_country']
            _phone = _json['a_phone']
            _lattitude = _json['a_lattitude']
            _longitude = _json['a_longitude']
            if request.method == 'POST':
                # sqlQuery = "INSERT INTO Venue(name, category, max_cap, current_cap, address, lattitude, longitude, queue_head, opening_time, closing_time) VALUES(%s, %s, %s, %s,%s, %s, %s, %s, %s, %s)"
                bindData = (_name, _id, _category, _max_cap, _current_cap, _queue_head, _opening_time,
                            _closing_time, _street, _city, _state, _zip, _country, _phone, _lattitude, _longitude)
                conn = connect()
                # print("****** here *******")
                cursor = conn.cursor()

                cursor.callproc('CreateVenue', bindData)
                conn.commit()
                response["result"] = "Succesfully added the venue"
                # respone.status_code = 200
                return response, 200
            else:
                response['message'] = "error adding venue data"
                return response, 500
        except:
            raise BadRequest(
                'Add_venue Request failed, please try again later.')
        finally:
            disconnect(conn)


"""post the data for a new customer


Returns
-------
    Json response message and code
"""


class Add_customer(Resource):
    def post(self):
        response = {}
        try:
            _json = request.json
            _name = _json['name']
            _email = _json['email']
            _phone = _json['phone']
            _address = _json['address']
            _eta = _json['eta']
            _transport = _json['transport']

            sqlQuery = """
                         INSERT INTO customer (name, email, phone, address, eta, transport)
                         VALUES('{}', '{}', '{}', '{}', '{}', '{}')""".format(_name, _email, _phone, _address, _eta, _transport)
            conn = connect()
            result = execute(sqlQuery, 'post', conn)
            if result['code'] == 281:
                response["result"] = "Succesfully added the customer"
                return response, 200
            else:
                response['message'] = "error adding customer data"
                return response, 500
        # else:
        #     response['message'] = "customer info is missing"
        #     return response, 400
        except:
            raise BadRequest(
                'Add_customer Request failed, please try again later.')
        finally:
            disconnect(conn)


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
            _entry_time = _json['t_entry_time']
            # _exit_time = _json['exit_time']
            _token_number = _json['t_token_number']
            # _created_at = _json['created_at']
            # _status = _json['status']

            # venue_avg_time = execute(""" SELECT avg_time_spent FROM venue WHERE uid={} """.format(id), 'get', conn)
            # print(venue_avg_time)
            if request.method == 'POST':
                bindData = (_user_id, _uid, _token_number,
                            "00:00:00", _entry_time, "00:00:00", "00:00:00")
                conn = connect()
                # print("****** here *******")
                cursor = conn.cursor()

                cursor.callproc('AddTicket', bindData)
                conn.commit()
                response["result"] = "Succesfully added the ticket"
                # respone.status_code = 200
                return response, 200
            else:
                response['message'] = "error adding ticket data"
                return response, 500
        except:
            raise BadRequest(
                'Add_ticket Request failed, please try again later.')
        finally:
            disconnect(conn)


# class Add_ticket(Resource):
#     def post(self):
#         response = {}
#         try:
#             _json = request.json
#             _user_id = _json['t_user_id']
#             _uid = _json['t_uid']
#             _entry_time = _json['t_entry_time']
#             # _exit_time = _json['exit_time']
#             _token_number = _json['t_token_number']
#             # _created_at = _json['created_at']
#             # _status = _json['status']
#             conn = connect()

#             # venue_avg_time = execute(""" SELECT avg_time_spent FROM venue WHERE uid={} """.format(id), 'get', conn)
#             # print(venue_avg_time)
#             bind_date = (_user_id, _uid, _token_number, "00:00:00" ,_entry_time, "00:00:00" , "00:00:00")
#             sqlQuery = """
#                       INSERT INTO ticket(user_id, uid, token_number, created_at, entry_time, exit_time, time_spent)
#                       VALUES ('{}','{}','{}',{}, '{}', {}, {})
#                       """.format(_user_id, _uid, _token_number, "00:00:00" ,_entry_time, "00:00:00" , "00:00:00")
#                         #  INSERT INTO ticket (user_id, uid, token_number, created_at)
#                         #  VALUES('{}', '{}', '{}', '{}')""".format(_user_id, _uid, _token_number, _created_at)
#             result = execute(sqlQuery, 'post', conn)
#             if result['code'] == 281:
#                 response["result"] = "Succesfully added the ticket"
#                 return response, 200
#             else:
#                 response['message'] = "error adding ticket data"
#                 return response, 500
#         # else:
#         #     response['message'] = "customer info is missing"
#         #     return response, 400
#         except:
#             raise BadRequest(
#                 'Add_ticket Request failed, please try again later.')
#         finally:
#             disconnect(conn)


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
api.add_resource(Ticket_Info, '/api/v2/tickets')
api.add_resource(Add_ticket, '/api/v2/add_ticket')
api.add_resource(Delete_ticket, '/api/v2/delete_ticket/<int:id>')
api.add_resource(Queue_info, '/api/v2/queue/<int:id>')
api.add_resource(Update_queue_info, '/api/v2/update_queue')

# Run on below IP address and port
# Make sure port number is unused (i.e. don't use numbers 0-1023)
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=2000)

import pymysql
from app import app
from config import mysql
from flask import jsonify, json
from flask import flash, request
from datetime import date, datetime
from django.core.serializers.json import DjangoJSONEncoder

# to add a new user
@app.route('/add/user', methods=['POST'])
def add_user():
        try:
                _json = request.json
                _name = _json['name']
                _email = _json['email']
                _phone = _json['phone']
                _address = _json['address']
                _eta = _json['eta']
                _transport = _json['transport']
                _venue_id = _json['venue_id']
                if _name and _email and _phone and _address and request.method == 'POST':
                        sqlQuery = "INSERT INTO customer(name, email, phone, address, eta, transport, venue_id)" \
                                   " VALUES(%s, %s, %s, %s,%s, %s, %s)"
                        bindData = (_name, _email, _phone, _address, _eta, _transport, _venue_id)
                        conn = mysql.connect()
                        cursor = conn.cursor()
                        cursor.execute(sqlQuery, bindData)
                        conn.commit()
                        respone = jsonify('Customer added successfully!')
                        respone.status_code = 200
                        return respone
                else:
                        return not_found()
        except Exception as e:
                print(e)
        finally:
                cursor.close()
                conn.close()

# get all users
@app.route('/users')
def all_users():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM customer")
        empRows = cursor.fetchall()
        respone = json.dumps(empRows, cls=DjangoJSONEncoder)
        return respone
        # respone.status_code = 200
        # return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# get a particular user
@app.route('/user/<int:id>')
def get_user(id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT customer_id, name, email, phone, address FROM customer WHERE customer_id =%s", id)
        empRow = cursor.fetchone()
        respone = jsonify(empRow)
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# delete a particular customer
@app.route('/delete-user/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Customer WHERE id =%s", (id))
        conn.commit()
        respone = jsonify('Ticket deleted successfully!')
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# to add new venues
@app.route('/add', methods=['POST'])
def add_venue():
        try:
                _json = request.json
                _name = _json['name']
                _category = _json['category']
                _max_cap = _json['max_cap']
                _current_cap = _json['current_cap']
                _address = _json['address']
                _lattitude = _json['lattitude']
                _longitude = _json['longitude']
                _queue_head = _json['queue_head']
                _opening_time = _json['opening_time']
                _closing_time = _json['closing_time']
                if _name and _max_cap and _current_cap and _address and _lattitude and _longitude and _opening_time and _closing_time  and request.method == 'POST':
                        sqlQuery = "INSERT INTO Venue(name, category, max_cap, current_cap, address, lattitude, longitude, queue_head, opening_time, closing_time) VALUES(%s, %s, %s, %s,%s, %s, %s, %s, %s, %s)"
                        bindData = (_name, _category, _max_cap, _current_cap, _address, _lattitude,_longitude,_queue_head,_opening_time,_closing_time)
                        conn = mysql.connect()
                        cursor = conn.cursor()
                        cursor.execute(sqlQuery, bindData)
                        conn.commit()
                        respone = jsonify('Venue added successfully!')
                        respone.status_code = 200
                        return respone
                else:
                        return not_found()
        except Exception as e:
                print(e)
        finally:
                cursor.close()
                conn.close()

# get a particular venue
@app.route('/venue/<int:id>')
def get_venue(id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT venue_id, name, category, max_cap, current_cap, address, queue_head FROM Venue WHERE venue_id =%s", id)
        empRow = cursor.fetchone()
        respone = jsonify(empRow)
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# delete a particular venue
@app.route('/delete-venue/<int:id>', methods=['DELETE'])
def delete_venue(id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Venue WHERE id =%s", (id))
        conn.commit()
        respone = jsonify('Ticket deleted successfully!')
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# get all Venues
@app.route('/venues')
def all_venues():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM Venue")
        empRows = cursor.fetchall()
        respone = jsonify(empRows)
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# to add a new ticket
@app.route('/add/ticket', methods=['POST'])
def add_ticket():
        try:
                _json = request.json
                _user_id = _json['user_id']
                _venue_id = _json['venue_id']
                _token_number = _json['token_number']
                _created_at = _json['created_at']
                if _user_id and _venue_id and _token_number and _created_at and request.method == 'POST':
                        sqlQuery = "INSERT INTO ticket(user_id, venue_id, token_number, created_at) VALUES(%s, %s, %s, %s)"
                        bindData = (_user_id, _venue_id, _token_number, _created_at)
                        conn = mysql.connect()
                        cursor = conn.cursor()
                        cursor.execute(sqlQuery, bindData)
                        conn.commit()
                        respone = jsonify('Ticket created successfully!')
                        respone.status_code = 200
                        return respone
                else:
                        return not_found()
        except Exception as e:
                print(e)
        finally:
                cursor.close()
                conn.close()

# get all Tickets
@app.route('/tickets')
def all_tickets():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM ticket")
        empRows = cursor.fetchall()
        respone = jsonify(empRows)
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# get a particular ticket
@app.route('/ticket/<int:id>')
def get_ticket(id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT ticket_id, user_id, venue_id, token_number, created_at FROM ticket WHERE ticket_id =%s", id)
        empRow = cursor.fetchone()
        respone = jsonify(empRow)
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# delete a particular ticket
@app.route('/delete-ticket/<int:id>', methods=['DELETE'])
def delete_ticket(id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ticket WHERE id =%s", (id))
        conn.commit()
        respone = jsonify('Ticket deleted successfully!')
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Record not found: ' + request.url,
    }
    respone = jsonify(message)
    respone.status_code = 404
    return respone

if __name__ == "__main__":
    app.run(debug=True)
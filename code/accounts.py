from datetime import datetime
from fnmatch import fnmatchcase
from flask import make_response, abort
from uuid import uuid4
import json

def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))


#Empty accounts table
ACCOUNTS = {

    "test@gmail.com": {
        "fname": "Doug",
        "lname": "Farrell",
        "email": "test@gmail.com",
        "account_id": "123abs",
        "timestamp": get_timestamp(),
    }
}

def read_all():
    '''
    reads all ACCOUNTS data
    :return  json string list 
    '''

    return json.dumps([ACCOUNTS[key] for key in sorted(ACCOUNTS.keys())])

 

# def create(account):
#     lname = account.get('lname', None)
#     fname = account.get('fname', None)
#     email = account.get('email', None)

def create(acount):
    fname = acount['fname']
    lname = acount['lname']
    email = acount['email']
    account_id = str(uuid4())


    if email not in ACCOUNTS and email is not None:
        ACCOUNTS[email] = {

            "fname": fname,
            "lname": lname,
            "email": email,
            "account_id": account_id,
            "timestamp": get_timestamp(),

        }
        return ACCOUNTS[email]

    else:
        abort(
            406,
            "Account with email {email} already exists".format(email=email),
        )

def delete(email):

    if email in ACCOUNTS:
        del ACCOUNTS[email]
        return make_response(
            "Account with email {email} successfully deleted".format(email=email)
        )
    else:
        abort(
            404, "Account with emai {email} not found".format(email=email)
        )

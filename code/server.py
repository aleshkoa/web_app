from crypt import methods
from flask import Flask,render_template,  request, jsonify
import accounts


app = Flask(__name__, template_folder="templates")
#default page
@app.route("/")
def home():
    return render_template('home.html')

@app.route("/api/account", methods= ['POST'])
def create_account():
    print(request.json)
    return accounts.create(request.json)

@app.route("/api/account", methods= ['GET'])
def read_account():
    return accounts.read_all()

@app.route("/api/account/{email}", methods= ['DELETE'])
def delete_account():
    return accounts.delete(request.json['email'])


if __name__ =='__main__':
    app.run(debug=True)
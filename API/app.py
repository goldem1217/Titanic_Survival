import json
from flask import Flask, render_template, request, jsonify
 
import cleaner
    
app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/titanic/<name>')
def titanic(name):
    with open('db/titanic_1308.json', 'r') as jsonfile:
        file_data = json.loads(jsonfile.read())
    # We can then find the data for the requested name and send it back as json
    return json.dumps(file_data[name])
 
if __name__ == '__main__':
	app.run(debug=True)

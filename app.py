from flask import Flask, render_template, request, send_file
from whitenoise import WhiteNoise
import json


app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app, root='static/', prefix='assets/')

@app.route('/')
def hello_world():
    return render_template("index.html")
'''
@app.route('/get_data')
def load_data():
    if request.remote_addr == "":
        f = open("gods.json")
        data = json.load(f)
        f.close()
        return data
    else:
        return "Nothing to see here."
'''

if __name__ == "__main__":
    app.run()

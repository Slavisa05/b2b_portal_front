from flask import Flask, request, render_template
from flask_cors import CORS


app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

@app.route('/')
def root():
    return render_template('homepage.html')

@app.route('/interfoni')
def interfoni():
    return render_template('interfoni.html')

@app.route('/led-paneli')
def ledPaneli():
    return render_template('led-paneli.html')

@app.route('/led-rasveta')
def ledRasveta():
    return render_template('led-rasveta.html')

@app.route('/video-nadzor')
def videoNadzor():
    return render_template('video-nadzor.html')

@app.route('/tehnicka-podrska')
def tehnickaPodrska():
    return render_template('tehnicka-podrska.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/admin-dashboard')
def adminDashboard():
    return render_template('admin-dashboard.html')

@app.route('/seller-dashboard')
def sellerDashboard():
    return render_template('seller-dashboard.html')



if __name__ == "__main__":
    app.run(debug=True, port=8000)
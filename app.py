from flask import Flask, render_template, redirect, request, flash, session, jsonify, url_for
from flask_cors import CORS
from config import Config
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
import datetime


app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Enable CORS for all routes

# Initialize database on startup
init_db()

class Farmer(db.Model):
    aadhar   = db.Column(db.String(12), primary_key=True)
    name     = db.Column(db.String(50), nullable=False, unique=False)
    mobile   = db.Column(db.String(10), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)



@app.route("/")
def home_page():
    """App landing/home page"""
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        aadhar = request.form['aadhar']
        password = request.form['password']

        user = Farmer.query.filter_by(aadhar=aadhar).first()

        if user is None:
            flash('Aadhar not found.', 'danger')
        elif not check_password_hash(user.password,password):
            flash('Incorrect password.', 'danger')
        else:
            session['user_id'] = user.aadhar
            session['name'] = user.name
            return redirect('/dashboard')  # login success 
    
    return render_template('login.html')

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
import random
import re
from datetime import datetime, timedelta
import requests
from email_validator import validate_email, EmailNotValidError
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import pytz

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'iamahacker.sanket@gmail.com'
app.config['MAIL_PASSWORD'] = 'yezo zslv lztk wnrn'
app.config['MAIL_DEFAULT_SENDER'] = 'sanket@theplasma.tech'

mail = Mail(app)


#--------------------------------- AUTHENTICATION -----------------------------------------------

def is_valid_phone_number(phone_number):
    return re.match(r"^\+?1?\d{9,15}$", phone_number) is not None

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        try:
            validate_email(email)
        except EmailNotValidError:
            return jsonify({'error': 'Invalid email format'}), 400

        otp = random.randint(1000, 9999)

        response = supabase.table("users").select("*").eq("email", email).execute()
        user = response.data[0] if response.data else None

        if user:
            supabase.table("users").update({"otp": otp}).eq("email", email).execute()
            user_id = user["id"]
        else:
            result = supabase.table("users").insert({
                "name": "Pending",
                "email": email,
                "otp": otp,
                "verified": False,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
            user_id = result.data[0]["id"]

        msg = Message('Your OTP Code', recipients=[email])
        msg.body = f"Your OTP code is: {otp}. It is valid for 5 minutes."
        mail.send(msg)

        return jsonify({'message': 'OTP sent successfully', 'user_id': user_id}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('otp'):
            return jsonify({'error': 'Email and OTP are required'}), 400

        email = data.get('email')
        otp = data.get('otp')

        try:
            otp = int(otp)
        except ValueError:
            return jsonify({'error': 'OTP must be an integer'}), 400

        response = supabase.table("users").select("*").eq("email", email).execute()
        user = response.data[0] if response.data else None

        if not user:
            return jsonify({'error': 'User not found'}), 400

        if otp != user['otp']:
            return jsonify({'error': 'Invalid OTP'}), 400

        supabase.table("users").update({
            "verified": True,
            "otp": None
        }).eq("email", email).execute()

        return jsonify({'message': 'OTP verified successfully', 'user_id': user['id']}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        name = data.get('name')
        phone = data.get('phone', None)
        address = data.get('address', None)
        location = data.get('location', None)

        if not all([user_id, name]):
            return jsonify({'error': 'User ID and Name are required'}), 400

        response = supabase.table("users").select("*").eq("id", user_id).execute()
        user = response.data[0] if response.data else None

        if not user:
            return jsonify({'error': 'User not found'}), 400

        supabase.table("users").update({
            "name": name,
            "phone": phone,
            "address": address,
            "location_lat": location.get('lat') if location else None,
            "location_long": location.get('long') if location else None,
            "verified": True
        }).eq("id", user_id).execute()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#------------------------------------------- COMPLAIN --------------------------------------------

@app.route('/api/raise-complaint', methods=['POST'])
def raise_complaint():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        complaint_text = data.get('complaint_text')
        complaint_sections = data.get('complaint_sections', [])
        docs = data.get('docs', [])  # Array of image/video URLs
        status = 'Pending'  # Default status

        if not user_id or not complaint_text:
            return jsonify({'error': 'User ID and Complaint text are required'}), 400

        # Insert complaint into Supabase
        result = supabase.table("complaints").insert({
            "user_id": user_id,
            "complaint_text": complaint_text,
            "complaint_sections": complaint_sections,
            "docs": docs,
            "status": status,
            "response": None,
            "created_at": datetime.utcnow().isoformat()
        }).execute()

        complaint_id = result.data[0]['id']
        return jsonify({'message': 'Complaint raised successfully', 'complaint_id': complaint_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

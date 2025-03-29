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
import base64
import google.generativeai as genai
from flask_cors import CORS



# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# GitHub configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")

GITHUB_API_URL = f"https://api.github.com/repos/{GITHUB_USERNAME}/{GITHUB_REPO}/contents/docs/"

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

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

        # Determine if the user is already registered or new
        is_registered = user.get("name") != "Pending"

        supabase.table("users").update({
            "verified": True,
            "otp": None
        }).eq("email", email).execute()

        return jsonify({
            'message': 'OTP verified successfully',
            'user_id': user['id'],
            'isRegistered': is_registered
        }), 200

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


#--------------------------------------- DOCS -------------------------------------------------

def upload_to_github(file, filename):
    try:
        file_content = file.read()
        encoded_content = base64.b64encode(file_content).decode('utf-8')

        upload_url = GITHUB_API_URL + filename

        response = requests.put(
            upload_url,
            headers={
                "Authorization": f"token {GITHUB_TOKEN}",
                "Accept": "application/vnd.github.v3+json",
            },
            json={
                "message": f"Upload {filename}",
                "content": encoded_content,
            },
        )

        if response.status_code in [200, 201]:
            return response.json()["content"]["download_url"]
        else:
            return None
    except Exception as e:
        return None


@app.route('/api/upload-doc', methods=['POST'])
def upload_doc():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        filename = file.filename
        category = request.form.get('category', 'General')

        if not filename.endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400

        file_url = upload_to_github(file, filename)
        if not file_url:
            return jsonify({'error': 'Failed to upload file to GitHub'}), 500

        result = supabase.table("docs").insert({
            "name": filename,
            "category": category,
            "url": file_url,
            "uploaded_at": datetime.utcnow().isoformat()
        }).execute()

        return jsonify({'message': 'File uploaded successfully', 'file_url': file_url}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/get-docs', methods=['GET'])
def get_docs():
    try:
        response = supabase.table("docs").select("*").execute()
        docs = response.data if response.data else []
        return jsonify({'docs': docs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/get-docs/<category>', methods=['GET'])
def get_docs_by_category(category):
    try:
        response = supabase.table("docs").select("*").eq("category", category).execute()
        docs = response.data if response.data else []
        return jsonify({'docs': docs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#------------------------------------- AI CHATBOT ------------------------------------------

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'Anonymous')
        query = data.get('query')

        if not query:
            return jsonify({'error': 'Query is required'}), 400

        # Check if the user_id is "Anonymous" and handle accordingly
        if user_id == 'Anonymous':
            user_id = None  # or some default UUID if needed, or leave it as None

        # Modify the input to give a legal advisory context
        prompt = (
            "You are a legal advisor. Provide a concise and well-formatted response to the following query:\n\n"
            f'"{query}"'
        )

        # Get AI response from Gemini using the latest model
        model = genai.GenerativeModel("gemini-1.5-pro-latest")
        response = model.generate_content(prompt)
        ai_response = response.text.strip() if response else "I'm sorry, I couldn't process your request."

        # Store chat log in Supabase only if the user_id is not None
        if user_id:
            supabase.table("chatbot_logs").insert({
                "user_id": user_id,
                "query": query,
                "response": ai_response,
                "timestamp": datetime.utcnow().isoformat()
            }).execute()

        return jsonify({'response': ai_response}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


    

#------------------------------------ PROFILE --------------------------------------------------

@app.route('/api/get-user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        user = response.data[0] if response.data else None
        
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update user information
@app.route('/api/update-user', methods=['PUT'])
def update_user():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        name = data.get('name')
        phone = data.get('phone')
        address = data.get('address')
        location = data.get('location', None)

        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        update_data = {"name": name, "phone": phone, "address": address}

        if location:
            update_data["location_lat"] = location.get('lat')
            update_data["location_long"] = location.get('long')

        supabase.table("users").update(update_data).eq("id", user_id).execute()

        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/get-chat-logs/<user_id>', methods=['GET'])
def get_chat_logs(user_id):
    try:
        response = supabase.table("chatbot_logs").select("*").eq("user_id", user_id).order("timestamp", desc=True).execute()
        chat_logs = response.data if response.data else []

        return jsonify({'chat_logs': chat_logs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify, render_template
import psycopg2
from psycopg2.extras import Json
import config  # Import the config module
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database connection parameters
def get_db_connection():
    conn = psycopg2.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        dbname=config.DB_NAME,
        user=config.DB_USER,
        password=config.DB_PASSWORD
    )
    return conn

# API route to handle profile creation
@app.route('/api/profile', methods=['POST'])
def create_profile():
    data = request.get_json()  # Get JSON data from request
    if not data:
        return jsonify({"error": "Invalid input"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO profile (data) VALUES (%s) RETURNING profile_id;",
            (Json(data),)
        )
        profile_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"profile_id": profile_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve HTML template
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=3001)

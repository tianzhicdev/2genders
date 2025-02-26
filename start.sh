# 2genders/start.sh
#!/bin/bash

set -e

# Variables
VENV_DIR="venv"
REQUIREMENTS_FILE="requirements.txt"
CONFIG_FILE="config.py"
TABLES_FILE="tables.sql"
SERVICE_FILE="svc.py"
LOG_FILE="flask.log"
FLASK_PORT=3001

# Function to display messages
echo_info() {
    echo -e "\033[32m[INFO]\033[0m $1"
}

echo_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

# 1. Set Up Python Virtual Environment and Install Dependencies
if [ ! -d "$VENV_DIR" ]; then
    echo_info "Creating Python virtual environment..."
    python3 -m venv "$VENV_DIR"
else
    echo_info "Python virtual environment already exists."
fi

echo_info "Activating virtual environment..."
source "$VENV_DIR/bin/activate"

echo_info "Installing Python dependencies..."
pip install --upgrade pip
pip install -r "$REQUIREMENTS_FILE"

# 2. Ensure PostgreSQL is Installed
if ! command -v psql &> /dev/null; then
    echo_info "PostgreSQL not found. Please install PostgreSQL manually."
    exit 1
else
    echo_info "PostgreSQL is already installed."
fi

# 3. Start PostgreSQL Service
echo_info "Starting PostgreSQL service..."
brew services start postgresql

# 4. Create Database and User from config.py
echo_info "Configuring PostgreSQL database and user..."

# Extract database credentials from config.py
DB_NAME=$(grep "DB_NAME" "$CONFIG_FILE" | cut -d '"' -f2)
DB_USER=$(grep "DB_USER" "$CONFIG_FILE" | cut -d '"' -f2)
DB_PASSWORD=$(grep "DB_PASSWORD" "$CONFIG_FILE" | cut -d '"' -f2)

# Create user if it doesn't exist
psql postgres -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || \
psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Create database if it doesn't exist
psql postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# 5. Run tables.sql to Create Necessary Tables
echo_info "Applying database schema..."
psql -U "$DB_USER" -d "$DB_NAME" -f "$TABLES_FILE"

# 6. Start Flask Service
echo_info "Starting Flask service on port $FLASK_PORT..."
# Check if Flask is already running on the specified port
if lsof -i:$FLASK_PORT | grep LISTEN &> /dev/null; then
    echo_info "Flask service is already running on port $FLASK_PORT."
else
    nohup python "$SERVICE_FILE" > "$LOG_FILE" 2>&1 &
    echo_info "Flask service started and running in the background on port $FLASK_PORT."
fi

echo_info "Setup complete! Access the web app at http://localhost:$FLASK_PORT/"
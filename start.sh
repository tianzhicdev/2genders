# 2genders/start.sh
#!/bin/bash

set -e

# Check for environment argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 dev|prod"
    exit 1
fi

ENVIRONMENT=$1
echo "Environment: $ENVIRONMENT"

# Variables
VENV_DIR="venv"
REQUIREMENTS_FILE="requirements.txt"
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

# 2. Start Flask Service
echo_info "Starting Flask service on port $FLASK_PORT..."
# Check if Flask is already running on the specified port
if lsof -i:$FLASK_PORT | grep LISTEN &> /dev/null; then
    echo_info "Flask service is already running on port $FLASK_PORT."
else
    nohup python "$SERVICE_FILE" > "$LOG_FILE" 2>&1 &
    echo_info "Flask service started and running in the background on port $FLASK_PORT."
fi

echo_info "Setup complete! Access the web app at http://localhost:$FLASK_PORT/"
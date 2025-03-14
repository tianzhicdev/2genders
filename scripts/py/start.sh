#!/bin/bash

# Set the directory to the script's location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "Creating requirements.txt file..."
    cat > requirements.txt << EOF
openai>=1.0.0
requests>=2.25.0
typing>=3.7.4
EOF
    echo "requirements.txt created."
fi

# Create and activate virtual environment
echo "Setting up virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

# Check for OpenAI API key
if [ -z "$OPENAI_TOKEN" ]; then
    echo "Warning: OPENAI_TOKEN environment variable is not set."
    echo "Please set your OpenAI API key with: export OPENAI_TOKEN=your_api_key"
    exit 1
fi

# Run the script
echo "Running main.py..."
python main.py

# Deactivate virtual environment
deactivate

echo "Script execution completed."

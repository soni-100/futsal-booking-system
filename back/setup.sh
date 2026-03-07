#!/bin/bash

# Futsal Booking Backend Setup Script

echo "Setting up Futsal Booking Backend..."

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo "Creating superuser..."
echo "Please enter admin credentials:"
python manage.py createsuperuser

echo "Setup complete!"
echo "Run 'python manage.py runserver' to start the development server"

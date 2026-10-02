import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set port for HF Spaces
os.environ['PORT'] = '7860'

# Import and run Flask app
from app import app

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=7860)

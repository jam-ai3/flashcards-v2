from flask import Flask
from flask_cors import CORS
import os
import sys

# Get the directory containing app.py
current_dir = os.path.dirname(os.path.abspath(__file__))

# Add parent directory to path (for access to all project modules)
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

# Add specific directories to path
sys.path.append(os.path.join(parent_dir, 'api'))
sys.path.append(os.path.join(parent_dir, 'utils'))  # Add utils explicitly

from api.endpoints import *

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/")
def hello_world():
    return "hello world!"

PdfConversionEndpoint(app)
PptxConversionEndpoint(app)
GenerateFlashcardsEndpoint(app)

# app = app.wsgi_app
# wsgi_app = app
if __name__ == "__main__":
    app.run(host = '0.0.0.0', debug=True, port=80)

from flask import Flask
from flask_cors import CORS
import os
import sys

# Add parent directory to path (for util)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Add api directory to path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'api'))

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

from flask import Flask
from flask_cors import CORS
import os
import sys
from api.endpoints import *

# I DON"T KNOW HOW THIS LINE BEHAVES ON VERCEL
# It includes the util in the path so we can use it
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

PdfConversionEndpoint(app)
PptxConversionEndpoint(app)
GenerateFlashcardsEndpoint(app)

# app = app.wsgi_app
wsgi_app = app
# if __name__ == "__main__":
#     app.run(debug=True, port=5000)

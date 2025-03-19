from util.pptx_extractor import get_text_from_pptx
from util.pdf_extractor import PdfParser
from flask import Flask, jsonify
from flask import request
from flask_cors import CORS, cross_origin
import os
import sys

# I DON"T KNOW HOW THIS LINE BEHAVES ON VERCEL
# It includes the util in the path so we can use it
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/pptx', methods=['POST'])
@cross_origin(origins="*")
def pptx_conversion():
    pptx_file = request.files['pptx']
    # CAN CAUSE MEMORY ISSUES
    pptx_binary_data = pptx_file.stream.read()
    extracted_text = ""
    try:
        extracted_text = get_text_from_pptx(pptx_binary_data)
        return jsonify(extracted_text)
    except:
        print("Error processing PPTX file")
        return jsonify({"error": "Failed to process PPTX file"}), 500


@app.route('/pdf', methods=['POST'])
@cross_origin(origins="*")
def pdf_conversion():
    print("Received request to convert PDF")
    pdf_file = request.files["pdf"]
    # CAN CAUSE MEMORY ISSUES
    pdf_binary_data = pdf_file.stream.read()
    extracted_text = ""
    try:
        parser = PdfParser(pdf_binary_data)
        extracted_text = parser.get_all_text_without_chapters()
        return jsonify(extracted_text)
    except:
        print("Error processing PDF file")
        return jsonify({"error": "Failed to process PDF file"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)

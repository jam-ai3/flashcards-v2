# pdf conversion endpoint
from flask import jsonify, request
from flask_cors import cross_origin
from utils.pdf_extractor import PdfParser
from utils.pptx_extractor import get_text_from_pptx
from utils.gemini import generate


class PdfConversionEndpoint:
    def __init__(self, app):
        self.app = app

        @app.route('/pdf', methods=['POST'])
        @cross_origin(origins="*")
        def pdf_conversion():
            pdf_file = request.files["pdf"]
            pdf_binary_data = pdf_file.stream.read()
            extracted_text = ""
            try:
                parser = PdfParser(pdf_binary_data)
                extracted_text = parser.get_all_text_without_chapters()
                return jsonify(extracted_text)
            except Exception as e:
                return jsonify({"error": "Failed to process PDF file", "devError": str(e)}), 500


class PptxConversionEndpoint:
    def __init__(self, app):
        self.app = app

        @app.route('/pptx', methods=['POST'])
        @cross_origin(origins="*")
        def pptx_conversion():
            pptx_file = request.files['pptx']
            pptx_binary_data = pptx_file.stream.read()
            extracted_text = ""
            try:
                extracted_text = get_text_from_pptx(pptx_binary_data)
                return jsonify(extracted_text)
            except Exception as e:
                return jsonify({"error": "Failed to process PPTX file", "devError": str(e)}), 500


class GenerateFlashcardsEndpoint:
    def __init__(self, app):
        self.app = app

        @app.route('/generate', methods=['POST'])
        @cross_origin(origins="*")
        def generate_flashcards():
            data = request.json
            input_type = data['inputType']
            text = data['text']
            is_free = data['isFree']

            if input_type == None or text == None or is_free == None:
                return jsonify({"error": "Missing required fields"}), 400

            flashcards = generate(input_type, text, is_free)
            return jsonify(flashcards)

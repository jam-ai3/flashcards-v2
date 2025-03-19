from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route('/python-api/flashcard_maker', methods = ['POST'])
def process_pdf():

    file = request.files['file']


    try:

        response = {
            'message': "PDF processed successfully",
        }



        return jsonify(response), 200
    
    except Exception as e:

        return jsonify({'error': str(e)}), 500
    

app = app.wsgi_app
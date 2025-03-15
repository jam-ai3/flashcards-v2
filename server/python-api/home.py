from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/python-api/home':
            # Send response status code
            self.send_response(200)
            
            # Send headers
            self.send_header('Content-type', 'text/html')
            self.end_headers()

            # Send the HTML content
            html_content = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Welcome to Flashcards</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        text-align: center;
                    }
                    h1 {
                        color: #333;
                    }
                    .welcome-text {
                        color: #666;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <h1>Welcome to Flashcards</h1>
                <p class="welcome-text">Your personal learning companion</p>
            </body>
            </html>
            """
            self.wfile.write(html_content.encode('utf-8'))
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode('utf-8'))


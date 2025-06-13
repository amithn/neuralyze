from flask import Flask, render_template, request, jsonify
from livereload import Server

app = Flask(__name__, template_folder='templates', static_folder='static')

# Route to serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/classification')
def about():
    return render_template('classification.html')

@app.route('/dashboard')
def contact():
    return render_template('dashboard.html')

# POST endpoint to classify uploaded data
@app.route('/classify', methods=['POST'])
def classify():
    file = request.files.get('file')
    filename = request.form.get('filename')

    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    # For demonstration, just return the file name and size
    return jsonify({
        'filename': filename or file.filename,
        'size': len(file.read()),
        'classification': 'example-label'
    })

if __name__ == '__main__':
    server = Server(app.wsgi_app)
    server.watch('templates/')
    server.watch('static/')
    server.serve(port=3000, debug=True)
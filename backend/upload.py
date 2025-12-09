from flask import request, jsonify
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import zipfile
from config import Config

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def handle_template_upload():
    """Handle ZIP file upload for templates"""
    if 'file' not in request.files:
        return {'error': 'No file provided'}, 400
    
    file = request.files['file']
    
    if file.filename == '':
        return {'error': 'No file selected'}, 400
    
    if not allowed_file(file.filename):
        return {'error': 'Invalid file type. Only ZIP files allowed'}, 400
    
    # Generate unique filename
    filename = secure_filename(file.filename)
    timestamp = int(datetime.utcnow().timestamp())
    unique_filename = f"{timestamp}_{filename}"
    
    file_path = os.path.join(Config.TEMPLATE_FOLDER, unique_filename)
    file.save(file_path)
    
    # Extract ZIP contents
    extract_path = os.path.join(Config.TEMPLATE_FOLDER, f"{timestamp}_{filename.rsplit('.', 1)[0]}")
    os.makedirs(extract_path, exist_ok=True)
    
    try:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
    except Exception as e:
        return {'error': f'Failed to extract ZIP: {str(e)}'}, 400
    
    return {
        'file_path': extract_path,
        'original_filename': filename
    }, 200


def handle_image_upload():
    """Handle preview image uploads"""
    if 'images' not in request.files:
        return {'error': 'No images provided'}, 400
    
    files = request.files.getlist('images')
    uploaded_images = []
    
    for file in files:
        if file and file.filename:
            filename = secure_filename(file.filename)
            timestamp = int(datetime.utcnow().timestamp())
            unique_filename = f"{timestamp}_{filename}"
            
            file_path = os.path.join(Config.UPLOAD_FOLDER, 'images', unique_filename)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            file.save(file_path)
            uploaded_images.append(f"/uploads/images/{unique_filename}")
    
    return {'images': uploaded_images}, 200
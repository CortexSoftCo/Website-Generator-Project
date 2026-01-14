import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # OpenAI - CRITICAL: Keep this secret!
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    
    # Google Gemini API Key
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    
    # Admin Configuration
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@marketplace.com')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'SecureAdmin@2024')

    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///marketplace.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # File Upload
    UPLOAD_FOLDER = 'backend/uploads'
    TEMPLATE_FOLDER = 'backend/uploads/templates'
    AI_FOLDER = 'backend/uploads/ai_generated'
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB max file size
    ALLOWED_EXTENSIONS = {'zip', 'rar', '7z'}
    
    # JazzCash Payment Gateway
    JAZZCASH_MERCHANT_ID = os.environ.get('JAZZCASH_MERCHANT_ID', 'MC12345')
    JAZZCASH_PASSWORD = os.environ.get('JAZZCASH_PASSWORD', 'password123')
    JAZZCASH_INTEGRITY_SALT = os.environ.get('JAZZCASH_INTEGRITY_SALT', 'salt123')
    JAZZCASH_RETURN_URL = os.environ.get('JAZZCASH_RETURN_URL', 'http://localhost:5000/api/payment/jazzcash/callback')
    JAZZCASH_ENVIRONMENT = os.environ.get('JAZZCASH_ENVIRONMENT', 'sandbox')  # or 'production'
    
    # Stripe (alternative payment option)
    STRIPE_PUBLIC_KEY = os.environ.get('STRIPE_PUBLIC_KEY', 'pk_test_mock')
    STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_mock')
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
    
    # Server
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    PORT = int(os.environ.get('PORT', 5000))
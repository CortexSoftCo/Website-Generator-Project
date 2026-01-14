from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from config import Config
from models import db, User, Seller, Category, Template, Purchase, Review, AIWebsite, Payment, TemplateCustomization
from auth import create_token, token_required, role_required
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import zipfile
import shutil
import jwt
from ai_generator import generate_website, regenerate_website, get_website_suggestions
from jazzcash_payment import JazzCashPayment
import google.generativeai as genai

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS properly
CORS(app, 
     resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Configure Gemini for prompt improvement
try:
    genai.configure(api_key=Config.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-pro')
except Exception as e:
    print(f"⚠️ Gemini configuration failed: {e}")
    model = None

db.init_app(app)

# Create upload directories
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
os.makedirs(Config.TEMPLATE_FOLDER, exist_ok=True)
os.makedirs(Config.AI_FOLDER, exist_ok=True)
os.makedirs(os.path.join(Config.UPLOAD_FOLDER, 'images'), exist_ok=True)

# Initialize database (with error handling for deployment)
def init_database():
    """Initialize database tables and default data"""
    try:
        with app.app_context():
            db.create_all()
            # Create default categories if not exist
            if Category.query.count() == 0:
                categories = [
                    Category(name='Business', slug='business', icon='briefcase'),
                    Category(name='Portfolio', slug='portfolio', icon='user'),
                    Category(name='E-commerce', slug='ecommerce', icon='shopping-cart'),
                    Category(name='Blog', slug='blog', icon='book'),
                    Category(name='Education', slug='education', icon='graduation-cap'),
                ]
                db.session.bulk_save_objects(categories)
                db.session.commit()
                print("✅ Categories created")
            
            # Create admin user if not exist
            admin_user = User.query.filter_by(email=Config.ADMIN_EMAIL).first()
            if not admin_user:
                admin_user = User(email=Config.ADMIN_EMAIL, role='admin', is_verified=True)
                admin_user.set_password(Config.ADMIN_PASSWORD)
                db.session.add(admin_user)
                db.session.commit()
                print(f"✅ Admin user created: {Config.ADMIN_EMAIL}")
            
            # Ensure we have admin_user for system seller
            if not admin_user:
                admin_user = User.query.filter_by(email=Config.ADMIN_EMAIL).first()
            
            # Create system seller for demo templates
            system_seller = Seller.query.filter_by(user_id=admin_user.id).first()
            if not system_seller:
                system_seller = Seller(
                    user_id=admin_user.id,
                    business_name='CreatorBox Official',
                    description='Official system templates curated by CreatorBox',
                    revenue=0.0
                )
                db.session.add(system_seller)
                db.session.commit()
                print(f"✅ System seller created: {system_seller.business_name}")
            
            # Create demo templates if none exist
            if Template.query.count() == 0:
                categories_dict = {cat.slug: cat.id for cat in Category.query.all()}
                
                demo_templates = [
                    {
                        'title': 'Modern Business Template',
                        'description': 'Professional business website with clean design',
                        'price': 29.99,
                        'category_id': categories_dict.get('business', 1),
                        'seller_id': system_seller.id,
                        'status': 'approved',
                        'file_path': 'backend/uploads/templates/ProMan',
                        'preview_images': ['/uploads/templates/ProMan/img/project-1.jpg', '/uploads/templates/ProMan/img/project-2.jpg', '/uploads/templates/ProMan/img/project-3.jpg'],
                        'demo_url': 'https://htmlcodex.com/business-website-template',
                        'rating': 4.5,
                        'downloads': 45,
                        'views': 230
                    },
                    {
                        'title': 'Portfolio Showcase',
                        'description': 'Elegant portfolio template for creatives',
                        'price': 24.99,
                        'category_id': categories_dict.get('portfolio', 2),
                        'seller_id': system_seller.id,
                        'status': 'approved',
                        'file_path': 'backend/uploads/templates/kaira-1.0.0',
                        'preview_images': ['/uploads/templates/kaira-1.0.0/images/banner-image-1.jpg', '/uploads/templates/kaira-1.0.0/images/banner-image-2.jpg', '/uploads/templates/kaira-1.0.0/images/banner-image-3.jpg'],
                        'demo_url': 'https://themewagon.com/themes/free-bootstrap-4-html5-portfolio-website-template-kaira/',
                        'rating': 4.7,
                        'downloads': 67,
                        'views': 312
                    },
                    {
                        'title': 'E-commerce Shop',
                        'description': 'Complete online store template',
                        'price': 39.99,
                        'category_id': categories_dict.get('ecommerce', 3),
                        'seller_id': system_seller.id,
                        'status': 'approved',
                        'file_path': 'backend/uploads/templates/Weldork',
                        'preview_images': ['/uploads/templates/Weldork/img/carousel-1.jpg', '/uploads/templates/Weldork/img/service-1.jpg', '/uploads/templates/Weldork/img/service-2.jpg'],
                        'demo_url': 'https://htmlcodex.com/ecommerce-website-template',
                        'rating': 4.6,
                        'downloads': 89,
                        'views': 445
                    },
                    {
                        'title': 'SaaS Website',
                        'description': 'Modern SaaS landing page template',
                        'price': 34.99,
                        'category_id': categories_dict.get('business', 1),
                        'seller_id': system_seller.id,
                        'status': 'approved',
                        'file_path': 'backend/uploads/templates/saas-website-template',
                        'preview_images': ['/uploads/templates/saas-website-template/img/hero-img-1.png', '/uploads/templates/saas-website-template/img/features-1.png', '/uploads/templates/saas-website-template/img/about-1.png'],
                        'demo_url': 'https://htmlcodex.com/saas-website-template',
                        'rating': 4.8,
                        'downloads': 123,
                        'views': 567
                    },
                    {
                        'title': 'Restaurant & Cafe',
                        'description': 'Delicious restaurant website template',
                        'price': 27.99,
                        'category_id': categories_dict.get('business', 1),
                        'seller_id': system_seller.id,
                        'status': 'approved',
                        'file_path': 'backend/uploads/templates/Italian-Cuisine',
                        'preview_images': ['/uploads/templates/Italian-Cuisine/img/img-1.jpg', '/uploads/templates/Italian-Cuisine/img/img-2.jpg', '/uploads/templates/Italian-Cuisine/img/img-3.jpg'],
                        'demo_url': 'https://htmlcodex.com/restaurant-website-template',
                        'rating': 4.4,
                        'downloads': 78,
                        'views': 289
                    },
                    {
                        'title': 'Real Estate',
                        'description': 'Property listing and real estate template',
                        'price': 32.99,
                        'category_id': categories_dict.get('business', 1),
                        'seller_id': system_seller.id,
                        'status': 'approved',
                        'file_path': 'backend/uploads/templates/Makaan',
                        'preview_images': ['/uploads/templates/Makaan/img/property-1.jpg', '/uploads/templates/Makaan/img/property-2.jpg', '/uploads/templates/Makaan/img/property-3.jpg'],
                        'demo_url': 'https://htmlcodex.com/real-estate-website-template',
                        'rating': 4.5,
                        'downloads': 56,
                        'views': 234
                    },
                    {
                        'title': 'Education & Courses',
                        'description': 'Online learning platform template',
                        'price': 29.99,
                        'category_id': categories_dict.get('education', 5),
                        'seller_id': system_seller.id,
                        'status': 'approved',
                        'file_path': 'backend/uploads/templates/Kider',
                        'preview_images': ['/uploads/templates/Kider/img/carousel-1.jpg', '/uploads/templates/Kider/img/carousel-2.jpg', '/uploads/templates/Kider/img/classes-1.jpg'],
                        'demo_url': 'https://htmlcodex.com/education-website-template',
                        'rating': 4.6,
                        'downloads': 92,
                        'views': 401
                    }
                ]
                
                for template_data in demo_templates:
                    template = Template(**template_data)
                    db.session.add(template)
                
                db.session.commit()
                print(f"✅ Created {len(demo_templates)} demo templates")
    except Exception as e:
        print(f"⚠️ Database initialization skipped: {str(e)}")
        print("Database will be initialized on first request")

# Don't initialize database at startup - use endpoint instead
# init_database()  # Commented out to prevent startup crashes


# ==================== HEALTH CHECK ====================

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'Website Generator API',
        'status': 'running',
        'version': '1.0.0'
    }), 200

@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    db_status = 'unknown'
    try:
        # Check database connection
        with app.app_context():
            db.session.execute(db.text('SELECT 1'))
            db_status = 'connected'
    except Exception as e:
        db_status = f'disconnected: {str(e)[:100]}'
    
    return jsonify({
        'status': 'healthy',
        'database': db_status,
        'message': 'API is running. Use /api/init-database to initialize database.'
    }), 200


# ==================== INIT ROUTE (Call once after deployment) ====================

@app.route('/api/init-database', methods=['POST'])
def init_database_endpoint():
    """
    Initialize database tables and default data.
    Call this endpoint once after deployment to set up the database.
    Requires admin password for security.
    """
    data = request.json or {}
    password = data.get('password', '')
    
    # Simple password protection
    if password != Config.ADMIN_PASSWORD:
        return jsonify({'error': 'Unauthorized. Provide correct admin password'}), 401
    
    try:
        with app.app_context():
            # Create all tables
            db.create_all()
            
            # Create default categories if not exist
            if Category.query.count() == 0:
                categories = [
                    Category(name='Business', slug='business', icon='briefcase'),
                    Category(name='Portfolio', slug='portfolio', icon='user'),
                    Category(name='E-commerce', slug='ecommerce', icon='shopping-cart'),
                    Category(name='Blog', slug='blog', icon='book'),
                    Category(name='Education', slug='education', icon='graduation-cap'),
                ]
                db.session.bulk_save_objects(categories)
                db.session.commit()
            
            # Create admin user if not exist
            if not User.query.filter_by(email=Config.ADMIN_EMAIL).first():
                admin = User(email=Config.ADMIN_EMAIL, role='admin', is_verified=True)
                admin.set_password(Config.ADMIN_PASSWORD)
                db.session.add(admin)
                db.session.commit()
            
            return jsonify({
                'message': 'Database initialized successfully',
                'details': {
                    'tables_created': True,
                    'categories_created': Category.query.count(),
                    'admin_user': Config.ADMIN_EMAIL
                }
            }), 200
            
    except Exception as e:
        return jsonify({
            'error': 'Database initialization failed',
            'details': str(e)
        }), 500


# ==================== AUTH ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        email=data['email'],
        role=data.get('role', 'buyer')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # If seller, create seller profile
    if user.role == 'seller':
        seller = Seller(
            user_id=user.id,
            business_name=data.get('business_name', ''),
            description=data.get('description', '')
        )
        db.session.add(seller)
        db.session.commit()
    
    token = create_token(user.id, user.role)
    
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': user.to_dict()
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = create_token(user.id, user.role)
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 200


@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    user = User.query.get(request.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200


# ==================== UPLOAD ROUTES ====================

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@app.route('/api/upload/template', methods=['POST'])
@token_required
@role_required(['seller', 'admin'])
def upload_template_file():
    """Upload and extract template ZIP file"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only ZIP files allowed'}), 400
    
    filename = secure_filename(file.filename)
    timestamp = int(datetime.utcnow().timestamp())
    unique_filename = f"{timestamp}_{filename}"
    
    file_path = os.path.join(Config.TEMPLATE_FOLDER, unique_filename)
    file.save(file_path)
    
    extract_path = os.path.join(Config.TEMPLATE_FOLDER, f"{timestamp}_{filename.rsplit('.', 1)[0]}")
    os.makedirs(extract_path, exist_ok=True)
    
    try:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
    except Exception as e:
        return jsonify({'error': f'Failed to extract ZIP: {str(e)}'}), 400
    
    return jsonify({
        'file_path': extract_path,
        'original_filename': filename
    }), 200


@app.route('/api/upload/images', methods=['POST'])
@token_required
def upload_images():
    """Upload preview images"""
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
    
    files = request.files.getlist('images')
    uploaded_images = []
    
    for file in files:
        if file and file.filename:
            filename = secure_filename(file.filename)
            timestamp = int(datetime.utcnow().timestamp())
            unique_filename = f"{timestamp}_{filename}"
            
            file_path = os.path.join(Config.UPLOAD_FOLDER, 'images', unique_filename)
            file.save(file_path)
            uploaded_images.append(f"/uploads/images/{unique_filename}")
    
    return jsonify({'images': uploaded_images}), 200


@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    """Serve uploaded files"""
    return send_from_directory(Config.UPLOAD_FOLDER, filename)

@app.route('/api/templates/<int:template_id>/preview-image/<path:imagepath>')
def serve_template_preview_image(template_id, imagepath):
    """Serve preview images from template folder"""
    template = Template.query.get_or_404(template_id)
    
    template_path = template.file_path
    if not os.path.isabs(template_path):
        template_path = os.path.join(os.getcwd(), template_path)
    
    template_path = os.path.abspath(template_path)
    
    # Search for the image in the entire template directory tree
    for root, dirs, files in os.walk(template_path):
        if os.path.basename(imagepath) in files:
            image_path = os.path.join(root, os.path.basename(imagepath))
            if os.path.exists(image_path):
                return send_file(image_path)
    
    return jsonify({'error': 'Image not found'}), 404

# ==================== CATEGORY ROUTES ====================

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify({'categories': [c.to_dict() for c in categories]}), 200


# ==================== TEMPLATE ROUTES ====================

@app.route('/api/templates', methods=['GET'])
def get_templates():
    status = request.args.get('status', 'approved')
    category_id = request.args.get('category_id')
    search = request.args.get('search', '')
    
    query = Template.query.filter_by(status=status)
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    if search:
        query = query.filter(Template.title.contains(search) | Template.description.contains(search))
    
    templates = query.all()
    return jsonify({'templates': [t.to_dict() for t in templates]}), 200


@app.route('/api/templates/<int:template_id>', methods=['GET'])
def get_template(template_id):
    template = Template.query.get_or_404(template_id)
    
    # Increment views
    template.views += 1
    db.session.commit()
    
    return jsonify({'template': template.to_dict()}), 200


@app.route('/api/templates', methods=['POST'])
@token_required
@role_required(['seller', 'admin'])
def create_template():
    data = request.json
    
    # Get seller_id
    seller_id = None
    if request.user_role == 'seller':
        seller = Seller.query.filter_by(user_id=request.user_id).first()
        if not seller:
            return jsonify({'error': 'Seller profile not found'}), 404
        seller_id = seller.id
    elif request.user_role == 'admin':
        # Admin can upload without seller profile
        seller_id = 0  # Special case for admin
    
    template = Template(
        seller_id=seller_id,
        category_id=data['category_id'],
        title=data['title'],
        description=data['description'],
        price=data['price'],
        preview_images=data.get('preview_images', []),
        demo_url=data.get('demo_url'),
        file_path=data['file_path'],
        status='approved' if request.user_role == 'admin' else 'pending',
        is_editable=data.get('is_editable', False)
    )
    
    db.session.add(template)
    db.session.commit()
    
    return jsonify({
        'message': 'Template created successfully',
        'template': template.to_dict()
    }), 201


@app.route('/api/templates/<int:template_id>', methods=['PUT'])
@token_required
@role_required(['seller', 'admin'])
def update_template(template_id):
    template = Template.query.get_or_404(template_id)
    
    # Check ownership
    if request.user_role == 'seller':
        seller = Seller.query.filter_by(user_id=request.user_id).first()
        if template.seller_id != seller.id:
            return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    
    template.title = data.get('title', template.title)
    template.description = data.get('description', template.description)
    template.price = data.get('price', template.price)
    template.category_id = data.get('category_id', template.category_id)
    template.preview_images = data.get('preview_images', template.preview_images)
    template.demo_url = data.get('demo_url', template.demo_url)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Template updated successfully',
        'template': template.to_dict()
    }), 200


@app.route('/api/templates/<int:template_id>', methods=['DELETE'])
@token_required
@role_required(['seller', 'admin'])
def delete_template(template_id):
    template = Template.query.get_or_404(template_id)
    
    # Check ownership
    if request.user_role == 'seller':
        seller = Seller.query.filter_by(user_id=request.user_id).first()
        if template.seller_id != seller.id:
            return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(template)
    db.session.commit()
    
    return jsonify({'message': 'Template deleted successfully'}), 200


# ==================== SELLER ROUTES ====================

@app.route('/api/seller/profile', methods=['GET'])
@token_required
@role_required(['seller'])
def get_seller_profile():
    seller = Seller.query.filter_by(user_id=request.user_id).first()
    if not seller:
        return jsonify({'error': 'Seller profile not found'}), 404
    
    return jsonify({'seller': seller.to_dict()}), 200


@app.route('/api/seller/profile', methods=['PUT'])
@token_required
@role_required(['seller'])
def update_seller_profile():
    seller = Seller.query.filter_by(user_id=request.user_id).first()
    if not seller:
        return jsonify({'error': 'Seller profile not found'}), 404
    
    data = request.json
    
    seller.business_name = data.get('business_name', seller.business_name)
    seller.description = data.get('description', seller.description)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'seller': seller.to_dict()
    }), 200


@app.route('/api/seller/templates', methods=['GET'])
@token_required
@role_required(['seller'])
def get_seller_templates():
    seller = Seller.query.filter_by(user_id=request.user_id).first()
    if not seller:
        return jsonify({'error': 'Seller profile not found'}), 404
    
    templates = Template.query.filter_by(seller_id=seller.id).all()
    return jsonify({'templates': [t.to_dict() for t in templates]}), 200


@app.route('/api/seller/stats', methods=['GET'])
@token_required
@role_required(['seller'])
def get_seller_stats():
    seller = Seller.query.filter_by(user_id=request.user_id).first()
    if not seller:
        return jsonify({'error': 'Seller profile not found'}), 404
    
    templates = Template.query.filter_by(seller_id=seller.id).all()
    
    total_templates = len(templates)
    total_downloads = sum(t.downloads for t in templates)
    total_views = sum(t.views for t in templates)
    
    return jsonify({
        'stats': {
            'revenue': seller.revenue,
            'total_templates': total_templates,
            'total_downloads': total_downloads,
            'total_views': total_views,
            'rating': seller.rating
        }
    }), 200


# ==================== PURCHASE ROUTES ====================

@app.route('/api/purchases', methods=['POST'])
@token_required
def create_purchase():
    data = request.json
    template_id = data['template_id']
    
    template = Template.query.get_or_404(template_id)
    
    # Check if already purchased
    existing = Purchase.query.filter_by(
        buyer_id=request.user_id,
        template_id=template_id
    ).first()
    
    if existing:
        return jsonify({'error': 'Template already purchased'}), 400
    
    # Mock payment processing
    transaction_id = f"TXN_{request.user_id}_{template_id}_{int(datetime.utcnow().timestamp())}"
    
    purchase = Purchase(
        buyer_id=request.user_id,
        template_id=template_id,
        price=template.price,
        transaction_id=transaction_id
    )
    
    # Update stats
    template.downloads += 1
    
    # Update seller revenue
    if template.seller_id > 0:
        seller = Seller.query.get(template.seller_id)
        if seller:
            seller.revenue += template.price
    
    db.session.add(purchase)
    db.session.commit()
    
    return jsonify({
        'message': 'Purchase successful',
        'purchase': purchase.to_dict()
    }), 201


@app.route('/api/purchases', methods=['GET'])
@token_required
def get_user_purchases():
    purchases = Purchase.query.filter_by(buyer_id=request.user_id).all()
    
    result = []
    for p in purchases:
        purchase_data = p.to_dict()
        purchase_data['template'] = Template.query.get(p.template_id).to_dict()
        result.append(purchase_data)
    
    return jsonify({'purchases': result}), 200


@app.route('/api/purchases/check/<int:template_id>', methods=['GET'])
@token_required
def check_purchase(template_id):
    purchase = Purchase.query.filter_by(
        buyer_id=request.user_id,
        template_id=template_id
    ).first()
    
    return jsonify({'purchased': purchase is not None}), 200


# ==================== REVIEW ROUTES ====================

@app.route('/api/reviews', methods=['POST'])
@token_required
def create_review():
    data = request.json
    template_id = data['template_id']
    
    # Check if user purchased the template
    purchase = Purchase.query.filter_by(
        buyer_id=request.user_id,
        template_id=template_id
    ).first()
    
    if not purchase:
        return jsonify({'error': 'You must purchase the template before reviewing'}), 403
    
    # Check if already reviewed
    existing = Review.query.filter_by(
        buyer_id=request.user_id,
        template_id=template_id
    ).first()
    
    if existing:
        return jsonify({'error': 'You have already reviewed this template'}), 400
    
    review = Review(
        buyer_id=request.user_id,
        template_id=template_id,
        rating=data['rating'],
        comment=data.get('comment', '')
    )
    
    db.session.add(review)
    
    # Update template rating
    template = Template.query.get(template_id)
    reviews = Review.query.filter_by(template_id=template_id).all()
    template.rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
    
    db.session.commit()
    
    return jsonify({
        'message': 'Review submitted successfully',
        'review': review.to_dict()
    }), 201


@app.route('/api/reviews/template/<int:template_id>', methods=['GET'])
def get_template_reviews(template_id):
    reviews = Review.query.filter_by(template_id=template_id).all()
    
    result = []
    for r in reviews:
        review_data = r.to_dict()
        buyer = User.query.get(r.buyer_id)
        review_data['buyer_email'] = buyer.email
        result.append(review_data)
    
    return jsonify({'reviews': result}), 200


# ==================== ADMIN ROUTES ====================

@app.route('/api/admin/templates/pending', methods=['GET'])
@token_required
@role_required(['admin'])
def get_pending_templates():
    templates = Template.query.filter_by(status='pending').all()
    return jsonify({'templates': [t.to_dict() for t in templates]}), 200


@app.route('/api/admin/templates/<int:template_id>/approve', methods=['POST'])
@token_required
@role_required(['admin'])
def approve_template(template_id):
    template = Template.query.get_or_404(template_id)
    template.status = 'approved'
    db.session.commit()
    
    return jsonify({'message': 'Template approved'}), 200


@app.route('/api/admin/templates/<int:template_id>/reject', methods=['POST'])
@token_required
@role_required(['admin'])
def reject_template(template_id):
    template = Template.query.get_or_404(template_id)
    template.status = 'rejected'
    db.session.commit()
    
    return jsonify({'message': 'Template rejected'}), 200


@app.route('/api/admin/templates/<int:template_id>/delete', methods=['DELETE'])
@token_required
@role_required(['admin'])
def admin_delete_template(template_id):
    """Delete a template completely from the system"""
    template = Template.query.get_or_404(template_id)
    
    # Delete template file if exists
    if template.file_path and os.path.exists(template.file_path):
        import shutil
        try:
            if os.path.isdir(template.file_path):
                shutil.rmtree(template.file_path)
            else:
                os.remove(template.file_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
    
    # Delete from database
    db.session.delete(template)
    db.session.commit()
    
    return jsonify({'message': 'Template deleted successfully'}), 200


@app.route('/api/admin/users', methods=['GET'])
@token_required
@role_required(['admin'])
def get_all_users():
    users = User.query.all()
    return jsonify({'users': [u.to_dict() for u in users]}), 200


@app.route('/api/admin/users/<int:user_id>/verify', methods=['POST'])
@token_required
@role_required(['admin'])
def verify_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_verified = True
    db.session.commit()
    
    return jsonify({'message': 'User verified'}), 200


@app.route('/api/admin/stats', methods=['GET'])
@token_required
@role_required(['admin'])
def get_admin_stats():
    total_users = User.query.count()
    total_sellers = Seller.query.count()
    total_templates = Template.query.count()
    total_purchases = Purchase.query.count()
    
    total_revenue = db.session.query(db.func.sum(Purchase.price)).scalar() or 0
    
    pending_templates = Template.query.filter_by(status='pending').count()
    
    return jsonify({
        'stats': {
            'total_users': total_users,
            'total_sellers': total_sellers,
            'total_templates': total_templates,
            'total_purchases': total_purchases,
            'total_revenue': total_revenue,
            'pending_templates': pending_templates
        }
    }), 200


# ==================== AI WEBSITE GENERATOR ====================
@app.route('/api/ai/generate', methods=['POST'])
@token_required
def ai_generate_website():
    """Generate multi-page website using AI with improved diversity and quality"""
    data = request.json
    description = data.get('description', '')
    user_preferences = data.get('preferences', {})
    
    if not description:
        return jsonify({'error': 'Description is required'}), 400
    
    try:
        import zipfile
        import io
        
        # Generate website using AI module (returns dict of files)
        generated_files = generate_website(description, user_preferences)
        
        # Log what was generated for debugging
        print(f"Generated {len(generated_files)} files: {list(generated_files.keys())}")
        for filename in generated_files.keys():
            content_length = len(generated_files[filename]) if isinstance(generated_files[filename], str) else 0
            print(f"  - {filename}: {content_length} characters")
        
        # Create directory for this website
        timestamp = int(datetime.utcnow().timestamp())
        website_folder = f"{Config.AI_FOLDER}/user_{request.user_id}_{timestamp}"
        os.makedirs(website_folder, exist_ok=True)
        
        # Save all generated files
        for filename, content in generated_files.items():
            file_path = os.path.join(website_folder, filename)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
        
        # Create ZIP file
        zip_path = f"{website_folder}.zip"
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for filename in generated_files.keys():
                file_path = os.path.join(website_folder, filename)
                zipf.write(file_path, filename)
        
        # Save AI website to database
        ai_website = AIWebsite(
            user_id=request.user_id,
            description=description,
            generated_files=generated_files,
            file_path=website_folder
        )
        
        db.session.add(ai_website)
        db.session.commit()
        
        return jsonify({
            'message': 'Website generated successfully',
            'website': ai_website.to_dict(),
            'preview': generated_files.get('index.html', ''),
            'download_url': f'/api/ai/websites/{ai_website.id}/download',
            'files': list(generated_files.keys())
        }), 201
        
    except Exception as e:
        print(f"AI Generation Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to generate website: {str(e)}'}), 500


@app.route('/api/ai/improve-prompt', methods=['POST'])
@token_required
def improve_prompt():
    """Improve user's prompt using AI"""
    data = request.json
    original_prompt = data.get('prompt', '')
    
    if not original_prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    try:
        # Use Gemini to improve the prompt
        improvement_prompt = f"""You are an expert at crafting detailed website requirements. A user wants to create a website and provided this description:

"{original_prompt}"

Your task is to improve and expand this description to make it more specific and actionable. Add details about:
- The type of business/website and its purpose
- Specific pages and features that should be included
- Visual style preferences (modern, minimalist, professional, etc.)
- Color scheme suggestions
- Target audience considerations
- Key functionality needed

Write an improved prompt that is clear, detailed, and will help generate a better website. Keep it concise but comprehensive (2-4 sentences).

Return ONLY the improved prompt text, no explanations or additional formatting."""

        response = model.generate_content(improvement_prompt)
        improved_prompt = response.text.strip()
        
        return jsonify({
            'original_prompt': original_prompt,
            'improved_prompt': improved_prompt
        }), 200
        
    except Exception as e:
        print(f"Prompt Improvement Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to improve prompt: {str(e)}'}), 500


@app.route('/api/ai/regenerate/<int:website_id>', methods=['POST'])
@token_required
def ai_regenerate_website(website_id):
    """Regenerate website with improvements"""
    ai_website = AIWebsite.query.get_or_404(website_id)
    
    # Check ownership
    if ai_website.user_id != request.user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    # Accept both 'improvements' and 'modification_request' for flexibility
    improvements = data.get('modification_request') or data.get('improvements', '')
    
    if not improvements:
        return jsonify({'error': 'Modification request is required'}), 400
    
    try:
        # Get original HTML
        original_html = ai_website.generated_files.get('index.html', '')
        
        # Regenerate with improvements
        generated_html = regenerate_website(
            ai_website.description,
            improvements,
            original_html
        )
        
        # Save updated HTML
        if ai_website.file_path and os.path.exists(ai_website.file_path):
            html_file_path = os.path.join(ai_website.file_path, 'index.html')
            with open(html_file_path, 'w', encoding='utf-8') as f:
                f.write(generated_html)
        
        # Update the AI website
        ai_website.generated_files = {'index.html': generated_html}
        ai_website.description = f"{ai_website.description}\n\n[Modifications: {improvements}]"
        db.session.commit()
        
        return jsonify({
            'message': 'Website updated successfully',
            'website': ai_website.to_dict(),
            'id': ai_website.id,
            'preview': generated_html
        }), 200
        
    except Exception as e:
        print(f"Regeneration Error: {str(e)}")
        return jsonify({'error': f'Failed to update website: {str(e)}'}), 500

def generate_business_template(description, colors):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Website</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }}
        .navbar {{ background: {colors['primary']}; color: {colors['secondary']}; padding: 20px; position: sticky; top: 0; z-index: 1000; }}
        .nav-container {{ max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }}
        .logo {{ font-size: 24px; font-weight: 700; }}
        .nav-links {{ display: flex; gap: 30px; list-style: none; }}
        .nav-links a {{ color: {colors['secondary']}; text-decoration: none; }}
        .hero {{ background: {colors['primary']}; color: {colors['secondary']}; padding: 120px 20px; text-align: center; }}
        .hero h1 {{ font-size: 56px; margin-bottom: 20px; }}
        .hero p {{ font-size: 20px; max-width: 600px; margin: 0 auto 40px; }}
        .btn {{ display: inline-block; padding: 14px 32px; background: {colors['accent']}; color: {colors['secondary']}; text-decoration: none; border-radius: 8px; font-weight: 600; }}
        .section {{ padding: 80px 20px; max-width: 1200px; margin: 0 auto; }}
        .section h2 {{ font-size: 36px; margin-bottom: 40px; text-align: center; }}
        .features {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }}
        .feature-card {{ background: #f5f5f5; padding: 40px; border-radius: 12px; text-align: center; }}
        .feature-card h3 {{ font-size: 24px; margin-bottom: 16px; }}
        .footer {{ background: {colors['primary']}; color: {colors['secondary']}; padding: 40px 20px; text-align: center; }}
        @media (max-width: 768px) {{
            .hero h1 {{ font-size: 36px; }}
            .nav-links {{ flex-direction: column; gap: 10px; }}
        }}
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">Your Business</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>
    
    <section class="hero" id="home">
        <h1>Welcome to Our Business</h1>
        <p>{description}</p>
        <a href="#contact" class="btn">Get Started</a>
    </section>
    
    <section class="section" id="about">
        <h2>About Us</h2>
        <p style="text-align: center; max-width: 800px; margin: 0 auto; font-size: 18px;">
            We are a professional business dedicated to providing exceptional services and solutions 
            to our clients. Our team is committed to excellence and innovation.
        </p>
    </section>
    
    <section class="section" id="services">
        <h2>Our Services</h2>
        <div class="features">
            <div class="feature-card">
                <h3>Service One</h3>
                <p>Professional service description with quality and expertise.</p>
            </div>
            <div class="feature-card">
                <h3>Service Two</h3>
                <p>Comprehensive solutions tailored to your specific needs.</p>
            </div>
            <div class="feature-card">
                <h3>Service Three</h3>
                <p>Expert consultation and support for your business growth.</p>
            </div>
        </div>
    </section>
    
    <section class="section" id="contact">
        <h2>Contact Us</h2>
        <p style="text-align: center; font-size: 18px;">
            Email: contact@business.com<br>
            Phone: (555) 123-4567
        </p>
    </section>
    
    <footer class="footer">
        <p>&copy; 2024 Your Business. All rights reserved.</p>
    </footer>
</body>
</html>"""


def generate_restaurant_template(description, colors):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restaurant</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }}
        .navbar {{ background: {colors['primary']}; color: {colors['secondary']}; padding: 20px; }}
        .nav-container {{ max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }}
        .hero {{ background: {colors['primary']}; color: {colors['secondary']}; padding: 100px 20px; text-align: center; }}
        .hero h1 {{ font-size: 48px; margin-bottom: 20px; }}
        .menu {{ padding: 80px 20px; max-width: 1200px; margin: 0 auto; }}
        .menu-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }}
        .menu-item {{ background: #f5f5f5; padding: 30px; border-radius: 12px; }}
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div style="font-size: 24px; font-weight: 700;">Restaurant Name</div>
            <div>Menu | About | Contact</div>
        </div>
    </nav>
    <section class="hero">
        <h1>Delicious Food Awaits</h1>
        <p>{description}</p>
    </section>
    <section class="menu">
        <h2 style="text-align: center; margin-bottom: 40px; font-size: 36px;">Our Menu</h2>
        <div class="menu-grid">
            <div class="menu-item">
                <h3>Dish One</h3>
                <p>Delicious description</p>
                <p style="font-weight: 700; margin-top: 12px;">$15.99</p>
            </div>
            <div class="menu-item">
                <h3>Dish Two</h3>
                <p>Delicious description</p>
                <p style="font-weight: 700; margin-top: 12px;">$18.99</p>
            </div>
        </div>
    </section>
</body>
</html>"""


def generate_portfolio_template(description, colors):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }}
        .hero {{ background: {colors['primary']}; color: {colors['secondary']}; padding: 120px 20px; text-align: center; }}
        .hero h1 {{ font-size: 56px; margin-bottom: 20px; }}
        .portfolio {{ padding: 80px 20px; max-width: 1200px; margin: 0 auto; }}
        .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }}
        .item {{ background: #f5f5f5; padding: 40px; border-radius: 12px; }}
    </style>
</head>
<body>
    <section class="hero">
        <h1>My Portfolio</h1>
        <p>{description}</p>
    </section>
    <section class="portfolio">
        <h2 style="text-align: center; margin-bottom: 40px; font-size: 36px;">Projects</h2>
        <div class="grid">
            <div class="item">
                <h3>Project 1</h3>
                <p>Project description and details</p>
            </div>
            <div class="item">
                <h3>Project 2</h3>
                <p>Project description and details</p>
            </div>
        </div>
    </section>
</body>
</html>"""


def generate_blog_template(description, colors):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }}
        .header {{ background: {colors['primary']}; color: {colors['secondary']}; padding: 40px 20px; text-align: center; }}
        .posts {{ padding: 80px 20px; max-width: 900px; margin: 0 auto; }}
        .post {{ background: #f5f5f5; padding: 40px; border-radius: 12px; margin-bottom: 30px; }}
    </style>
</head>
<body>
    <header class="header">
        <h1>My Blog</h1>
        <p>{description}</p>
    </header>
    <section class="posts">
        <article class="post">
            <h2>Blog Post Title</h2>
            <p style="color: #666; margin: 12px 0;">Published on January 1, 2024</p>
            <p>Blog post content and article text goes here...</p>
        </article>
    </section>
</body>
</html>"""


def generate_ecommerce_template(description, colors):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }}
        .header {{ background: {colors['primary']}; color: {colors['secondary']}; padding: 20px; }}
        .hero {{ background: {colors['accent']}; color: {colors['secondary']}; padding: 80px 20px; text-align: center; }}
        .products {{ padding: 80px 20px; max-width: 1200px; margin: 0 auto; }}
        .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }}
        .product {{ background: #f5f5f5; padding: 30px; border-radius: 12px; text-align: center; }}
        .product h3 {{ margin-bottom: 12px; }}
        .price {{ font-size: 24px; font-weight: 700; color: {colors['accent']}; margin-top: 12px; }}
    </style>
</head>
<body>
    <header class="header">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between;">
            <div style="font-size: 24px; font-weight: 700;">Shop Name</div>
            <div>Cart (0)</div>
        </div>
    </header>
    <section class="hero">
        <h1>Welcome to Our Shop</h1>
        <p>{description}</p>
    </section>
    <section class="products">
        <h2 style="text-align: center; margin-bottom: 40px; font-size: 36px;">Products</h2>
        <div class="grid">
            <div class="product">
                <h3>Product 1</h3>
                <p>Product description</p>
                <div class="price">$29.99</div>
                <button style="margin-top: 16px; padding: 10px 20px; background: {colors['accent']}; color: {colors['secondary']}; border: none; border-radius: 6px; cursor: pointer;">Add to Cart</button>
            </div>
            <div class="product">
                <h3>Product 2</h3>
                <p>Product description</p>
                <div class="price">$39.99</div>
                <button style="margin-top: 16px; padding: 10px 20px; background: {colors['accent']}; color: {colors['secondary']}; border: none; border-radius: 6px; cursor: pointer;">Add to Cart</button>
            </div>
        </div>
    </section>
</body>
</html>"""


@app.route('/api/ai/websites', methods=['GET'])
@token_required
def get_user_ai_websites():
    """Get all AI-generated websites for the current user"""
    websites = AIWebsite.query.filter_by(user_id=request.user_id).order_by(AIWebsite.created_at.desc()).all()
    
    # Return websites with preview data
    result = []
    for website in websites:
        website_data = website.to_dict()
        website_data['preview'] = website.generated_files.get('index.html', '')[:500]  # Preview snippet
        result.append(website_data)
    
    return jsonify({'websites': result}), 200


@app.route('/api/ai/websites/<int:website_id>', methods=['GET'])
@token_required
def get_ai_website(website_id):
    """Get a specific AI website with full HTML"""
    website = AIWebsite.query.get_or_404(website_id)
    
    # Check ownership
    if website.user_id != request.user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    website_data = website.to_dict()
    website_data['preview'] = website.generated_files.get('index.html', '')
    
    return jsonify({'website': website_data}), 200


@app.route('/api/ai/websites/<int:website_id>', methods=['DELETE'])
@token_required
def delete_ai_website(website_id):
    """Delete an AI-generated website"""
    website = AIWebsite.query.get_or_404(website_id)
    
    # Check ownership
    if website.user_id != request.user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Delete folder if exists
    if website.file_path and os.path.exists(website.file_path):
        try:
            shutil.rmtree(website.file_path)
        except Exception as e:
            print(f"Error deleting folder: {str(e)}")
    
    db.session.delete(website)
    db.session.commit()
    
    return jsonify({'message': 'Website deleted successfully'}), 200


@app.route('/api/ai/websites/<int:website_id>/download', methods=['GET'])
def download_ai_website(website_id):
    """Download AI website as ZIP file"""
    # Get token from query parameter or header
    token_from_query = request.args.get('token')
    token_from_header = request.headers.get('Authorization', '').replace('Bearer ', '')
    token = token_from_query or token_from_header
    
    # Debug logging
    print(f"\n{'='*50}")
    print(f"DOWNLOAD REQUEST for website {website_id}")
    print(f"{'='*50}")
    print(f"Query params: {dict(request.args)}")
    print(f"Headers: {dict(request.headers)}")
    print(f"Token from query: {token_from_query[:30] if token_from_query else 'NONE'}...")
    print(f"Token from header: {token_from_header[:30] if token_from_header else 'NONE'}...")
    print(f"Final token selected: {token[:30] if token else 'NONE'}...")
    print(f"Token length: {len(token) if token else 0}")
    print(f"{'='*50}\n")
    
    if not token:
        print("❌ ERROR: No token provided")
        return jsonify({
            'error': 'Token is missing',
            'details': 'Please include token in URL as ?token=YOUR_TOKEN'
        }), 401
    
    # Verify token
    try:
        print(f"Attempting to decode token...")
        print(f"Using JWT_SECRET_KEY: {Config.JWT_SECRET_KEY[:10]}...")
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        print(f"✅ Token verified successfully!")
        print(f"   User ID: {user_id}")
        print(f"   Payload: {payload}")
    except jwt.ExpiredSignatureError:
        print("❌ ERROR: Token has expired")
        return jsonify({'error': 'Token has expired', 'details': 'Please log in again'}), 401
    except jwt.InvalidTokenError as e:
        print(f"❌ ERROR: Invalid token - {str(e)}")
        return jsonify({'error': 'Invalid token', 'details': str(e)}), 401
    except Exception as e:
        print(f"❌ ERROR: Token verification failed - {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Invalid token', 'details': str(e)}), 401
    
    print(f"\nFetching website {website_id} from database...")
    
    website = AIWebsite.query.get_or_404(website_id)
    print(f"Website found: ID={website.id}, Owner={website.user_id}")
    
    # Check ownership
    if website.user_id != user_id:
        print(f"❌ ERROR: Unauthorized - User {user_id} trying to access website owned by {website.user_id}")
        return jsonify({'error': 'Unauthorized', 'details': 'You do not own this website'}), 403
    
    print(f"✅ Ownership verified")
    
    # Check if ZIP file exists
    zip_path = f"{website.file_path}.zip"
    print(f"Looking for ZIP file at: {zip_path}")
    print(f"ZIP exists: {os.path.exists(zip_path)}")
    
    if os.path.exists(zip_path):
        # Send existing ZIP file
        print(f"✅ Sending existing ZIP file: {zip_path}")
        from flask import send_file
        return send_file(
            zip_path,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f'website-{website_id}.zip'
        )
    else:
        # Create ZIP on the fly if it doesn't exist
        print(f"Creating ZIP on-the-fly...")
        print(f"Files to zip: {list(website.generated_files.keys()) if website.generated_files else 'NONE'}")
        import zipfile
        import io
        
        if not website.generated_files:
            print(f"❌ ERROR: No generated files found")
            return jsonify({'error': 'No files to download'}), 404
        
        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for filename, content in website.generated_files.items():
                print(f"  Adding {filename} ({len(content)} bytes)")
                zipf.writestr(filename, content)
        
        memory_file.seek(0)
        print(f"✅ ZIP created successfully, sending to client...")
        
        from flask import send_file
        return send_file(
            memory_file,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f'website-{website_id}.zip'
        )


@app.route('/api/test-token', methods=['GET'])
def test_token():
    """Test endpoint to verify token is working"""
    token = request.args.get('token') or request.headers.get('Authorization', '').replace('Bearer ', '')
    
    print(f"\n=== TOKEN TEST ===")
    print(f"Token received: {token[:30] if token else 'NONE'}...")
    
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        return jsonify({
            'success': True,
            'message': 'Token is valid!',
            'user_id': payload['user_id'],
            'payload': payload
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 401


@app.route('/api/ai/suggestions', methods=['POST'])
@token_required
def get_ai_suggestions_route():
    """Get AI suggestions for website generation"""
    data = request.json
    description = data.get('description', '')
    
    try:
        suggestions = get_website_suggestions(description)
        return jsonify({'suggestions': suggestions}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def find_index_html(directory):
    """Recursively find index.html in directory"""
    for root, dirs, files in os.walk(directory):
        if 'index.html' in files:
            return os.path.relpath(os.path.join(root, 'index.html'), directory)
    return None


@app.route('/api/templates/<int:template_id>/debug', methods=['GET'])
def debug_template(template_id):
    template = Template.query.get_or_404(template_id)
    
    template_path = template.file_path
    if not os.path.isabs(template_path):
        template_path = os.path.join(os.getcwd(), template_path)
    
    exists = os.path.exists(template_path)
    files = []
    index_location = None
    
    if exists and os.path.isdir(template_path):
        for root, dirs, filenames in os.walk(template_path):
            for f in filenames:
                rel_path = os.path.relpath(os.path.join(root, f), template_path)
                files.append(rel_path)
                if f == 'index.html':
                    index_location = rel_path
    
    return jsonify({
        'template_id': template_id,
        'db_file_path': template.file_path,
        'absolute_path': template_path,
        'exists': exists,
        'is_dir': os.path.isdir(template_path) if exists else False,
        'index_html_found': index_location,
        'total_files': len(files),
        'files': files[:30]
    }), 200

# Serve uploaded files (images, etc.)
@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory(Config.UPLOAD_FOLDER, filename)

@app.route('/api/templates/<int:template_id>/preview')
@app.route('/api/templates/<int:template_id>/preview/<path:filepath>')
def serve_template_file(template_id, filepath='index.html'):
    """Serve template files for preview with full asset support"""
    try:
        template = Template.query.get_or_404(template_id)
        
        # Get absolute path
        template_path = template.file_path
        if not os.path.isabs(template_path):
            template_path = os.path.join(os.getcwd(), template_path)
        
        template_path = os.path.abspath(template_path)
        
        # Find index.html and template root
        index_html_path = None
        template_root = template_path
        
        for root, dirs, files in os.walk(template_path):
            if 'index.html' in files:
                index_html_path = os.path.join(root, 'index.html')
                template_root = root
                break
        
        # Serve index.html with base tag injection
        if filepath == 'index.html':
            if not index_html_path or not os.path.exists(index_html_path):
                return jsonify({'error': 'index.html not found'}), 404
            
            # Read and modify HTML
            with open(index_html_path, 'r', encoding='utf-8', errors='ignore') as f:
                html_content = f.read()
            # Inject base tag for relative paths
            base_url = f'http://localhost:5000/api/templates/{template_id}/preview/'
            if '<base' not in html_content.lower():
                base_tag = f'<base href="{base_url}">'
                # Case-insensitive replacement for <head>
                import re
                if re.search(r'<head>', html_content, re.IGNORECASE):
                    html_content = re.sub(r'(<head>)', f'\\1\n    {base_tag}', html_content, count=1, flags=re.IGNORECASE)
                elif re.search(r'<html', html_content, re.IGNORECASE):
                    html_content = re.sub(r'(<html[^>]*>)', f'\\1\n<head>\n    {base_tag}\n</head>', html_content, count=1, flags=re.IGNORECASE)
            
            from flask import Response
            return Response(html_content, mimetype='text/html')
        
        # Serve other files (CSS, JS, images, etc.)
        # Try to find the file in the template directory
        file_path = os.path.abspath(os.path.join(template_root, filepath))
        
        # If file doesn't exist in direct path, search recursively
        if not os.path.exists(file_path):
            for root, dirs, files in os.walk(template_path):
                if os.path.basename(filepath) in files:
                    file_path = os.path.join(root, os.path.basename(filepath))
                    break
        
        # Security check
        if not file_path.startswith(template_path):
            return jsonify({'error': 'Invalid file path'}), 403
        
        if not os.path.exists(file_path):
            return jsonify({'error': f'File not found: {filepath}'}), 404
        
        # Determine mimetype
        from mimetypes import guess_type
        mimetype, _ = guess_type(file_path)
        
        return send_file(file_path, mimetype=mimetype)
        
    except Exception as e:
        print(f"Preview Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/templates/<int:template_id>/download', methods=['GET'])
@token_required
def download_template(template_id):
    """Download purchased template as ZIP"""
    template = Template.query.get_or_404(template_id)
    
    # Check if user purchased the template
    purchase = Purchase.query.filter_by(
        buyer_id=request.user_id,
        template_id=template_id
    ).first()
    
    if not purchase and request.user_role not in ['admin', 'seller']:
        # Check if seller owns it
        if request.user_role == 'seller':
            seller = Seller.query.filter_by(user_id=request.user_id).first()
            if not seller or template.seller_id != seller.id:
                return jsonify({'error': 'You must purchase this template first'}), 403
        else:
            return jsonify({'error': 'You must purchase this template first'}), 403
    
    # Create ZIP file
    zip_filename = f"{template.title.replace(' ', '_')}.zip"
    zip_path = os.path.join(Config.TEMPLATE_FOLDER, f"download_{template_id}_{int(datetime.utcnow().timestamp())}.zip")
    
    try:
        shutil.make_archive(zip_path.rsplit('.', 1)[0], 'zip', template.file_path)
        
        return send_file(
            zip_path,
            as_attachment=True,
            download_name=zip_filename,
            mimetype='application/zip'
        )
    except Exception as e:
        return jsonify({'error': f'Failed to create download: {str(e)}'}), 500


@app.route('/api/templates/<int:template_id>/customize', methods=['POST'])
@token_required
def customize_template_endpoint(template_id):
    """Customize template with business details and download"""
    from template_customizer import customize_template
    
    template = Template.query.get_or_404(template_id)
    
    # Check if user purchased the template
    purchase = Purchase.query.filter_by(
        buyer_id=request.user_id,
        template_id=template_id
    ).first()
    
    if not purchase and request.user_role not in ['admin', 'seller']:
        if request.user_role == 'seller':
            seller = Seller.query.filter_by(user_id=request.user_id).first()
            if not seller or template.seller_id != seller.id:
                return jsonify({'error': 'You must purchase this template first'}), 403
        else:
            return jsonify({'error': 'You must purchase this template first'}), 403
    
    try:
        # Get business details from form data
        business_details = {
            'businessName': request.form.get('businessName', ''),
            'tagline': request.form.get('tagline', ''),
            'description': request.form.get('description', ''),
            'email': request.form.get('email', ''),
            'phone': request.form.get('phone', ''),
            'address': request.form.get('address', ''),
            'city': request.form.get('city', ''),
            'country': request.form.get('country', ''),
            'facebook': request.form.get('facebook', ''),
            'twitter': request.form.get('twitter', ''),
            'linkedin': request.form.get('linkedin', ''),
            'instagram': request.form.get('instagram', '')
        }
        
        # Get logo file if provided
        logo_file = request.files.get('logo')
        
        # Validate required fields
        if not business_details['businessName']:
            return jsonify({'error': 'Business name is required'}), 400
        
        # Get template folder path
        template_folder = template.file_path
        if not os.path.exists(template_folder):
            return jsonify({'error': 'Template files not found'}), 404
        
        # Customize template
        zip_path = customize_template(template_folder, business_details, logo_file)
        
        # Save customization record
        customization = TemplateCustomization(
            user_id=request.user_id,
            template_id=template_id,
            business_name=business_details['businessName'],
            tagline=business_details['tagline'],
            description=business_details['description'],
            email=business_details['email'],
            phone=business_details['phone'],
            address=business_details['address'],
            city=business_details['city'],
            country=business_details['country'],
            facebook=business_details['facebook'],
            twitter=business_details['twitter'],
            linkedin=business_details['linkedin'],
            instagram=business_details['instagram'],
            customized_file_path=zip_path
        )
        
        if logo_file:
            customization.logo_path = f"logos/{logo_file.filename}"
        
        db.session.add(customization)
        db.session.commit()
        
        # Return download URL
        download_url = f'/api/templates/customized/{customization.id}/download'
        
        return jsonify({
            'message': 'Template customized successfully',
            'customization_id': customization.id,
            'download_url': download_url
        }), 200
        
    except Exception as e:
        print(f"Customization error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to customize template: {str(e)}'}), 500


@app.route('/api/templates/customized/<int:customization_id>/download', methods=['GET'])
def download_customized_template(customization_id):
    """Download customized template"""
    # Get token from query parameter or header
    token_from_query = request.args.get('token')
    token_from_header = request.headers.get('Authorization', '').replace('Bearer ', '')
    token = token_from_query or token_from_header
    
    # Debug logging
    print(f"\n{'='*50}")
    print(f"CUSTOMIZED TEMPLATE DOWNLOAD REQUEST for customization {customization_id}")
    print(f"{'='*50}")
    print(f"Query params: {dict(request.args)}")
    print(f"Token from query: {token_from_query[:30] if token_from_query else 'NONE'}...")
    print(f"Token from header: {token_from_header[:30] if token_from_header else 'NONE'}...")
    print(f"Final token selected: {token[:30] if token else 'NONE'}...")
    print(f"{'='*50}\n")
    
    if not token:
        print("❌ ERROR: No token provided")
        return jsonify({
            'error': 'Token is missing',
            'details': 'Please include token in URL as ?token=YOUR_TOKEN'
        }), 401
    
    # Verify token
    try:
        print(f"Attempting to decode token...")
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user_role = payload.get('role', '')
        print(f"✅ Token verified successfully!")
        print(f"   User ID: {user_id}")
        print(f"   Role: {user_role}")
    except jwt.ExpiredSignatureError:
        print("❌ ERROR: Token has expired")
        return jsonify({'error': 'Token has expired', 'details': 'Please log in again'}), 401
    except jwt.InvalidTokenError as e:
        print(f"❌ ERROR: Invalid token - {str(e)}")
        return jsonify({'error': 'Invalid token', 'details': str(e)}), 401
    except Exception as e:
        print(f"❌ ERROR: Token verification failed - {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Invalid token', 'details': str(e)}), 401
    
    print(f"\nFetching customization {customization_id} from database...")
    customization = TemplateCustomization.query.get_or_404(customization_id)
    print(f"Customization found: ID={customization.id}, Owner={customization.user_id}")
    
    # Check ownership
    if customization.user_id != user_id and user_role != 'admin':
        print(f"❌ ERROR: Unauthorized - User {user_id} trying to access customization owned by {customization.user_id}")
        return jsonify({'error': 'Unauthorized'}), 403
    
    print(f"✅ Ownership verified")
    
    if not os.path.exists(customization.customized_file_path):
        print(f"❌ ERROR: File not found at {customization.customized_file_path}")
        return jsonify({'error': 'Customized file not found'}), 404
    
    try:
        print(f"✅ Sending customized template: {customization.customized_file_path}")
        return send_file(
            customization.customized_file_path,
            as_attachment=True,
            download_name=f"{customization.business_name}_template.zip",
            mimetype='application/zip'
        )
    except Exception as e:
        print(f"❌ ERROR: Download failed - {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Download failed: {str(e)}'}), 500


@app.route('/api/admin/templates/<int:template_id>/edit', methods=['POST'])
@token_required
@role_required(['admin'])
def edit_admin_template(template_id):
    """Edit admin template with AI based on user description"""
    template = Template.query.get_or_404(template_id)
    
    if not template.is_editable:
        return jsonify({'error': 'Template is not editable'}), 400
    
    data = request.json
    description = data.get('description', '')
    
    if not description:
        return jsonify({'error': 'Description is required'}), 400
    
    # In production, integrate with Claude API or similar
    # For now, create a modified version based on description
    # This is a placeholder - in production, use AI to modify the template
    
    return jsonify({
        'message': 'Template editing initiated',
        'description': description,
        'note': 'In production, this would use AI to modify the template files'
    }), 200


@app.route('/api/admin/users/<int:user_id>/ban', methods=['POST'])
@token_required
@role_required(['admin'])
def ban_user(user_id):
    """Ban a user"""
    user = User.query.get_or_404(user_id)
    # In production, add a banned field to User model
    return jsonify({'message': 'User banned (mock)'}), 200


# ==================== PAYMENT ROUTES ====================

@app.route('/api/payment/jazzcash/initiate', methods=['POST'])
@token_required
def initiate_jazzcash_payment():
    """Initiate JazzCash payment (wallet or card)"""
    try:
        data = request.json
        user_id = request.user_id
        
        # Validate required fields
        required_fields = ['amount', 'payment_method']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        amount = float(data['amount'])
        payment_method = data['payment_method']  # 'wallet' or 'card'
        purchase_id = data.get('purchase_id')
        template_id = data.get('template_id')
        
        # Get user info
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Initialize JazzCash
        jazzcash = JazzCashPayment()
        
        # Generate transaction ID
        transaction_id = jazzcash.generate_transaction_id()
        bill_reference = f"BILL{transaction_id}"
        
        # Create payment record in database
        payment = Payment(
            user_id=user_id,
            purchase_id=purchase_id,
            payment_gateway='jazzcash',
            transaction_id=transaction_id,
            bill_reference=bill_reference,
            amount=amount,
            currency='PKR',
            status='pending',
            customer_email=user.email,
            customer_mobile=data.get('mobile_number', ''),
            payment_method=payment_method
        )
        db.session.add(payment)
        db.session.commit()
        
        # Prepare payment data
        payment_data = {
            'amount': amount,
            'bill_reference': bill_reference,
            'description': f"Template Purchase - {template_id}" if template_id else "Website Template Purchase",
            'mobile_number': data.get('mobile_number', '03001234567'),
            'email': user.email,
            'transaction_id': transaction_id
        }
        
        # Initiate payment based on method
        if payment_method == 'wallet':
            result = jazzcash.initiate_payment(payment_data)
        elif payment_method == 'card':
            result = jazzcash.initiate_card_payment(payment_data)
        else:
            return jsonify({'error': 'Invalid payment method'}), 400
        
        if result.get('success'):
            # Update payment record with response
            payment.raw_response = result
            db.session.commit()
            
            return jsonify({
                'success': True,
                'payment_id': payment.id,
                'transaction_id': transaction_id,
                'payment_url': result.get('payment_url'),
                'form_data': result.get('form_data'),
                'message': 'Payment initiated successfully'
            }), 200
        else:
            payment.status = 'failed'
            payment.response_message = result.get('message', 'Payment initiation failed')
            db.session.commit()
            return jsonify({'error': result.get('message', 'Payment initiation failed')}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/payment/jazzcash/callback', methods=['POST'])
def jazzcash_callback():
    """Handle JazzCash payment callback"""
    try:
        data = request.form.to_dict()
        
        # Initialize JazzCash
        jazzcash = JazzCashPayment()
        
        # Verify payment response
        verification = jazzcash.verify_payment_response(data)
        
        if not verification['valid']:
            return jsonify({'error': 'Invalid payment response'}), 400
        
        transaction_id = data.get('pp_TxnRefNo')
        
        # Find payment record
        payment = Payment.query.filter_by(transaction_id=transaction_id).first()
        
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404
        
        # Update payment status
        payment.status = verification['status']
        payment.response_code = data.get('pp_ResponseCode')
        payment.response_message = data.get('pp_ResponseMessage')
        payment.raw_response = data
        
        if verification['status'] == 'success':
            payment.completed_at = datetime.utcnow()
            
            # If this was for a template purchase, create Purchase record
            if payment.purchase_id:
                purchase = Purchase.query.get(payment.purchase_id)
                if purchase:
                    purchase.payment_status = 'completed'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'status': verification['status'],
            'message': verification['message'],
            'payment_id': payment.id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/payment/<int:payment_id>/status', methods=['GET'])
@token_required
def check_payment_status(payment_id):
    """Check payment status"""
    try:
        payment = Payment.query.get_or_404(payment_id)
        
        # Verify user owns this payment
        if payment.user_id != request.user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # If payment is pending, check with JazzCash
        if payment.status == 'pending':
            jazzcash = JazzCashPayment()
            status = jazzcash.check_transaction_status(payment.transaction_id)
            
            if status['success']:
                # Update payment status
                payment.status = status.get('status', payment.status)
                payment.response_code = status.get('response_code')
                payment.response_message = status.get('message')
                db.session.commit()
        
        return jsonify(payment.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/payment/user/history', methods=['GET'])
@token_required
def get_user_payment_history():
    """Get user's payment history"""
    try:
        user_id = request.user_id
        payments = Payment.query.filter_by(user_id=user_id).order_by(Payment.created_at.desc()).all()
        
        return jsonify({
            'payments': [payment.to_dict() for payment in payments]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)

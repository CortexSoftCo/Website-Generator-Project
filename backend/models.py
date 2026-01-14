from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, seller, buyer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)
    
    seller_profile = db.relationship('Seller', backref='user', uselist=False, cascade='all, delete-orphan')
    purchases = db.relationship('Purchase', backref='buyer', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='buyer', lazy=True, cascade='all, delete-orphan')
    ai_websites = db.relationship('AIWebsite', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat()
        }


class Seller(db.Model):
    __tablename__ = 'sellers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    business_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    revenue = db.Column(db.Float, default=0.0)
    rating = db.Column(db.Float, default=0.0)
    
    templates = db.relationship('Template', backref='seller', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'business_name': self.business_name,
            'description': self.description,
            'revenue': self.revenue,
            'rating': self.rating
        }


class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    icon = db.Column(db.String(50))
    
    templates = db.relationship('Template', backref='category', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'icon': self.icon
        }


class Template(db.Model):
    __tablename__ = 'templates'
    
    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, db.ForeignKey('sellers.id'), nullable=True)  # Nullable for system templates
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    preview_images = db.Column(db.JSON)  # Array of image URLs
    demo_url = db.Column(db.String(255))
    file_path = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    downloads = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_editable = db.Column(db.Boolean, default=False)  # Admin templates that can be AI-edited
    
    purchases = db.relationship('Purchase', backref='template', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='template', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'seller_id': self.seller_id,
            'category_id': self.category_id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'preview_images': self.preview_images,
            'demo_url': self.demo_url,
            'status': self.status,
            'downloads': self.downloads,
            'views': self.views,
            'rating': self.rating,
            'created_at': self.created_at.isoformat(),
            'is_editable': self.is_editable
        }


class Purchase(db.Model):
    __tablename__ = 'purchases'
    
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey('templates.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    purchased_at = db.Column(db.DateTime, default=datetime.utcnow)
    transaction_id = db.Column(db.String(100))
    
    def to_dict(self):
        return {
            'id': self.id,
            'buyer_id': self.buyer_id,
            'template_id': self.template_id,
            'price': self.price,
            'purchased_at': self.purchased_at.isoformat(),
            'transaction_id': self.transaction_id
        }


class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey('templates.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'buyer_id': self.buyer_id,
            'template_id': self.template_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat()
        }


class AIWebsite(db.Model):
    __tablename__ = 'ai_websites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    generated_files = db.Column(db.JSON)  # Store file structure
    file_path = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'description': self.description,
            'generated_files': self.generated_files,
            'created_at': self.created_at.isoformat(),
            'file_path': self.file_path
        }


class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    purchase_id = db.Column(db.Integer, db.ForeignKey('purchases.id'), nullable=True)
    
    # Payment Gateway Info
    payment_gateway = db.Column(db.String(50), nullable=False)
    transaction_id = db.Column(db.String(100), unique=True, nullable=False)
    bill_reference = db.Column(db.String(100))
    
    # Amount
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default='PKR')
    
    # Status
    status = db.Column(db.String(50), default='pending')
    response_code = db.Column(db.String(20))
    response_message = db.Column(db.Text)
    
    # Customer Info
    customer_email = db.Column(db.String(120))
    customer_mobile = db.Column(db.String(20))
    
    # Payment Method
    payment_method = db.Column(db.String(50))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Raw response data
    raw_response = db.Column(db.JSON)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'purchase_id': self.purchase_id,
            'payment_gateway': self.payment_gateway,
            'transaction_id': self.transaction_id,
            'amount': self.amount,
            'currency': self.currency,
            'status': self.status,
            'payment_method': self.payment_method,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'response_message': self.response_message
        }


class TemplateCustomization(db.Model):
    __tablename__ = 'template_customizations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey('templates.id'), nullable=False)
    
    # Business Details
    business_name = db.Column(db.String(200))
    tagline = db.Column(db.String(500))
    description = db.Column(db.Text)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(50))
    address = db.Column(db.String(500))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    
    # Social Media
    facebook = db.Column(db.String(255))
    twitter = db.Column(db.String(255))
    linkedin = db.Column(db.String(255))
    instagram = db.Column(db.String(255))
    
    # Files
    logo_path = db.Column(db.String(255))
    customized_file_path = db.Column(db.String(255))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'template_id': self.template_id,
            'business_name': self.business_name,
            'tagline': self.tagline,
            'description': self.description,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'country': self.country,
            'facebook': self.facebook,
            'twitter': self.twitter,
            'linkedin': self.linkedin,
            'instagram': self.instagram,
            'logo_path': self.logo_path,
            'customized_file_path': self.customized_file_path,
            'created_at': self.created_at.isoformat()
        }

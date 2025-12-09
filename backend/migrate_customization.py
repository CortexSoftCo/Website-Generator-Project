"""
Database migration script to add TemplateCustomization table
Run this after adding the new model to models.py
"""

from app import app, db
from models import TemplateCustomization

with app.app_context():
    print("Creating database tables...")
    db.create_all()
    print("✅ Database tables created successfully!")
    print("   - TemplateCustomization table added")

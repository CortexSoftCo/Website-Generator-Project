"""
Script to register existing templates in the uploads folder to the database.
Run this script to add the digital-marketing-html-template to the database.
"""
from app import app, db
from models import Template, Category, User
import os

def register_existing_template():
    with app.app_context():
        # Get admin user (seller_id = 0 for admin)
        admin = User.query.filter_by(email='admin@marketplace.com').first()
        if not admin:
            print("Admin user not found. Please create admin user first.")
            return
        
        # Get Business category (or create if doesn't exist)
        category = Category.query.filter_by(slug='business').first()
        if not category:
            category = Category(name='Business', slug='business', icon='briefcase')
            db.session.add(category)
            db.session.commit()
        
        # Template details
        template_name = "Digital Marketing HTML Template"
        template_path = os.path.join('uploads', 'digital-marketing-html-template')
        
        # Check if template already exists
        existing = Template.query.filter_by(title=template_name).first()
        if existing:
            print(f"Template '{template_name}' already exists in database.")
            return
        
        # Check if template folder exists - try multiple paths
        original_path = template_path
        if not os.path.exists(template_path):
            # Try absolute path from current directory
            abs_path = os.path.abspath(template_path)
            if os.path.exists(abs_path):
                template_path = abs_path
            else:
                # Try from project root
                project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                alt_path = os.path.join(project_root, 'uploads', 'digital-marketing-html-template')
                if os.path.exists(alt_path):
                    template_path = alt_path
                else:
                    print(f"Template folder not found. Tried:")
                    print(f"  - {original_path}")
                    print(f"  - {abs_path}")
                    print(f"  - {alt_path}")
                    print(f"Current working directory: {os.getcwd()}")
                    return
        
        # Check for preview image
        preview_image_path = os.path.join(template_path, 'digital-marketing-html-template.jpg')
        preview_images = []
        if os.path.exists(preview_image_path):
            preview_images = [f"/uploads/digital-marketing-html-template/digital-marketing-html-template.jpg"]
        
        # Create template
        template = Template(
            seller_id=0,  # Admin template
            category_id=category.id,
            title=template_name,
            description="A professional digital marketing HTML template with modern design, responsive layout, and multiple pages including home, about, services, team, testimonials, and contact pages.",
            price=29.99,
            preview_images=preview_images,
            file_path=template_path,
            status='approved',
            is_editable=True  # Admin templates can be edited
        )
        
        db.session.add(template)
        db.session.commit()
        
        print(f"Successfully registered template: {template_name}")
        print(f"   Template ID: {template.id}")
        print(f"   File Path: {template_path}")
        print(f"   Preview Images: {len(preview_images)}")

if __name__ == '__main__':
    register_existing_template()
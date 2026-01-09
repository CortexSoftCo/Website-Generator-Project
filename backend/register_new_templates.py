"""
Script to register Italian-Cuisine, Kider, Makaan, and ProMan templates to the database.
Run this script to add these templates.
"""
from app import app, db
from models import Template, Category, User
import os

def register_new_templates():
    with app.app_context():
        # Get admin user
        admin = User.query.filter_by(email='admin@marketplace.com').first()
        if not admin:
            print("Admin user not found. Please create admin user first.")
            return
        
        # Define templates to register
        templates_data = [
            {
                'name': 'Italian Cuisine Restaurant',
                'folder': 'Italian-Cuisine',
                'category_slug': 'business',
                'category_name': 'Business',
                'description': 'A beautiful restaurant template perfect for Italian restaurants, cafes, and food businesses. Features menu pages, online ordering, contact form, and elegant design.',
                'price': 5.00,
                'preview_image': 'Italian_Cuisine.png',
                'thumbnail_folder': 'images'
            },
            {
                'name': 'Kider - Kindergarten & Education',
                'folder': 'Kider',
                'category_slug': 'education',
                'category_name': 'Education',
                'description': 'Modern education template designed for kindergartens, preschools, and educational institutions. Includes class pages, appointment booking, team showcase, and colorful kid-friendly design.',
                'price': 5.00,
                'preview_image': 'Kider.png',
                'thumbnail_folder': 'images'
            },
            {
                'name': 'Makaan - Real Estate & Property',
                'folder': 'Makaan',
                'category_slug': 'business',
                'category_name': 'Business',
                'description': 'Professional real estate template for property listings, real estate agents, and property management businesses. Features property search, agent profiles, and modern layout.',
                'price': 5.00,
                'preview_image': 'Makaan.png',
                'thumbnail_folder': 'images'
            },
            {
                'name': 'ProMan - Professional Portfolio',
                'folder': 'ProMan',
                'category_slug': 'portfolio',
                'category_name': 'Portfolio',
                'description': 'Clean and modern portfolio template perfect for professionals, freelancers, and creative agencies. Showcases projects with elegant design and smooth animations.',
                'price': 5.00,
                'preview_image': 'Proman.png',
                'thumbnail_folder': 'images'
            },
            {
                'name': 'Kaira - Modern E-commerce Store',
                'folder': 'kaira-1.0.0',
                'category_slug': 'ecommerce',
                'category_name': 'E-commerce',
                'description': 'A sleek and modern e-commerce template perfect for online stores and retail businesses. Features product listings, shopping cart functionality, and responsive design.',
                'price': 5.00,
                'preview_image': 'Kaira.png',
                'thumbnail_folder': 'images'
            },
            {
                'name': 'TripBiz - Travel & Tourism Blog',
                'folder': 'tripbiz',
                'category_slug': 'blog',
                'category_name': 'Blog',
                'description': 'Modern travel and tourism blog template perfect for travel bloggers, tour agencies, and travel enthusiasts. Features blog posts, destination guides, and beautiful imagery.',
                'price': 5.00,
                'preview_image': 'TripBiz.png',
                'thumbnail_folder': 'images'
            }
        ]
        
        registered_count = 0
        
        for template_data in templates_data:
            # Check if template already exists
            existing = Template.query.filter_by(title=template_data['name']).first()
            if existing:
                print(f"✓ Template '{template_data['name']}' already exists (ID: {existing.id})")
                continue
            
            # Get or create category
            category = Category.query.filter_by(slug=template_data['category_slug']).first()
            if not category:
                category = Category(
                    name=template_data['category_name'], 
                    slug=template_data['category_slug'],
                    icon='folder'
                )
                db.session.add(category)
                db.session.commit()
                print(f"✓ Created category: {template_data['category_name']}")
            
            # Build template path - go up one directory to access uploads folder
            template_path = os.path.join('..', 'uploads', template_data['folder'])
            
            # Check if folder exists
            if not os.path.exists(template_path):
                abs_path = os.path.abspath(template_path)
                print(f"✗ Template folder not found: {abs_path}")
                continue
            
            # Look for preview images
            preview_images = []
            
            # Check if thumbnail is specified in template_data
            if 'thumbnail_folder' in template_data and template_data.get('preview_image'):
                thumbnail_path = os.path.join('uploads', template_data['thumbnail_folder'], template_data['preview_image'])
                if os.path.exists(thumbnail_path):
                    preview_images.append(f"/uploads/{template_data['thumbnail_folder']}/{template_data['preview_image']}")
            
            # Fallback to looking in template folder
            if not preview_images:
                possible_preview_names = ['preview.jpg', 'preview.png', 'screenshot.jpg', 'screenshot.png']
                for img_name in possible_preview_names:
                    img_path = os.path.join(template_path, img_name)
                    if os.path.exists(img_path):
                        preview_images.append(f"/uploads/{template_data['folder']}/{img_name}")
                        break
            
            # Create template
            template = Template(
                seller_id=0,  # Admin template
                category_id=category.id,
                title=template_data['name'],
                description=template_data['description'],
                price=template_data['price'],
                preview_images=preview_images,
                file_path=template_path,
                status='approved',
                is_editable=True
            )
            
            db.session.add(template)
            db.session.commit()
            
            print(f"✓ Registered: {template_data['name']} (ID: {template.id})")
            registered_count += 1
        
        print(f"\n{'='*50}")
        print(f"Registration complete! Added {registered_count} new templates.")
        print(f"{'='*50}")

if __name__ == '__main__':
    register_new_templates()

"""
Script to update template preview images to use thumbnails from uploads/images folder
"""
from app import app, db
from models import Template
import os

def update_template_thumbnails():
    with app.app_context():
        # Define thumbnail mappings
        thumbnail_mappings = {
            'Italian Cuisine Restaurant': 'Italian_Cuisine.png',
            'Kider - Kindergarten & Education': 'Kider.png',
            'Makaan - Real Estate & Property': 'Makaan.png',
            'ProMan - Professional Portfolio': 'Proman.png',
            'Kaira - Modern E-commerce Store': 'Kaira.png',
            'TripBiz - Travel & Tourism Blog': 'TripBiz.png'
        }
        
        updated_count = 0
        
        for template_name, thumbnail_file in thumbnail_mappings.items():
            template = Template.query.filter_by(title=template_name).first()
            
            if not template:
                print(f"✗ Template '{template_name}' not found")
                continue
            
            # Check if thumbnail exists
            thumbnail_path = os.path.join('uploads', 'images', thumbnail_file)
            if not os.path.exists(thumbnail_path):
                print(f"✗ Thumbnail not found: {thumbnail_path}")
                continue
            
            # Update preview images
            new_preview = [f"/uploads/images/{thumbnail_file}"]
            old_preview = template.preview_images
            template.preview_images = new_preview
            updated_count += 1
            
            print(f"✓ Updated '{template_name}' thumbnail")
            print(f"  Old: {old_preview}")
            print(f"  New: {new_preview}")
        
        if updated_count > 0:
            db.session.commit()
            print(f"\n{'='*50}")
            print(f"Updated {updated_count} template thumbnails")
            print(f"{'='*50}")
        else:
            print("\nNo templates updated.")

if __name__ == '__main__':
    update_template_thumbnails()

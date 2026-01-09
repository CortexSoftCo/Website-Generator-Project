#!/usr/bin/env python3
"""
Update template preview images
"""

import os
import sys
from app import app, db
from models import Template

def update_template_images():
    """Update preview images for templates"""
    
    with app.app_context():
        # Define image mappings
        image_updates = [
            {
                'template_id': 4,
                'name': 'Italian Cuisine Restaurant',
                'image': 'uploads/images/Italian_Cuisine.png'
            },
            {
                'template_id': 5,
                'name': 'Kider - Kindergarten & Education',
                'image': 'uploads/images/Kider.png'
            },
            {
                'template_id': 6,
                'name': 'Makaan - Real Estate & Property',
                'image': 'uploads/images/Makaan.png'
            },
            {
                'template_id': 7,
                'name': 'ProMan - Professional Portfolio',
                'image': 'uploads/images/Proman.png'
            }
        ]
        
        updated_count = 0
        
        for update_data in image_updates:
            template = Template.query.get(update_data['template_id'])
            
            if not template:
                print(f"✗ Template ID {update_data['template_id']} not found")
                continue
            
            # Check if image file exists
            image_path = update_data['image']
            if not os.path.exists(image_path):
                print(f"✗ Image not found: {image_path}")
                continue
            
            # Update preview images
            template.preview_images = [update_data['image']]
            updated_count += 1
            print(f"✓ Updated {template.title} with image: {update_data['image']}")
        
        # Commit changes
        if updated_count > 0:
            db.session.commit()
            print(f"\n{'='*50}")
            print(f"Successfully updated {updated_count} templates with preview images!")
            print(f"{'='*50}")
        else:
            print("\n✗ No templates were updated")

if __name__ == '__main__':
    update_template_images()

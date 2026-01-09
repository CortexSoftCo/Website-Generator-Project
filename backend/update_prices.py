"""
Script to update all template prices to $5.00
"""
from app import app, db
from models import Template

def update_template_prices():
    with app.app_context():
        # Get all templates
        templates = Template.query.all()
        
        if not templates:
            print("No templates found in database.")
            return
        
        updated_count = 0
        
        for template in templates:
            if template.price != 5.00:
                old_price = template.price
                template.price = 5.00
                updated_count += 1
                print(f"✓ Updated '{template.title}': ${old_price:.2f} → $5.00")
            else:
                print(f"✓ '{template.title}' already at $5.00")
        
        if updated_count > 0:
            db.session.commit()
            print(f"\n{'='*50}")
            print(f"Updated {updated_count} template prices to $5.00")
            print(f"{'='*50}")
        else:
            print("\nAll templates already have correct pricing.")

if __name__ == '__main__':
    update_template_prices()

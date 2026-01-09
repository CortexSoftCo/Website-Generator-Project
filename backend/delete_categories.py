"""
Script to delete Landing Page and Dashboard categories from the database
"""
from app import app, db
from models import Category, Template

def delete_categories():
    with app.app_context():
        # Find and delete Landing Page and Dashboard categories
        categories_to_delete = ['landing', 'dashboard']
        
        deleted_count = 0
        
        for slug in categories_to_delete:
            category = Category.query.filter_by(slug=slug).first()
            
            if category:
                # Check if there are templates using this category
                templates = Template.query.filter_by(category_id=category.id).all()
                
                if templates:
                    print(f"⚠ Category '{category.name}' has {len(templates)} templates. Moving them to 'Business' category...")
                    
                    # Get or create Business category
                    business_cat = Category.query.filter_by(slug='business').first()
                    if not business_cat:
                        business_cat = Category(name='Business', slug='business', icon='briefcase')
                        db.session.add(business_cat)
                        db.session.commit()
                    
                    # Move templates to Business category
                    for template in templates:
                        template.category_id = business_cat.id
                        print(f"  Moved template: {template.title}")
                
                # Delete the category
                db.session.delete(category)
                deleted_count += 1
                print(f"✓ Deleted category: {category.name}")
            else:
                print(f"✓ Category '{slug}' not found (already deleted)")
        
        if deleted_count > 0:
            db.session.commit()
            print(f"\n{'='*50}")
            print(f"Deleted {deleted_count} categories")
            print(f"{'='*50}")
        else:
            print("\nNo categories to delete.")

if __name__ == '__main__':
    delete_categories()

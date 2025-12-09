import os
import re
import shutil
from bs4 import BeautifulSoup
from PIL import Image
import zipfile
from datetime import datetime

class TemplateCustomizer:
    """Handles template customization with business details"""
    
    def __init__(self, template_path, output_path):
        self.template_path = template_path
        self.output_path = output_path
        self.replacements = {}
        
    def set_business_details(self, details):
        """Set business details for replacement"""
        # Default placeholder values that exist in templates
        default_company = "GrowMark"
        default_email = "info@example.com"
        default_phone = "+012 345 67890"
        default_address = "123 Street, New York, USA"
        
        # Build replacement dictionary
        self.replacements = {
            # Company name variations
            default_company: details.get('businessName', default_company),
            default_company.upper(): details.get('businessName', default_company).upper(),
            default_company.lower(): details.get('businessName', default_company).lower(),
            
            # Contact details
            default_email: details.get('email', default_email),
            default_phone: details.get('phone', default_phone),
            default_address: self._build_full_address(details),
            
            # Meta tags
            'content=""': f'content="{details.get("description", "")}"',
        }
        
        # Add tagline/slogan replacements if provided
        if details.get('tagline'):
            self.replacements['Digital Marketing'] = details.get('tagline')
            self.replacements['Your Tagline'] = details.get('tagline')
            
        return self
    
    def _build_full_address(self, details):
        """Build full address string from components"""
        parts = []
        if details.get('address'):
            parts.append(details['address'])
        if details.get('city'):
            parts.append(details['city'])
        if details.get('country'):
            parts.append(details['country'])
        
        if parts:
            return ', '.join(parts)
        return "123 Street, New York, USA"
    
    def process_logo(self, logo_file, logo_name='logo'):
        """Process and save logo file"""
        if not logo_file:
            return None
            
        try:
            # Create img directory if not exists
            img_dir = os.path.join(self.output_path, 'img')
            os.makedirs(img_dir, exist_ok=True)
            
            # Determine file extension
            ext = os.path.splitext(logo_file.filename)[1] or '.png'
            logo_filename = f'{logo_name}{ext}'
            logo_path = os.path.join(img_dir, logo_filename)
            
            # Save logo
            logo_file.save(logo_path)
            
            # Optimize logo size
            self._optimize_logo(logo_path)
            
            return f'img/{logo_filename}'
        except Exception as e:
            print(f"Logo processing error: {e}")
            return None
    
    def _optimize_logo(self, logo_path, max_width=300, max_height=100):
        """Optimize logo dimensions"""
        try:
            with Image.open(logo_path) as img:
                # Convert RGBA to RGB if needed
                if img.mode == 'RGBA':
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3])
                    img = background
                
                # Resize if too large
                if img.width > max_width or img.height > max_height:
                    img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
                    img.save(logo_path, optimize=True, quality=85)
        except Exception as e:
            print(f"Logo optimization error: {e}")
    
    def customize_html_files(self, logo_path=None, social_links=None):
        """Process all HTML files in template"""
        html_files = []
        
        for root, dirs, files in os.walk(self.output_path):
            for file in files:
                if file.endswith('.html'):
                    file_path = os.path.join(root, file)
                    html_files.append(file_path)
                    self._customize_html_file(file_path, logo_path, social_links)
        
        return len(html_files)
    
    def _customize_html_file(self, file_path, logo_path=None, social_links=None):
        """Customize a single HTML file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse HTML
            soup = BeautifulSoup(content, 'html.parser')
            
            # Replace logo if provided
            if logo_path:
                self._replace_logo_in_html(soup, logo_path)
            
            # Replace text content
            content = str(soup)
            for old, new in self.replacements.items():
                if new:  # Only replace if new value exists
                    content = content.replace(old, new)
            
            # Update social media links
            if social_links:
                content = self._update_social_links(content, social_links)
            
            # Write updated content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
        except Exception as e:
            print(f"Error customizing {file_path}: {e}")
    
    def _replace_logo_in_html(self, soup, logo_path):
        """Replace favicon and logo images in HTML"""
        # Update favicon
        favicon_tags = soup.find_all('link', rel='icon')
        for tag in favicon_tags:
            tag['href'] = logo_path
        
        # Find and replace logo images (common patterns)
        # Look for h1/h2 with company name and replace with logo
        company_name = list(self.replacements.keys())[0]  # First replacement is company name
        
        # Find headers with company name
        for tag in soup.find_all(['h1', 'h2']):
            if company_name in tag.get_text():
                # Replace text with image
                new_img = soup.new_tag('img', src=logo_path, alt=self.replacements[company_name])
                new_img['style'] = 'height: 40px; width: auto;'
                tag.clear()
                tag.append(new_img)
    
    def _update_social_links(self, content, social_links):
        """Update social media links in HTML"""
        social_patterns = {
            'facebook': r'href="[^"]*facebook[^"]*"',
            'twitter': r'href="[^"]*twitter[^"]*"',
            'linkedin': r'href="[^"]*linkedin[^"]*"',
            'instagram': r'href="[^"]*instagram[^"]*"'
        }
        
        for platform, pattern in social_patterns.items():
            if social_links.get(platform):
                content = re.sub(pattern, f'href="{social_links[platform]}"', content)
        
        return content
    
    def create_zip(self, zip_filename):
        """Create ZIP file from customized template"""
        zip_path = os.path.join(os.path.dirname(self.output_path), zip_filename)
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(self.output_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, self.output_path)
                    zipf.write(file_path, arcname)
        
        return zip_path


def customize_template(template_folder, business_details, logo_file=None):
    """
    Main function to customize a template with business details
    
    Args:
        template_folder: Path to the template folder
        business_details: Dict with business info (name, email, phone, address, etc.)
        logo_file: FileStorage object for logo (optional)
    
    Returns:
        Path to customized ZIP file
    """
    # Create temporary output directory
    timestamp = int(datetime.utcnow().timestamp())
    output_dir = f"{template_folder}_customized_{timestamp}"
    
    # Copy template to output directory
    shutil.copytree(template_folder, output_dir)
    
    # Initialize customizer
    customizer = TemplateCustomizer(template_folder, output_dir)
    customizer.set_business_details(business_details)
    
    # Process logo if provided
    logo_path = None
    if logo_file:
        logo_path = customizer.process_logo(logo_file)
    
    # Extract social links
    social_links = {
        'facebook': business_details.get('facebook'),
        'twitter': business_details.get('twitter'),
        'linkedin': business_details.get('linkedin'),
        'instagram': business_details.get('instagram')
    }
    
    # Customize all HTML files
    customizer.customize_html_files(logo_path, social_links)
    
    # Create ZIP file
    zip_filename = f"customized_{business_details.get('businessName', 'template').replace(' ', '_')}_{timestamp}.zip"
    zip_path = customizer.create_zip(zip_filename)
    
    # Clean up temporary directory
    try:
        shutil.rmtree(output_dir)
    except:
        pass
    
    return zip_path

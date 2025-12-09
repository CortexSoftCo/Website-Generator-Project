# Template Customization Feature

## Overview
Users can now customize purchased templates with their business details before downloading. This includes:
- Business name, tagline, and description
- Logo upload and replacement
- Contact information (email, phone, address)
- Social media links (Facebook, Twitter, LinkedIn, Instagram)

## How It Works

### User Flow
1. **Purchase Template**: User must first purchase a template from the marketplace
2. **Click Download**: Instead of direct download, a customization form appears
3. **Fill Business Details**: User enters their company information
4. **Upload Logo** (optional): User can upload a logo to replace template logos
5. **Customize & Download**: System processes template and provides customized ZIP file

### Technical Implementation

#### Frontend Components
- **BusinessCustomizationForm.jsx**: Modal form with all business detail fields
  - Logo upload with preview
  - Business information section
  - Contact details section
  - Social media links section
  - Form validation

#### Backend Processing
- **template_customizer.py**: Core customization logic
  - `TemplateCustomizer` class handles all processing
  - Parses HTML files with BeautifulSoup
  - Replaces placeholder text (company names, contact info)
  - Processes and optimizes logo images
  - Updates social media links
  - Creates customized ZIP file

#### API Endpoints
1. **POST /api/templates/:id/customize**
   - Requires: User must have purchased template
   - Accepts: FormData with business details + logo file
   - Returns: Customization ID and download URL

2. **GET /api/templates/customized/:id/download**
   - Requires: User must own the customization
   - Returns: Customized ZIP file

#### Database
- **TemplateCustomization** table tracks:
  - User and template IDs
  - All business details submitted
  - Logo path
  - Customized file path
  - Creation timestamp

## Customization Logic

### Text Replacements
The system automatically finds and replaces common placeholder values:
```python
"GrowMark" → User's Business Name
"info@example.com" → User's Email
"+012 345 67890" → User's Phone
"123 Street, New York, USA" → User's Full Address
```

### Logo Processing
1. Uploads logo to `img/` folder in template
2. Optimizes dimensions (max 300x100px)
3. Converts RGBA to RGB if needed
4. Replaces favicon links
5. Replaces company name headers with logo images

### Social Media Links
Updates href attributes for social media icons:
- Facebook links
- Twitter links  
- LinkedIn links
- Instagram links

## File Structure
```
backend/
├── template_customizer.py    # Main customization logic
├── models.py                  # Added TemplateCustomization model
├── app.py                     # Added 2 new endpoints
└── requirements.txt           # Added beautifulsoup4, Pillow, lxml

frontend/
├── src/
│   ├── components/
│   │   └── BusinessCustomizationForm.jsx   # New form component
│   ├── pages/
│   │   └── TemplateDetail.jsx             # Updated with customization flow
│   └── api.js                             # Added customizeTemplate()
```

## Usage Example

### Frontend Code
```javascript
import { customizeTemplate } from '../api';

const handleCustomize = async (businessData) => {
  const formData = new FormData();
  formData.append('businessName', businessData.businessName);
  formData.append('email', businessData.email);
  formData.append('logo', businessData.logoFile);
  // ... other fields
  
  const response = await customizeTemplate(templateId, formData);
  window.open(`http://localhost:5000${response.data.download_url}`);
};
```

### Backend Processing
```python
from template_customizer import customize_template

business_details = {
    'businessName': 'Acme Corp',
    'email': 'info@acme.com',
    'phone': '+1-555-1234',
    # ... other fields
}

zip_path = customize_template(
    template_folder='/path/to/template',
    business_details=business_details,
    logo_file=logo_file_object
)
```

## Tested Templates
The customization works with common HTML template patterns:
- Bootstrap-based templates
- Templates with topbar/navbar contact info
- Templates with social media icon links
- Templates with company branding elements

## Future Enhancements
- [ ] Preview customized template before download
- [ ] Save business profiles for quick reuse
- [ ] Support for multiple logo variants (header, footer, favicon)
- [ ] Color scheme customization
- [ ] Font family selection
- [ ] More granular text replacement controls
- [ ] Support for additional social platforms
- [ ] Bulk customization for multiple templates

## Dependencies
```
beautifulsoup4==4.12.2  # HTML parsing
Pillow==10.1.0          # Image processing
lxml==4.9.3             # XML/HTML parser
```

## Security Considerations
- Logo files limited to 5MB
- Only image files accepted for logos
- User must own/purchase template before customizing
- Customized files stored securely per user
- Download URLs include ownership verification

## Error Handling
- Validates business name is required
- Checks template file existence
- Handles missing logo gracefully
- Provides detailed error messages
- Logs all errors for debugging

## Performance
- Logo optimization reduces file size
- ZIP compression for efficient downloads
- Temporary directories cleaned after processing
- Async form submission with loading states

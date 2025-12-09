# Template Customization Feature - Quick Start Guide

## 🎯 What's New?

You can now customize templates with your business details before downloading! When you purchase a template and click "Download Template", you'll see a form where you can add:

- ✅ **Business Name** - Replaces template placeholder names
- ✅ **Logo Upload** - Your logo appears throughout the template
- ✅ **Contact Info** - Email, phone, and address automatically updated
- ✅ **Social Media** - Your Facebook, Twitter, LinkedIn, Instagram links
- ✅ **Tagline & Description** - Customize the messaging

## 🚀 How to Use

1. **Purchase any template** from the marketplace
2. **Click "Download Template"** button
3. **Fill in your business details** in the popup form
4. **Upload your logo** (optional but recommended)
5. **Click "Customize & Download"**
6. Your personalized template downloads automatically!

## 📋 What Gets Customized?

### Text Replacements
- Company names throughout all pages
- Email addresses in contact sections
- Phone numbers in headers/footers
- Physical addresses
- Meta descriptions

### Logo Integration
- Favicon (browser tab icon)
- Header/navbar logos
- Footer branding
- Optimized to fit template design

### Links
- Social media icons link to your profiles
- Contact forms updated with your email
- Phone numbers made clickable

## 🔧 Technical Details

### Files Created
```
BusinessCustomizationForm.jsx    - The customization modal form
template_customizer.py           - Backend processing engine
TemplateCustomization model      - Database tracking
```

### API Endpoints
```
POST   /api/templates/:id/customize              - Submit customization
GET    /api/templates/customized/:id/download    - Download custom ZIP
```

### Database
New `template_customizations` table stores all your customizations for future reference.

## 💡 Pro Tips

1. **Use high-quality logos** - PNG or JPG, under 5MB
2. **Fill all fields** - More details = better customization
3. **Check spelling** - Your info goes directly into the template
4. **Save time** - Your details are saved for future downloads

## 🎨 Example

**Before Customization:**
```html
<h2>GrowMark</h2>
<a href="mailto:info@example.com">Email Us</a>
<span>+012 345 67890</span>
```

**After Customization with "Acme Corp":**
```html
<img src="img/logo.png" alt="Acme Corp">
<a href="mailto:contact@acmecorp.com">Email Us</a>
<span>+1-555-ACME</span>
```

## 🛠️ What's Installed

New Python packages:
- `beautifulsoup4` - HTML parsing
- `Pillow` - Image processing
- `lxml` - Fast XML/HTML parsing

## ✨ Next Steps

Try it out! Purchase a template and customize it with your business details. The system automatically:
- Replaces all placeholder text
- Inserts your logo
- Updates contact information
- Links your social media
- Creates a ready-to-use website!

## 📝 Notes

- Only works with **purchased templates**
- Logo must be an **image file** (PNG, JPG, etc.)
- Maximum logo size: **5MB**
- Business name is **required**, other fields optional
- Download includes all customized files in a **ZIP archive**

---

**Need help?** Check TEMPLATE_CUSTOMIZATION.md for full technical documentation.

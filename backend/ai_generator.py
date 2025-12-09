"""
AI Website Generator Module
Uses Google Gemini 2.0 Flash to generate beautiful, diverse, and dynamic websites
"""

import google.generativeai as genai
from config import Config
import random
import json
import re

# Configure Gemini
genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-pro')  # Using most powerful model for best quality


def enhance_user_prompt(user_description: str) -> dict:
    """
    Use LLM to enhance user's simple description into a detailed, comprehensive prompt.
    Returns enhanced description and suggested pages.
    """
    enhancement_prompt = f"""You are an expert web consultant. A user wants a website and gave this description:

"{user_description}"

Your task is to:
1. Analyze what type of business/website this is
2. Expand the description with rich details about:
   - Target audience and their needs
   - Key features and functionality required
   - Visual style and branding direction
   - Content sections needed
   - User journey and experience goals
3. Determine ALL pages this website should have (minimum 4, maximum 10)

Think about what pages would make this website COMPLETE and PROFESSIONAL.
Common pages: Home, About, Services/Products, Portfolio/Gallery, Team, Testimonials, Blog, FAQ, Contact, Pricing, etc.

Return ONLY a JSON object (no markdown):
{{
  "enhanced_description": "Detailed 2-3 paragraph description with specific requirements...",
  "business_type": "e.g., tech startup, restaurant, healthcare, education, etc.",
  "target_audience": "Who will use this site",
  "key_features": ["feature1", "feature2", "feature3"],
  "pages": ["index", "about", "services", "contact", "portfolio", ...],
  "visual_style": "modern/minimalist/bold/elegant/etc.",
  "color_mood": "professional/vibrant/calming/energetic/etc."
}}"""

    try:
        response = model.generate_content(
            enhancement_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.8,
                max_output_tokens=2048,
            )
        )
        
        result_text = response.text.strip()
        
        # Clean markdown if present
        if '```json' in result_text:
            result_text = re.search(r'```json\s*(\{.*?\})\s*```', result_text, re.DOTALL)
            if result_text:
                result_text = result_text.group(1)
        elif '```' in result_text:
            result_text = re.search(r'```\s*(\{.*?\})\s*```', result_text, re.DOTALL)
            if result_text:
                result_text = result_text.group(1)
        
        enhanced_data = json.loads(result_text)
        
        print(f"\n✅ Prompt Enhanced!")
        print(f"   Business Type: {enhanced_data.get('business_type', 'N/A')}")
        print(f"   Pages: {len(enhanced_data.get('pages', []))}")
        print(f"   Pages List: {', '.join(enhanced_data.get('pages', []))}")
        
        return enhanced_data
        
    except Exception as e:
        print(f"⚠️ Prompt enhancement failed: {str(e)}, using original description")
        # Fallback to basic structure
        return {
            'enhanced_description': user_description,
            'business_type': 'general',
            'target_audience': 'general audience',
            'key_features': ['responsive design', 'modern UI', 'fast loading'],
            'pages': ['index', 'about', 'services', 'contact'],
            'visual_style': 'modern',
            'color_mood': 'professional'
        }

# Enhanced color schemes for variety and vibrancy
COLOR_SCHEMES = [
    {
        'name': 'Ocean Breeze',
        'primary': '#0ea5e9',
        'secondary': '#0284c7',
        'accent': '#06b6d4',
        'bg': '#f0f9ff',
        'text': '#0c4a6e',
        'card': '#ffffff'
    },
    {
        'name': 'Sunset Glow',
        'primary': '#f59e0b',
        'secondary': '#ea580c',
        'accent': '#fb923c',
        'bg': '#fff7ed',
        'text': '#7c2d12',
        'card': '#ffffff'
    },
    {
        'name': 'Forest Green',
        'primary': '#10b981',
        'secondary': '#059669',
        'accent': '#34d399',
        'bg': '#f0fdf4',
        'text': '#064e3b',
        'card': '#ffffff'
    },
    {
        'name': 'Royal Purple',
        'primary': '#8b5cf6',
        'secondary': '#7c3aed',
        'accent': '#a78bfa',
        'bg': '#faf5ff',
        'text': '#4c1d95',
        'card': '#ffffff'
    },
    {
        'name': 'Rose Garden',
        'primary': '#ec4899',
        'secondary': '#db2777',
        'accent': '#f472b6',
        'bg': '#fdf2f8',
        'text': '#831843',
        'card': '#ffffff'
    },
    {
        'name': 'Midnight Blue',
        'primary': '#3b82f6',
        'secondary': '#2563eb',
        'accent': '#60a5fa',
        'bg': '#eff6ff',
        'text': '#1e3a8a',
        'card': '#ffffff'
    },
    {
        'name': 'Crimson Red',
        'primary': '#ef4444',
        'secondary': '#dc2626',
        'accent': '#f87171',
        'bg': '#fef2f2',
        'text': '#7f1d1d',
        'card': '#ffffff'
    },
    {
        'name': 'Emerald',
        'primary': '#14b8a6',
        'secondary': '#0d9488',
        'accent': '#2dd4bf',
        'bg': '#f0fdfa',
        'text': '#134e4a',
        'card': '#ffffff'
    },
    {
        'name': 'Amber Sunset',
        'primary': '#f59e0b',
        'secondary': '#d97706',
        'accent': '#fbbf24',
        'bg': '#fffbeb',
        'text': '#78350f',
        'card': '#ffffff'
    },
    {
        'name': 'Violet Dream',
        'primary': '#a855f7',
        'secondary': '#9333ea',
        'accent': '#c084fc',
        'bg': '#faf5ff',
        'text': '#581c87',
        'card': '#ffffff'
    },
    {
        'name': 'Coral Reef',
        'primary': '#fb7185',
        'secondary': '#f43f5e',
        'accent': '#fda4af',
        'bg': '#fff1f2',
        'text': '#881337',
        'card': '#ffffff'
    },
    {
        'name': 'Deep Space',
        'primary': '#6366f1',
        'secondary': '#4f46e5',
        'accent': '#818cf8',
        'bg': '#eef2ff',
        'text': '#312e81',
        'card': '#ffffff'
    }
]

# Design styles for variety
DESIGN_STYLES = [
    'modern and minimalist',
    'bold and creative',
    'elegant and professional',
    'playful and vibrant',
    'clean and corporate',
    'artistic and unique',
    'tech-forward and futuristic',
    'warm and welcoming'
]


def generate_website(description: str, user_preferences: dict = None) -> dict:
    """
    Generate a complete multi-page website with separate HTML, CSS, and JS files.
    
    Args:
        description: User's description of the desired website
        user_preferences: Optional dict with 'style', 'color_scheme', etc.
    
    Returns:
        Dictionary with file names as keys and content as values
    """
    # STEP 1: Enhance user's prompt using LLM
    print(f"\n🔍 Enhancing user prompt: '{description[:100]}...'")
    enhanced_data = enhance_user_prompt(description)
    
    # Use enhanced description for generation
    enhanced_description = enhanced_data.get('enhanced_description', description)
    required_pages = enhanced_data.get('pages', ['index', 'about', 'services', 'contact'])
    business_type = enhanced_data.get('business_type', 'general')
    
    # Ensure 'index' is always first (it's the home page)
    if 'index' in required_pages and required_pages[0] != 'index':
        required_pages.remove('index')
        required_pages.insert(0, 'index')
    elif 'index' not in required_pages:
        required_pages.insert(0, 'index')
    
    print(f"✅ Enhanced! Business: {business_type}, Pages: {', '.join(required_pages)}")
    
    # Select random color scheme and style for diversity
    color_scheme = random.choice(COLOR_SCHEMES)
    design_style = enhanced_data.get('visual_style', random.choice(DESIGN_STYLES))
    
    # Override with user preferences if provided
    if user_preferences:
        if 'style' in user_preferences:
            design_style = user_preferences['style']
        if 'color_scheme' in user_preferences:
            color_scheme = user_preferences['color_scheme']
    
    # Build dynamic page list for JSON output
    page_files = {f"{page}.html" for page in required_pages}
    pages_json_example = ',\n  '.join([f'"{page}.html": "complete HTML"' for page in required_pages])
    
    # Build navigation menu items
    nav_items = '\n       '.join([
        f'<li><a href="{page}.html" class="nav-link">{page.capitalize()}</a></li>' 
        for page in required_pages
    ])
    
    # Professional, detailed prompt for beautiful websites
    prompt = f"""You are a world-class web designer. Create a STUNNING, MODERN, PROFESSIONAL website.

ENHANCED PROJECT DETAILS:
{enhanced_description}

Business Type: {business_type}
Target Audience: {enhanced_data.get('target_audience', 'general audience')}
Key Features: {', '.join(enhanced_data.get('key_features', []))}

⚠️ CRITICAL REQUIREMENTS:

1. GENERATE EXACTLY THESE PAGES: {', '.join(required_pages)}
   (Total of {len(required_pages)} pages as determined by business needs)

2. CONSISTENT NAVIGATION BAR (EXACT SAME CODE ON ALL PAGES):
   Use this EXACT navigation structure on EVERY page:
   
```html
<nav class="navbar" id="navbar">
  <div class="container nav-container">
    <div class="logo">
      <a href="index.html">BusinessName</a>
    </div>
    <button class="nav-toggle" id="navToggle">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <ul class="nav-menu" id="navMenu">
       {nav_items}
    </ul>
  </div>
</nav>
```
   
   ⚠️ DO NOT modify navigation structure between pages
   Only change: add 'active' class to current page's link
   Fixed to top, white background, shadow on scroll
   Responsive hamburger menu on mobile

3. IMAGES - MUST USE PICSUM PHOTOS:
   Use https://picsum.photos/id/[ID]/[width]/[height]
   
   SELECT IDs BY CONTENT TYPE:
   - People/Team: 64, 65, 91, 177, 203, 216, 223, 237, 243, 366, 433, 453, 512, 548, 549
   - Technology: 0, 180, 367, 431, 487
   - Business/Office: 1-50
   - Food/Restaurant: 292, 326, 365, 429
   - Medical/Health: 48, 169, 515
   - Fitness: 41, 66, 123, 416
   
   Business-Specific:
   * Tech: Hero=ID:0, Team=223,237,243, Features=180,367
   * Restaurant: Hero=ID:292, Menu=326,365,429
   * Medical: Hero=ID:515, Team=177,203,216
   * Fitness: Hero=ID:416, Team=91,433,453

DESIGN THEME: {design_style}

COLOR SCHEME (use these exact colors):
- Primary: {color_scheme['primary']} (for buttons, headers, accents)
- Secondary: {color_scheme['secondary']} (for secondary elements)
- Accent: {color_scheme['accent']} (for highlights, hover states)
- Background: {color_scheme['bg']} (main background)
- Text: {color_scheme['text']} (all text content)

PAGE-SPECIFIC REQUIREMENTS:

INDEX PAGE (index.html):
   - HERO SECTION with full-screen background image
   - Example: <img src="https://picsum.photos/id/1/1920/1080" class="hero-bg" alt="Hero">
   - Gradient overlay for text readability
   - Large heading (48px-64px) + subheading (18px-24px)
   - 2 CTA buttons: Primary (filled) + Secondary (outlined)
   - Features/Services section with 3-4 cards (each card MUST have image)
   - Testimonials section with client quotes
   - Call-to-action section

ABOUT PAGE (about.html) - IF REQUIRED:
   - Company story with image
   - Mission/Vision/Values
   - Team section with member photos:
     <img src="https://picsum.photos/id/64/400/400" alt="Team Member">
   - Stats/achievements section

SERVICES/PRODUCTS PAGE - IF REQUIRED:
   - Grid of service/product cards (6-9 cards)
   - EACH card MUST have image at top:
     <img src="https://picsum.photos/id/180/600/400" alt="Service">
   - Title, description, price/CTA button
   - Filter/category buttons

CONTACT PAGE (contact.html):
   - 2-column layout: Form + Contact Info
   - Form: Name, Email, Phone, Message fields
   - Beautiful input styling with focus states
   - Submit button with hover effect
   - Contact details: address, phone, email
   - Optional: map or background image

OTHER PAGES (portfolio, blog, pricing, faq, etc.):
   - Design appropriate layouts based on page purpose
   - Maintain consistent styling and navigation
   - Include relevant images and content sections
   - Ensure responsive design
   - Gradient overlay: rgba(0,0,0,0.4) for text readability
   - Large heading (48px-64px): Create compelling title
   - Subheading (18px-24px): Engaging description
   - 2 CTA buttons: Primary (filled) + Secondary (outlined)
   - Centered content, white text
   - Example: <img src="https://picsum.photos/id/1/1920/1080" class="hero-bg" alt="Hero">

3. FEATURES/SERVICES SECTION - MUST INCLUDE SERVICE IMAGES:
   - 3-4 feature cards in grid
   - Each card: Icon (Font Awesome), Image, title, description
   - Example card structure:
     <div class="card">
       <img src="https://source.unsplash.com/600x400/?[service-keyword]" alt="Service">
       <i class="fa-solid fa-icon"></i>
       <h3>Service Title</h3>
       <p>Description</p>
     </div>
   - White cards with shadow: box-shadow: 0 10px 30px rgba(0,0,0,0.1)
   - Hover effect: lift up, deeper shadow
   - Padding: 40px, border-radius: 10px

4. ABOUT SECTION (on about.html) - MUST HAVE COMPANY & TEAM IMAGES:
   - 2-column layout: Image + Text
   - Company image: <img src="https://picsum.photos/id/180/800/600" alt="About Us">
   - Professional company story
   - Stats/achievements section with numbers
   - Team grid with actual <img> tags for each member:
     <div class="team-grid">
       <div class="team-member">
         <img src="https://picsum.photos/id/64/400/400" alt="Team Member">
         <h4>Name</h4>
         <p>Position</p>
       </div>
       <!-- Repeat for 3-6 team members with different portrait numbers -->
     </div>

5. SERVICES PAGE (services.html) - EACH SERVICE CARD MUST HAVE IMAGE:
   - Grid of 6-9 service cards
   - MANDATORY: Each card must have an <img> tag at the top
   - Card structure:
     <div class="service-card">
       <img src="https://picsum.photos/id/180/600/400" alt="Service Name">
       <h3>Service Title</h3>
       <p>Description</p>
       <span class="price">$XX</span>
     </div>
   - Use Unsplash with relevant keywords for each service:
     * Web Development: https://picsum.photos/id/0/600/400
     * Marketing: https://picsum.photos/id/431/600/400
     * Design: https://picsum.photos/id/48/600/400
     * Consulting: https://picsum.photos/id/180/600/400
     * Finance: https://picsum.photos/id/367/600/400
   - Consistent card design with hover effects
   - Filter/category buttons at top

6. CONTACT PAGE (contact.html):
   - 2-column: Form + Contact Info
   - Form fields: Name, Email, Phone, Message
   - Beautiful input styling with focus states
   - Submit button with loading state
   - Contact details: address, phone, email, hours
   - Background image: https://picsum.photos/id/431/1200/800
   - Map or location placeholder

7. CSS REQUIREMENTS (styles.css):
```css
/* RESET */
* {{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}}

/* VARIABLES */
:root {{
  --primary: {color_scheme['primary']};
  --secondary: {color_scheme['secondary']};
  --accent: {color_scheme['accent']};
  --bg: {color_scheme['bg']};
  --text: {color_scheme['text']};
}}

/* BODY */
body {{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
}}

/* NAVIGATION */
nav {{
  position: fixed;
  top: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}}

/* BUTTONS */
.btn {{
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid var(--primary);
}}

.btn-primary {{
  background: var(--primary);
  color: white;
}}

.btn-primary:hover {{
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}}

/* CARDS */
.card {{
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}}

.card:hover {{
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
}}

/* RESPONSIVE */
@media (max-width: 768px) {{
  /* Mobile styles */
  nav {{
    padding: 0 20px;
  }}
  
  .grid {{
    grid-template-columns: 1fr !important;
  }}
  
  h1 {{
    font-size: 32px !important;
  }}
}}
```

8. JAVASCRIPT (script.js):
```javascript
// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {{
  menuToggle.addEventListener('click', () => {{
    navLinks.classList.toggle('active');
  }});
}}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {{
  const nav = document.querySelector('nav');
  if (window.scrollY > 100) {{
    nav.classList.add('scrolled');
  }} else {{
    nav.classList.remove('scrolled');
  }}
}});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
  anchor.addEventListener('click', function(e) {{
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {{
      target.scrollIntoView({{ behavior: 'smooth' }});
    }}
  }});
}});

// Form Validation
const form = document.querySelector('form');
if (form) {{
  form.addEventListener('submit', (e) => {{
    e.preventDefault();
    // Add validation logic
    alert('Form submitted successfully!');
  }});
}}

// Scroll Animations
const observerOptions = {{
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
}};

const observer = new IntersectionObserver((entries) => {{
  entries.forEach(entry => {{
    if (entry.isIntersecting) {{
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }}
  }});
}}, observerOptions);

document.querySelectorAll('.card, .feature').forEach(el => {{
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
}});
```

CONTENT GUIDELINES:
- Write professional, engaging copy
- Use power words: "Transform", "Discover", "Elevate", "Premium"
- Create realistic testimonials with names and companies
- Add stats like "10,000+ Happy Customers", "99% Satisfaction"
- Use compelling CTAs: "Get Started Today", "Schedule Free Consultation"

MOBILE RESPONSIVENESS:
- Single column layout on mobile
- Touch-friendly buttons (min 44px height)
- Hamburger menu that slides in from right
- Readable font sizes (min 16px)
- Stacked cards, no horizontal scroll

IMAGES - USE THESE RELIABLE SOURCES (they work in all browsers):

PRIMARY: Use Picsum Photos with ID-based URLs for reliability:
- Structure: https://picsum.photos/id/[ID]/[width]/[height]
- IDs to use by category:
  * Business/Office: 1-50 (e.g., https://picsum.photos/id/1/1920/1080)
  * People/Team: 64, 65, 91, 177, 203, 216, 223, 237, 243, 366, 433, 453, 512, 548, 549
  * Technology: 0, 180, 367, 431, 487
  * Nature/Background: 10, 15, 20, 42, 48
  * Architecture: 164, 169, 174, 175, 214
  
ALTERNATIVE: Placeholder.com for colored placeholders:
- https://via.placeholder.com/[width]x[height]/[color]/[text-color]?text=[Your+Text]
- Example: https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Service+Image

BACKUP: Lorem Picsum with random but cached:
- https://picsum.photos/[width]/[height]?random=[number]
- Use different numbers (1-100) for variety

EXAMPLES BY SECTION:
- Hero: https://picsum.photos/id/1/1920/1080 (city skyline)
- About Company: https://picsum.photos/id/180/800/600 (office/tech)
- Team Member 1: https://picsum.photos/id/64/400/400 (person)
- Team Member 2: https://picsum.photos/id/65/400/400 (person)
- Team Member 3: https://picsum.photos/id/91/400/400 (person)
- Service Card 1: https://picsum.photos/id/0/600/400 (tech)
- Service Card 2: https://picsum.photos/id/180/600/400 (workspace)
- Service Card 3: https://picsum.photos/id/367/600/400 (laptop/code)
- Contact Background: https://picsum.photos/id/431/1200/800 (communication)

IMPORTANT RULES:
1. ALWAYS use specific ID numbers - DO NOT use generic /800/600 without an ID
2. Use different IDs for variety (don't repeat the same image)
3. For team photos: ONLY use these IDs: 64, 65, 91, 177, 203, 216, 223, 237, 243
4. These images load fast and work in all browsers (no CORS issues)

BUSINESS-SPECIFIC IMAGE ID SELECTIONS:
- Restaurant: Hero=ID:292 | Team=IDs:64,65,91 | Services=IDs:326,431,488
- Gym/Fitness: Hero=ID:416 | Team=IDs:177,203,216 | Services=IDs:225,244,365
- Tech Startup: Hero=ID:0 | Team=IDs:223,237,243 | Services=IDs:180,367,487
- Medical/Healthcare: Hero=ID:515 | Team=IDs:366,433,453 | Services=IDs:4,13,24
- Law Firm: Hero=ID:164 | Team=IDs:512,548,549 | Services=IDs:169,175,214
- Real Estate: Hero=ID:484 | Team=IDs:64,91,203 | Services=IDs:1014,1024,1039
- Education: Hero=ID:159 | Team=IDs:65,177,216 | Services=IDs:119,201,326
- Creative Agency: Hero=ID:42 | Team=IDs:223,243,366 | Services=IDs:48,56,62

EXAMPLE HTML WITH IMAGES (follow this pattern):
```
<section class="hero">
  <img src="https://picsum.photos/id/1/1920/1080" class="hero-bg" alt="Hero">
  <div class="hero-content"><h1>Welcome</h1></div>
</section>

<section class="services">
  <div class="service-card">
    <img src="https://picsum.photos/id/180/600/400" alt="Service">
    <h3>Web Development</h3>
  </div>
</section>

<section class="team">
  <div class="team-member">
    <img src="https://picsum.photos/id/64/400/400" alt="Team Member">
    <h4>John Doe</h4>
  </div>
  <div class="team-member">
    <img src="https://picsum.photos/id/65/400/400" alt="Team Member">
    <h4>Jane Smith</h4>
  </div>
</section>
```

Return ONLY this JSON object (no markdown blocks, no explanations, just pure JSON):
{{
  {pages_json_example},
  "styles.css": "/* Complete beautiful CSS */",
  "script.js": "// Complete interactive JavaScript"
}}

CRITICAL: The first key MUST be "index.html". Example format:
{{
  "index.html": "<!DOCTYPE html>...",
  "about.html": "<!DOCTYPE html>...",
  "styles.css": "/* CSS code */",
  "script.js": "// JS code"
}}

REMINDER: Use the EXACT same navigation HTML on ALL pages. Only add 'active' class to current page link.
"""


    # Retry mechanism with fallback to simpler prompt if enhanced version fails
    max_retries = 2
    last_error = None
    
    for attempt in range(max_retries):
        try:
            # Use simpler prompt on retry
            current_prompt = prompt if attempt == 0 else f"""Create a professional multi-page website.

Business: {enhanced_description[:500]}
Pages Required: {', '.join(required_pages)}
Style: {design_style}
Colors: Primary {color_scheme['primary']}, Secondary {color_scheme['secondary']}, Accent {color_scheme['accent']}

Navigation structure (use EXACT same HTML on all pages):
```html
<nav class="navbar">
  <div class="logo"><a href="index.html">BusinessName</a></div>
  <ul class="nav-menu">
    {nav_items}
  </ul>
</nav>
```

Return ONLY this JSON object (no markdown, just pure JSON):
{{
  {pages_json_example},
  "styles.css": "complete CSS",
  "script.js": "complete JavaScript"
}}

IMPORTANT: First key MUST be "index.html" (the home page).

Use Picsum Photos: https://picsum.photos/id/[ID]/[width]/[height]
Team photos: IDs 64,65,91,177,203,216,223,237,243
Tech images: IDs 0,180,367,431,487
Make it responsive and professional. Ensure navigation is IDENTICAL on all pages."""

            # Generate content with Google Gemini 2.5 Pro
            response = model.generate_content(
                current_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=1.0,  # Max creativity for beautiful designs
                    max_output_tokens=65536,  # Maximum possible output
                )
            )
            
            # Extract JSON response
            response_text = response.text.strip()
            
            print(f"\n=== AI Response Attempt {attempt + 1} ===")
            print(f"Response length: {len(response_text)} characters")
            print(f"First 300 chars: {response_text[:300]}")
            print(f"Last 100 chars: {response_text[-100:]}")
            
            # Validate response is not empty or too short
            if not response_text or len(response_text) < 100:
                raise ValueError("AI returned empty or too short response")
            
            # Parse JSON to get file structure
            try:
                files_dict = json.loads(response_text)
            except json.JSONDecodeError as e:
                # Fallback: try to extract JSON from markdown code blocks
                if '```json' in response_text:
                    response_text = response_text.split('```json')[1].split('```')[0].strip()
                elif '```' in response_text:
                    response_text = response_text.split('```')[1].split('```')[0].strip()
                
                try:
                    files_dict = json.loads(response_text)
                except json.JSONDecodeError:
                    # Log the problematic response for debugging
                    print(f"ERROR: Invalid JSON from AI (first 500 chars): {response_text[:500]}")
                    raise ValueError(f"AI response is not valid JSON: {str(e)}")
            
            # Validate that we have the required files
            if not isinstance(files_dict, dict):
                print(f"❌ ERROR: Response is not a dictionary, it's {type(files_dict)}")
                raise ValueError("Generated content is not a valid dictionary structure")
            
            print(f"📦 Files in response: {list(files_dict.keys())}")
            
            if 'index.html' not in files_dict:
                print(f"❌ ERROR: index.html is missing!")
                print(f"   Available files: {list(files_dict.keys())}")
                raise ValueError("Generated content is missing index.html (home page)")
            
            # Validate that HTML files actually contain valid HTML (not garbage)
            for filename, content in files_dict.items():
                if filename.endswith('.html'):
                    if not isinstance(content, str) or len(content) < 200:
                        raise ValueError(f"{filename} is too short or invalid")
                    if '<!DOCTYPE html>' not in content and '<html' not in content.lower():
                        raise ValueError(f"{filename} does not contain valid HTML structure")
                    # Check for garbage/malformed content
                    if content.count('<') < 5 or content.count('>') < 5:
                        raise ValueError(f"{filename} appears to be malformed HTML")
                elif filename.endswith('.css'):
                    if not isinstance(content, str) or len(content) < 50:
                        raise ValueError(f"{filename} is too short or invalid")
                elif filename.endswith('.js'):
                    if not isinstance(content, str):
                        raise ValueError(f"{filename} has invalid content type")
            
            # Success! Return the validated files
            print(f"\n✅ Generation Successful!")
            print(f"   Generated {len([f for f in files_dict.keys() if f.endswith('.html')])} pages: {', '.join([f for f in files_dict.keys() if f.endswith('.html')])}")
            print(f"   Total files: {list(files_dict.keys())}")
            for filename, content in files_dict.items():
                print(f"   {filename}: {len(content)} chars")
            return files_dict
            
        except Exception as e:
            last_error = e
            print(f"❌ Attempt {attempt + 1} failed: {str(e)}")
            if attempt < max_retries - 1:
                print(f"🔄 Retrying with simpler prompt...")
                continue
            else:
                # All retries failed
                raise Exception(f"AI generation failed after {max_retries} attempts. Last error: {str(last_error)}")


def regenerate_website(original_description: str, improvements: str, original_html: str = None) -> str:
    """
    Regenerate/improve an existing website with user feedback using iterative AI editing.
    
    Args:
        original_description: Original website description
        improvements: User's improvement requests/changes needed
        original_html: Optional existing HTML to improve upon
    
    Returns:
        Improved HTML code as string
    """
    # Select new random styling for freshness if no HTML provided
    color_scheme = random.choice(COLOR_SCHEMES)
    design_style = random.choice(DESIGN_STYLES)
    
    # If we have original HTML, modify it intelligently
    if original_html:
        prompt = f"""You are an expert web designer. INTELLIGENTLY MODIFY the existing website based on user feedback.

ORIGINAL REQUEST: "{original_description}"

USER CHANGES REQUESTED: "{improvements}"

EXISTING HTML PROVIDED: Use the structure below as base and MODIFY only what's needed.

CRITICAL INSTRUCTIONS:
✅ Return ONLY the COMPLETE modified HTML - NO explanations
✅ PRESERVE what works well in the original
✅ IMPLEMENT the requested changes precisely
✅ IMPROVE overall quality and polish
✅ Keep all CSS and JavaScript inline
✅ Maintain responsiveness and animations
✅ Update images with Picsum Photos using specific IDs: https://picsum.photos/id/[ID]/[width]/[height]
✅ NO gradient backgrounds - solid colors only
✅ Make it MORE dynamic and professional

MODIFY THESE ASPECTS based on user request:
- Layout and structure
- Colors and styling
- Content and copy
- Images and media
- Interactions and animations
- Sections and components

EXISTING HTML TO MODIFY:
{original_html[:5000]}... (showing first 5000 chars for context)

Generate the IMPROVED, COMPLETE HTML now:"""
    else:
        # Generate fresh with improvements in mind
        prompt = f"""You are an expert web designer. CREATE an ENHANCED version of the website with improvements.

ORIGINAL REQUEST: "{original_description}"

USER IMPROVEMENTS: "{improvements}"

NEW ENHANCED DESIGN:
🎨 Style: {design_style}
🎨 Color Scheme: {color_scheme['name']}
   - Primary: {color_scheme['primary']}
   - Secondary: {color_scheme['secondary']}
   - Accent: {color_scheme['accent']}
   - Background: {color_scheme['bg']}
   - Cards: {color_scheme['card']}

REQUIREMENTS:
✅ Return ONLY complete HTML - NO explanations
✅ Make it BETTER, MORE DYNAMIC than before
✅ Include ALL CSS and JavaScript inline
✅ Full responsiveness with smooth animations
✅ Modern UI with depth and shadows
✅ High-quality Picsum Photos with specific IDs: https://picsum.photos/id/[ID]/[width]/[height]
✅ Interactive elements (modals, forms, animations)
✅ Implement the requested improvements
✅ NO gradients - solid colors only
✅ Professional, polished, production-ready

STRUCTURE:
- Fixed/sticky navigation
- Dynamic hero with CTA
- Feature sections with animations
- Image galleries/portfolios
- Contact forms with validation
- Compelling footer
- All requested improvements integrated

Generate the ENHANCED, COMPLETE HTML now:"""

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=1.0,  # Max creativity
                max_output_tokens=65536,  # Maximum possible
            )
        )
        
        improved_html = response.text.strip()
        
        # Clean up markdown code blocks if present
        if '```html' in improved_html:
            improved_html = improved_html.split('```html')[1].split('```')[0].strip()
        elif '```' in improved_html:
            improved_html = improved_html.split('```')[1].split('```')[0].strip()
        
        if not improved_html.strip().lower().startswith(('<!doctype', '<html')):
            raise ValueError("Generated content is not valid HTML")
        
        return improved_html
        
    except Exception as e:
        raise Exception(f"Regeneration failed: {str(e)}")


def get_website_suggestions(description: str) -> dict:
    """
    Get AI suggestions for improving a website description.
    
    Returns:
        Dict with suggestions for better results
    """
    suggestions = {
        'color_schemes': random.sample(COLOR_SCHEMES, 3),
        'design_styles': random.sample(DESIGN_STYLES, 3),
        'tips': [
            'Be specific about the type of business/project',
            'Mention desired pages or sections',
            'Describe your target audience',
            'Specify any must-have features',
            'Note any brand colors or preferences'
        ]
    }
    return suggestions

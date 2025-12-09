# TemplateHub - Website Generator & Marketplace

## Overview
TemplateHub is a modern web application that combines a template marketplace with AI-powered website generation. Users can browse, purchase, and sell website templates, or generate custom websites using Google Gemini AI.

## Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLAlchemy with SQLite
- **AI**: Google Gemini 2.0 Flash (gemini-2.0-flash-exp)
- **Authentication**: JWT tokens
- **File Upload**: Local storage with organized structure
- **Payment**: JazzCash integration (sandbox/production ready)

### Frontend
- **Framework**: React 18.2 with Vite
- **State Management**: Zustand
- **Routing**: React Router v6
- **Styling**: Inline styles with modern CSS (no UI libraries)
- **API Client**: Axios

### Design System
- **Brand**: TemplateHub
- **Primary Color**: Cyan (#06b6d4)
- **Secondary Colors**: Navy (#0f172a, #1e293b), Slate (#64748b)
- **Typography**: System fonts with gradient accents
- **Effects**: Glassmorphism, smooth animations, hover transforms
- **Icons**: NO emoji/icon dependencies - uses colored bars, gradients, shapes

## Project Structure

```
Website_Generator/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models.py              # Database models
│   ├── auth.py                # JWT authentication
│   ├── config.py              # Configuration management
│   ├── ai_generator.py        # Gemini AI integration
│   ├── upload.py              # File upload handling
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (API keys)
│   └── instance/
│       └── marketplace.db     # SQLite database
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # App entry point
│   │   ├── App.jsx            # Root component with routing
│   │   ├── api.js             # API client functions
│   │   ├── index.css          # Global styles + animations
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navigation with glassmorphism
│   │   │   ├── Footer.jsx     # Gradient logo footer
│   │   │   └── TemplateCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── SellerDashboard.jsx
│   │   │   ├── BuyerDashboard.jsx
│   │   │   ├── AIBuilder.jsx  # AI website generator
│   │   │   ├── Categories.jsx
│   │   │   ├── TemplateDetail.jsx
│   │   │   └── Cart.jsx
│   │   └── store/
│   │       ├── index.js       # Store exports
│   │       └── store.js       # Zustand stores
│   ├── package.json
│   └── vite.config.js
│
└── uploads/                   # Template files & AI-generated sites
```

## Features

### 1. User Roles & Authentication
- **Buyer**: Browse, purchase, and download templates
- **Seller**: Upload templates, manage listings, track revenue
- **Admin**: Approve/reject templates, manage users, delete any template

### 2. Template Marketplace
- Browse templates by category
- Search and filter functionality
- Preview images and demo URLs
- Ratings and reviews
- Secure file downloads after purchase
- Template deletion (sellers for own, admin for all)

### 3. AI Website Generator
- **Model**: Google Gemini 2.0 Flash (gemini-2.0-flash-exp)
- **Output**: 8000 tokens max
- **Features**:
  - Generate complete HTML websites from descriptions
  - 12 vibrant color schemes (Ocean Breeze, Sunset Glow, Forest Green, etc.)
  - 8 design styles (modern, bold, elegant, playful, etc.)
  - Responsive design with animations
  - Iterative editing (regenerate with user feedback)
  - Download generated websites
- **Prompt Engineering**: Optimized for quality, speed, and diversity

### 4. Payment Integration
- **Provider**: JazzCash (Pakistan's leading payment gateway)
- **Features**:
  - Sandbox and production modes
  - HMAC-SHA256 security
  - Transaction tracking
  - Payment history
  - Auto-redirect after payment

### 5. Admin Features
- View all users and sellers
- Approve/reject pending templates
- Upload templates directly
- View statistics dashboard
- Delete any template (pending or approved)
- Verify user accounts

## Database Models

### User
- email, password_hash, role (buyer/seller/admin)
- is_verified, created_at

### Seller
- user_id, business_name, description
- revenue, rating

### Template
- title, description, price
- category_id, seller_id
- status (pending/approved/rejected)
- file_path, preview_images, demo_url
- views, downloads, rating

### AIWebsite
- user_id, description
- generated_files (JSON)
- file_path, created_at

### Purchase
- buyer_id, template_id
- price, transaction_id
- payment_status, payment_method
- created_at

### Category
- name, description
- template_count

### Review
- user_id, template_id
- rating (1-5), comment

### Payment
- user_id, template_id, amount
- transaction_id, payment_method
- status (pending/completed/failed)
- jazzcash_response (JSON)

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login and get JWT token
- GET `/api/auth/me` - Get current user info

### Templates
- GET `/api/templates` - List templates (with filters)
- GET `/api/templates/:id` - Get template details
- POST `/api/templates` - Create template (seller)
- PUT `/api/templates/:id` - Update template (seller)
- DELETE `/api/templates/:id` - Delete template (seller/admin)

### Admin
- GET `/api/admin/templates/pending` - Get pending templates
- POST `/api/admin/templates/:id/approve` - Approve template
- POST `/api/admin/templates/:id/reject` - Reject template
- DELETE `/api/admin/templates/:id/delete` - Delete any template
- GET `/api/admin/users` - Get all users
- POST `/api/admin/users/:id/verify` - Verify user
- GET `/api/admin/stats` - Dashboard statistics

### AI Generator
- POST `/api/ai/generate` - Generate website
- POST `/api/ai/regenerate/:id` - Improve existing website
- GET `/api/ai/websites` - Get user's AI websites
- GET `/api/ai/websites/:id` - Get specific AI website
- DELETE `/api/ai/websites/:id` - Delete AI website

### Payments
- POST `/api/payment/jazzcash/initiate` - Start JazzCash payment
- GET `/api/payment/jazzcash/callback` - Payment callback
- GET `/api/payment/:id/status` - Check payment status
- GET `/api/payment/user/history` - User payment history

## Environment Variables (.env)

```env
# Flask
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Admin
ADMIN_EMAIL=admin@marketplace.com
ADMIN_PASSWORD=SecureAdmin@2024

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Database
DATABASE_URL=sqlite:///marketplace.db

# JazzCash
JAZZCASH_MERCHANT_ID=your-merchant-id
JAZZCASH_PASSWORD=your-password
JAZZCASH_INTEGRITY_SALT=your-salt
JAZZCASH_RETURN_URL=http://localhost:5000/api/payment/jazzcash/callback
JAZZCASH_ENVIRONMENT=sandbox

# Server
DEBUG=True
PORT=5000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Setup Instructions

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### First-Time Setup
1. Get Google Gemini API key from https://makersuite.google.com/app/apikey
2. Apply for JazzCash merchant account at https://sandbox.jazzcash.com.pk
3. Update `.env` file with your credentials
4. Run backend to create database and admin account
5. Run frontend and login as admin

## AI Generator Configuration

### Gemini Model Settings
- **Model**: gemini-2.0-flash-exp (latest experimental)
- **Temperature**: 1.0 (maximum creativity)
- **Max Output Tokens**: 8000 (balanced quality/speed)
- **Top-p**: 0.95, Top-k: 40

### Color Schemes (12 total)
1. Ocean Breeze - Blue tones
2. Sunset Glow - Orange/amber
3. Forest Green - Green shades
4. Royal Purple - Purple hues
5. Rose Garden - Pink/rose
6. Midnight Blue - Deep blues
7. Crimson Red - Red tones
8. Emerald - Teal/cyan
9. Amber Sunset - Warm yellows
10. Violet Dream - Purple/violet
11. Coral Reef - Pink/coral
12. Deep Space - Indigo/blue

### Design Styles (8 total)
- Modern and minimalist
- Bold and creative
- Elegant and professional
- Playful and vibrant
- Clean and corporate
- Artistic and unique
- Tech-forward and futuristic
- Warm and welcoming

## Key Features Summary

### ✅ Implemented
- User authentication (JWT)
- Role-based access control
- Template marketplace with categories
- Template upload and approval workflow
- AI website generation with Gemini
- Iterative AI editing
- JazzCash payment integration
- Admin dashboard with statistics
- Seller dashboard with revenue tracking
- Buyer dashboard with purchases
- Template deletion (sellers & admin)
- All templates view for admin
- Responsive design
- Modern UI with glassmorphism
- No icon dependencies

### 🎨 Design Highlights
- Navy/cyan color scheme
- Gradient text logos
- Smooth animations
- Hover effects
- Custom scrollbar
- Glassmorphism effects
- Professional typography
- Mobile-responsive

## Common Issues & Solutions

### White Screen
- Check browser console for errors
- Verify API endpoints are correct
- Ensure backend is running on port 5000
- Check for duplicate function names in imports

### AI Generation Timeout
- Model switched to gemini-2.0-flash-exp (faster)
- Token limit reduced to 8000
- Prompt streamlined for speed
- No request_options parameter (not supported)

### Payment Not Working
- Verify JazzCash credentials in .env
- Check JAZZCASH_ENVIRONMENT (sandbox/production)
- Ensure JAZZCASH_RETURN_URL is accessible
- Check HMAC signature calculation

### Template Upload Fails
- Verify file size < 100MB
- Check file format (.zip, .rar, .7z)
- Ensure upload folders have write permissions
- Check seller profile exists

## JazzCash Merchant Account

### Registration Requirements
- Business name
- Merchant code (provided by JazzCash)
- Category code (IT Services/E-commerce)
- Website URL
- Contact details
- Valid Pakistani mobile number

### Integration Steps
1. Register at https://sandbox.jazzcash.com.pk (test) or production portal
2. Receive Merchant ID, Password, Integrity Salt
3. Add credentials to .env file
4. Test in sandbox mode first
5. Switch to production when ready

## Future Enhancements

- Stripe payment integration (international)
- Email notifications
- Template preview in browser
- Advanced search filters
- Seller analytics dashboard
- Template versioning
- Wishlist functionality
- Social sharing
- Template bundles
- Referral system

## Support & Contact

For issues or questions:
- Check browser console for errors
- Verify .env configuration
- Ensure all dependencies installed
- Check backend logs for API errors

## License

This project includes templates with various licenses. Check individual template LICENSE.txt files.

---

**Last Updated**: December 5, 2025
**Version**: 1.0.0

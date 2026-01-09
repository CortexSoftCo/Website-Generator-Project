# Contact Page Web3Forms Integration

## Setup Instructions

The Contact Us page is integrated with Web3Forms API for handling form submissions.

### Getting Your Access Key

1. Visit [Web3Forms](https://web3forms.com/)
2. Sign up for a free account (no credit card required)
3. Create a new form and get your Access Key
4. Copy the Access Key

### Update the Contact Page

Open `frontend/src/pages/Contact.jsx` and replace the placeholder with your actual Access Key:

```javascript
access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // Replace with your actual key from web3forms.com
```

Replace `'YOUR_WEB3FORMS_ACCESS_KEY'` with the actual key you received from Web3Forms.

### Features

- ✅ Beautiful, modern design matching the project theme
- ✅ Form validation
- ✅ Loading states
- ✅ Success/Error messages
- ✅ Responsive layout
- ✅ Email notifications via Web3Forms
- ✅ No backend required

### Testing

1. Get your Access Key from Web3Forms
2. Update the key in Contact.jsx
3. Navigate to `/contact` in your application
4. Fill out and submit the form
5. Check the email address you configured in Web3Forms

### Contact Information

Update the contact information in the Contact.jsx file:
- Email: cortexsoft@gmail.com (line ~128)
- Phone: +92 (300) 123-4567 (line ~138)
- Location: Islamabad, Pakistan (line ~148)
- Business Hours (lines ~157-159)

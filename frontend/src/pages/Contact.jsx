import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send to backend API
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>We'd love to hear from you</p>
      </div>

      <div style={styles.content}>
        <div style={styles.left}>
          <h2 style={styles.sectionTitle}>Get in Touch</h2>
          <div style={styles.info}>
            <div style={styles.infoItem}>
              <h3 style={styles.infoTitle}>Email</h3>
              <p style={styles.infoText}>support@templatemarket.com</p>
            </div>
            <div style={styles.infoItem}>
              <h3 style={styles.infoTitle}>Business Hours</h3>
              <p style={styles.infoText}>Monday - Friday: 9:00 AM - 6:00 PM</p>
            </div>
            <div style={styles.infoItem}>
              <h3 style={styles.infoTitle}>Response Time</h3>
              <p style={styles.infoText}>We typically respond within 24 hours</p>
            </div>
          </div>
        </div>

        <div style={styles.right}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {submitted && (
              <div style={styles.success}>
                Thank you! We'll get back to you soon.
              </div>
            )}
            
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={styles.input}
              required
            />
            
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={styles.input}
              required
            />
            
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              style={styles.input}
              required
            />
            
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              style={styles.textarea}
              rows="6"
              required
            />
            
            <button type="submit" style={styles.button}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '60px 20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  title: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1e293b'
  },
  subtitle: {
    fontSize: '20px',
    color: '#64748b'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px'
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1e293b'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  infoItem: {
    padding: '24px',
    background: '#ffffff',
    borderRadius: '8px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)'
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1e293b'
  },
  infoText: {
    fontSize: '14px',
    color: '#64748b'
  },
  right: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  success: {
    background: 'rgba(226, 232, 240, 0.8)',
    color: '#1e293b',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '8px',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  input: {
    padding: '14px 16px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    background: '#ffffff',
    color: '#1e293b'
  },
  textarea: {
    padding: '14px 16px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    background: '#ffffff',
    color: '#1e293b'
  },
  button: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '14px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
  }
};


import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '08e7caa8-b0c1-4ac2-b96c-4df2aa44898c',
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          botcheck: ''
        })
      });

      const result = await response.json();
      
      console.log('Web3Forms Response:', result); // Debug log

      if (result.success) {
        setStatus('success');
        setResponseMessage('Thank you for contacting us! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setResponseMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setResponseMessage(result.message || 'Something went wrong. Please try again.');
        console.error('Web3Forms error:', result);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setResponseMessage('Failed to send message. Please check your internet connection and try again.');
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroShapes}>
          <div style={styles.heroShape1}></div>
          <div style={styles.heroShape2}></div>
        </div>
        
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <MessageSquare size={14} style={{marginRight: '8px'}} />
            Get In Touch
          </div>
          <h1 style={styles.heroTitle}>
            Contact <span style={styles.heroTitleAccent}>Us</span>
          </h1>
          <p style={styles.heroText}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section style={styles.contactSection}>
        <div style={styles.container}>
          <div style={styles.grid}>
            {/* Contact Info */}
            <div style={styles.infoColumn}>
              <h2 style={styles.sectionTitle}>Let's Talk</h2>
              <p style={styles.infoText}>
                Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.
              </p>

              <div style={styles.contactCards}>
                <div style={styles.contactCard}>
                  <div style={styles.iconWrapper}>
                    <Mail size={24} color="#06b6d4" />
                  </div>
                  <div>
                    <h3 style={styles.contactCardTitle}>Email</h3>
                    <p style={styles.contactCardText}>cortexsoft@gmail.com</p>
                  </div>
                </div>

                <div style={styles.contactCard}>
                  <div style={styles.iconWrapper}>
                    <Phone size={24} color="#10b981" />
                  </div>
                  <div>
                    <h3 style={styles.contactCardTitle}>Phone</h3>
                    <p style={styles.contactCardText}>+92 (300) 123-4567</p>
                  </div>
                </div>

                <div style={styles.contactCard}>
                  <div style={styles.iconWrapper}>
                    <MapPin size={24} color="#8b5cf6" />
                  </div>
                  <div>
                    <h3 style={styles.contactCardTitle}>Location</h3>
                    <p style={styles.contactCardText}>Islamabad, Pakistan</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div style={styles.additionalInfo}>
                <h3 style={styles.additionalTitle}>Business Hours</h3>
                <p style={styles.additionalText}>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p style={styles.additionalText}>Saturday: 10:00 AM - 4:00 PM</p>
                <p style={styles.additionalText}>Sunday: Closed</p>
              </div>
            </div>

            {/* Contact Form */}
            <div style={styles.formColumn}>
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>Send us a Message</h2>
                <p style={styles.formSubtitle}>Fill out the form below and we'll get back to you shortly</p>

                {/* Status Messages */}
                {status === 'success' && (
                  <div style={styles.successAlert}>
                    <CheckCircle size={20} />
                    <span>{responseMessage}</span>
                  </div>
                )}

                {status === 'error' && (
                  <div style={styles.errorAlert}>
                    <AlertCircle size={20} />
                    <span>{responseMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                      rows="6"
                      style={styles.textarea}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      ...styles.submitBtn,
                      ...(status === 'loading' ? styles.submitBtnDisabled : {})
                    }}
                    onMouseEnter={(e) => {
                      if (status !== 'loading') {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (status !== 'loading') {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.3)';
                      }
                    }}
                  >
                    {status === 'loading' ? (
                      <>
                        <span style={styles.spinner}></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} style={{marginRight: '8px'}} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#ffffff',
  },

  // Hero Styles
  hero: {
    position: 'relative',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    padding: '120px 20px 80px',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1), transparent)',
    pointerEvents: 'none',
  },
  heroShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  heroShape1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
  },
  heroShape2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-5%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 20px',
    background: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    borderRadius: '50px',
    color: '#06b6d4',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '24px',
    lineHeight: '1.2',
  },
  heroTitleAccent: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroText: {
    fontSize: '20px',
    color: '#94a3b8',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto',
  },

  // Contact Section
  contactSection: {
    padding: '80px 20px',
    background: '#ffffff',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '60px',
    alignItems: 'start',
  },

  // Info Column
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  sectionTitle: {
    fontSize: '40px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '16px',
  },
  infoText: {
    fontSize: '18px',
    color: '#64748b',
    lineHeight: '1.6',
  },
  contactCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  contactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '24px',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  contactCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '4px',
  },
  contactCardText: {
    fontSize: '15px',
    color: '#64748b',
  },
  additionalInfo: {
    padding: '24px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
  },
  additionalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '12px',
  },
  additionalText: {
    fontSize: '15px',
    color: '#64748b',
    marginBottom: '8px',
  },

  // Form Column
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  formCard: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
  },
  formTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  formSubtitle: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
  },

  // Alerts
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    color: '#059669',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '24px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    color: '#dc2626',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '24px',
  },

  // Form Styles
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: '#ffffff',
    color: '#0f172a',
  },
  textarea: {
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: '#ffffff',
    color: '#0f172a',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(6, 182, 212, 0.3)',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '8px',
  },
};

// Add keyframe animation for spinner
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

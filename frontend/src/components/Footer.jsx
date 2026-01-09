import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div style={styles.column}>
            <h3 style={styles.title}>
              Creator<span style={styles.titleAccent}>Box</span>
            </h3>
            <p style={styles.text}>
              Professional website templates and AI-powered website builder
            </p>
          </div>
          
          <div style={styles.column}>
            <h4 style={styles.heading}>Quick Links</h4>
            <Link to="/categories" style={styles.link}>Categories</Link>
            <Link to="/ai-builder" style={styles.link}>AI Builder</Link>
            <Link to="/about" style={styles.link}>About Us</Link>
            <Link to="/contact" style={styles.link}>Contact</Link>
          </div>
          
          <div style={styles.column}>
            <h4 style={styles.heading}>Legal</h4>
            <Link to="/terms" style={styles.link}>Terms & Conditions</Link>
            <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
          </div>
          
          <div style={styles.column}>
            <h4 style={styles.heading}>Connect</h4>
            <p style={styles.text}>Email: cortexsoft@gmail.com</p>
            {/* <p style={styles.text}>Follow us on social media</p> */}
          </div>
        </div>
        
        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} CreatorBox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    color: '#e2e8f0',
    padding: '60px 20px 20px',
    marginTop: '80px',
    boxShadow: 'inset 0 10px 30px rgba(15, 23, 42, 0.6)',
    borderTop: '1px solid rgba(6, 182, 212, 0.2)'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#ffffff',
    letterSpacing: '-0.5px'
  },
  titleAccent: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800'
  },
  heading: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#ffffff'
  },
  text: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.6'
  },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
    padding: '2px 0'
  },
  bottom: {
    borderTop: '1px solid rgba(148, 163, 184, 0.2)',
    paddingTop: '20px',
    textAlign: 'center'
  },
  copyright: {
    fontSize: '14px',
    color: '#64748b'
  }
};


export default function About() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>About Us</h1>
        <p style={styles.subtitle}>Your trusted source for premium website templates</p>
      </div>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Who We Are</h2>
          <p style={styles.text}>
            TemplateMarket is a leading marketplace for premium website templates and 
            AI-powered website generation. We connect talented designers and developers 
            with businesses and individuals looking for professional, high-quality website solutions.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.text}>
            Our mission is to democratize web design by providing access to professional 
            templates and cutting-edge AI technology that makes website creation accessible 
            to everyone, regardless of technical expertise.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>What We Offer</h2>
          <div style={styles.features}>
            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>Premium Templates</h3>
              <p style={styles.featureText}>
                Curated collection of professionally designed templates across various categories
              </p>
            </div>
            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>AI Website Builder</h3>
              <p style={styles.featureText}>
                Generate custom websites instantly using our advanced AI technology
              </p>
            </div>
            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>Quality Assurance</h3>
              <p style={styles.featureText}>
                All templates are reviewed and approved by our expert team
              </p>
            </div>
            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>Support</h3>
              <p style={styles.featureText}>
                Dedicated support team to help you with any questions or issues
              </p>
            </div>
          </div>
        </section>
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
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
  },
  section: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)'
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1e293b'
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#1e293b'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginTop: '24px'
  },
  feature: {
    padding: '24px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '8px',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b'
  },
  featureText: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6'
  }
};


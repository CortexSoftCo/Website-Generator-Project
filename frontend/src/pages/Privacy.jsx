export default function Privacy() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
          <p style={styles.text}>
            We collect information that you provide directly to us, including:
          </p>
          <ul style={styles.list}>
            <li>Name and email address when you create an account</li>
            <li>Payment information when you make a purchase</li>
            <li>Information you provide when contacting us</li>
            <li>Usage data and analytics when you use our website</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
          <p style={styles.text}>
            We use the information we collect to:
          </p>
          <ul style={styles.list}>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Information Sharing</h2>
          <p style={styles.text}>
            We do not sell, trade, or rent your personal information to third parties. We may share 
            your information only in the following circumstances:
          </p>
          <ul style={styles.list}>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>With service providers who assist us in operating our website</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Data Security</h2>
          <p style={styles.text}>
            We implement appropriate security measures to protect your personal information. However, 
            no method of transmission over the Internet is 100% secure, and we cannot guarantee 
            absolute security.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Cookies</h2>
          <p style={styles.text}>
            We use cookies to enhance your experience on our website. You can choose to disable 
            cookies through your browser settings, though this may affect website functionality.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Your Rights</h2>
          <p style={styles.text}>
            You have the right to:
          </p>
          <ul style={styles.list}>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Children's Privacy</h2>
          <p style={styles.text}>
            Our service is not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Changes to This Policy</h2>
          <p style={styles.text}>
            We may update this privacy policy from time to time. We will notify you of any changes 
            by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Contact Us</h2>
          <p style={styles.text}>
            If you have questions about this privacy policy, please contact us at 
            privacy@templatemarket.com
          </p>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
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
    marginBottom: '12px',
    color: '#1e293b'
  },
  lastUpdated: {
    fontSize: '14px',
    color: '#64748b'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  section: {
    background: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1e293b'
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#1e293b',
    marginBottom: '12px'
  },
  list: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#1e293b',
    paddingLeft: '24px',
    marginTop: '12px'
  }
};


export default function Terms() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Terms & Conditions</h1>
        <p style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <p style={styles.text}>
            By accessing and using TemplateMarket, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to these terms, please do not use 
            our service.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Use License</h2>
          <p style={styles.text}>
            Permission is granted to temporarily download one copy of the templates on TemplateMarket's 
            website for personal, non-commercial transitory viewing only. This is the grant of a license, 
            not a transfer of title, and under this license you may not:
          </p>
          <ul style={styles.list}>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on TemplateMarket's website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Purchases and Payments</h2>
          <p style={styles.text}>
            When you purchase a template, you are purchasing a license to use that template. 
            All sales are final. Refunds may be considered on a case-by-case basis within 30 days 
            of purchase if the template does not function as described.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. User Accounts</h2>
          <p style={styles.text}>
            You are responsible for maintaining the confidentiality of your account and password. 
            You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Seller Responsibilities</h2>
          <p style={styles.text}>
            Sellers are responsible for ensuring their templates are original, do not infringe on 
            any copyrights, and function as described. TemplateMarket reserves the right to remove 
            any template that violates these terms.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Limitation of Liability</h2>
          <p style={styles.text}>
            TemplateMarket shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Changes to Terms</h2>
          <p style={styles.text}>
            TemplateMarket reserves the right to modify these terms at any time. We will notify 
            users of any significant changes via email or through our website.
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


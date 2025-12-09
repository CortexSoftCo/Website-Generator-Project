import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import { getUserPurchases } from '../api';

export default function BuyerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadPurchases();
  }, [user]);

  const loadPurchases = async () => {
    try {
      const res = await getUserPurchases();
      setPurchases(res.data.purchases);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (templateId) => {
    window.open(`http://localhost:5000/api/templates/${templateId}/download`, '_blank');
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Purchases</h1>
      
      {purchases.length === 0 ? (
        <div style={styles.empty}>
          <h2 style={styles.emptyTitle}>No purchases yet</h2>
          <p style={styles.emptyText}>Start browsing our templates!</p>
          <Link to="/categories" style={styles.btnPrimary}>
            Browse Templates
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {purchases.map(purchase => (
            <div key={purchase.id} style={styles.card}>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{purchase.template.title}</h3>
                <p style={styles.cardDescription}>
                  {purchase.template.description.substring(0, 100)}...
                </p>
                <div style={styles.cardMeta}>
                  <span style={styles.cardPrice}>${purchase.price}</span>
                  <span style={styles.cardDate}>
                    Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div style={styles.cardActions}>
                <Link
                  to={`/template/${purchase.template_id}`}
                  style={styles.viewBtn}
                >
                  View
                </Link>
                <button
                  onClick={() => handleDownload(purchase.template_id)}
                  style={styles.downloadBtn}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '32px',
    color: '#1e293b'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  card: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)'
  },
  cardContent: {
    padding: '24px',
    flex: 1
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
    marginBottom: '16px'
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#64748b'
  },
  cardPrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b'
  },
  cardDate: {
    fontSize: '12px'
  },
  cardActions: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(226, 232, 240, 0.8)',
    display: 'flex',
    gap: '12px'
  },
  viewBtn: {
    flex: 1,
    padding: '10px',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  downloadBtn: {
    flex: 1,
    padding: '10px',
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)'
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px'
  },
  emptyTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b'
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '24px'
  },
  btnPrimary: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
  }
};


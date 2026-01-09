import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store';
import { createPurchase } from '../api';
import { useAuthStore } from '../store';

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    // Navigate to payment page with cart details
    navigate('/payment', {
      state: {
        amount: total,
        template_id: items.map(item => item.id),
        purchase_type: 'cart',
        items: items
      }
    });
  };

  if (items.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>Add some templates to get started!</p>
          <Link to="/categories" style={styles.btnPrimary}>
            Browse Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>
      
      <div style={styles.content}>
        <div style={styles.items}>
          {items.map(item => (
            <div key={item.id} style={styles.item}>
              <div style={styles.itemInfo}>
                <h3 style={styles.itemTitle}>{item.title}</h3>
                <p style={styles.itemDescription}>
                  {item.description.substring(0, 100)}...
                </p>
                <div style={styles.itemMeta}>
                  <span style={styles.itemPrice}>${item.price}</span>
                  <span style={styles.itemRating}>{item.rating.toFixed(1)}</span>
                </div>
              </div>
              <div style={styles.itemActions}>
                <Link to={`/template/${item.id}`} style={styles.viewLink}>
                  View
                </Link>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Subtotal ({items.length} items)</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <div style={styles.summaryTotal}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            style={styles.checkoutBtn}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          <Link to="/categories" style={styles.continueLink}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '32px'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '40px'
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  item: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)'
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1e293b'
  },
  itemDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '12px',
    lineHeight: '1.5'
  },
  itemMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px'
  },
  itemPrice: {
    fontWeight: '600',
    fontSize: '18px',
    color: '#1e293b'
  },
  itemRating: {
    color: '#64748b'
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  viewLink: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  removeBtn: {
    padding: '8px 16px',
    background: 'rgba(226, 232, 240, 0.8)',
    color: '#1e293b',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  summary: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '20px',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)'
  },
  summaryTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1e293b'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
    fontSize: '14px',
    color: '#64748b'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0',
    fontSize: '18px',
    fontWeight: '700',
    borderTop: '2px solid #1e293b',
    marginTop: '8px',
    color: '#1e293b'
  },
  checkoutBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
  },
  continueLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '12px',
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '14px'
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


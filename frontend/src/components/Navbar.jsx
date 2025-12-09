import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../store';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⬡</span>
          TemplateHub
        </Link>
        
        <div style={styles.links}>
          <Link to="/categories" style={styles.link}>Categories</Link>
          <Link to="/ai-builder" style={styles.link}>AI Builder</Link>
          
          {!user ? (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.btnPrimary}>Get Started</Link>
            </>
          ) : (
            <>
              <Link to="/cart" style={styles.link}>
                Cart {items.length > 0 && `(${items.length})`}
              </Link>
              
              {user.role === 'seller' && (
                <Link to="/seller/dashboard" style={styles.link}>Dashboard</Link>
              )}
              
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" style={styles.link}>Admin</Link>
              )}
              
              {user.role === 'buyer' && (
                <Link to="/buyer/dashboard" style={styles.link}>My Purchases</Link>
              )}
              
              <button onClick={handleLogout} style={styles.btnSecondary}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.2), 0 2px 8px rgba(6, 182, 212, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '18px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#ffffff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '-0.5px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    textShadow: '0 2px 10px rgba(6, 182, 212, 0.3)'
  },
  logoIcon: {
    fontSize: '28px',
    color: '#06b6d4',
    filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))'
  },
  links: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center'
  },
  link: {
    color: '#e2e8f0',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    padding: '8px 12px',
    borderRadius: '8px',
    position: 'relative'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #06b6d4 100%)',
    backgroundSize: '200% auto',
    color: '#ffffff',
    padding: '12px 28px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
  },
  btnSecondary: {
    background: 'rgba(226, 232, 240, 0.1)',
    color: '#e2e8f0',
    padding: '10px 24px',
    borderRadius: '10px',
    border: '1.5px solid rgba(226, 232, 240, 0.3)',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};
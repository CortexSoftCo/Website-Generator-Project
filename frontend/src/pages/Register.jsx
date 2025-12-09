import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { useAuthStore } from '../store';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'buyer',
    business_name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await register(formData);
      setAuth(res.data.user, res.data.token);
      
      if (formData.role === 'seller') navigate('/seller/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={styles.input}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={styles.input}
            required
          />
          
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            style={styles.input}
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          
          {formData.role === 'seller' && (
            <>
              <input
                type="text"
                placeholder="Business Name"
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                style={styles.input}
                required
              />
              
              <textarea
                placeholder="Business Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={styles.textarea}
                rows="3"
              />
            </>
          )}
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  card: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#1e293b'
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    border: '1px solid rgba(220, 38, 38, 0.3)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    padding: '14px 18px',
    border: '2px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    background: '#f8fafc',
    color: '#1e293b',
    transition: 'all 0.3s ease'
  },
  textarea: {
    padding: '14px 18px',
    border: '2px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    background: '#f8fafc',
    color: '#1e293b',
    transition: 'all 0.3s ease'
  },
  button: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 6px 20px rgba(6, 182, 212, 0.3)',
    transition: 'all 0.3s ease'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b'
  },
  link: {
    color: '#06b6d4',
    fontWeight: '700',
    textDecoration: 'none'
  }
};
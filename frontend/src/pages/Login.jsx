import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { useAuthStore } from '../store';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(formData);
      setAuth(res.data.user, res.data.token);
      
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.data.user.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundShapes}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>
      
      <div style={styles.card}>
        <div style={styles.headerBar}></div>
        
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to continue your journey</p>
        
        {error && (
          <div style={styles.error}>
            <div style={styles.errorBar}></div>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={{
              ...styles.inputWrapper,
              ...(focusedField === 'email' ? styles.inputWrapperFocused : {})
            }}>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
                required
              />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={{
              ...styles.inputWrapper,
              ...(focusedField === 'password' ? styles.inputWrapperFocused : {})
            }}>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            style={styles.button} 
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(6, 182, 212, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.3)';
            }}
          >
            {loading ? (
              <span style={styles.loadingSpinner}>
                <span style={styles.spinner}></span>
                Logging in...
              </span>
            ) : (
              <>Sign In →</>
            )}
          </button>
        </form>
        
        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine}></span>
        </div>
        
        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Create one now</Link>
        </p>
      </div>
      
      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0
  },
  shape1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
    top: '-200px',
    right: '-200px',
    animation: 'float 8s ease-in-out infinite'
  },
  shape2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
    bottom: '-150px',
    left: '-150px',
    animation: 'float 10s ease-in-out infinite'
  },
  shape3: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'float 12s ease-in-out infinite'
  },
  card: {
    background: '#ffffff',
    backdropFilter: 'blur(20px)',
    padding: '50px 40px',
    borderRadius: '24px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 1,
    animation: 'fadeInUp 0.6s ease-out'
  },
  headerBar: {
    height: '4px',
    background: 'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 50%, #10b981 100%)',
    borderRadius: '2px',
    marginBottom: '32px',
    boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    textAlign: 'center',
    color: '#1e293b',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '32px',
    fontWeight: '500'
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#991b1b',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    border: '1px solid rgba(220, 38, 38, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
  },
  errorBar: {
    height: '3px',
    background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
    borderRadius: '2px',
    marginBottom: '4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    letterSpacing: '0.3px'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    border: '2px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    background: '#f8fafc',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)'
  },
  inputWrapperFocused: {
    border: '2px solid #06b6d4',
    background: '#ffffff',
    boxShadow: '0 4px 16px rgba(6, 182, 212, 0.15)',
    transform: 'translateY(-1px)'
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    background: 'transparent',
    color: '#1e293b',
    fontWeight: '500'
  },
  button: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 6px 20px rgba(6, 182, 212, 0.3)',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px'
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.6s linear infinite'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(203, 213, 225, 0.5), transparent)'
  },
  dividerText: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: '1px'
  },
  footer: {
    textAlign: 'center',
    fontSize: '15px',
    color: '#64748b',
    fontWeight: '500'
  },
  link: {
    color: '#06b6d4',
    fontWeight: '700',
    textDecoration: 'none',
    borderBottom: '2px solid transparent',
    transition: 'border-color 0.3s',
    paddingBottom: '2px'
  }
};
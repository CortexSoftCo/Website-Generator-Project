import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTemplates, getCategories } from '../api';
import TemplateCard from '../components/TemplateCard';

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesRes, categoriesRes] = await Promise.all([
        getTemplates({ status: 'approved' }),
        getCategories()
      ]);
      setTemplates(templatesRes.data.templates.slice(0, 6));
      setCategories(categoriesRes.data.categories);
    } catch (err) {
      console.error(err);
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
          <div style={styles.heroShape3}></div>
        </div>
        
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Premium Templates</div>
          <h1 className="hero-title" style={styles.heroTitle}>
            Build Your Dream Website
            <span style={styles.heroTitleAccent}> In Minutes</span>
          </h1>
          <p style={styles.heroText}>
            Choose from thousands of professionally designed templates or let our AI create a custom website tailored to your vision
          </p>
          <div style={styles.heroButtons}>
            <Link 
              to="/categories" 
              style={styles.btnPrimary}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(6, 182, 212, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(6, 182, 212, 0.3)';
              }}
            >
              Explore Templates →
            </Link>
            <Link 
              to="/ai-builder" 
              style={styles.btnSecondary}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Try AI Builder
            </Link>
          </div>
          
          <div style={styles.heroStats}>
            <div style={styles.statItem}>
              <div className="stat-number" style={styles.statNumber}>10K+</div>
              <div style={styles.statLabel}>Templates</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <div className="stat-number" style={styles.statNumber}>50K+</div>
              <div style={styles.statLabel}>Happy Users</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>4.9/5</div>
              <div style={styles.statLabel}>Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Browse by Category</h2>
          <p style={styles.sectionSubtitle}>Find the perfect template for your project</p>
        </div>
        <div style={styles.categoriesGrid}>
          {categories.map((cat, index) => {
            const categoryInfo = {
              'business': { icon: '▦', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#667eea' },
              'portfolio': { icon: '◆', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#f093fb' },
              'ecommerce': { icon: '◉', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#06b6d4' },
              'blog': { icon: '▣', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#10b981' },
              'landing': { icon: '▲', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#f59e0b' },
              'dashboard': { icon: '▧', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#8b5cf6' }
            };
            const info = categoryInfo[cat.slug] || { icon: '◈', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: '#ec4899' };
            
            return (
              <Link 
                key={cat.id} 
                to={`/category/${cat.slug}`} 
                style={{
                  ...styles.categoryCard,
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.25)';
                  const iconEl = e.currentTarget.querySelector('.category-icon');
                  iconEl.style.transform = 'scale(1.3) rotate(10deg)';
                  const bgEl = e.currentTarget.querySelector('.category-bg');
                  bgEl.style.transform = 'scale(1.2)';
                  bgEl.style.opacity = '0.2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                  const iconEl = e.currentTarget.querySelector('.category-icon');
                  iconEl.style.transform = 'scale(1) rotate(0deg)';
                  const bgEl = e.currentTarget.querySelector('.category-bg');
                  bgEl.style.transform = 'scale(1)';
                  bgEl.style.opacity = '0.1';
                }}
              >
                <div className="category-bg" style={{
                  ...styles.categoryBg,
                  background: info.gradient
                }}></div>
                <div className="category-icon" style={styles.categoryIcon}>{info.icon}</div>
                <h3 style={styles.categoryName}>{cat.name}</h3>
                <div style={styles.categoryArrow}>→</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Templates Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.trendingBadge}>Hot</div>
          <h2 style={styles.sectionTitle}>Trending Templates</h2>
          <p style={styles.sectionSubtitle}>Most popular designs this month</p>
        </div>
        <div style={styles.templatesGrid}>
          {templates.map((template, index) => (
            <div 
              key={template.id}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <TemplateCard template={template} />
            </div>
          ))}
        </div>
        <div style={styles.center}>
          <Link 
            to="/categories" 
            style={styles.btnViewAll}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(55, 53, 62, 0.4)';
              e.currentTarget.querySelector('.arrow').style.transform = 'translateX(6px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(55, 53, 62, 0.3)';
              e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
            }}
          >
            View All Templates <span className="arrow" style={styles.arrow}>→</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{...styles.section, ...styles.featuresSection}}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Why Choose Us</h2>
          <p style={styles.sectionSubtitle}>Everything you need to succeed online</p>
        </div>
        <div style={styles.featuresGrid}>
          {[
            { title: 'Premium Quality', text: 'Every template is professionally designed with pixel-perfect attention to detail', color: '#fbbf24' },
            { title: 'AI-Powered', text: 'Generate custom websites instantly with our advanced AI technology', color: '#8b5cf6' },
            { title: 'Fair Pricing', text: 'Affordable one-time payments with lifetime access and free updates', color: '#10b981' },
            { title: 'Fully Responsive', text: 'Beautiful on every device from mobile phones to 4K displays', color: '#3b82f6' },
            { title: 'Easy Customize', text: 'Drag-and-drop editor makes customization simple for everyone', color: '#f43f5e' },
            { title: 'Fast Loading', text: 'Optimized code ensures lightning-fast performance for all users', color: '#06b6d4' }
          ].map((feature, index) => (
            <div 
              key={index}
              style={{
                ...styles.featureCard,
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)';
                const barEl = e.currentTarget.querySelector('.feature-bar');
                barEl.style.transform = 'scaleX(1.05)';
                const bgEl = e.currentTarget.querySelector('.feature-bg');
                bgEl.style.transform = 'scale(1.3)';
                bgEl.style.opacity = '0.15';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';
                const barEl = e.currentTarget.querySelector('.feature-bar');
                barEl.style.transform = 'scaleX(1)';
                const bgEl = e.currentTarget.querySelector('.feature-bg');
                bgEl.style.transform = 'scale(1)';
                bgEl.style.opacity = '0.1';
              }}
            >
              <div className="feature-bg" style={{
                ...styles.featureBg,
                background: feature.color
              }}></div>
              <div className="feature-bar" style={{
                ...styles.featureBar,
                background: feature.color
              }}></div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-25px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
`;

const styles = {
  wrapper: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
    minHeight: '100vh'
  },
  hero: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    color: '#ffffff',
    padding: '140px 20px 100px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.12) 0%, transparent 50%)',
    pointerEvents: 'none'
  },
  heroShapes: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  heroShape1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
    top: '-300px',
    right: '-200px',
    animation: 'float 12s ease-in-out infinite'
  },
  heroShape2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
    bottom: '-200px',
    left: '-150px',
    animation: 'float 15s ease-in-out infinite 2s'
  },
  heroShape3: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
    top: '40%',
    left: '10%',
    animation: 'float 18s ease-in-out infinite 4s'
  },
  heroContent: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1
  },
  heroBadge: {
    display: 'inline-block',
    padding: '10px 24px',
    background: 'rgba(6, 182, 212, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    boxShadow: '0 4px 16px rgba(6, 182, 212, 0.2)',
    color: '#ffffff',
    letterSpacing: '0.5px',
    animation: 'fadeInUp 0.6s ease-out'
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: '800',
    marginBottom: '28px',
    lineHeight: '1.1',
    color: '#ffffff',
    letterSpacing: '-1px',
    animation: 'fadeInUp 0.6s ease-out 0.1s both'
  },
  heroTitleAccent: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'block',
    marginTop: '8px'
  },
  heroText: {
    fontSize: '20px',
    color: 'rgba(226, 232, 240, 0.9)',
    marginBottom: '48px',
    lineHeight: '1.7',
    maxWidth: '700px',
    margin: '0 auto 48px',
    animation: 'fadeInUp 0.6s ease-out 0.2s both'
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    animation: 'fadeInUp 0.6s ease-out 0.3s both'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #06b6d4 100%)',
    backgroundSize: '200% auto',
    color: '#ffffff',
    padding: '18px 48px',
    borderRadius: '14px',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '700',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 35px rgba(6, 182, 212, 0.4), 0 0 60px rgba(6, 182, 212, 0.2)',
    border: 'none',
    display: 'inline-block',
    letterSpacing: '0.3px',
    position: 'relative',
    overflow: 'hidden',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  },
  btnSecondary: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    color: '#ffffff',
    padding: '18px 48px',
    borderRadius: '14px',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '700',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    letterSpacing: '0.3px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    marginTop: '64px',
    animation: 'fadeInUp 0.6s ease-out 0.4s both'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '4px',
    letterSpacing: '-0.5px'
  },
  statLabel: {
    fontSize: '14px',
    color: 'rgba(226, 232, 240, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  statDivider: {
    width: '1px',
    height: '50px',
    background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
  },
  section: {
    maxWidth: '1280px',
    margin: '60px auto',
    padding: '80px 40px',
    background: '#ffffff',
    borderRadius: '32px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(0, 0, 0, 0.06)'
  },
  featuresSection: {
    background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '64px',
    position: 'relative'
  },
  trendingBadge: {
    display: 'inline-block',
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    color: '#ffffff',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
    animation: 'pulse 2s ease-in-out infinite'
  },
  sectionTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '16px',
    color: '#1a1a1a',
    letterSpacing: '-1px'
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: '#6b7280',
    fontWeight: '500'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '28px',
    marginBottom: '48px'
  },
  categoryCard: {
    background: '#ffffff',
    padding: '40px 24px',
    borderRadius: '20px',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#1a1a1a',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: '2px solid #f3f4f6',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    position: 'relative',
    overflow: 'hidden',
    animation: 'fadeInUp 0.6s ease-out both'
  },
  categoryBg: {
    position: 'absolute',
    inset: 0,
    opacity: 0.1,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '20px'
  },
  categoryIcon: {
    fontSize: '56px',
    marginBottom: '16px',
    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-block',
    position: 'relative',
    zIndex: 1
  },
  categoryName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '12px',
    letterSpacing: '0.3px',
    position: 'relative',
    zIndex: 1
  },
  categoryArrow: {
    fontSize: '24px',
    color: '#6b7280',
    fontWeight: '700',
    position: 'relative',
    zIndex: 1
  },
  templatesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '32px',
    marginBottom: '56px'
  },
  center: {
    textAlign: 'center'
  },
  btnViewAll: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '18px 48px',
    borderRadius: '14px',
    textDecoration: 'none',
    fontSize: '17px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 6px 16px rgba(6, 182, 212, 0.3)',
    border: 'none',
    letterSpacing: '0.3px'
  },
  arrow: {
    fontSize: '20px',
    transition: 'transform 0.3s ease',
    display: 'inline-block'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px'
  },
  featureCard: {
    textAlign: 'center',
    padding: '40px 32px',
    background: '#ffffff',
    borderRadius: '24px',
    border: '2px solid #f3f4f6',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    animation: 'fadeInUp 0.6s ease-out both'
  },
  featureBg: {
    position: 'absolute',
    inset: 0,
    opacity: 0.1,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '24px'
  },
  featureBar: {
    height: '5px',
    width: '80px',
    borderRadius: '3px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-block',
    position: 'relative',
    zIndex: 1
  },
  featureTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1a1a1a',
    letterSpacing: '0.2px',
    position: 'relative',
    zIndex: 1
  },
  featureText: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.7',
    position: 'relative',
    zIndex: 1
  }
};
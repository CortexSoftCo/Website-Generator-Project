import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getTemplates, getCategories } from '../api';
import TemplateCard from '../components/TemplateCard';
import { 
  Crown, Sparkles, DollarSign, Smartphone, 
  MousePointer, Zap, Shield, Clock, Users, Star, Brain,
  Code, Layout, Palette, Globe, Rocket, Monitor, Layers
} from 'lucide-react';

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFeature, setActiveFeature] = useState(null);
  const featuresRef = useRef(null);

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
          <div style={styles.heroParticles}></div>
        </div>
        
        {/* Floating Icons */}
        <div style={styles.floatingIconsContainer}>
          <div style={{...styles.floatingIcon, ...styles.floatingIcon1}}>
            <Code size={24} color="#06b6d4" />
          </div>
          <div style={{...styles.floatingIcon, ...styles.floatingIcon2}}>
            <Layout size={28} color="#8b5cf6" />
          </div>
          <div style={{...styles.floatingIcon, ...styles.floatingIcon3}}>
            <Palette size={22} color="#f43f5e" />
          </div>
          <div style={{...styles.floatingIcon, ...styles.floatingIcon4}}>
            <Globe size={26} color="#10b981" />
          </div>
          <div style={{...styles.floatingIcon, ...styles.floatingIcon5}}>
            <Rocket size={24} color="#fbbf24" />
          </div>
          <div style={{...styles.floatingIcon, ...styles.floatingIcon6}}>
            <Monitor size={28} color="#3b82f6" />
          </div>
          <div style={{...styles.floatingIcon, ...styles.floatingIcon7}}>
            <Layers size={22} color="#ec4899" />
          </div>
          <div style={{...styles.floatingIcon, ...styles.floatingIcon8}}>
            <Sparkles size={20} color="#06b6d4" />
          </div>
        </div>
        
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            {/* <Sparkles size={14} style={{marginRight: '8px'}} /> */}
            Premium Templates
          </div>
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
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(6, 182, 212, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 35px rgba(6, 182, 212, 0.4)';
              }}
            >
              <span style={{marginRight: '8px'}}>🚀</span> Explore Templates
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
              <Sparkles size={18} style={{marginRight: '8px'}} /> Try AI Builder
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
              <div style={styles.statNumber}>4.9<span style={{fontSize: '20px', color: '#fbbf24'}}>★</span></div>
              <div style={styles.statLabel}>Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={styles.categoriesSection}>
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
              'education': { icon: '◔', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#f59e0b' }
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
      <section style={styles.trendingSection}>
        <div style={styles.trendingParticles}></div>
        
        <div style={styles.trendingSectionHeader}>
          {/* <div style={styles.trendingBadge}>
            <Star size={12} style={{marginRight: '6px'}} />
            Hot
          </div> */}
          <h2 style={styles.trendingSectionTitle}>
            Trending Templates
            <span style={styles.trendingTitleAccent}> This Month</span>
          </h2>
          <p style={styles.trendingSectionSubtitle}>Most popular designs chosen by our community</p>
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

      {/* Why Choose Us - Premium Section */}
      <section ref={featuresRef} style={styles.whyChooseUsSection}>
        <div style={styles.whyChooseContent}>
          {/* Section Header */}
          <div style={styles.whyChooseHeader}>
            {/* <div style={styles.whyChooseBadge}>
              <Star size={14} style={{marginRight: '6px'}} />
              Why Choose Us
            </div> */}
            <h2 style={styles.whyChooseTitle}>
              Everything You Need to Succeed Online
            </h2>
            <p style={styles.whyChooseSubtitle}>
        We combine cutting edge technology with elegant design to create stunning websites that turn visitors into loyal customers.
            </p>
          </div>

          {/* Main Features Grid */}
          <div style={styles.whyChooseGrid}>
            {[
              { 
                icon: '⍟', 
                title: 'Premium Quality', 
                text: 'Every template is professionally designed with pixel-perfect attention to detail and modern aesthetics',
                gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                bgGlow: 'rgba(251, 191, 36, 0.15)',
                stats: '500+ Templates'
              },
              { 
                icon: '⌬', 
                title: 'AI-Powered Magic', 
                text: 'Generate custom websites instantly with our advanced AI technology that understands your vision',
                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                bgGlow: 'rgba(139, 92, 246, 0.15)',
                stats: 'GPT-4 Powered'
              },
              { 
                icon: '€', 
                title: 'Fair & Transparent', 
                text: 'Affordable one-time payments with lifetime access, free updates no hidden fees or any other charges',
                gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                bgGlow: 'rgba(16, 185, 129, 0.15)',
                stats: 'From $29'
              },
              { 
                icon: '📱︎', 
                title: 'Fully Responsive', 
                text: 'Beautiful on every device from mobile phones to 4K displays with fluid animations and best design',
                gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                bgGlow: 'rgba(59, 130, 246, 0.15)',
                stats: '100% Mobile Ready'
              },
              { 
                icon: '☸', 
                title: 'Easy Customization', 
                text: 'Intuitive drag-and-drop editor makes customization simple for everyone, no coding required',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                bgGlow: 'rgba(240, 147, 251, 0.15)',
                stats: 'No Code Needed'
              },
              { 
                icon: '🗲', 
                title: 'Lightning Fast', 
                text: 'Optimized code ensures sub-second load times for exceptional user experience and SEO',
                gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                bgGlow: 'rgba(6, 182, 212, 0.15)',
                stats: '< 1s Load Time'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index}
                  style={{
                    ...styles.whyChooseCard,
                    animationDelay: `${index * 0.1}s`,
                    ...(activeFeature === index ? styles.whyChooseCardActive : {})
                  }}
                  onMouseEnter={(e) => {
                    setActiveFeature(index);
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.25)';
                    const iconEl = e.currentTarget.querySelector('.category-icon');
                    if(iconEl) iconEl.style.transform = 'scale(1.3) rotate(10deg)';
                    const bgEl = e.currentTarget.querySelector('.category-bg');
                    if(bgEl) {
                      bgEl.style.transform = 'scale(1.2)';
                      bgEl.style.opacity = '0.2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    setActiveFeature(null);
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                    const iconEl = e.currentTarget.querySelector('.category-icon');
                    if(iconEl) iconEl.style.transform = 'scale(1) rotate(0deg)';
                    const bgEl = e.currentTarget.querySelector('.category-bg');
                    if(bgEl) {
                      bgEl.style.transform = 'scale(1)';
                      bgEl.style.opacity = '0.1';
                    }
                  }}
                >
                  {/* Background Gradient */}
                  <div className="category-bg" style={{
                    ...styles.categoryBg,
                    background: feature.gradient
                  }}></div>
                  
                  {/* Icon Container */}
                  <div className="category-icon" style={styles.categoryIcon}>
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <div style={styles.featureContent}>
                    <h3 style={styles.whyChooseCardTitle}>{feature.title}</h3>
                    <p style={styles.whyChooseCardText}>{feature.text}</p>
                    
                    {/* Stats Text */}
                    <div style={styles.featureStats}>
                      {feature.stats}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          {/* <div style={styles.trustSection}>
            <div style={styles.trustItem}>
              <Shield size={24} color="#000000" />
              <span style={styles.trustText}>Secure & Reliable</span>
            </div>
            <div style={styles.trustDivider}></div>
            <div style={styles.trustItem}>
              <Clock size={24} color="#000000" />
              <span style={styles.trustText}>24/7 Support</span>
            </div>
            <div style={styles.trustDivider}></div>
            <div style={styles.trustItem}>
              <Users size={24} color="#000000" />
              <span style={styles.trustText}>50K+ Happy Users</span>
            </div>
          </div> */}
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
  
  @keyframes orbFloat1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(30px, -30px) rotate(90deg); }
    50% { transform: translate(0, -50px) rotate(180deg); }
    75% { transform: translate(-30px, -30px) rotate(270deg); }
  }
  
  @keyframes orbFloat2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-40px, 20px) scale(1.1); }
    66% { transform: translate(40px, -20px) scale(0.9); }
  }
  
  @keyframes orbFloat3 {
    0%, 100% { transform: translate(0, 0); opacity: 0.3; }
    50% { transform: translate(20px, 30px); opacity: 0.6; }
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes iconBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes glowPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
  }
  
  @keyframes floatIcon1 {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
    50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
  }
  
  @keyframes floatIcon2 {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
    50% { transform: translateY(-25px) rotate(-8deg); opacity: 0.9; }
  }
  
  @keyframes floatIcon3 {
    0%, 100% { transform: translateX(0) translateY(0); opacity: 0.5; }
    50% { transform: translateX(15px) translateY(-15px); opacity: 0.8; }
  }
  
  @keyframes floatIcon4 {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
    50% { transform: translateY(-18px) scale(1.1); opacity: 0.9; }
  }
  
  @keyframes floatIcon5 {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
    33% { transform: translateY(-12px) rotate(5deg); opacity: 0.7; }
    66% { transform: translateY(-8px) rotate(-5deg); opacity: 0.8; }
  }
  
  @keyframes floatIcon6 {
    0%, 100% { transform: translateX(0) translateY(0); opacity: 0.6; }
    50% { transform: translateX(-10px) translateY(-22px); opacity: 1; }
  }
  
  @keyframes floatIcon7 {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
    50% { transform: translateY(-16px) rotate(8deg); opacity: 0.85; }
  }
  
  @keyframes floatIcon8 {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.55; }
    50% { transform: translateY(-14px) scale(1.05); opacity: 0.9; }
  }
`;

const styles = {
  wrapper: {
    background: '#ffffff',
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
  heroParticles: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(6,182,212,0.4), transparent),
      radial-gradient(2px 2px at 50px 160px, rgba(139,92,246,0.3), transparent),
      radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.3), transparent),
      radial-gradient(2px 2px at 130px 80px, rgba(6,182,212,0.4), transparent),
      radial-gradient(3px 3px at 160px 120px, rgba(139,92,246,0.3), transparent)
    `,
    backgroundRepeat: 'repeat',
    backgroundSize: '200px 200px',
    opacity: 0.6
  },
  floatingIconsContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0
  },
  floatingIcon: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease'
  },
  floatingIcon1: {
    top: '15%',
    left: '8%',
    animation: 'floatIcon1 8s ease-in-out infinite'
  },
  floatingIcon2: {
    top: '25%',
    right: '10%',
    animation: 'floatIcon2 10s ease-in-out infinite 1s'
  },
  floatingIcon3: {
    top: '60%',
    left: '5%',
    animation: 'floatIcon3 9s ease-in-out infinite 0.5s'
  },
  floatingIcon4: {
    top: '70%',
    right: '8%',
    animation: 'floatIcon4 11s ease-in-out infinite 2s'
  },
  floatingIcon5: {
    top: '10%',
    left: '25%',
    animation: 'floatIcon5 7s ease-in-out infinite 1.5s'
  },
  floatingIcon6: {
    top: '45%',
    right: '5%',
    animation: 'floatIcon6 12s ease-in-out infinite 0.8s'
  },
  floatingIcon7: {
    bottom: '15%',
    left: '15%',
    animation: 'floatIcon7 9s ease-in-out infinite 2.5s'
  },
  floatingIcon8: {
    top: '35%',
    left: '3%',
    animation: 'floatIcon8 8s ease-in-out infinite 1.2s'
  },
  heroContent: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 28px',
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
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
  trendingSection: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    color: '#ffffff',
    padding: '100px 40px',
    position: 'relative',
    overflow: 'hidden'
  },
  trendingOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.12) 0%, transparent 50%)',
    pointerEvents: 'none'
  },
  trendingShapes: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  trendingShape1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
    top: '-300px',
    right: '-200px',
    animation: 'float 12s ease-in-out infinite'
  },
  trendingShape2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
    bottom: '-200px',
    left: '-150px',
    animation: 'float 15s ease-in-out infinite 2s'
  },
  trendingShape3: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
    top: '40%',
    left: '10%',
    animation: 'float 18s ease-in-out infinite 4s'
  },
  trendingParticles: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(6,182,212,0.4), transparent),
      radial-gradient(2px 2px at 50px 160px, rgba(139,92,246,0.3), transparent),
      radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.3), transparent),
      radial-gradient(2px 2px at 130px 80px, rgba(6,182,212,0.4), transparent),
      radial-gradient(3px 3px at 160px 120px, rgba(139,92,246,0.3), transparent)
    `,
    backgroundRepeat: 'repeat',
    backgroundSize: '200px 200px',
    opacity: 0.6
  },
  trendingFloatingIconsContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0
  },
  trendingSectionHeader: {
    textAlign: 'center',
    marginBottom: '64px',
    position: 'relative',
    zIndex: 1,
    maxWidth: '1280px',
    margin: '0 auto 64px'
  },
  trendingSectionTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '16px',
    color: '#ffffff',
    letterSpacing: '-1px'
  },
  trendingTitleAccent: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline'
  },
  trendingSectionSubtitle: {
    fontSize: '18px',
    color: 'rgba(226, 232, 240, 0.8)',
    fontWeight: '500'
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
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 22px',
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
    backdropFilter: 'blur(10px)',
    color: '#ffffff',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '16px',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
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
  categoriesSection: {
    maxWidth: '1280px',
    margin: '60px auto',
    padding: '80px 40px',
    background: '#ffffff'
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
    marginBottom: '56px',
    position: 'relative',
    zIndex: 1,
    maxWidth: '1280px',
    margin: '0 auto 56px'
  },
  center: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 1
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
    boxShadow: '0 10px 35px rgba(6, 182, 212, 0.4)',
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
  },
  // Why Choose Us Premium Styles
  whyChooseUsSection: {
    maxWidth: '1280px',
    margin: '60px auto',
    padding: '80px 40px',
    background: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  },
  whyChooseBgElements: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  whyChooseOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.12) 0%, transparent 50%)',
    pointerEvents: 'none'
  },
  floatingOrb1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
    top: '-300px',
    right: '-200px',
    animation: 'float 12s ease-in-out infinite',
    filter: 'blur(40px)'
  },
  floatingOrb2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
    bottom: '-200px',
    left: '-150px',
    animation: 'float 15s ease-in-out infinite 2s',
    filter: 'blur(40px)'
  },
  floatingOrb3: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
    top: '40%',
    left: '10%',
    animation: 'float 18s ease-in-out infinite 4s',
    filter: 'blur(40px)'
  },
  whyChooseParticles: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(6,182,212,0.4), transparent),
      radial-gradient(2px 2px at 50px 160px, rgba(139,92,246,0.3), transparent),
      radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.3), transparent),
      radial-gradient(2px 2px at 130px 80px, rgba(6,182,212,0.4), transparent),
      radial-gradient(3px 3px at 160px 120px, rgba(139,92,246,0.3), transparent)
    `,
    backgroundRepeat: 'repeat',
    backgroundSize: '200px 200px',
    opacity: 0.6,
    pointerEvents: 'none'
  },
  gridPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    opacity: 0.5
  },
  whyChooseContent: {
    position: 'relative',
    zIndex: 1
  },
  whyChooseHeader: {
    textAlign: 'center',
    marginBottom: '80px'
  },
  whyChooseBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#ffffff',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
  },
  whyChooseTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '16px',
    color: '#1a1a1a',
    letterSpacing: '-1px',
    lineHeight: '1.2'
  },
  whyChooseTitleGradient: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline'
  },
  whyChooseSubtitle: {
    fontSize: '18px',
    color: '#6b7280',
    fontWeight: '500',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.7'
  },
  whyChooseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '28px',
    marginBottom: '60px'
  },
  whyChooseCard: {
    background: '#ffffff',
    padding: '36px',
    borderRadius: '20px',
    border: '2px solid #f3f4f6',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    animation: 'fadeInUp 0.6s ease-out both'
  },
  whyChooseCardActive: {
    transform: 'translateY(-12px) scale(1.02)'
  },
  cardGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    opacity: 0,
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none',
    animation: 'glowPulse 3s ease-in-out infinite'
  },
  featureIconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    zIndex: 1
  },
  featureIconEmoji: {
    fontSize: '32px',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  featureContent: {
    position: 'relative',
    zIndex: 1
  },
  whyChooseCardTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1a1a1a',
    letterSpacing: '0.2px'
  },
  whyChooseCardText: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.7',
    marginBottom: '20px'
  },
  featureStats: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: '0.3px',
    marginTop: '8px',
    position: 'relative',
    zIndex: 1
  },
  cardCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100px',
    height: '100px',
    opacity: 0.1,
    borderRadius: '100% 0 24px 0',
    transition: 'opacity 0.4s ease'
  },
  trustSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    flexWrap: 'wrap',
    padding: '32px',
    background: '#f8f9fa',
    borderRadius: '20px',
    border: '1px solid #e5e7eb'
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  trustText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  trustDivider: {
    width: '1px',
    height: '30px',
    background: '#e5e7eb'
  }
};
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function TemplateCard({ template }) {
  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/400x300';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const previewImage = getImageUrl(template.preview_images?.[0]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/template/${template.id}`}
      className="template-card"
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? '0 12px 32px rgba(6, 182, 212, 0.25)' : '0 4px 16px rgba(15, 23, 42, 0.12)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageWrapper}>
        <img
          src={previewImage}
          alt={template.title}
          style={{
            ...styles.image,
            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
          }}
        />
        <div style={{
          ...styles.overlay,
          opacity: isHovered ? 1 : 0
        }}>
          <div style={styles.viewBadge}>View Details</div>
        </div>
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{template.title}</h3>
        <p style={styles.description}>
          {template.description.substring(0, 80)}...
        </p>
        <div style={styles.footer}>
          <div style={styles.rating}>
            <span style={styles.ratingBadge}>{template.rating.toFixed(1)}</span>
            <span style={styles.ratingText}>{template.downloads} downloads</span>
          </div>
          <div style={styles.price}>${template.price}</div>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: '#1e293b',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)',
    position: 'relative',
    display: 'block'
  },
  imageWrapper: {
    width: '100%',
    height: '220px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'brightness(0.98) contrast(1.02)'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(6, 182, 212, 0) 0%, rgba(6, 182, 212, 0.95) 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '20px',
    opacity: 0,
    transition: 'opacity 0.3s',
    pointerEvents: 'none'
  },
  viewBadge: {
    background: '#ffffff',
    color: '#06b6d4',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    border: '2px solid #06b6d4'
  },
  content: {
    padding: '24px',
    background: '#ffffff'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#1e293b',
    letterSpacing: '0.3px'
  },
  description: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '18px',
    lineHeight: '1.6',
    minHeight: '42px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid rgba(226, 232, 240, 0.8)'
  },
  rating: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  ratingBadge: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(6, 182, 212, 0.25)'
  },
  ratingText: {
    fontSize: '12px',
    color: '#94a3b8'
  },
  price: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1e293b'
  }
};
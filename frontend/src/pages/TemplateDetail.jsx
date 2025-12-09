import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTemplate, createPurchase, checkPurchase, createReview, getTemplateReviews, customizeTemplate } from '../api';
import { useAuthStore, useCartStore } from '../store';
import BusinessCustomizationForm from '../components/BusinessCustomizationForm';

export default function TemplateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const [template, setTemplate] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [purchased, setPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCustomizationForm, setShowCustomizationForm] = useState(false);
  const [customizing, setCustomizing] = useState(false);

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    try {
      const res = await getTemplate(id);
      setTemplate(res.data.template);

      // Load reviews
      const reviewsRes = await getTemplateReviews(id);
      setReviews(reviewsRes.data.reviews);

      // Check if purchased
      if (user) {
        try {
          const purchaseRes = await checkPurchase(id);
          setPurchased(purchaseRes.data.purchased);
        } catch (err) {
          // Not purchased
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await createPurchase({ template_id: parseInt(id) });
      setPurchased(true);
      alert('Purchase successful! You can now download the template.');
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed');
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(template);
    alert('Added to cart!');
  };

  const handleDownload = () => {
    if (!purchased) {
      alert('Please purchase the template first');
      return;
    }
    // Show customization form instead of direct download
    setShowCustomizationForm(true);
  };

  const handleCustomizationSubmit = async (formData) => {
    setCustomizing(true);
    
    try {
      // Create FormData object
      const data = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'logo' && formData[key]) {
          data.append(key, formData[key]);
        }
      });
      
      // Add logo file if present
      if (formData.logo) {
        data.append('logo', formData.logo);
      }
      
      // Call customization API
      const response = await customizeTemplate(id, data);
      
      // Download the customized template with token
      if (response.data.download_url) {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Authentication token not found. Please log in again.');
          return;
        }
        
        console.log('📥 Starting customized template download...');
        console.log('Download URL:', response.data.download_url);
        console.log('Token available:', !!token);
        
        // Add token to download URL
        const downloadUrl = `http://localhost:5000${response.data.download_url}?token=${encodeURIComponent(token)}`;
        console.log('Full download URL:', downloadUrl.substring(0, 100) + '...');
        
        // Open download in new window
        const downloadWindow = window.open(downloadUrl, '_blank');
        
        if (!downloadWindow) {
          console.warn('Popup blocked, trying direct navigation...');
          window.location.href = downloadUrl;
        }
        
        setShowCustomizationForm(false);
        alert('Template customized and downloaded successfully!');
      }
    } catch (err) {
      console.error('Customization error:', err);
      alert(err.response?.data?.error || 'Failed to customize template');
    } finally {
      setCustomizing(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!purchased) {
      alert('You must purchase the template before reviewing');
      return;
    }

    try {
      await createReview({
        template_id: parseInt(id),
        ...reviewForm
      });
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      loadTemplate(); // Reload to get updated reviews
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!template) {
    return <div style={styles.error}>Template not found</div>;
  }

  // Build preview URL - try to find index.html in template folder
  const previewUrl = `http://localhost:5000/api/templates/${id}/preview`;


  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.left}>
          <div style={styles.preview}>
            {previewUrl ? (
              <iframe
                src={`http://localhost:5000/api/templates/${id}/preview`}
                style={styles.iframe}
                title="Template Preview"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-popups-to-escape-sandbox"
              />
            ) : (
              <div style={styles.noPreview}>Preview not available</div>
            )}
          </div>

          {template.preview_images && template.preview_images.length > 0 && (
            <div style={styles.imageGallery}>
              {template.preview_images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.startsWith('http') ? img : `http://localhost:5000${img.startsWith('/') ? '' : '/'}${img}`}
                  alt={`Preview ${idx + 1}`}
                  style={styles.galleryImage}
                />
              ))}
            </div>
          )}
        </div>

        <div style={styles.right}>
          <h1 style={styles.title}>{template.title}</h1>
          <div style={styles.meta}>
            <span style={styles.rating}>{template.rating.toFixed(1)}</span>
            <span style={styles.downloads}>{template.downloads} downloads</span>
            <span style={styles.views}>{template.views} views</span>
          </div>

          <p style={styles.description}>{template.description}</p>

          <div style={styles.priceSection}>
            <div style={styles.price}>${template.price}</div>
            {purchased ? (
              <button onClick={handleDownload} style={styles.btnPrimary}>
                Download Template
              </button>
            ) : (
              <>
                <button onClick={handlePurchase} style={styles.btnPrimary}>
                  Buy Now
                </button>
                <button onClick={handleAddToCart} style={styles.btnSecondary}>
                  Add to Cart
                </button>
              </>
            )}
          </div>

          {purchased && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              style={styles.btnSecondary}
            >
              Write a Review
            </button>
          )}

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
              <h3>Write a Review</h3>
              <div style={styles.ratingInput}>
                <label>Rating: </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  style={styles.select}
                >
                  {[1, 2, 3, 4, 5].map(r => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Write your review..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                style={styles.textarea}
                rows="4"
              />
              <div style={styles.reviewActions}>
                <button type="submit" style={styles.btnPrimary}>Submit Review</button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  style={styles.btnSecondary}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div style={styles.reviews}>
            <h3 style={styles.reviewsTitle}>Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p style={styles.noReviews}>No reviews yet</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} style={styles.reviewItem}>
                  <div style={styles.reviewHeader}>
                    <span style={styles.reviewRating}>{review.rating}</span>
                    <span style={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p style={styles.reviewComment}>{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Business Customization Form Modal */}
      {showCustomizationForm && (
        <BusinessCustomizationForm
          onSubmit={handleCustomizationSubmit}
          onCancel={() => setShowCustomizationForm(false)}
          loading={customizing}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px'
  },
  error: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#c33'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '40px'
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  preview: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    overflow: 'hidden',
    height: '600px',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)'
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none'
  },
  noPreview: {
    padding: '60px',
    textAlign: 'center',
    color: '#64748b',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
  },
  imageGallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '12px'
  },
  galleryImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
    transition: 'transform 0.2s'
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1e293b',
    textShadow: '0 1px 2px rgba(15, 23, 42, 0.12)'
  },
  meta: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#64748b'
  },
  rating: {
    fontWeight: '600',
    color: '#64748b'
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#1e293b'
  },
  priceSection: {
    padding: '24px',
    background: '#ffffff',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)',
    gap: '12px'
  },
  price: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1e293b',
    textShadow: '0 1px 2px rgba(15, 23, 42, 0.12)'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
  },
  btnSecondary: {
    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    color: '#ffffff',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #64748b',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 2px 6px rgba(100, 116, 139, 0.3)'
  },
  reviewForm: {
    padding: '24px',
    background: '#ffffff',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)'
  },
  ratingInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  select: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    background: '#ffffff',
    color: '#1e293b'
  },
  textarea: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    background: '#ffffff',
    color: '#1e293b'
  },
  reviewActions: {
    display: 'flex',
    gap: '12px'
  },
  reviews: {
    marginTop: '24px'
  },
  reviewsTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1e293b'
  },
  noReviews: {
    color: '#64748b',
    fontStyle: 'italic'
  },
  reviewItem: {
    padding: '16px',
    background: '#ffffff',
    borderRadius: '8px',
    marginBottom: '12px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.12)'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  reviewRating: {
    fontWeight: '600',
    color: '#64748b'
  },
  reviewDate: {
    fontSize: '12px',
    color: '#64748b'
  },
  reviewComment: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#1e293b'
  }
};


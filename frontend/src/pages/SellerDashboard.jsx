import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import { getSellerTemplates, getSellerStats, getSellerProfile, getCategories, deleteSellerTemplate } from '../api';
import { uploadTemplate, uploadImages, createTemplate } from '../api';

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    demo_url: '',
    file: null,
    images: []
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [templatesRes, statsRes, profileRes, categoriesRes] = await Promise.all([
        getSellerTemplates(),
        getSellerStats(),
        getSellerProfile(),
        getCategories()
      ]);
      setTemplates(templatesRes.data.templates);
      setStats(statsRes.data.stats);
      setProfile(profileRes.data.seller);
      setCategories(categoriesRes.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData({...uploadData, file: e.target.files[0]});
  };

  const handleImagesChange = (e) => {
    setUploadData({...uploadData, images: Array.from(e.target.files)});
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload template file
      const formData = new FormData();
      formData.append('file', uploadData.file);
      const fileRes = await uploadTemplate(formData);

      // Upload images
      let imageUrls = [];
      if (uploadData.images.length > 0) {
        const imageFormData = new FormData();
        uploadData.images.forEach(img => imageFormData.append('images', img));
        const imagesRes = await uploadImages(imageFormData);
        imageUrls = imagesRes.data.images;
      }

      // Create template record
      await createTemplate({
        title: uploadData.title,
        description: uploadData.description,
        price: parseFloat(uploadData.price),
        category_id: parseInt(uploadData.category_id),
        demo_url: uploadData.demo_url,
        file_path: fileRes.data.file_path,
        preview_images: imageUrls
      });

      alert('Template uploaded successfully! Waiting for admin approval.');
      setShowUploadForm(false);
      setUploadData({
        title: '',
        description: '',
        price: '',
        category_id: '',
        demo_url: '',
        file: null,
        images: []
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteSellerTemplate(templateId);
      alert('Template deleted successfully');
      loadData();
    } catch (err) {
      alert('Failed to delete template');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Seller Dashboard</h1>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          style={styles.btnPrimary}
        >
          {showUploadForm ? 'Cancel' : '+ Upload Template'}
        </button>
      </div>

      {showUploadForm && (
        <div style={styles.uploadForm}>
          <h2 style={styles.formTitle}>Upload New Template</h2>
          <form onSubmit={handleUpload} style={styles.form}>
            <input
              type="text"
              placeholder="Template Title"
              value={uploadData.title}
              onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Description"
              value={uploadData.description}
              onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
              style={styles.textarea}
              rows="4"
              required
            />
            <div style={styles.row}>
              <input
                type="number"
                placeholder="Price"
                value={uploadData.price}
                onChange={(e) => setUploadData({...uploadData, price: e.target.value})}
                style={styles.input}
                required
                step="0.01"
              />
              <select
                value={uploadData.category_id}
                onChange={(e) => setUploadData({...uploadData, category_id: e.target.value})}
                style={styles.input}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <input
              type="url"
              placeholder="Demo URL (optional)"
              value={uploadData.demo_url}
              onChange={(e) => setUploadData({...uploadData, demo_url: e.target.value})}
              style={styles.input}
            />
            <label style={styles.fileLabel}>
              Template ZIP File
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                required
              />
            </label>
            <label style={styles.fileLabel}>
              Preview Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
              />
            </label>
            <button type="submit" style={styles.submitBtn} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Template'}
            </button>
          </form>
        </div>
      )}

      {stats && (
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3 style={styles.statValue}>${stats.revenue.toFixed(2)}</h3>
            <p style={styles.statLabel}>Total Revenue</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statValue}>{stats.total_templates}</h3>
            <p style={styles.statLabel}>Templates</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statValue}>{stats.total_downloads}</h3>
            <p style={styles.statLabel}>Downloads</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statValue}>{stats.total_views}</h3>
            <p style={styles.statLabel}>Total Views</p>
          </div>
        </div>
      )}

      <div style={styles.templates}>
        <h2 style={styles.sectionTitle}>My Templates</h2>
        {templates.length === 0 ? (
          <p style={styles.empty}>No templates uploaded yet</p>
        ) : (
          <div style={styles.grid}>
            {templates.map(template => (
              <div key={template.id} style={styles.templateCard}>
                <h3 style={styles.templateTitle}>{template.title}</h3>
                <p style={styles.templateStatus}>
                  Status: <span style={{
                    color: template.status === 'approved' ? '#0a0' : 
                           template.status === 'pending' ? '#fa0' : '#c33'
                  }}>
                    {template.status}
                  </span>
                </p>
                <p style={styles.templatePrice}>${template.price}</p>
                <div style={styles.templateMeta}>
                  <span>Views: {template.views}</span>
                  <span>Downloads: {template.downloads}</span>
                </div>
                <div style={styles.templateActions}>
                  <Link to={`/template/${template.id}`} style={styles.viewLink}>
                    View Template
                  </Link>
                  <button
                    onClick={() => handleDelete(template.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1e293b'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)'
  },
  uploadForm: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '40px',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1e293b'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    background: '#ffffff',
    color: '#1e293b'
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    background: '#ffffff',
    color: '#1e293b'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  fileLabel: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#1e293b'
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1e293b'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b'
  },
  templates: {
    marginTop: '40px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1e293b'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  templateCard: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)'
  },
  templateTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b'
  },
  templateStatus: {
    fontSize: '14px',
    marginBottom: '8px',
    color: '#64748b'
  },
  templatePrice: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1e293b'
  },
  templateMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '16px'
  },
  templateActions: {
    display: 'flex',
    gap: '12px'
  },
  viewLink: {
    flex: 1,
    display: 'block',
    textAlign: 'center',
    padding: '10px',
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)'
  },
  deleteBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b'
  }
};


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { 
  getPendingTemplates,
  getTemplates,
  approveTemplate, 
  rejectTemplate,
  deleteAdminTemplate,
  getAllUsers,
  getAdminStats,
  verifyUser,
  getCategories
} from '../api';
import { uploadTemplate, uploadImages, createTemplate } from '../api';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [pendingTemplates, setPendingTemplates] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    demo_url: '',
    file: null,
    images: [],
    is_editable: false
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [pendingRes, allTemplatesRes, usersRes, statsRes, categoriesRes] = await Promise.all([
        getPendingTemplates(),
        getTemplates(),
        getAllUsers(),
        getAdminStats(),
        getCategories()
      ]);
      setPendingTemplates(pendingRes.data.templates);
      setAllTemplates(allTemplatesRes.data.templates);
      setUsers(usersRes.data.users);
      setStats(statsRes.data.stats);
      setCategories(categoriesRes.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (templateId) => {
    try {
      await approveTemplate(templateId);
      alert('Template approved');
      loadData();
    } catch (err) {
      alert('Failed to approve template');
    }
  };

  const handleReject = async (templateId) => {
    try {
      await rejectTemplate(templateId);
      alert('Template rejected');
      loadData();
    } catch (err) {
      alert('Failed to reject template');
    }
  };

  const handleDelete = async (templateId) => {
    if (!confirm('Are you sure you want to permanently delete this template? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteAdminTemplate(templateId);
      alert('Template deleted successfully');
      loadData();
    } catch (err) {
      alert('Failed to delete template');
    }
  };

  const handleVerify = async (userId) => {
    try {
      await verifyUser(userId);
      alert('User verified');
      loadData();
    } catch (err) {
      alert('Failed to verify user');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      const fileRes = await uploadTemplate(formData);

      let imageUrls = [];
      if (uploadData.images.length > 0) {
        const imageFormData = new FormData();
        uploadData.images.forEach(img => imageFormData.append('images', img));
        const imagesRes = await uploadImages(imageFormData);
        imageUrls = imagesRes.data.images;
      }

      await createTemplate({
        title: uploadData.title,
        description: uploadData.description,
        price: parseFloat(uploadData.price),
        category_id: parseInt(uploadData.category_id),
        demo_url: uploadData.demo_url,
        file_path: fileRes.data.file_path,
        preview_images: imageUrls,
        is_editable: uploadData.is_editable
      });

      alert('Template uploaded successfully!');
      setShowUploadForm(false);
      setUploadData({
        title: '',
        description: '',
        price: '',
        category_id: '',
        demo_url: '',
        file: null,
        images: [],
        is_editable: false
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            ...styles.tab,
            ...(activeTab === 'overview' ? styles.tabActive : {})
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          style={{
            ...styles.tab,
            ...(activeTab === 'templates' ? styles.tabActive : {})
          }}
        >
          Pending Templates ({pendingTemplates.length})
        </button>
        <button
          onClick={() => setActiveTab('allTemplates')}
          style={{
            ...styles.tab,
            ...(activeTab === 'allTemplates' ? styles.tabActive : {})
          }}
        >
          All Templates ({allTemplates.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            ...styles.tab,
            ...(activeTab === 'users' ? styles.tabActive : {})
          }}
        >
          Users
        </button>
      </div>

      {activeTab === 'overview' && (
        <div>
          {stats && (
            <div style={styles.stats}>
              <div style={styles.statCard}>
                <h3 style={styles.statValue}>{stats.total_users}</h3>
                <p style={styles.statLabel}>Total Users</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statValue}>{stats.total_sellers}</h3>
                <p style={styles.statLabel}>Sellers</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statValue}>{stats.total_templates}</h3>
                <p style={styles.statLabel}>Templates</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statValue}>{stats.total_purchases}</h3>
                <p style={styles.statLabel}>Purchases</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statValue}>${stats.total_revenue.toFixed(2)}</h3>
                <p style={styles.statLabel}>Total Revenue</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statValue}>{stats.pending_templates}</h3>
                <p style={styles.statLabel}>Pending Approval</p>
              </div>
            </div>
          )}

          <div style={styles.uploadSection}>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              style={styles.btnPrimary}
            >
              {showUploadForm ? 'Cancel' : '+ Upload Template'}
            </button>

            {showUploadForm && (
              <div style={styles.uploadForm}>
                <h2 style={styles.formTitle}>Upload Template</h2>
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
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={uploadData.is_editable}
                      onChange={(e) => setUploadData({...uploadData, is_editable: e.target.checked})}
                    />
                    Make editable by users (AI-powered editing)
                  </label>
                  <label style={styles.fileLabel}>
                    Template ZIP File
                    <input
                      type="file"
                      accept=".zip"
                      onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                      required
                    />
                  </label>
                  <label style={styles.fileLabel}>
                    Preview Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setUploadData({...uploadData, images: Array.from(e.target.files)})}
                    />
                  </label>
                  <button type="submit" style={styles.submitBtn} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Template'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div>
          {pendingTemplates.length === 0 ? (
            <p style={styles.empty}>No pending templates</p>
          ) : (
            <div style={styles.grid}>
              {pendingTemplates.map(template => (
                <div key={template.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{template.title}</h3>
                  <p style={styles.cardDescription}>{template.description.substring(0, 100)}...</p>
                  <p style={styles.cardPrice}>${template.price}</p>
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => handleApprove(template.id)}
                      style={styles.approveBtn}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(template.id)}
                      style={styles.rejectBtn}
                    >
                      Reject
                    </button>
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
      )}

      {activeTab === 'allTemplates' && (
        <div>
          {allTemplates.length === 0 ? (
            <p style={styles.empty}>No templates found</p>
          ) : (
            <div style={styles.grid}>
              {allTemplates.map(template => (
                <div key={template.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{template.title}</h3>
                  <p style={styles.cardDescription}>{template.description.substring(0, 100)}...</p>
                  <p style={styles.cardPrice}>${template.price}</p>
                  <p style={styles.cardStatus}>
                    Status: <span style={{
                      color: template.status === 'approved' ? '#10b981' : 
                             template.status === 'pending' ? '#f59e0b' : '#ef4444'
                    }}>
                      {template.status}
                    </span>
                  </p>
                  <div style={styles.cardActions}>
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
      )}

      {activeTab === 'users' && (
        <div>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCell}>Email</div>
              <div style={styles.tableCell}>Role</div>
              <div style={styles.tableCell}>Verified</div>
              <div style={styles.tableCell}>Actions</div>
            </div>
            {users.map(u => (
              <div key={u.id} style={styles.tableRow}>
                <div style={styles.tableCell}>{u.email}</div>
                <div style={styles.tableCell}>{u.role}</div>
                <div style={styles.tableCell}>
                  {u.is_verified ? 'Yes' : 'No'}
                </div>
                <div style={styles.tableCell}>
                  {!u.is_verified && (
                    <button
                      onClick={() => handleVerify(u.id)}
                      style={styles.verifyBtn}
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    borderBottom: '2px solid rgba(226, 232, 240, 0.8)'
  },
  tab: {
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#64748b'
  },
  tabActive: {
    color: '#1e293b',
    borderBottomColor: '#06b6d4'
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
  uploadSection: {
    marginTop: '40px'
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
    marginBottom: '20px',
    boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)'
  },
  uploadForm: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    padding: '32px',
    marginTop: '20px',
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
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1e293b'
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  card: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)'
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
    marginBottom: '12px'
  },
  cardPrice: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1e293b'
  },
  cardStatus: {
    fontSize: '14px',
    marginBottom: '16px',
    color: '#64748b',
    fontWeight: '500'
  },
  cardActions: {
    display: 'flex',
    gap: '12px'
  },
  approveBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
  },
  rejectBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    color: '#ffffff',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(100, 116, 139, 0.3)'
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
  table: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    padding: '16px',
    fontWeight: '600',
    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
    color: '#1e293b'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '16px',
    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
    color: '#1e293b'
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center'
  },
  verifyBtn: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(6, 182, 212, 0.3)'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b'
  }
};


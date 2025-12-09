import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { getUserAIWebsites, getAIWebsite, regenerateAIWebsite, deleteAIWebsite, downloadAIWebsite } from '../api';

export default function AIHistory() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [improvements, setImprovements] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWebsites();
  }, [user]);

  const loadWebsites = async () => {
    try {
      const res = await getUserAIWebsites();
      setWebsites(res.data.websites);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewWebsite = async (websiteId) => {
    try {
      const res = await getAIWebsite(websiteId);
      setSelectedWebsite(res.data.website);
      setImprovements('');
    } catch (err) {
      alert('Failed to load website');
    }
  };

  const handleRegenerate = async (e) => {
    e.preventDefault();
    if (!selectedWebsite || !improvements.trim()) return;

    setRegenerating(true);
    try {
      const res = await regenerateAIWebsite(selectedWebsite.id, { improvements });
      setSelectedWebsite(res.data.website);
      alert('Website regenerated successfully!');
      setImprovements('');
      loadWebsites(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.error || 'Regeneration failed');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async (websiteId) => {
    if (!window.confirm('Are you sure you want to delete this website?')) return;

    try {
      await deleteAIWebsite(websiteId);
      alert('Website deleted successfully');
      setSelectedWebsite(null);
      loadWebsites();
    } catch (err) {
      alert('Failed to delete website');
    }
  };

  const handleDownload = (websiteId) => {
    const url = `http://localhost:5000/api/ai/websites/${websiteId}/download`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-website-${websiteId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return <div style={styles.loading}>Loading your websites...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My AI Websites</h1>
        <button
          onClick={() => navigate('/ai-builder')}
          style={styles.btnPrimary}
        >
          + Create New Website
        </button>
      </div>

      <div style={styles.content}>
        {/* Left Sidebar - Website List */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Your Websites ({websites.length})</h2>
          {websites.length === 0 ? (
            <div style={styles.empty}>
              <p>No websites yet. Create your first AI website!</p>
            </div>
          ) : (
            <div style={styles.websiteList}>
              {websites.map((website) => (
                <div
                  key={website.id}
                  style={{
                    ...styles.websiteCard,
                    ...(selectedWebsite?.id === website.id ? styles.websiteCardActive : {})
                  }}
                  onClick={() => handleViewWebsite(website.id)}
                >
                  <div style={styles.websiteCardHeader}>
                    <span style={styles.websiteId}>#{website.id}</span>
                    <span style={styles.websiteDate}>
                      {new Date(website.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={styles.websiteDesc}>
                    {website.description.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Main Area - Preview & Controls */}
        <div style={styles.main}>
          {selectedWebsite ? (
            <>
              <div style={styles.controls}>
                <h2 style={styles.previewTitle}>Website Preview</h2>
                <div style={styles.controlButtons}>
                  <button
                    onClick={() => handleDownload(selectedWebsite.id)}
                    style={styles.btnSecondary}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(selectedWebsite.id)}
                    style={styles.btnDanger}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={styles.description}>
                <h3 style={styles.descTitle}>Original Description:</h3>
                <p style={styles.descText}>{selectedWebsite.description}</p>
              </div>

              <div style={styles.previewContainer}>
                <iframe
                  srcDoc={selectedWebsite.preview}
                  style={styles.iframe}
                  title="Website Preview"
                />
              </div>

              <div style={styles.regenerateSection}>
                <h3 style={styles.regenerateTitle}>Want to improve it?</h3>
                <form onSubmit={handleRegenerate} style={styles.regenerateForm}>
                  <textarea
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    placeholder="Describe the improvements you want (e.g., 'Add a contact form', 'Make it more colorful', 'Add more sections')"
                    style={styles.textarea}
                    rows="4"
                  />
                  <button
                    type="submit"
                    style={styles.btnRegenerate}
                    disabled={regenerating || !improvements.trim()}
                  >
                    {regenerating ? 'Regenerating...' : 'Regenerate Website'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={styles.placeholder}>
              <div style={styles.placeholderCircle}></div>
              <h3 style={styles.placeholderTitle}>Select a website to view</h3>
              <p style={styles.placeholderText}>
                Choose a website from the list to preview, edit, or download it
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  loading: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '18px',
    color: '#64748b'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#1e293b'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
    textDecoration: 'none'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '40px',
    minHeight: '700px'
  },
  sidebar: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    height: 'fit-content',
    maxHeight: '800px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1e293b'
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#64748b',
    fontSize: '14px'
  },
  websiteList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
    maxHeight: '700px'
  },
  websiteCard: {
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s'
  },
  websiteCardActive: {
    borderColor: '#06b6d4',
    background: '#06b6d4',
    color: '#ffffff'
  },
  websiteCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '12px',
    opacity: 0.8
  },
  websiteId: {
    fontWeight: '700'
  },
  websiteDate: {},
  websiteDesc: {
    fontSize: '14px',
    lineHeight: '1.4',
    margin: 0
  },
  main: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  previewTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b'
  },
  controlButtons: {
    display: 'flex',
    gap: '12px'
  },
  btnSecondary: {
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    color: '#1e293b',
    padding: '10px 20px',
    borderRadius: '6px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnDanger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  description: {
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  descTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1e293b'
  },
  descText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.6'
  },
  previewContainer: {
    background: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '500px',
    marginBottom: '24px',
    border: '2px solid rgba(226, 232, 240, 0.8)'
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none'
  },
  regenerateSection: {
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  regenerateTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1e293b'
  },
  regenerateForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  textarea: {
    padding: '14px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '6px',
    fontSize: '15px',
    fontFamily: 'inherit',
    resize: 'vertical',
    background: '#fff'
  },
  btnRegenerate: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: '#fff',
    padding: '14px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
  },
  placeholder: {
    textAlign: 'center',
    padding: '100px 40px',
    color: '#64748b'
  },
  placeholderCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
  },
  placeholderTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b'
  },
  placeholderText: {
    fontSize: '16px',
    maxWidth: '400px',
    margin: '0 auto'
  }
};

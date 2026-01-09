import { useState } from 'react';
import { useAuthStore } from '../store';
import { generateWebsite, regenerateAIWebsite, improvePrompt } from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function AIBuilder() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [improvingPrompt, setImprovingPrompt] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [selectedPage, setSelectedPage] = useState('index.html');

  // Combine HTML with CSS and JS for proper preview
  const getPreviewContent = () => {
    if (!generatedWebsite) return '';
    
    // Get files from the correct location in response
    const files = generatedWebsite.website?.generated_files || generatedWebsite.generated_files || {};
    console.log('Preview files available:', Object.keys(files));
    console.log('Selected page:', selectedPage);
    
    let html = files[selectedPage] || generatedWebsite.preview || '';
    const css = files['styles.css'] || '';
    const js = files['script.js'] || '';
    
    console.log('HTML length:', html.length);
    console.log('CSS length:', css.length);
    console.log('JS length:', js.length);
    
    // Always inject CSS and JS into HTML for proper rendering in iframe
    if (css) {
      // Remove existing link to styles.css and inject inline
      html = html.replace(/<link[^>]*href=["']styles\.css["'][^>]*>/gi, '');
      if (!html.includes('</head>')) {
        html = html.replace('<head>', '<head>\n<style>' + css + '</style>');
      } else {
        html = html.replace('</head>', '<style>' + css + '</style>\n</head>');
      }
    }
    
    if (js) {
      // Remove existing script tag and inject inline
      html = html.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, '');
      if (!html.includes('</body>')) {
        html = html + '<script>' + js + '</script>';
      } else {
        html = html.replace('</body>', '<script>' + js + '</script>\n</body>');
      }
    }
    
    return html;
  };

  const handleImprovePrompt = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description first');
      return;
    }

    setImprovingPrompt(true);
    setError('');

    try {
      const res = await improvePrompt({ prompt: description });
      setDescription(res.data.improved_prompt);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to improve prompt');
    } finally {
      setImprovingPrompt(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedWebsite(null);
    setEditMode(false);

    try {
      const res = await generateWebsite({ description });
      setGeneratedWebsite(res.data);
      
      // Navigate to the generated website page
      if (res.data.website?.id) {
        navigate(`/generated-website/${res.data.website.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate website');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (e) => {
    e.preventDefault();
    
    if (!editDescription.trim()) {
      setError('Please describe what changes you want');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await regenerateAIWebsite(generatedWebsite.id, {
        modification_request: editDescription
      });
      setGeneratedWebsite(res.data);
      setEditDescription('');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to regenerate website');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedWebsite) {
      console.error('No generated website available');
      return;
    }
    
    // Download ZIP file from server with authentication token
    const token = localStorage.getItem('token');
    
    console.log('=== DOWNLOAD DEBUG ===');
    console.log('Generated website object:', generatedWebsite);
    console.log('Download URL from response:', generatedWebsite.download_url);
    console.log('Website ID:', generatedWebsite.website?.id || generatedWebsite.id);
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
    console.log('Token length:', token ? token.length : 0);
    
    if (!token) {
      console.error('❌ No token found in localStorage');
      alert('You are not logged in. Please log in first.');
      return;
    }
    
    // Build download URL
    const downloadUrl = `http://localhost:5000${generatedWebsite.download_url}?token=${encodeURIComponent(token)}`;
    console.log('Full download URL:', downloadUrl.substring(0, 100) + '...');
    console.log('Opening download window...');
    
    // Open in new window
    const newWindow = window.open(downloadUrl, '_blank');
    
    if (!newWindow) {
      console.error('❌ Popup blocked! Trying direct download...');
      window.location.href = downloadUrl;
    } else {
      console.log('✅ Download window opened successfully');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>AI Website Builder</h1>
          <p style={styles.subtitle}>
            Describe your website and let AI create it for you
          </p>
        </div>
        <Link to="/ai-history" style={styles.historyBtn}>
          My Websites
        </Link>
      </div>

      <div style={styles.content}>
        <div style={styles.left}>
          <form onSubmit={handleGenerate} style={styles.form}>
            <label style={styles.label}>
              Describe your website
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: A modern restaurant website with menu, about us, and contact pages. Use a warm color scheme with red and white colors."
              style={styles.textarea}
              rows="8"
              required
            />
            
            <button
              type="button"
              onClick={handleImprovePrompt}
              style={styles.improveBtn}
              disabled={improvingPrompt || !description.trim()}
            >
              {improvingPrompt ? '✨ Improving...' : '✨ Improve Prompt with AI'}
            </button>
            
            <div style={styles.tips}>
              <h3 style={styles.tipsTitle}>Tips for best results:</h3>
              <ul style={styles.tipsList}>
                <li>Describe the type of business or website</li>
                <li>Mention specific pages you want (Home, About, Contact, etc.)</li>
                <li>Specify color preferences (no gradients)</li>
                <li>Describe the style (modern, minimalist, professional, etc.)</li>
                <li>Mention any specific features or sections</li>
              </ul>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button
              type="submit"
              style={styles.generateBtn}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Website'}
            </button>
          </form>
        </div>

        <div style={styles.right}>
          {generatedWebsite ? (
            <div style={styles.preview}>
              <div style={styles.previewHeader}>
                <h3 style={styles.previewTitle}>Generated Website</h3>
                <div style={styles.previewActions}>
                  <button 
                    onClick={() => setEditMode(!editMode)} 
                    style={{...styles.editBtn, ...(editMode ? styles.editBtnActive : {})}}
                  >
                    {editMode ? 'Cancel Edit' : 'Edit with AI'}
                  </button>
                  <button onClick={handleDownload} style={styles.downloadBtn}>
                    Download
                  </button>
                </div>
              </div>
              
              {editMode && (
                <div style={styles.editPanel}>
                  <form onSubmit={handleRegenerate} style={styles.editForm}>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Describe what you want to change... Examples:
• Change the color scheme to blue and white
• Make the header bigger with a hero image
• Add a testimonials section
• Change the font to something more modern
• Add social media icons to the footer"
                      style={styles.editTextarea}
                      rows="3"
                      required
                    />
                    <button
                      type="submit"
                      style={styles.regenerateBtn}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Apply Changes'}
                    </button>
                  </form>
                </div>
              )}
              
              {/* File tabs for multi-page navigation */}
              {generatedWebsite.files && generatedWebsite.files.length > 1 && (
                <div style={styles.fileTabs}>
                  {generatedWebsite.files.filter(f => f.endsWith('.html')).map(file => (
                    <button
                      key={file}
                      onClick={() => setSelectedPage(file)}
                      style={{
                        ...styles.fileTab,
                        ...(selectedPage === file ? styles.fileTabActive : {})
                      }}
                    >
                      {file.replace('.html', '')}
                    </button>
                  ))}
                </div>
              )}
              
              <iframe
                srcDoc={getPreviewContent()}
                style={{...styles.iframe, ...(editMode ? styles.iframeWithEdit : {})}}
                title="Generated Website Preview"
              />
            </div>
          ) : (
            <div style={styles.placeholder}>
              <div style={styles.placeholderCircle}></div>
              <h3 style={styles.placeholderTitle}>Your website will appear here</h3>
              <p style={styles.placeholderText}>
                Enter a description and click "Generate Website" to create your custom website
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
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
    background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, rgba(241, 245, 249, 0.5) 100%)',
    borderRadius: '16px',
    marginTop: '20px',
    marginBottom: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    textAlign: 'center',
    marginBottom: '40px'
  },
  historyBtn: {
    background: '#079EBE',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    whiteSpace: 'nowrap'
  },
  title: {
    fontSize: '42px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1e293b'
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px'
  },
  left: {
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  label: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b'
  },
  textarea: {
    width: '100%',
    padding: '16px',
    border: '2px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.6',
    background: '#ffffff',
    color: '#1e293b',
    transition: 'all 0.3s ease'
  },
  tips: {
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '8px',
    border: '1px solid rgba(203, 213, 225, 0.5)'
  },
  tipsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b'
  },
  tipsList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.8'
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    border: '1px solid rgba(220, 38, 38, 0.3)'
  },
  generateBtn: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 6px 20px rgba(6, 182, 212, 0.3)',
    transition: 'all 0.3s ease'
  },
  improveBtn: {
    background: '#079EBE',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  right: {
    display: 'flex',
    flexDirection: 'column'
  },
  preview: {
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    overflow: 'hidden',
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)'
  },
  previewHeader: {
    padding: '16px',
    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
  },
  previewTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b'
  },
  previewActions: {
    display: 'flex',
    gap: '12px'
  },
  editBtn: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
    transition: 'all 0.3s ease'
  },
  editBtnActive: {
    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    boxShadow: '0 2px 8px rgba(100, 116, 139, 0.3)'
  },
  downloadBtn: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
  },
  editPanel: {
    padding: '16px',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    borderBottom: '1px solid rgba(216, 180, 254, 0.5)'
  },
  editForm: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  editTextarea: {
    flex: 1,
    padding: '12px',
    border: '2px solid rgba(216, 180, 254, 0.5)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.5',
    background: '#ffffff',
    color: '#1e293b',
    minHeight: '80px'
  },
  regenerateBtn: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
    whiteSpace: 'nowrap',
    height: 'fit-content'
  },
  fileTabs: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
    overflowX: 'auto'
  },
  fileTab: {
    padding: '8px 16px',
    background: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#64748b',
    transition: 'all 0.2s ease',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap'
  },
  fileTabActive: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    borderColor: '#06b6d4',
    boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)'
  },
  iframe: {
    flex: 1,
    border: 'none',
    width: '100%'
  },
  iframeWithEdit: {
    maxHeight: 'calc(600px - 180px)'
  },
  placeholder: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    border: '2px dashed rgba(203, 213, 225, 0.6)',
    borderRadius: '12px',
    padding: '60px 40px',
    textAlign: 'center',
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
    position: 'relative'
  },
  placeholderTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b'
  },
  placeholderText: {
    fontSize: '16px',
    color: '#64748b',
    maxWidth: '400px'
  }
};


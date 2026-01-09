import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAIWebsite } from '../api';

export default function GeneratedWebsite() {
  const { websiteId, page } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [websiteData, setWebsiteData] = useState(null);
  const [currentPage, setCurrentPage] = useState(page || 'index.html');

  useEffect(() => {
    loadWebsite();
  }, [websiteId]);

  useEffect(() => {
    if (page) {
      setCurrentPage(page);
    }
  }, [page]);

  // Intercept iframe link clicks to prevent duplication
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Intercept all link clicks inside the iframe
        iframeDoc.addEventListener('click', (e) => {
          const target = e.target.closest('a');
          if (target && target.href) {
            const href = target.getAttribute('href');
            
            // Check if it's a navigation to another HTML page
            if (href && href.endsWith('.html')) {
              e.preventDefault();
              e.stopPropagation();
              
              // Extract the page name and navigate
              const pageName = href.split('/').pop();
              handlePageChange(pageName);
            }
          }
        }, true);
      } catch (err) {
        // Cross-origin or security error - ignore
        console.log('Cannot access iframe content:', err);
      }
    };

    iframe.addEventListener('load', handleIframeLoad);
    
    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [websiteId]);

  const loadWebsite = async () => {
    try {
      setLoading(true);
      const response = await getAIWebsite(websiteId);
      setWebsiteData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load website');
    } finally {
      setLoading(false);
    }
  };

  const getPageContent = () => {
    if (!websiteData?.website?.generated_files) return '';
    
    const files = websiteData.website.generated_files;
    let html = files[currentPage] || files['index.html'] || '';
    const css = files['styles.css'] || '';
    const js = files['script.js'] || '';
    
    // Inject CSS inline
    if (css && html) {
      html = html.replace(/<link[^>]*href=["']styles\.css["'][^>]*>/gi, '');
      if (!html.includes('</head>')) {
        html = html.replace('<head>', '<head>\n<style>' + css + '</style>');
      } else {
        html = html.replace('</head>', '<style>' + css + '</style>\n</head>');
      }
    }
    
    // Inject JS inline
    if (js && html) {
      html = html.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, '');
      if (!html.includes('</body>')) {
        html = html + '<script>' + js + '</script>';
      } else {
        html = html.replace('</body>', '<script>' + js + '</script>\n</body>');
      }
    }

    // Add base tag to handle relative links
    if (html && !html.includes('<base')) {
      html = html.replace('<head>', `<head>\n<base href="/generated-website/${websiteId}/">`);
    }
    
    return html;
  };

  const getAvailablePages = () => {
    if (!websiteData?.website?.generated_files) return [];
    const files = websiteData.website.generated_files;
    return Object.keys(files).filter(file => file.endsWith('.html'));
  };

  const handlePageChange = (pageName) => {
    setCurrentPage(pageName);
    // Force iframe to reload by updating the key
    navigate(`/generated-website/${websiteId}/${pageName}`);
  };

  const handleBackToBuilder = () => {
    navigate('/ai-history');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading your website...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2 style={styles.errorTitle}>Error</h2>
          <p style={styles.errorText}>{error}</p>
          <button onClick={handleBackToBuilder} style={styles.backBtn}>
            Back to My Websites
          </button>
        </div>
      </div>
    );
  }

  const availablePages = getAvailablePages();
  const pageContent = getPageContent();

  return (
    <div style={styles.fullContainer}>
      {/* Header Bar */}
      <div style={styles.header}>
        <button onClick={handleBackToBuilder} style={styles.backButton}>
          ← Back to My Websites
        </button>
      </div>

      {/* Website Content */}
      <div style={styles.websiteContainer}>
        <iframe
          ref={iframeRef}
          key={currentPage}
          srcDoc={pageContent}
          style={styles.iframe}
          title="Generated Website"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}

const styles = {
  fullContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f8fafc'
  },
  header: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderBottom: '3px solid #06b6d4'
  },
  backButton: {
    background: '#ffffff',
    color: '#1e293b',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  websiteContainer: {
    flex: 1,
    overflow: 'hidden',
    background: '#ffffff'
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none'
  },
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  loading: {
    textAlign: 'center'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #06b6d4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  loadingText: {
    fontSize: '18px',
    color: '#64748b',
    fontWeight: '500'
  },
  errorBox: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px'
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: '16px'
  },
  errorText: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '24px'
  },
  backBtn: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTemplates, getCategories } from '../api';
import TemplateCard from '../components/TemplateCard';

export default function Categories() {
  const { slug } = useParams();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  useEffect(() => {
    if (search || selectedCategory) {
      loadTemplates();
    }
  }, [search, selectedCategory]);

  const loadData = async () => {
    try {
      const [templatesRes, categoriesRes] = await Promise.all([
        getTemplates({ status: 'approved' }),
        getCategories()
      ]);
      
      setCategories(categoriesRes.data.categories);
      
      if (slug) {
        const category = categoriesRes.data.categories.find(c => c.slug === slug);
        if (category) {
          setSelectedCategory(category.id);
          setTemplates(templatesRes.data.templates.filter(t => t.category_id === category.id));
        }
      } else {
        setTemplates(templatesRes.data.templates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const params = { status: 'approved', search };
      if (selectedCategory) params.category_id = selectedCategory;
      
      const res = await getTemplates(params);
      setTemplates(res.data.templates);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Browse Templates</h1>
        <p style={styles.subtitle}>Discover premium website templates</p>
      </div>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        
        <div style={styles.categoryFilters}>
          <button
            onClick={() => handleCategoryFilter(null)}
            style={{
              ...styles.filterBtn,
              ...(selectedCategory === null ? styles.filterBtnActive : {})
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== null) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(113, 90, 90, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== null) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            All
          </button>
          {categories.map(cat => {
            const icons = {
              'business': '',
              'portfolio': '',
              'ecommerce': '',
              'blog': '',
              'education': ''
            };
            const icon = icons[cat.slug] || '';
            
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.id)}
                style={{
                  ...styles.filterBtn,
                  ...(selectedCategory === cat.id ? styles.filterBtnActive : {})
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat.id) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(113, 90, 90, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat.id) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <span style={styles.filterIcon}>{icon}</span> {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : templates.length === 0 ? (
        <div style={styles.empty}>No templates found</div>
      ) : (
        <div style={styles.grid}>
          {templates.map((template, index) => (
            <div
              key={template.id}
              style={{
                animation: `fadeInUp 0.6s ease-out ${Math.min(index * 0.1, 1)}s both`
              }}
            >
              <TemplateCard template={template} />
            </div>
          ))}
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
  header: {
    textAlign: 'center',
    marginBottom: '40px'
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
  filters: {
    marginBottom: '40px'
  },
  searchInput: {
    width: '100%',
    padding: '14px 20px',
    border: '2px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '20px',
    outline: 'none',
    background: '#ffffff',
    color: '#1e293b',
    transition: 'all 0.3s ease'
  },
  categoryFilters: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '10px 24px',
    border: '2px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '8px',
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    color: '#1e293b',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)'
  },
  filterBtnActive: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    borderColor: '#06b6d4',
    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
    transform: 'translateY(-1px)'
  },
          grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '28px',
            animation: 'fadeIn 0.5s ease-out'
          },
          filterIcon: {
            marginRight: '8px',
            fontSize: '18px',
            display: 'inline-block',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
          },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#64748b'
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#64748b'
  }
};


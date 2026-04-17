import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
  },
  createBtn: {
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer',
  },
  cardName: {
    fontSize: 17,
    fontWeight: 600,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#999',
  },
  taskCount: {
    background: '#e8f4fd',
    color: '#1976d2',
    padding: '2px 10px',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 12,
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: 12,
    padding: 28,
    width: '100%',
    maxWidth: 440,
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
    minHeight: 80,
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelBtn: {
    padding: '9px 18px',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#999',
    fontSize: 15,
  },
};

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/projects', form);
      setShowModal(false);
      setForm({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Projects</h1>
        {isAdmin && (
          <button style={styles.createBtn} onClick={() => setShowModal(true)}>
            + New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div style={styles.empty}>No projects yet. {isAdmin && 'Create your first project!'}</div>
      ) : (
        <div style={styles.grid}>
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
              <div style={styles.card}>
                <div style={styles.cardName}>{p.name}</div>
                <div style={styles.cardDesc}>{p.description || 'No description'}</div>
                <div style={styles.cardMeta}>
                  <span>By {p.creator?.name || 'Unknown'}</span>
                  <span style={styles.taskCount}>{p.tasks?.length || 0} tasks</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <form style={styles.modalContent} onClick={(e) => e.stopPropagation()} onSubmit={handleCreate}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Create Project</h2>
            <div style={styles.field}>
              <label style={styles.label}>Project Name</label>
              <input
                style={styles.input}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div style={styles.actions}>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" style={styles.createBtn} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

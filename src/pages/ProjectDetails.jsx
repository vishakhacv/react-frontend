import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { djangoApi } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

const styles = {
  backLink: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    display: 'inline-block',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
  },
  desc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    gap: 10,
  },
  btn: {
    padding: '9px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 12,
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  count: {
    background: '#e8f4fd',
    color: '#1976d2',
    padding: '1px 8px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 12,
  },
  empty: {
    textAlign: 'center',
    padding: 32,
    color: '#999',
    fontSize: 14,
  },
};

export default function ProjectDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error('Failed to fetch project', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  const handleCheckOverdue = async () => {
    try {
      const res = await djangoApi.post('/check-overdue/');
      alert(res.data.message);
      fetchProject();
    } catch (err) {
      alert('Failed to check overdue tasks. Is the Django service running on port 8001?');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      window.location.href = '/projects';
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  if (loading) return <p>Loading project...</p>;
  if (!project) return <p>Project not found.</p>;

  const tasks = project.tasks || [];

  return (
    <div>
      <Link to="/projects" style={styles.backLink}>← Back to Projects</Link>

      <div style={styles.header}>
        <h1 style={styles.title}>{project.name}</h1>
        <div style={styles.actions}>
          {isAdmin && (
            <>
              <Link to={`/projects/${id}/create-task`}>
                <button style={{ ...styles.btn, background: '#1a1a2e' }}>+ Add Task</button>
              </Link>
              <button style={{ ...styles.btn, background: '#e65100' }} onClick={handleCheckOverdue}>
                Check Overdue
              </button>
              <button style={{ ...styles.btn, background: '#c62828' }} onClick={handleDelete}>
                Delete Project
              </button>
            </>
          )}
        </div>
      </div>

      <p style={styles.desc}>{project.description || 'No description.'}</p>

      <div style={styles.sectionTitle}>
        Tasks <span style={styles.count}>{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <div style={styles.empty}>No tasks yet. {isAdmin && 'Add your first task!'}</div>
      ) : (
        <div style={styles.grid}>
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onUpdate={fetchProject} />
          ))}
        </div>
      )}
    </div>
  );
}

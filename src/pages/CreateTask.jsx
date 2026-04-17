import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const styles = {
  backLink: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    display: 'inline-block',
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: 28,
    maxWidth: 520,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 24,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 6,
    color: '#333',
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
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
    background: '#fff',
  },
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 8,
  },
  btn: {
    padding: '10px 22px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    color: '#fff',
    background: '#1a1a2e',
  },
  cancelBtn: {
    padding: '10px 22px',
    borderRadius: 8,
    fontSize: 14,
    background: '#f5f5f5',
    border: '1px solid #ddd',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
};

export default function CreateTask() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    due_date: '',
    assigned_to: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/tasks', {
        ...form,
        project_id: Number(projectId),
        assigned_to: Number(form.assigned_to),
      });
      navigate(`/projects/${projectId}`);
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message || (data?.errors ? Object.values(data.errors).flat().join(', ') : 'Failed to create task');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <Link to={`/projects/${projectId}`} style={styles.backLink}>← Back to Project</Link>

      <div style={styles.card}>
        <h2 style={styles.title}>Create New Task</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} value={form.title} onChange={set('title')} required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} value={form.description} onChange={set('description')} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <select style={styles.select} value={form.priority} onChange={set('priority')}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Due Date</label>
            <input style={styles.input} type="date" value={form.due_date} onChange={set('due_date')} required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Assign To</label>
            <select style={styles.select} value={form.assigned_to} onChange={set('assigned_to')} required>
              <option value="">Select a user</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate(`/projects/${projectId}`)}>
              Cancel
            </button>
            <button type="submit" style={styles.btn} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  TODO: { bg: '#e8f4fd', text: '#1976d2' },
  IN_PROGRESS: { bg: '#fff3e0', text: '#e65100' },
  DONE: { bg: '#e8f5e9', text: '#2e7d32' },
  OVERDUE: { bg: '#ffebee', text: '#c62828' },
};

const PRIORITY_COLORS = {
  LOW: { bg: '#f1f8e9', text: '#558b2f' },
  MEDIUM: { bg: '#fff8e1', text: '#f57f17' },
  HIGH: { bg: '#fce4ec', text: '#c62828' },
};

const styles = {
  card: {
    background: '#fff',
    borderRadius: 10,
    padding: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    flex: 1,
  },
  badge: (colors) => ({
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 10,
    background: colors.bg,
    color: colors.text,
    whiteSpace: 'nowrap',
  }),
  desc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 1.4,
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
    color: '#888',
  },
  select: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid #ddd',
    background: '#fafafa',
  },
};

export default function TaskCard({ task, onUpdate }) {
  const { isAdmin } = useAuth();
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
      onUpdate?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const statusColor = STATUS_COLORS[task.status] || STATUS_COLORS.TODO;
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>{task.title}</span>
        <span style={styles.badge(statusColor)}>{task.status.replace('_', ' ')}</span>
      </div>

      {task.description && (
        <p style={styles.desc}>{task.description}</p>
      )}

      <div style={styles.meta}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={styles.badge(priorityColor)}>{task.priority}</span>
          <span>Due: {task.due_date}</span>
        </div>
        {task.assignee && (
          <span>Assigned: {task.assignee.name}</span>
        )}
      </div>

      <div>
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={updating || task.status === 'OVERDUE'}
          style={styles.select}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
          {task.status === 'OVERDUE' && <option value="OVERDUE">OVERDUE</option>}
        </select>
      </div>
    </div>
  );
}

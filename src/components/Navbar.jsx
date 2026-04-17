import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '0 24px',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  brand: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: 14,
  },
  role: {
    background: 'rgba(255,255,255,0.15)',
    padding: '2px 10px',
    borderRadius: 12,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  btn: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '5px 14px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/projects" style={styles.brand}>
        TaskManager
      </Link>
      {user && (
        <div style={styles.right}>
          <span>{user.name}</span>
          <span style={styles.role}>{user.role}</span>
          <button style={styles.btn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

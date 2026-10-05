import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  History,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/analysis',  icon: <Activity       size={20} />, label: 'New Analysis' },
    { path: '/history',   icon: <History        size={20} />, label: 'History'      },
    { path: '/profile',   icon: <Settings       size={20} />, label: 'Settings'     },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="sidebar-brand">
          <div className="brand-icon">G</div>
          <span>GaitGuard</span>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        {}
        <button
          onClick={handleLogout}
          className="nav-item mobile-logout"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <LogOut size={20} color="var(--color-error)" />
          <span style={{ color: 'var(--color-error)' }}>Logout</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div
          className="user-profile-sm"
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer' }}
          title="View profile"
        >
          <div
            className="user-avatar"
            style={{
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '13px',
              color: 'white',
            }}
          >
            {initials}
          </div>
          <div className="user-info">
            <div className="user-name" title={displayName}>{displayName}</div>
            <div className="user-role" style={{ fontSize: '11px', opacity: 0.6 }} title={displayEmail}>
              {displayEmail}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <LogOut size={20} color="var(--color-error)" />
          <span style={{ color: 'var(--color-error)' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

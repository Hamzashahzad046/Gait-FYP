import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="top-navbar">
      <h1 className="page-title">{title}</h1>

      <div className="navbar-actions">

        {}
        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '8px',
            padding: '6px 10px',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
          title={`Logged in as ${displayName}`}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', fontSize: '12px', color: 'white',
          }}>
            {initials}
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>{displayName}</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

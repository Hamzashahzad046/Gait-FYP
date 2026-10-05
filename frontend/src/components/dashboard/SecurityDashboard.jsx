

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Clock,
  Activity,
  AlertCircle,
  LogOut,
  Settings,
  Shield,
  Zap,
} from 'lucide-react';
import { gaitService } from '../../services/gaitService';
import { useAuth } from '../../hooks/useAuth';

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await gaitService.getSystemStats();
      if (result.success) {
        setStats(result.stats);
      } else {
        setError(result.error || 'Failed to load statistics');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const handleInitiateScan = () => {
    navigate('/analysis');
  };

  const handleViewPersonnel = () => {
    navigate('/history');
  };

  const handleViewLogs = () => {
    navigate('/history');
  };

  const handleSystemSecurity = () => {
    navigate('/profile');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent 40%),
        radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.05), transparent 40%)
      `,
      padding: '24px',
    }}>
      {}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '20px',
          background: 'rgba(31, 31, 46, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Shield size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)' }}>
              GAIT RECOGNITION
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>
              Security Command Center
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 250ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
            }}
          >
            <Settings size={18} />
            Profile
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: 'var(--color-error)',
              cursor: 'pointer',
              transition: 'all 250ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </motion.header>

      {}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            color: 'var(--color-error)',
          }}
        >
          <AlertCircle size={20} />
          {error}
        </motion.div>
      )}

      {}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(31, 31, 46, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Users size={24} color="var(--color-accent)" />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Authorized Users</h3>
          </div>
          {loading ? (
            <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid var(--color-primary-glow)',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          ) : (
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
              {stats?.authorizedUsers || 0}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(31, 31, 46, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Clock size={24} color="var(--color-primary)" />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Last Scan Time</h3>
          </div>
          {loading ? (
            <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid var(--color-primary-glow)',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          ) : (
            <div style={{ color: 'var(--color-primary)' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                {stats?.lastScanTime
                  ? new Date(stats.lastScanTime).toLocaleTimeString()
                  : 'No recent scans'}
              </div>
              {stats?.lastDetectedPerson && (
                <small style={{ color: 'var(--text-muted)' }}>
                  Detected: {stats.lastDetectedPerson}
                </small>
              )}
            </div>
          )}
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(31, 31, 46, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Activity size={24} color="var(--color-success)" />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Total Scans</h3>
          </div>
          {loading ? (
            <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid var(--color-primary-glow)',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          ) : (
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--color-success)' }}>
              {stats?.totalScans || 0}
            </div>
          )}
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'rgba(31, 31, 46, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Zap size={24} color="var(--color-warning)" />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>System Status</h3>
          </div>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--color-success)',
                boxShadow: '0 0 10px var(--color-success)',
              }}
            />
            <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>Operational</span>
          </div>
        </motion.div>
      </div>

      {}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleInitiateScan}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          padding: '24px',
          background: 'var(--gradient-primary)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '18px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-glow)',
          marginBottom: '32px',
          transition: 'transform 250ms ease',
        }}
      >
        <Zap size={24} />
        INITIALIZE GAIT SCAN
      </motion.button>

      {}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleViewPersonnel}
          style={{
            padding: '16px',
            background: 'rgba(31, 31, 46, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 250ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.background = 'rgba(31, 31, 46, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
            e.currentTarget.style.background = 'rgba(31, 31, 46, 0.4)';
          }}
        >
          <Users size={24} color="var(--color-accent)" />
          Authorized Personnel
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={handleViewLogs}
          style={{
            padding: '16px',
            background: 'rgba(31, 31, 46, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 250ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.background = 'rgba(31, 31, 46, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
            e.currentTarget.style.background = 'rgba(31, 31, 46, 0.4)';
          }}
        >
          <BarChart3 size={24} color="var(--color-primary)" />
          Access Logs
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleSystemSecurity}
          style={{
            padding: '16px',
            background: 'rgba(31, 31, 46, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 250ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.background = 'rgba(31, 31, 46, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
            e.currentTarget.style.background = 'rgba(31, 31, 46, 0.4)';
          }}
        >
          <Shield size={24} color="var(--color-warning)" />
          System Security
        </motion.button>
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SecurityDashboard;

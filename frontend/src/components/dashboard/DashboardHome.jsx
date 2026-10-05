import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCards from './StatsCards';
import { gaitService } from '../../services/gaitService';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../core/supabaseClient';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [stats,    setStats]    = useState(null);
  const [recent,   setRecent]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const [statsRes, historyRes] = await Promise.all([
        gaitService.getSystemStats(),
        gaitService.getDetectionHistory(5),
      ]);

      if (statsRes.success)   setStats(statsRes.stats);
      if (historyRes.success) setRecent(historyRes.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  useEffect(() => {
    if (!user?.id) return;

    const channel = gaitService.subscribeToDetections(user.id, (newRecord) => {
      setRecent((prev) => [newRecord, ...prev].slice(0, 5));
      loadData(true);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadData]);
  const statsCards = [
    {
      title: 'Total Scans',
      value: loading ? '—' : String(stats?.totalScans ?? 0),
      trend: 'Live',
      icon:  <Activity />,
      color: 'var(--color-primary)',
    },
    {
      title: 'Identified Persons',
      value: loading ? '—' : String(stats?.identifiedUsers ?? 0),
      trend: 'Unique',
      icon:  <Users />,
      color: 'var(--color-accent)',
    },
    {
      title: 'System Status',
      value: 'Online',
      trend: 'Operational',
      icon:  <CheckCircle />,
      color: 'var(--color-success)',
    },
    {
      title: 'Last Scan',
      value: loading
        ? '—'
        : stats?.lastScanTime
          ? new Date(stats.lastScanTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'None yet',
      trend: stats?.lastPerson || 'No data',
      icon:  <Clock />,
      color: 'var(--color-warning)',
    },
  ];

  const getStatusClass = (record) =>
    record.person_name === 'Unknown' ? 'status-failed' : 'status-completed';

  return (
    <div className="page-container">
      <StatsCards stats={statsCards} isLoading={loading} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginTop: '8px' }}>
        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="dashboard-section"
        >
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 className="section-title" style={{ margin: 0 }}>Recent Analyses</h3>
              {}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-success)' }}>
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'var(--color-success)',
                  boxShadow: '0 0 6px var(--color-success)',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                LIVE
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => loadData(true)}
                disabled={refreshing}
                style={{
                  background: 'none', border: '1px solid var(--border-color)',
                  borderRadius: '6px', padding: '6px 10px', cursor: 'pointer',
                  color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px', transition: 'all 200ms ease',
                }}
              >
                <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                Refresh
              </button>
              <button
                onClick={() => navigate('/history')}
                style={{
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '6px', padding: '6px 12px', cursor: 'pointer',
                  color: 'var(--color-primary)', fontSize: '12px', fontWeight: '600',
                }}
              >
                View All →
              </button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{
                    height: '48px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    animation: 'shimmer 1.5s ease-in-out infinite',
                  }} />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center', padding: '40px 0',
                  color: 'var(--text-muted)', fontSize: '14px',
                }}
              >
                <Activity size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>No analyses yet. <button onClick={() => navigate('/analysis')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600' }}>Run your first scan →</button></p>
              </motion.div>
            ) : (
              recent.map((record, idx) => (
                <motion.div
                  key={record.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: idx < recent.length - 1 ? '14px' : 0,
                    borderBottom: idx < recent.length - 1 ? '1px solid var(--border-color)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: record.person_name === 'Unknown'
                        ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '14px',
                      color: record.person_name === 'Unknown' ? 'var(--color-error)' : 'var(--color-primary)',
                    }}>
                      {record.person_name === 'Unknown' ? '?' : record.person_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>
                        {record.person_name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {new Date(record.created_at).toLocaleString([], {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`status-badge ${getStatusClass(record)}`}>
                      {record.person_name === 'Unknown' ? 'Unidentified' : 'Matched'}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {record.confidence?.toFixed(1)}% conf.
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin  { 100%{transform:rotate(360deg)} }
        @keyframes shimmer {
          0%   { background: rgba(255,255,255,0.03); }
          50%  { background: rgba(255,255,255,0.07); }
          100% { background: rgba(255,255,255,0.03); }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;

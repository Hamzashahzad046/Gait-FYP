import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = () => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    animation: 'shimmer 1.5s ease-in-out infinite',
    border: '1px solid var(--border-color)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ width: '60%', height: '14px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }} />
    </div>
    <div style={{ width: '40%', height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', marginBottom: '10px' }} />
    <div style={{ width: '50%', height: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)' }} />
  </div>
);

const StatsCards = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        <style>{`
          @keyframes shimmer {
            0%   { background: rgba(255,255,255,0.03); }
            50%  { background: rgba(255,255,255,0.06); }
            100% { background: rgba(255,255,255,0.03); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="stat-card"
          >
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            {stat.trend && (
              <div
                className={`stat-trend ${
                  stat.trend.startsWith('+') ? 'trend-up' :
                  stat.trend.startsWith('-') ? 'trend-down' : ''
                }`}
                style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}
              >
                {stat.trend}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default StatsCards;

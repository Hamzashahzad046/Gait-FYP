import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="auth-container" style={{ flexDirection: 'column', textAlign: 'center' }}>
      <div className="auth-background">
        <div className="auth-bg-shape shape-1"></div>
        <div className="auth-bg-shape shape-2"></div>
      </div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ 
          width: '120px', height: '120px', borderRadius: '50%', 
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px'
        }}>
          <AlertTriangle size={64} color="var(--color-error)" />
        </div>
        
        <h1 style={{ fontSize: '72px', margin: '0 0 16px 0', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </h1>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 32px' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to="/dashboard" className="btn btn-primary">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

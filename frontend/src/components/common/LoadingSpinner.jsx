import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeMap = {
    small: '16px',
    medium: '32px',
    large: '48px'
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px' }}>
      <div 
        style={{ 
          width: spinnerSize, 
          height: spinnerSize, 
          border: '3px solid rgba(108, 99, 255, 0.2)', 
          borderTopColor: 'var(--color-primary)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} 
      />
      {text && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{text}</span>}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

import React from 'react';
import ForgotPassword from '../components/auth/ForgotPassword';

const ForgotPasswordPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-bg-shape shape-1"></div>
        <div className="auth-bg-shape shape-2" style={{ background: 'rgba(59, 130, 246, 0.3)' }}></div>
      </div>
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;

import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-bg-shape shape-1"></div>
        <div className="auth-bg-shape shape-2"></div>
      </div>
      <SignupForm />
    </div>
  );
};

export default SignupPage;

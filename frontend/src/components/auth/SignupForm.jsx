import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import OTPVerification from './OTPVerification';

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName || !formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    const result = await signup(formData.fullName, formData.email, formData.password);
    if (result.success) {
      setUserEmail(formData.email);
      setStep(2);
    } else {
      setFormError(result.error || 'Signup failed');
    }
  };

  const handleOTPComplete = () => {
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="auth-card"
      style={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(31, 31, 46, 0.4)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
      }}
    >
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="auth-header">
              <div className="auth-logo" style={{ background: 'var(--gradient-accent)' }}>
                <ShieldCheck size={32} />
              </div>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join the Secure Gait Recognition system</p>
            </div>

            <form className="auth-form" onSubmit={handleSignupSubmit}>
              {(formError || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                >
                  {formError || error}
                </motion.div>
              )}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '14px',
                    color: 'var(--text-muted)',
                  }} />
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    placeholder="John Doe"
                    style={{ paddingLeft: '40px' }}
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '14px',
                    color: 'var(--text-muted)',
                  }} />
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="you@example.com"
                    style={{ paddingLeft: '40px' }}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-wrapper">
                  <Lock size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '14px',
                    color: 'var(--text-muted)',
                    zIndex: 1,
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    placeholder="Create a strong password"
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Minimum 8 characters
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-accent auth-btn"
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(10,14,26,0.3)',
                        borderTopColor: 'var(--bg-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    Creating...
                  </span>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-light)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Sign In
              </button>
            </div>
          </motion.div>
        ) : (
          <OTPVerification
            key="otp"
            email={userEmail}
            onComplete={handleOTPComplete}
            isLoading={isLoading}
            onBack={() => setStep(1)}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};

export default SignupForm;


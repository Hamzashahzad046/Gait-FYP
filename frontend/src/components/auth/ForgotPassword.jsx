import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email) {
      setFormError('Please enter your email address');
      return;
    }

    const result = await forgotPassword(email);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setFormError(result.error || 'Failed to send reset link');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="auth-card"
      style={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(31, 31, 46, 0.4)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
      }}
    >
      <button
        type="button"
        onClick={() => navigate('/login')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          textDecoration: 'none',
          fontSize: '14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={16} /> Back to Login
      </button>

      {!isSubmitted ? (
        <>
          <div className="auth-header" style={{ marginBottom: '32px' }}>
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
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
                  color: 'var(--color-error)',
                }}
              >
                {formError || error}
              </motion.div>
            )}

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
                  className="form-input"
                  placeholder="you@example.com"
                  style={{ paddingLeft: '40px' }}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFormError('');
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={isLoading || !email}
              style={{
                opacity: (isLoading || !email) ? 0.7 : 1,
                cursor: (isLoading || !email) ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Sending Link...' : (
                <>
                  Send Reset Link
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '20px 0' }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
          }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Check your email</h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}>
            We've sent a password reset link to<br />
            <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Didn't receive the email?{' '}
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-light)',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Click to resend
            </button>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ForgotPassword;


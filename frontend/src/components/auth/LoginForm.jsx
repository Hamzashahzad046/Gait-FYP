import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('Please enter both email and password');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setFormError(result.error || 'Authentication failed');
    }
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
      <div className="auth-header">
        <div className="auth-logo" style={{ background: 'var(--gradient-primary)' }}>
          <Shield size={32} />
        </div>
        <h2 className="auth-title">SECURE GAIT RECOGNITION</h2>
        <p className="auth-subtitle">Authenticate to access the system</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
        {(formError || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-error"
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
              placeholder="Enter your email"
              style={{ paddingLeft: '40px' }}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="off"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Password</label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              style={{
                fontSize: '12px',
                color: 'var(--color-primary-light)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Forgot password?
            </button>
          </div>
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
              placeholder="Enter your password"
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="new-password"
              required
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
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-btn"
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
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              Authenticating...
            </span>
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/signup')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary-light)',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Create one
        </button>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};

export default LoginForm;


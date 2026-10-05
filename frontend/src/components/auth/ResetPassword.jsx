import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-card text-center" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ display: 'inline-flex', background: 'var(--color-success)', borderRadius: '50%', padding: '16px', marginBottom: '20px' }}>
          <CheckCircle size={32} color="white" />
        </div>
        <h2>Password Updated!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your password has been changed successfully. Redirecting to login...</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Create New Password</h2>
        <p className="auth-subtitle">Your new password must be different from previous used passwords.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <div className="password-input-wrapper">
            <Lock className="form-icon" size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)', zIndex: 1 }} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              className="form-input" 
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
              value={formData.password}
              onChange={handleChange}
              required minLength={8}
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="password-input-wrapper">
            <Lock className="form-icon" size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)', zIndex: 1 }} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword"
              className="form-input" 
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
              value={formData.confirmPassword}
              onChange={handleChange}
              required minLength={8}
            />
            <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary auth-btn" disabled={isLoading || !formData.password || !formData.confirmPassword}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </motion.div>
  );
};

export default ResetPassword;

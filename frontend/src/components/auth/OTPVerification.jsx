import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const OTPVerification = ({ email, onComplete, onBack }) => {
  const { verifyOTP, isLoading, error } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formError, setFormError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setFormError('');

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setFormError('Please enter a valid 6-digit code');
      return;
    }

    const result = await verifyOTP(email, otpCode);
    if (result.success) {
      onComplete();
    } else {
      setFormError(result.error || 'Invalid OTP');
    }
  };

  return (
    <motion.div
      key="otp-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="auth-header">
        <div className="auth-logo" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
        }}>
          <ShieldAlert size={32} color="var(--color-primary-light)" />
        </div>
        <h2 className="auth-title">Verify Email</h2>
        <p className="auth-subtitle">
          We've sent a 6-digit verification code to <br />
          <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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

        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="otp-input"
              disabled={isLoading}
            />
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-btn"
          disabled={isLoading || otp.join('').length !== 6}
          style={{
            opacity: (isLoading || otp.join('').length !== 6) ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div className="auth-footer" style={{ marginTop: '24px' }}>
        Didn't receive the code?{' '}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary-light)',
            fontWeight: '500',
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          Resend code
        </button>
      </div>
    </motion.div>
  );
};

export default OTPVerification;


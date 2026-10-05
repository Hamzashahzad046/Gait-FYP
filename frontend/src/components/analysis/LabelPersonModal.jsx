

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, HelpCircle, X, AlertTriangle, CheckCircle } from 'lucide-react';

const LabelPersonModal = ({ isOpen, onSaveLabeled, onSaveUnknown, onClose, analysisResult }) => {
  const [personName, setPersonName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    if (!isOpen) {
      setPersonName('');
      setError('');
    }
  }, [isOpen]);

  const handleSaveLabeled = () => {
    const trimmed = personName.trim();
    if (!trimmed) {
      setError('Please enter a name for this subject.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    onSaveLabeled(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveLabeled();
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
          />

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 20  }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001,
              width: '100%',
              maxWidth: '460px',
              padding: '0 16px',
            }}
          >
            <div style={{
              background: 'rgba(20, 20, 35, 0.97)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.1)',
            }}>
              {}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <AlertTriangle size={24} color="var(--color-warning, #f59e0b)" />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary, #fff)' }}>
                      Unidentified Subject
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted, #6b7280)' }}>
                      Confidence: {analysisResult?.confidence?.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted, #6b7280)', padding: '4px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {}
              <div style={{
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '24px',
                fontSize: '13px',
                color: 'var(--text-secondary, #9ca3af)',
                lineHeight: '1.7',
              }}>
                The gait pattern did not match any known profiles.<br />
                <strong style={{ color: 'var(--color-warning, #f59e0b)' }}>
                  Would you like to register this person as a new subject?
                </strong>
              </div>

              {}
              <div style={{ marginBottom: '8px' }}>
                <label style={{
                  display: 'block', fontSize: '13px', fontWeight: '600',
                  color: 'var(--text-secondary, #9ca3af)', marginBottom: '8px',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  Subject Name
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="e.g. John Doe"
                  value={personName}
                  onChange={(e) => { setPersonName(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.3)'}`,
                    borderRadius: '10px',
                    color: 'var(--text-primary, #fff)',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 200ms ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.7)'; }}
                  onBlur={(e) => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.3)'; }}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ margin: '6px 0 0', fontSize: '12px', color: '#ef4444' }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
                <button
                  onClick={handleSaveLabeled}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', borderRadius: '10px',
                    color: 'white', fontWeight: '700', fontSize: '14px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <UserPlus size={18} />
                  Register as New Subject
                </button>

                <button
                  onClick={onSaveUnknown}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'var(--text-secondary, #9ca3af)',
                    fontWeight: '600', fontSize: '14px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  <HelpCircle size={18} />
                  Save as Unknown
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LabelPersonModal;

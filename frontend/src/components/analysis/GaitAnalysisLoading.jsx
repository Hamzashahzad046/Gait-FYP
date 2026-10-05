

import React from 'react';
import { motion } from 'framer-motion';

const GaitAnalysisLoading = ({ message } = {}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background: 'rgba(31, 31, 46, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
        borderRadius: '12px',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          position: 'relative',
          width: '140px',
          height: '140px',
          borderRadius: '16px',
          border: '2px solid var(--color-primary-glow)',
          background: 'rgba(99, 102, 241, 0.05)',
          marginBottom: '32px',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.1)',
        }}
      >
        {}
        <motion.div
          animate={{ top: ['0%', '100%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
            boxShadow: '0 0 15px var(--color-primary)',
          }}
        />

        {}
        <svg
          viewBox="0 0 24 24"
          fill="rgba(99, 102, 241, 0.2)"
          stroke="rgba(99, 102, 241, 0.4)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: '100%', height: '100%', padding: '20px' }}
        >
          <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M14 6H10a4 4 0 0 0-4 4v5a2 2 0 0 0 2 2h2v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-7h2a2 2 0 0 0 2-2V10a4 4 0 0 0-4-4Z" />
        </svg>
      </motion.div>

      {}
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
        }}
      >
        Analyzing Gait Pattern{message ? '' : '...'}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          color: 'var(--text-muted)',
          marginBottom: '32px',
          fontSize: '14px',
        }}
      >
        {message || 'Processing video and extracting biometrics'}
      </motion.p>
    </motion.div>
  );
};

export default GaitAnalysisLoading;

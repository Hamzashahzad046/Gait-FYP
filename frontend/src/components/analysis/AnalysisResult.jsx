

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { CheckCircle, Download, ArrowRight, Edit2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { gaitService } from '../../services/gaitService';

const AnalysisResult = ({ result, onReset, onDownload }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentName, setCurrentName] = useState(result?.person || 'Unknown');
  const [newName, setNewName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  if (!result) return null;

  const confidenceColor = result.confidence >= 90
    ? 'var(--color-success)'
    : result.confidence >= 70
    ? 'var(--color-warning)'
    : 'var(--color-error)';

  const handleStartEdit = () => {
    setNewName(currentName);
    setIsEditingName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
  };

  const handleSaveName = async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === currentName) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    if (result.detectionId) {
      const res = await gaitService.updateDetectionName(result.detectionId, trimmed);
      if (res.success) {
        setCurrentName(trimmed);
      } else {
        console.error('Failed to rename:', res.error);
        alert('Failed to save the new name: ' + res.error);
      }
    } else {
      setCurrentName(trimmed);
    }
    setIsSavingName(false);
    setIsEditingName(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') handleCancelEdit();
  };

  const handleDeleteCurrent = async () => {
    if (!result?.detectionId) return;
    if (!window.confirm('Delete this record and re-identify?')) return;
    try {
      const res = await gaitService.deleteDetectionRecord(result.detectionId);
      if (res.success) {
        toast.success('Record deleted');
        onReset();
      } else {
        toast.error(res.error || 'Deletion failed');
      }
    } catch (err) {
      toast.error('Error deleting record');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {}
      {result.alreadyExists && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            color: '#93c5fd',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{
            background: '#3b82f6',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>i</div>
          <div style={{ fontWeight: '500', fontSize: '15px' }}>
            The person is already stored in the database.
          </div>
        </motion.div>
      )}

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(31, 31, 46, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--gradient-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            fontWeight: 'bold',
            color: 'var(--bg-primary)',
            boxShadow: 'var(--shadow-glow-accent)',
          }}
        >
          {currentName.charAt(0).toUpperCase()}
        </motion.div>

        {}
        <div>
          <p style={{
            color: 'var(--text-muted)',
            margin: 0,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
          }}>
            Subject Identified
          </p>
          
          {isEditingName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSavingName}
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.5)',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  outline: 'none',
                  width: '100%',
                  maxWidth: '240px'
                }}
              />
              <button
                onClick={handleSaveName}
                disabled={isSavingName}
                style={{
                  background: 'var(--color-success)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isSavingName ? 0.5 : 1
                }}
                title="Save Name"
              >
                {isSavingName ? (
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Check size={16} />
                )}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSavingName}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'var(--color-error)',
                  borderRadius: '6px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{
                margin: 0,
                fontSize: '28px',
                color: 'var(--text-primary)',
              }}>
                {currentName}
              </h2>
              {!result.isDuplicateVideo && (
                <button
                  onClick={handleStartEdit}
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: 'var(--color-primary)',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 200ms ease'
                  }}
                  title="Rename Subject"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                  }}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              padding: '6px 12px',
              background: `rgba(${
                result.confidence >= 90 ? '16, 185, 129' : '245, 158, 11'
              }, 0.1)`,
              border: `1px solid ${confidenceColor}`,
              borderRadius: '20px',
            }}
          >
            <CheckCircle size={16} color={confidenceColor} />
            <span style={{
              color: confidenceColor,
              fontWeight: '600',
              fontSize: '14px',
            }}>
              {result.confidence}% Match Confidence
            </span>
          </motion.div>
        </div>

        {}
        <div style={{ textAlign: 'right', minWidth: '120px' }}>
          <small style={{
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: '4px',
          }}>
            Analysis Time
          </small>
          <div style={{
            fontSize: '14px',
            color: 'var(--text-primary)',
            fontWeight: '600',
          }}>
            {result.timestamp
              ? new Date(result.timestamp).toLocaleTimeString()
              : 'Just now'}
          </div>
        </div>

        </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'rgba(31, 31, 46, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-color)',
        }}>
          Extracted Biometrics
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}>
          {result.metrics && Object.entries(result.metrics).map(([key, value], idx) => {
            const labels = {
              avg_knee_angle: { label: 'Avg Knee Angle', unit: '°' },
              avg_hip_angle: { label: 'Avg Hip Angle', unit: '°' },
              stride_length: { label: 'Stride Length', unit: 'm' },
              step_count: { label: 'Step Count', unit: '' },
            };

            const metricLabel = labels[key] || { label: key, unit: '' };

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                style={{
                  background: 'rgba(99, 102, 241, 0.05)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <small style={{
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '12px',
                }}>
                  {metricLabel.label}
                </small>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'var(--color-primary)',
                }}>
                  {value}
                  <span style={{
                    fontSize: '14px',
                    marginLeft: '4px',
                    color: 'var(--text-muted)',
                  }}>
                    {metricLabel.unit}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          display: 'flex',
          gap: '12px',
        }}
      >
        <button
          onClick={handleDeleteCurrent}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: 'var(--color-error)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 250ms ease',
          }}
        >
          <Trash2 size={18} />
          Delete & Re-Identify
        </button>

        <button
          onClick={onDownload}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px',
            color: 'var(--color-primary)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 250ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
          }}
        >
          <Download size={18} />
          Download Report
        </button>

        <button
          onClick={onReset}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: 'var(--gradient-primary)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 250ms ease',
            boxShadow: 'var(--shadow-glow)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Analyze Another
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisResult;


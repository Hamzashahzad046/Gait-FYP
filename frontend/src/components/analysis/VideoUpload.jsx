

import React, { useRef, useState } from 'react';
import { UploadCloud, FileVideo, X, Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoUpload = ({ file, setFile, onStartAnalysis, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const ALLOWED_FORMATS = ['video/mp4', 'video/x-msvideo', 'video/quicktime'];
  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setUploadError('');

    if (!ALLOWED_FORMATS.includes(selectedFile.type)) {
      setUploadError('Please select a valid video file (MP4, AVI, MOV)');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError('File size exceeds 100MB limit');
      return;
    }

    setFile(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        background: 'rgba(31, 31, 46, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
        borderRadius: '12px',
        padding: '32px',
      }}
    >
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            color: 'var(--color-error)',
          }}
        >
          <AlertCircle size={20} />
          {uploadError}
        </motion.div>
      )}

      {!file ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'rgba(99, 102, 241, 0.2)'}`,
            borderRadius: '12px',
            background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)',
            cursor: 'pointer',
            transition: 'all 250ms ease',
            textAlign: 'center',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="video/mp4,video/x-msvideo,video/quicktime"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            disabled={isLoading}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--color-primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <UploadCloud size={40} color="var(--color-primary)" />
          </motion.div>

          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
          }}>
            Upload Gait Analysis Video
          </h3>

          <p style={{
            color: 'var(--text-secondary)',
            margin: '0 0 16px 0',
            maxWidth: '400px',
          }}>
            Drag and drop your video here, or click to browse from your computer
          </p>

          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '20px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              MP4
            </span>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '20px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              AVI
            </span>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '20px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              MOV
            </span>
          </div>

          <small style={{
            color: 'var(--text-muted)',
            marginTop: '16px',
            display: 'block',
          }}>
            Max file size: 100 MB
          </small>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FileVideo size={28} color="var(--color-primary)" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '300px',
            }}>
              {file.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}>
              {formatFileSize(file.size)}
            </div>
          </div>

          <button
            onClick={() => setFile(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'all 250ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-error)';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'none';
            }}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </motion.div>
      )}

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={onStartAnalysis}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px 24px',
              background: 'var(--gradient-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 250ms ease',
              boxShadow: 'var(--shadow-glow)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                ANALYZING...
              </>
            ) : (
              <>
                <Play size={20} />
                START ANALYSIS
              </>
            )}
          </button>

          <button
            onClick={() => setFile(null)}
            disabled={isLoading}
            style={{
              padding: '14px 24px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--color-error)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 250ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }
            }}
          >
            Cancel
          </button>
        </motion.div>
      )}

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default VideoUpload;


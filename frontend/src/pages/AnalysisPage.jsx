

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VideoUpload from '../components/analysis/VideoUpload';
import GaitAnalysisLoading from '../components/analysis/GaitAnalysisLoading';
import AnalysisResult from '../components/analysis/AnalysisResult';
import LabelPersonModal from '../components/analysis/LabelPersonModal';
import { gaitService } from '../services/gaitService';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [file,   setFile]   = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState('');
  const [savedRecord, setSavedRecord] = useState(null);
  const handleStartAnalysis = async () => {
    if (!file) return;

    setStatus('analyzing');
    setError('');
    setResult(null);

    try {
      const fileHash = await gaitService.computeFileHash(file);
      const duplicateResult = await gaitService.checkDuplicateVideo(fileHash);
      if (duplicateResult) {
        setResult(duplicateResult);
        setStatus('complete');
        return;
      }
      const analysisResult = await gaitService.analyzeGait(file);

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Analysis failed');
      }
      analysisResult.videoFilename = file.name;
      analysisResult.fileHash = fileHash;

      // Check if predicted person already exists in the database
      if (analysisResult.person !== 'Unknown') {
        const personExists = await gaitService.checkPersonExists(analysisResult.person);
        if (personExists) {
          analysisResult.alreadyExists = true;
        }
      }

      setResult(analysisResult);
      if (analysisResult.person === 'Unknown') {
        setStatus('labeling');
      } else {
        await saveAndComplete(analysisResult, null);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please try again.');
      setStatus('error');
    }
  };
  const handleSaveLabeled = async (personName) => {
    setStatus('saving');
    await saveAndComplete(result, personName);
  };
  const handleSaveUnknown = async () => {
    setStatus('saving');
    await saveAndComplete(result, 'Unknown');
  };
  const saveAndComplete = async (analysisResult, personNameOverride) => {
    try {
      const finalPersonName = personNameOverride !== null ? personNameOverride : analysisResult.person;
      
      // If overriding/labeling, check if this person already exists in the database
      let personExists = false;
      if (finalPersonName && finalPersonName !== 'Unknown') {
        personExists = await gaitService.checkPersonExists(finalPersonName);
      }

      const saveResult = await gaitService.saveDetectionResult(
        analysisResult,
        personNameOverride,
      );

      if (!saveResult.success) {
        console.warn('Failed to save to DB:', saveResult.error);
        alert('Database Error: Failed to save the result. ' + saveResult.error);
      } else {
        setSavedRecord(saveResult.record);
      }
      const finalResult = {
        ...analysisResult,
        person: finalPersonName,
        detectionId: saveResult?.record?.id,
        alreadyExists: analysisResult.alreadyExists || personExists,
      };
      setResult(finalResult);
      setStatus('complete');
    } catch (err) {
      console.error('Save error:', err);
      setStatus('complete');
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    setError('');
    setSavedRecord(null);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportText = `
GAITGUARD — ANALYSIS REPORT
============================

Subject:    ${result.person}
Confidence: ${result.confidence}%
Timestamp:  ${result.timestamp ? new Date(result.timestamp).toLocaleString() : 'N/A'}
Video File: ${result.videoFilename || 'N/A'}

Extracted Biometrics
--------------------
Avg Knee Angle : ${result.metrics?.avg_knee_angle}°
Avg Hip Angle  : ${result.metrics?.avg_hip_angle}°
Stride Length  : ${result.metrics?.stride_length} m
Step Count     : ${result.metrics?.step_count}

Report Generated: ${new Date().toLocaleString()}
    `.trim();

    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText);
    a.download = `gait-report-${result.person.replace(/\s+/g, '_')}-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent 40%),
        radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.05), transparent 40%)
      `,
      padding: '24px',
    }}>
      <Toaster position="top-right" />
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', marginBottom: '16px', fontSize: '14px', fontWeight: '600',
          }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          Gait Analysis
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
          Upload a video to run the biometric identification pipeline
        </p>
      </motion.header>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '24px',
              color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '12px',
            }}
          >
            <span>⚠️</span>
            <div>
              <div style={{ fontWeight: '600' }}>Analysis failed</div>
              <div style={{ fontSize: '14px' }}>{error}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === 'complete' && savedRecord && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px', padding: '10px 16px', marginBottom: '16px',
              color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px',
            }}
          >
            <CheckCircle size={16} /> Detection saved to database successfully
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {(status === 'idle' || status === 'labeling') && (
            <VideoUpload
              key="upload"
              file={file}
              setFile={setFile}
              onStartAnalysis={handleStartAnalysis}
              isLoading={false}
            />
          )}

          {(status === 'analyzing' || status === 'saving') && (
            <GaitAnalysisLoading
              key="analyzing"
              message={status === 'saving' ? 'Saving to database…' : undefined}
            />
          )}

          {status === 'complete' && result && (
            <AnalysisResult
              key="result"
              result={result}
              onReset={handleReset}
              onDownload={handleDownloadReport}
            />
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key="error"
              style={{
                background: 'rgba(31, 31, 46, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px', padding: '32px', textAlign: 'center',
              }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: '28px',
              }}>
                ⚠️
              </div>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Analysis Failed</h3>
              <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)' }}>{error}</p>
              <button
                onClick={handleReset}
                style={{
                  padding: '10px 24px', background: 'var(--gradient-primary)',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontWeight: '600', cursor: 'pointer', boxShadow: 'var(--shadow-glow)',
                }}
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {}
      <LabelPersonModal
        isOpen={status === 'labeling'}
        analysisResult={result}
        onSaveLabeled={handleSaveLabeled}
        onSaveUnknown={handleSaveUnknown}
        onClose={() => setStatus('idle')}
      />
    </div>
  );
};

export default AnalysisPage;

import React, { useState, useMemo } from 'react';
import { Search, Download, Activity, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gaitService } from '../../services/gaitService';
import toast from 'react-hot-toast';

const AnalysisHistory = ({ data = [], loading = false, error = '', onRecordDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const q = searchTerm.toLowerCase();
    return data.filter(
      (row) =>
        row.person_name?.toLowerCase().includes(q) ||
        row.id?.toLowerCase().includes(q),
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? This will also clear the person identification status.')) return;
    try {
      const res = await gaitService.deleteDetectionRecord(id);
      if (res.success) {
        toast.success('Record deleted successfully');
        if (onRecordDeleted) onRecordDeleted(id);
      } else {
        toast.error(res.error || 'Failed to delete record');
      }
    } catch (err) {
      toast.error('An error occurred during deletion');
    }
  };
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Person', 'Confidence', 'Knee Angle', 'Hip Angle', 'Stride Length', 'Step Count', 'Identified'];
    const rows = filtered.map((r) => [
      r.id,
      new Date(r.created_at).toLocaleString(),
      r.person_name,
      `${r.confidence?.toFixed(1)}%`,
      r.avg_knee_angle?.toFixed(2) || '',
      r.avg_hip_angle?.toFixed(2)  || '',
      r.stride_length?.toFixed(2)  || '',
      r.step_count || '',
      r.is_identified ? 'Yes' : 'No',
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `gait-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (loading) {
    return (
      <div className="dashboard-section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              height: '52px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
        <style>{`@keyframes shimmer { 0%{background:rgba(255,255,255,0.03)} 50%{background:rgba(255,255,255,0.07)} 100%{background:rgba(255,255,255,0.03)} }`}</style>
      </div>
    );
  }
  if (error) {
    return (
      <div className="dashboard-section" style={{ textAlign: 'center', padding: '48px' }}>
        <p style={{ color: 'var(--color-error)' }}>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      {}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="form-input"
              style={{ paddingLeft: '36px', width: '260px', padding: '8px 16px 8px 36px' }}
            />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          className="btn btn-primary"
          style={{ padding: '8px 16px' }}
          onClick={handleExportCSV}
          disabled={filtered.length === 0}
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Activity size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <p style={{ margin: 0 }}>
            {searchTerm ? 'No records match your search.' : 'No analyses recorded yet.'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date & Time</th>
                  <th>Identified Subject</th>
                  <th>Confidence</th>
                  <th>Knee Angle</th>
                  <th>Hip Angle</th>
                  <th>Steps</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr key={row.id} className="history-row">
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '11px' }}>
                      {String(row.id).slice(0, 8)}…
                    </td>
                    <td>{new Date(row.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ fontWeight: '600' }}>{row.person_name || 'Unknown'}</td>
                    <td>
                      <span style={{ color: Number(row.confidence) >= 80 ? 'var(--color-success)' : Number(row.confidence) >= 60 ? 'var(--color-warning)' : 'var(--color-error)' }}>
                        {Number(row.confidence).toFixed(1)}%
                      </span>
                    </td>
                    <td>{row.avg_knee_angle != null ? Number(row.avg_knee_angle).toFixed(1) : '—'}°</td>
                    <td>{row.avg_hip_angle != null ? Number(row.avg_hip_angle).toFixed(1) : '—'}°</td>
                    <td>{row.step_count ?? '—'}</td>
                    <td>
                      <span className={`status-badge ${row.is_identified ? 'status-completed' : 'status-failed'}`}>
                        {row.is_identified ? 'Identified' : 'Unknown'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '4px', opacity: 0.7 }}
                        title="Delete record & re-identify"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px' }}
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px' }}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisHistory;

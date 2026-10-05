import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/common/Navbar';
import { User, Mail, Shield, Save, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../core/supabaseClient';

const Toast = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, x: '-50%' }}
    animate={{ opacity: 1, y: 0,   x: '-50%' }}
    exit={{   opacity: 0, y: -20,  x: '-50%' }}
    style={{
      position: 'fixed', top: '24px', left: '50%',
      zIndex: 9999,
      background: type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)',
      color: 'white', borderRadius: '10px', padding: '12px 20px',
      display: 'flex', alignItems: 'center', gap: '10px',
      fontWeight: '600', fontSize: '14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}
  >
    {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
    {message}
  </motion.div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const fullName  = user?.user_metadata?.full_name || '';
  const email     = user?.email || '';
  const initials  = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : email.charAt(0).toUpperCase();

  const [nameValue,    setNameValue]    = useState(fullName);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showPwForm,   setShowPwForm]   = useState(false);
  const [currentPw,    setCurrentPw]    = useState('');
  const [newPw,        setNewPw]        = useState('');
  const [confirmPw,    setConfirmPw]    = useState('');
  const [showNew,      setShowNew]      = useState(false);
  const [savingPw,     setSavingPw]     = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const trimmed = nameValue.trim();
    if (!trimmed) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });
      if (error) throw error;
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPw.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    setSavingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      showToast('Password changed successfully!', 'success');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setShowPwForm(false);
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Account Settings" />

        <div className="page-container" style={{ maxWidth: '760px', margin: '0 auto', width: '100%' }}>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-section"
          >
            <div className="section-header">
              <h3 className="section-title">Profile Information</h3>
            </div>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              {}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '96px', height: '96px', borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '36px', fontWeight: '700', color: 'white',
                  boxShadow: 'var(--shadow-glow)',
                }}>
                  {initials}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  {user?.created_at
                    ? `Joined ${new Date(user.created_at).toLocaleDateString([], { month: 'short', year: 'numeric' })}`
                    : ''}
                </span>
              </div>

              {}
              <form onSubmit={handleSaveProfile} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Display Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-input"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      placeholder="Your full name"
                      style={{ paddingLeft: '36px' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      readOnly
                      style={{ paddingLeft: '36px', opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>
                  <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                    Email cannot be changed. Contact support if needed.
                  </small>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingProfile || nameValue.trim() === fullName}
                    style={{ opacity: savingProfile ? 0.7 : 1 }}
                  >
                    {savingProfile ? (
                      <>
                        <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        Saving…
                      </>
                    ) : (
                      <><Save size={16} /> Save Changes</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dashboard-section"
          >
            <div className="section-header">
              <h3 className="section-title">Security Settings</h3>
            </div>

            {}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Change Password</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>
                  Update your password to keep your account secure.
                </p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setShowPwForm((v) => !v)}
              >
                {showPwForm ? 'Cancel' : 'Update Password'}
              </button>
            </div>

            {}
            <AnimatePresence>
              {showPwForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{   opacity: 0, height: 0 }}
                  onSubmit={handleChangePassword}
                  style={{ overflow: 'hidden', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">New Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                      <input
                        type={showNew ? 'text' : 'password'}
                        className="form-input"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="Min. 8 characters"
                        style={{ paddingLeft: '36px', paddingRight: '44px' }}
                        required
                        minLength={8}
                      />
                      <button type="button" onClick={() => setShowNew((v) => !v)}
                        style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        className="form-input"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        placeholder="Repeat new password"
                        style={{ paddingLeft: '36px' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={savingPw}
                      style={{ opacity: savingPw ? 0.7 : 1 }}
                    >
                      {savingPw ? (
                        <>
                          <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                          Saving…
                        </>
                      ) : (
                        <><Lock size={16} /> Change Password</>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Active Session</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>
                  Logged in as <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                </p>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '20px',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                fontSize: '12px', color: 'var(--color-success)', fontWeight: '600',
              }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)' }} />
                Authenticated
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ProfilePage;



import { supabase } from '../core/supabaseClient';
import { api } from './api';

export const gaitService = {
  
  computeFileHash: async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  },

  
  checkDuplicateVideo: async (fileHash) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return null;

      const { data, error } = await supabase
        .from('detections')
        .select('*')
        .eq('user_id', user.id)
        .eq('file_hash', fileHash)
        .limit(1)
        .single();

      if (error || !data) return null;
      return {
        person: data.person_name,
        confidence: data.confidence,
        timestamp: data.created_at,
        videoFilename: data.video_filename,
        fileHash: data.file_hash,
        detectionId: data.id,
        alreadyExists: true,
        isDuplicateVideo: true,
        metrics: {
          avg_knee_angle: data.avg_knee_angle,
          avg_hip_angle: data.avg_hip_angle,
          stride_length: data.stride_length,
          step_count: data.step_count
        }
      };
    } catch (error) {
      console.error('Check duplicate error:', error);
      return null;
    }
  },

  checkPersonExists: async (personName) => {
    try {
      if (!personName || personName === 'Unknown') return false;

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return false;

      const { data, error } = await supabase
        .from('detections')
        .select('id')
        .eq('user_id', user.id)
        .eq('person_name', personName)
        .limit(1);

      if (error || !data || data.length === 0) return false;
      return true;
    } catch (error) {
      console.error('Check person exists error:', error);
      return false;
    }
  },

  
  analyzeGait: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/analyze/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,
    });

    return {
      success: true,
      ...response.data,
    };
  },

  
  saveDetectionResult: async (result, personNameOverride = null) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User is not authenticated.');
      }

      const personName = personNameOverride ?? result.person ?? 'Unknown';
      const isIdentified = personName !== 'Unknown';

      const { data, error } = await supabase
        .from('detections')
        .insert([
          {
            user_id:        user.id,
            person_name:    personName,
            confidence:     result.confidence,
            avg_knee_angle: parseFloat(result.metrics?.avg_knee_angle) || null,
            avg_hip_angle:  parseFloat(result.metrics?.avg_hip_angle)  || null,
            stride_length:  parseFloat(result.metrics?.stride_length)  || null,
            step_count:     parseInt(result.metrics?.step_count)       || null,
            video_filename: result.videoFilename || null,
            file_hash:      result.fileHash || null,
            is_identified:  isIdentified,
            created_at:     result.timestamp || new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { success: true, detectionId: data?.id, record: data };
    } catch (error) {
      console.error('Save detection error:', error.message);
      return { success: false, error: error.message };
    }
  },

  
  updateDetectionName: async (detectionId, newName) => {
    try {
      const trimmed = newName.trim();
      if (!trimmed) throw new Error('Name cannot be empty');

      const { data, error } = await supabase
        .from('detections')
        .update({
          person_name: trimmed,
          is_identified: trimmed !== 'Unknown',
        })
        .eq('id', detectionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, record: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteDetectionRecord: async (detectionId) => {
    try {
      const response = await api.delete(`/history/${detectionId}`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getDetectionHistory: async (limit = 50) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('User is not authenticated.');

      const { data, error } = await supabase
        .from('detections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  },

  
  getSystemStats: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('User is not authenticated.');
      const { count: totalScans, error: countErr } = await supabase
        .from('detections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countErr) throw countErr;
      const { data: personsData, error: personsErr } = await supabase
        .from('detections')
        .select('person_name')
        .eq('user_id', user.id)
        .neq('person_name', 'Unknown');

      if (personsErr) throw personsErr;

      const identifiedUsers = new Set(
        (personsData || []).map((r) => r.person_name)
      ).size;
      const { data: lastScanData, error: lastErr } = await supabase
        .from('detections')
        .select('created_at, person_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastErr && lastErr.code !== 'PGRST116') throw lastErr;

      return {
        success: true,
        stats: {
          totalScans:      totalScans  || 0,
          identifiedUsers: identifiedUsers,
          lastScanTime:    lastScanData?.created_at   || null,
          lastPerson:      lastScanData?.person_name  || null,
        },
      };
    } catch (error) {
      console.error('Get stats error:', error.message);
      return {
        success: true,
        stats: { totalScans: 0, identifiedUsers: 0, lastScanTime: null, lastPerson: null },
      };
    }
  },

  
  subscribeToDetections: (userId, onChange) => {
    const channel = supabase
      .channel('detections-realtime')
      .on(
        'postgres_changes',
        {
          event:  '*',
          schema: 'public',
          table:  'detections',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => onChange(payload.record || payload.new),
      )
      .subscribe();

    return channel;
  },
};


CREATE TABLE IF NOT EXISTS public.detections (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  person_name     TEXT        NOT NULL DEFAULT 'Unknown',
  confidence      FLOAT       NOT NULL,
  avg_knee_angle  FLOAT,
  avg_hip_angle   FLOAT,
  stride_length   FLOAT,
  step_count      INTEGER,
  video_filename  TEXT,
  is_identified   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_detections_user_id
  ON public.detections (user_id, created_at DESC);

ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own"
  ON public.detections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own"
  ON public.detections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own"
  ON public.detections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users_delete_own"
  ON public.detections FOR DELETE
  USING (auth.uid() = user_id);


-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS contact_submissions_user_id_idx ON contact_submissions(user_id);
CREATE INDEX IF NOT EXISTS contact_submissions_status_idx ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions(created_at);

-- Set up RLS policies
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own submissions
CREATE POLICY contact_submissions_insert_policy
  ON contact_submissions
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Allow users to view their own submissions
CREATE POLICY contact_submissions_select_policy
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow service role to do everything
CREATE POLICY contact_submissions_service_policy
  ON contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

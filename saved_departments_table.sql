-- Create saved_departments table to store user's saved departments
CREATE TABLE IF NOT EXISTS saved_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  institute TEXT NOT NULL,
  department TEXT NOT NULL,
  institute_type TEXT NOT NULL,
  state TEXT NOT NULL,
  nirf TEXT,
  quota TEXT NOT NULL,
  gender TEXT NOT NULL,
  seat_type TEXT NOT NULL,
  opening_rank INTEGER NOT NULL,
  closing_rank INTEGER NOT NULL,
  prediction_rank INTEGER,
  prediction_percentile NUMERIC(10,6),
  category_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, institute, department, quota, gender, seat_type)
);

-- Add RLS policies
ALTER TABLE saved_departments ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own saved departments
CREATE POLICY "Users can view their own saved departments"
  ON saved_departments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own saved departments
CREATE POLICY "Users can insert their own saved departments"
  ON saved_departments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own saved departments
CREATE POLICY "Users can update their own saved departments"
  ON saved_departments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own saved departments
CREATE POLICY "Users can delete their own saved departments"
  ON saved_departments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS saved_departments_user_id_idx ON saved_departments(user_id);
CREATE INDEX IF NOT EXISTS saved_departments_institute_idx ON saved_departments(institute);
CREATE INDEX IF NOT EXISTS saved_departments_department_idx ON saved_departments(department);

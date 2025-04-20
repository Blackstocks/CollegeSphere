-- Add exam_type column to saved_departments table
ALTER TABLE saved_departments 
ADD COLUMN IF NOT EXISTS exam_type TEXT DEFAULT 'jee-main';

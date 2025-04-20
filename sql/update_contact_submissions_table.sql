-- Modify the contact_submissions table to make user_id nullable
ALTER TABLE contact_submissions 
ALTER COLUMN user_id DROP NOT NULL;

-- Update the foreign key constraint to allow null values
ALTER TABLE contact_submissions 
DROP CONSTRAINT IF EXISTS contact_submissions_user_id_fkey;

ALTER TABLE contact_submissions 
ADD CONSTRAINT contact_submissions_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE SET NULL;

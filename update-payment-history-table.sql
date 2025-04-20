-- Add GST fields to payment_history table
ALTER TABLE payment_history 
ADD COLUMN IF NOT EXISTS base_amount DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS gst_amount DECIMAL(10, 2);

-- Update existing records to set base_amount and gst_amount based on amount_paid
-- Assuming 18% GST for all existing records
UPDATE payment_history
SET 
  base_amount = ROUND(amount_paid / 1.18, 2),
  gst_amount = ROUND(amount_paid - (amount_paid / 1.18), 2)
WHERE 
  base_amount IS NULL OR gst_amount IS NULL;

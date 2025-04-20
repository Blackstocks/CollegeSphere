-- Check if base_amount and gst_amount columns exist, and add them if they don't
DO $$
BEGIN
    -- Check if base_amount column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'credit_purchases' 
        AND column_name = 'base_amount'
    ) THEN
        -- Add base_amount column
        ALTER TABLE credit_purchases ADD COLUMN base_amount DECIMAL(10, 2);
    END IF;

    -- Check if gst_amount column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'credit_purchases' 
        AND column_name = 'gst_amount'
    ) THEN
        -- Add gst_amount column
        ALTER TABLE credit_purchases ADD COLUMN gst_amount DECIMAL(10, 2);
    END IF;
END
$$;

-- Update existing records to set base_amount and gst_amount if they're NULL
UPDATE credit_purchases
SET 
    base_amount = ROUND(amount_paid / 1.18, 2),
    gst_amount = ROUND(amount_paid - (amount_paid / 1.18), 2)
WHERE 
    base_amount IS NULL OR gst_amount IS NULL;

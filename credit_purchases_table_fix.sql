-- Check if the credit_purchases table exists, if not create it
CREATE TABLE IF NOT EXISTS credit_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_mobile TEXT NOT NULL,
  credits_purchased INTEGER NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  base_amount DECIMAL(10, 2),
  gst_amount DECIMAL(10, 2),
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Check if base_amount column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_purchases' AND column_name = 'base_amount'
  ) THEN
    ALTER TABLE credit_purchases ADD COLUMN base_amount DECIMAL(10, 2);
  END IF;
END $$;

-- Check if gst_amount column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_purchases' AND column_name = 'gst_amount'
  ) THEN
    ALTER TABLE credit_purchases ADD COLUMN gst_amount DECIMAL(10, 2);
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'credit_purchases' AND indexname = 'credit_purchases_user_id_idx'
  ) THEN
    CREATE INDEX credit_purchases_user_id_idx ON credit_purchases(user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'credit_purchases' AND indexname = 'credit_purchases_razorpay_order_id_idx'
  ) THEN
    CREATE INDEX credit_purchases_razorpay_order_id_idx ON credit_purchases(razorpay_order_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'credit_purchases' AND indexname = 'credit_purchases_payment_status_idx'
  ) THEN
    CREATE INDEX credit_purchases_payment_status_idx ON credit_purchases(payment_status);
  END IF;
END $$;

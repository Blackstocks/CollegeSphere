-- Create payment_history table to track all transactions
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  credits_purchased INTEGER NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  transaction_id TEXT,
  order_id TEXT,
  payment_details JSONB,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  payment_method TEXT NOT NULL DEFAULT 'razorpay', -- 'razorpay', 'manual', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS payment_history_user_id_idx ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS payment_history_payment_status_idx ON payment_history(payment_status);
CREATE INDEX IF NOT EXISTS payment_history_created_at_idx ON payment_history(created_at);
CREATE INDEX IF NOT EXISTS payment_history_transaction_id_idx ON payment_history(transaction_id);
CREATE INDEX IF NOT EXISTS payment_history_order_id_idx ON payment_history(order_id);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_history_updated_at
BEFORE UPDATE ON payment_history
FOR EACH ROW
EXECUTE FUNCTION update_payment_history_updated_at();

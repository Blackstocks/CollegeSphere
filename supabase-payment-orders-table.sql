-- Create payment_orders table
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_mobile TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS payment_orders_user_id_idx ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS payment_orders_status_idx ON payment_orders(status);
CREATE INDEX IF NOT EXISTS payment_orders_transaction_id_idx ON payment_orders(transaction_id);

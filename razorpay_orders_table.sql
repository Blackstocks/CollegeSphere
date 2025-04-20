-- Create table for Razorpay orders with GST information
CREATE TABLE IF NOT EXISTS razorpay_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_mobile TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  base_amount DECIMAL(10, 2) NOT NULL,
  gst_amount DECIMAL(10, 2) NOT NULL,
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('created', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS razorpay_orders_user_id_idx ON razorpay_orders(user_id);
CREATE INDEX IF NOT EXISTS razorpay_orders_status_idx ON razorpay_orders(status);

-- Create credit_purchases table to track all user credit purchases
CREATE TABLE IF NOT EXISTS credit_purchases (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES users(id),
user_name TEXT NOT NULL,
user_email TEXT NOT NULL,
user_mobile TEXT NOT NULL,
credits_purchased INTEGER NOT NULL,
amount_paid DECIMAL(10, 2) NOT NULL,
base_amount DECIMAL(10, 2) NOT NULL,
gst_amount DECIMAL(10, 2) NOT NULL,
razorpay_order_id TEXT NOT NULL,
razorpay_payment_id TEXT,
payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
purchase_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS credit_purchases_user_id_idx ON credit_purchases(user_id);
CREATE INDEX IF NOT EXISTS credit_purchases_payment_status_idx ON credit_purchases(payment_status);
CREATE INDEX IF NOT EXISTS credit_purchases_razorpay_order_id_idx ON credit_purchases(razorpay_order_id);
CREATE INDEX IF NOT EXISTS credit_purchases_razorpay_payment_id_idx ON credit_purchases(razorpay_payment_id);

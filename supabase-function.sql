-- Create a function to handle both credit deduction and transaction logging in a single transaction
CREATE OR REPLACE FUNCTION deduct_credits_and_log(
  p_user_id UUID,
  p_credits INTEGER,
  p_transaction_type TEXT
) RETURNS VOID AS $$
BEGIN
  -- Update user credits
  UPDATE users
  SET credits = credits - p_credits
  WHERE id = p_user_id;
  
  -- Log the transaction
  INSERT INTO credit_transactions (
    user_id,
    credits_added,
    transaction_type
  ) VALUES (
    p_user_id,
    -p_credits,
    p_transaction_type
  );
END;
$$ LANGUAGE plpgsql;

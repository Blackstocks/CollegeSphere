-- Create chatbot_users table to store user information from the chatbot
CREATE TABLE IF NOT EXISTS chatbot_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT now(),
  interaction_count INTEGER DEFAULT 1,
  source TEXT DEFAULT 'chatbot',
  notes TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS chatbot_users_email_idx ON chatbot_users(email);
CREATE INDEX IF NOT EXISTS chatbot_users_mobile_idx ON chatbot_users(mobile);
CREATE INDEX IF NOT EXISTS chatbot_users_created_at_idx ON chatbot_users(created_at);

-- Create a function to update last_interaction timestamp
CREATE OR REPLACE FUNCTION update_chatbot_user_last_interaction()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_interaction = now();
  NEW.interaction_count = OLD.interaction_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update last_interaction
CREATE TRIGGER update_chatbot_user_last_interaction
BEFORE UPDATE ON chatbot_users
FOR EACH ROW
EXECUTE FUNCTION update_chatbot_user_last_interaction();

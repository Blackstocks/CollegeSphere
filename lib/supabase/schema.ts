// This file represents the database schema we'll create in Supabase
// You'll need to create these tables in your Supabase dashboard

/*
Table: users
- id (uuid, primary key, default: uuid_generate_v4())
- name (text, not null)
- email (text, not null, unique)
- mobile (text, not null)
- gender (text, not null)
- category (text, not null)
- home_state (text, not null)
- credits (integer, not null, default: 50)
- created_at (timestamp with time zone, default: now())

Table: predictions
- id (uuid, primary key, default: uuid_generate_v4())
- user_id (uuid, references users.id)
- percentile (numeric(10,6), not null)
- rank (integer, not null)
- colleges (jsonb, not null)
- created_at (timestamp with time zone, default: now())

Table: credit_transactions
- id (uuid, primary key, default: uuid_generate_v4())
- user_id (uuid, references users.id)
- credits_added (integer, not null)
- transaction_type (text, not null) - 'recharge', 'prediction', 'view_details', etc.
- payment_id (text) - optional, for recharge transactions
- created_at (timestamp with time zone, default: now())
*/

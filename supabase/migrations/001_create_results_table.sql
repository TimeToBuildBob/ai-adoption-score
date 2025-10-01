-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL,
  percentile INTEGER,
  archetype TEXT NOT NULL,
  category_scores JSONB NOT NULL,
  answers JSONB NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS results_overall_score_idx ON results(overall_score);
CREATE INDEX IF NOT EXISTS results_is_verified_idx ON results(is_verified);
CREATE INDEX IF NOT EXISTS results_created_at_idx ON results(created_at);
CREATE INDEX IF NOT EXISTS results_user_id_idx ON results(user_id);

-- Enable Row Level Security
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read verified results (for stats)
CREATE POLICY "Anyone can read verified results"
  ON results FOR SELECT
  USING (is_verified = true);

-- Policy: Anyone can insert results
CREATE POLICY "Anyone can insert results"
  ON results FOR INSERT
  WITH CHECK (true);

-- Policy: Users can read their own results
CREATE POLICY "Users can read own results"
  ON results FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own results
CREATE POLICY "Users can update own results"
  ON results FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to calculate percentile
CREATE OR REPLACE FUNCTION calculate_percentile(score INTEGER)
RETURNS INTEGER AS $$
DECLARE
  total_verified INTEGER;
  lower_count INTEGER;
BEGIN
  -- Get total verified results
  SELECT COUNT(*) INTO total_verified
  FROM results
  WHERE is_verified = true;
  
  -- If no verified results, return based on score
  IF total_verified = 0 THEN
    RETURN LEAST(99, GREATEST(1, score));
  END IF;
  
  -- Count how many verified results have lower scores
  SELECT COUNT(*) INTO lower_count
  FROM results
  WHERE is_verified = true AND overall_score < score;
  
  -- Calculate percentile
  RETURN LEAST(99, GREATEST(1, ROUND((lower_count::FLOAT / total_verified::FLOAT) * 100)));
END;
$$ LANGUAGE plpgsql;

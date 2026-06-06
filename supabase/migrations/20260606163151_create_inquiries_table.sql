CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  practice_area text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_inquiries" ON inquiries FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "select_inquiries" ON inquiries FOR SELECT
  TO authenticated USING (true);
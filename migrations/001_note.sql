CREATE TABLE IF NOT EXISTS public.starter_note (
  id smallint PRIMARY KEY CHECK (id = 1),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 280),
  revision bigint NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.starter_note (id, body) VALUES (1, 'Hello from Host Little.')
ON CONFLICT (id) DO NOTHING;

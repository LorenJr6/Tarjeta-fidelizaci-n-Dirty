-- Ejecuta esto una vez en el SQL Editor de Neon (o en la pestaña "Query" de Vercel Storage).
-- Guardado aquí como referencia del proyecto, no se ejecuta solo.

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  stamps INTEGER NOT NULL DEFAULT 0,
  rewards INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

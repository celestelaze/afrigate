-- 001 — Pré-requis de la fonction "register" (ajout seulement, sans risque pour le site actuel)
CREATE TABLE IF NOT EXISTS public.edge_rate_limits (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key        text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS edge_rate_limits_key_created_idx ON public.edge_rate_limits (key, created_at DESC);

-- RLS activée sans aucune politique = personne (anon/authenticated) n'y a accès ; seule la fonction serveur (service_role) y écrit.
ALTER TABLE public.edge_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.edge_rate_limits FROM anon, authenticated;

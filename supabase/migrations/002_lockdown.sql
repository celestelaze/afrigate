-- 002 — Verrouillage. À appliquer UNIQUEMENT quand le nouveau site (qui appelle la fonction "register") est en ligne.

-- 1) Fin de l'inscription directe depuis le navigateur (contournable)
DROP FUNCTION IF EXISTS public.register_user(text, text, text, text, text, text);

-- 2) Fin de l'auto-confirmation des emails (ouvrait un contournement via l'inscription publique de Supabase)
DROP TRIGGER  IF EXISTS auto_confirm_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.auto_confirm_user();

-- 3) Un numéro vérifié = un seul compte
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique ON public.profiles (phone) WHERE phone IS NOT NULL AND phone <> '';

-- 4) Un utilisateur ne peut ni créer son profil à la main, ni changer son numéro vérifié
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT  UPDATE (first_name, last_name, country) ON public.profiles TO authenticated;

-- 5) Un transfert ne peut être créé que "pending" et à son propre nom
DROP POLICY IF EXISTS transfers_insert_own ON public.transfers;
CREATE POLICY transfers_insert_own ON public.transfers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

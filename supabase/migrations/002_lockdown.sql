-- 002 — Verrouillage. À appliquer UNIQUEMENT quand le nouveau site (qui appelle la fonction "register") est en ligne.

-- 1) Fin de l'inscription directe depuis le navigateur (contournable : exécutable par n'importe qui)
DROP FUNCTION IF EXISTS public.register_user(text, text, text, text, text, text);

-- 2) Fin de l'auto-confirmation des emails (permettait de créer un compte sans passer par le site)
DROP TRIGGER  IF EXISTS auto_confirm_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.auto_confirm_user();

-- 3) Un numéro vérifié = un seul compte
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique ON public.profiles (phone) WHERE phone IS NOT NULL AND phone <> '';

-- 4) profiles : doublons de politiques supprimés ; un utilisateur ne crée pas son profil et ne change pas son numéro vérifié
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profile_insert_own  ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
DROP POLICY IF EXISTS profile_update_own  ON public.profiles;
DROP POLICY IF EXISTS profile_select_own  ON public.profiles;   -- doublon de profiles_select_own
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT  UPDATE (first_name, last_name, country) ON public.profiles TO authenticated;

-- 5) transfers : plus d'insertion anonyme ; un transfert ne naît que "pending" et à son propre nom
DROP POLICY IF EXISTS transfer_insert_anon ON public.transfers;
DROP POLICY IF EXISTS transfer_insert_own  ON public.transfers;
DROP POLICY IF EXISTS transfer_select_own  ON public.transfers;  -- doublon de transfers_select_own
DROP POLICY IF EXISTS transfers_insert_own ON public.transfers;
CREATE POLICY transfers_insert_own ON public.transfers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

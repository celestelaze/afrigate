# AfriGate — Transfert d'argent 🌍

Site web professionnel de transfert d'argent entre le **Maroc** et l'**Afrique de l'Ouest**.

## Pays couverts
🇲🇦 Maroc · 🇨🇮 Côte d'Ivoire · 🇸🇳 Sénégal · 🇬🇼 Guinée-Bissau · 🇲🇱 Mali · 🇳🇪 Niger · 🇧🇫 Burkina Faso

## Stack technique
- ⚛️ React 18 + Vite
- 🎨 Tailwind CSS
- 🔐 Supabase (Auth + Database)
- 🔁 React Router v6

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/afrigate.git
cd afrigate
npm install
```

### Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez `.env.example` → `.env`
3. Remplissez vos clés Supabase dans `.env`

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Créer les tables Supabase

Exécutez ce SQL dans l'éditeur SQL de Supabase :

```sql
-- Profils utilisateurs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transferts
CREATE TABLE transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  direction TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  send_method TEXT NOT NULL,
  receive_method TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  fees NUMERIC NOT NULL,
  total_to_pay NUMERIC NOT NULL,
  amount_received NUMERIC NOT NULL,
  origin_currency TEXT NOT NULL,
  destination_currency TEXT NOT NULL,
  beneficiary_first_name TEXT NOT NULL,
  beneficiary_last_name TEXT NOT NULL,
  beneficiary_phone TEXT NOT NULL,
  reference TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sécurité (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can read own transfers" ON transfers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transfers" ON transfers FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Lancer le projet

```bash
npm run dev
```

---

## Personnalisation

| Fichier | Ce qu'il faut changer |
|---|---|
| `src/lib/constants.js` | Numéro WhatsApp, taux de change |
| `src/pages/Social.jsx` | Liens réseaux sociaux |
| `src/components/Footer.jsx` | Email, téléphone |

### Changer le numéro WhatsApp
Dans `src/lib/constants.js` :
```js
export const WHATSAPP_NUMBER = '212600000000' // ← remplacer ici
```

---

## Déploiement sur Vercel

```bash
npm run build
# Puis déployez le dossier /dist sur Vercel, Netlify ou tout hébergeur static
```

---

## Taux de change

| Direction | Taux | Frais |
|---|---|---|
| 🇲🇦 Maroc → Afrique | 1 MAD = 57 FCFA | +10% |
| 🌍 Afrique → 🇲🇦 Maroc | 1 MAD = 63 FCFA | +10% |

---

© 2025 AfriGate. Tous droits réservés.

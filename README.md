# CRX Frontend

Interface utilisateur du projet CRX Marketplace — plateforme dédiée aux marques de mode indépendantes françaises.

---

## Stack technique

| Technologie | Rôle |
|---|---|
| Next.js 16 | Framework React — SSR, routing, optimisations |
| TypeScript | Langage — typage statique |
| Tailwind CSS | Styles utilitaires |
| React Context | Gestion de l'état global (panier, auth) |

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                  → Landing page (/)
│   ├── login/page.tsx            → Connexion + Inscription
│   ├── products/[id]/page.tsx    → Fiche produit
│   ├── panier/page.tsx           → Panier
│   ├── checkout/page.tsx         → Tunnel d'achat (3 étapes)
│   ├── dashboard/page.tsx        → Back-office marque (BRAND)
│   └── admin/page.tsx            → Dashboard admin (ADMIN)
├── components/
│   ├── Header.tsx                → Navigation + panier + auth
│   ├── Hero.tsx
│   ├── Articles.tsx              → Grille des marques
│   ├── Spotlight.tsx
│   ├── Newsletter.tsx
│   ├── ValueProposition.tsx
│   └── Footer.tsx
├── context/
│   └── CartContext.tsx           → État global du panier
├── hooks/
│   └── useAuth.ts                → Login, register, logout
├── lib/
│   └── api.ts                    → Client HTTP vers le backend
├── types/
│   └── index.ts                  → Types TypeScript partagés
└── middleware.ts                 → Protection des routes par cookie
```

---

## Prérequis

- Node.js 20+

---

## Installation

```bash
# Cloner le repo
git clone https://github.com/ikramlhm-hub/crx-frontend.git
cd crx-frontend

# Installer les dépendances
npm install
```

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

En production :

```env
NEXT_PUBLIC_API_URL=https://crx-backend.onrender.com/api
```

---

## Lancer en développement

```bash
npm run dev
```

Le site démarre sur `http://localhost:3000`

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Démarrage en développement avec hot reload |
| `npm run build` | Build de production |
| `npm start` | Démarrage en production |

---

## Pages et accès par rôle

| Page | Non connecté | CONSUMER | BRAND | ADMIN |
|---|---|---|---|---|
| Landing page `/` | ✓ | ✓ | ✓ | ✓ |
| Fiche produit `/products/[id]` | ✓ | ✓ | ✓ sans panier | ✓ |
| Panier `/panier` | ✓ | ✓ | Redirigé dashboard | — |
| Checkout `/checkout` | Redirigé login | ✓ | — | — |
| Dashboard `/dashboard` | Redirigé login | — | ✓ | — |
| Admin `/admin` | Redirigé login | — | — | ✓ |

---

## Gestion de l'état

### CartContext
Gère le panier globalement — accessible depuis tous les composants.

```typescript
const { items, total, count, addItem, removeItem, increment, decrement, clear } = useCart()
```

### useAuth
Gère l'authentification — login, register, logout avec redirection automatique selon le rôle.

```typescript
const { user, loading, login, register, logout } = useAuth()
```

Après connexion :
- `BRAND` → redirigé vers `/dashboard`
- `ADMIN` → redirigé vers `/admin`
- `CONSUMER` → reste sur la landing page

---

## Séparation des rôles côté frontend

Les restrictions suivantes sont appliquées selon le rôle connecté :

**BRAND**
- Icône panier masquée dans le Header
- Bouton "Ajouter au panier" remplacé par un message informatif
- Redirection automatique vers `/dashboard` à la connexion
- Bouton "Mon dashboard" affiché dans le Header

**CONSUMER**
- Accès complet au catalogue et au tunnel d'achat
- Pas d'accès au dashboard marque ni à l'admin

> La vérification des droits est aussi faite côté serveur (backend) — le frontend ne fait qu'adapter l'affichage.

---

## Protection des routes

Deux niveaux de protection :

**Middleware Next.js** (`src/middleware.ts`) — côté serveur, vérifie le cookie `accessToken` avant de servir la page.

**useEffect côté composant** — vérifie le rôle et redirige si nécessaire (ex: un BRAND qui tente d'accéder à `/checkout`).

---

## Production

| Service | URL |
|---|---|
| Frontend | https://crx-market.fr |
| Backend | https://crx-backend.onrender.com |

**Comptes de démonstration**

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@crx.fr | admin123secure |
| Marque | ikram@crx.fr | motdepasse123 |
| Consommateur | rayan@crx.fr | motdepasse123 |

---

## Auteure

Ikram Lahmouri — M1 Développeur Full Stack — Avril 2026

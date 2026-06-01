# Box Office Explorer

Application web full-stack pour explorer les données de box-office de 200 films et génération d'une description du film grâce à l'IA (2022–2024).

## Stack

- **Frontend** : React 18 + TypeScript + Vite
- **Backend** : Express + TypeScript
- **Données** : fichier `box-office-200.json` (lu/écrit en direct par l'API)

---

## Prérequis

- Node.js ≥ 18
- npm ≥ 9

---

## Installation

```bash
# À la racine du projet
npm run install:all
```

Cette commande installe les dépendances racine (concurrently), serveur et client.

---

## Configuration

Crée ou modifie le fichier `server/.env` :

```env
GROQ_API_KEY=your_groq_api_key_here
```

Obtenir une clé gratuite sur [console.groq.com](https://console.groq.com). ou contactez-moi si vous avez besoin d'une clé.

---

## Lancer le projet

Ouvrir deux terminaux séparés :

**Terminal 1 — Serveur (port 3001)**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend (port 3000)**
```bash
cd frontend
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## API REST

Base URL : `http://localhost:3001/api/films`

| Méthode | Route              | Description                          |
| ------- | ------------------ | ------------------------------------ |
| GET     | `/api/films`       | Récupère tous les films              |
| GET     | `/api/films/:id`   | Récupère un film par son ID          |
| POST    | `/api/films`       | Crée un nouveau film (avec validation) |
| PUT     | `/api/films/:id`   | Modifie un film existant             |
| DELETE  | `/api/films/:id`   | Supprime un film                     |

### Corps attendu pour POST / PUT

```json
{
  "titre": "Mon Film",
  "date_sortie": "2024-06-15",
  "genre": "Action",
  "recettes_totales": 12000000,
  "nombre_entrees": 950000,
  "pays_origine": "France",
  "distributeur": "Gaumont",
  "duree_minutes": 120,
  "note_presse": 7.5
}
```

Toutes les valeurs sont **obligatoires** à la création. La validation vérifie :
- `note_presse` entre 0 et 10
- `duree_minutes` entier positif
- `date_sortie` au format `YYYY-MM-DD`
- `recettes_totales` et `nombre_entrees` ≥ 0

---

## Fonctionnalités

### Obligatoires
- Liste des films avec titre, genre, recettes, date de sortie et note presse
- Filtre par genre
- Tri par recettes (croissant/décroissant) ou par date de sortie
- Compteur de films et recettes cumulées mis à jour selon les filtres
- Page détail avec toutes les informations d'un film

### Bonus
- **Statistiques par genre** : nombre de films, recettes totales, note presse moyenne
- **Moteur de recommandation** : 3 films similaires sur la page détail
- **CRUD complet** via l'API Express (persiste dans le JSON)

---

## Algorithme de recommandation

Le score de similarité entre deux films est calculé ainsi :

```
score = genre_match × 3
      + (1 − |rev_a − rev_b| / rev_max) × 2
      + (1 − |note_a − note_b| / 10) × 1
```

- **Genre** (0 ou 3 pts) : le genre est le critère le plus fort, car les préférences du spectateur sont d'abord catégorielles.
- **Proximité des recettes** (0–2 pts) : deux films au succès commercial similaire partagent souvent un public et un positionnement marketing proches. La différence est normalisée par le maximum du catalogue.
- **Proximité de la note presse** (0–1 pt) : recommander des films de qualité équivalente améliore la cohérence perçue, mais ce critère reste secondaire.

Score max possible : 6. Les 3 films avec le score le plus élevé (hors le film courant) sont affichés.

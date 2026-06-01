import { Router, Request, Response } from 'express';
import fs from 'fs';
import { DATA_PATH } from '../config';
import { Film } from '../types/film';
import { AsyncMutex } from '../utils/AsyncMutex';

const router = Router();
const mutex = new AsyncMutex();

// ── Helpers ──────────────────────────────────────────────────────────────────

function readFilms(): Film[] {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  try {
    return JSON.parse(raw) as Film[];
  } catch (err) {
    throw new Error(`Fichier JSON corrompu : ${err instanceof Error ? err.message : String(err)}`);
  }
}

function writeFilms(films: Film[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(films, null, 2), 'utf-8');
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateFilm(data: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];

  if (!data.titre || typeof data.titre !== 'string' || data.titre.trim() === '') {
    errors.push('titre est requis');
  }

  if (
    !data.date_sortie ||
    typeof data.date_sortie !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date_sortie) ||
    isNaN(Date.parse(data.date_sortie))
  ) {
    errors.push('date_sortie doit être une date valide au format YYYY-MM-DD');
  }

  if (!data.genre || typeof data.genre !== 'string' || data.genre.trim() === '') {
    errors.push('genre est requis');
  }

  if (typeof data.recettes_totales !== 'number' || data.recettes_totales < 0) {
    errors.push('recettes_totales doit être un nombre positif ou nul');
  }

  if (typeof data.nombre_entrees !== 'number' || data.nombre_entrees < 0) {
    errors.push('nombre_entrees doit être un nombre positif ou nul');
  }

  if (!data.pays_origine || typeof data.pays_origine !== 'string' || data.pays_origine.trim() === '') {
    errors.push('pays_origine est requis');
  }

  if (!data.distributeur || typeof data.distributeur !== 'string' || data.distributeur.trim() === '') {
    errors.push('distributeur est requis');
  }

  if (
    typeof data.duree_minutes !== 'number' ||
    !Number.isInteger(data.duree_minutes) ||
    data.duree_minutes <= 0
  ) {
    errors.push('duree_minutes doit être un entier strictement positif');
  }

  if (
    data.note_presse !== null &&
    data.note_presse !== undefined &&
    (typeof data.note_presse !== 'number' ||
      data.note_presse < 0 ||
      data.note_presse > 10)
  ) {
    errors.push('note_presse doit être un nombre entre 0 et 10, ou null');
  }

  return { valid: errors.length === 0, errors };
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/films
router.get('/', async (_req: Request, res: Response) => {
  try {
    const films = readFilms();
    res.json(films);
  } catch (err) {
    console.error('[GET /films]', err instanceof Error ? err.message : err);
    res.status(500).json({ message: 'Erreur lors de la lecture des données' });
  }
});

// GET /api/films/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const films = readFilms();
    const film = films.find((f) => f.id === parseInt(req.params.id, 10));
    if (!film) {
      res.status(404).json({ message: 'Film non trouvé' });
      return;
    }
    res.json(film);
  } catch (err) {
    console.error('[GET /films/:id]', err instanceof Error ? err.message : err);
    res.status(500).json({ message: 'Erreur lors de la lecture des données' });
  }
});

// POST /api/films
router.post('/', (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;

  const { valid, errors } = validateFilm(body);
  if (!valid) {
    res.status(400).json({ message: 'Données invalides', errors });
    return;
  }

  mutex.run(async () => {
    try {
      const films = readFilms();
      const newId = films.length > 0 ? Math.max(...films.map((f) => f.id)) + 1 : 1;
      const newFilm: Film = {
        id: newId,
        titre: (body.titre as string).trim(),
        date_sortie: body.date_sortie as string,
        genre: (body.genre as string).trim(),
        recettes_totales: body.recettes_totales as number,
        nombre_entrees: body.nombre_entrees as number,
        pays_origine: (body.pays_origine as string).trim(),
        distributeur: (body.distributeur as string).trim(),
        duree_minutes: body.duree_minutes as number,
        note_presse: (body.note_presse as number | null) ?? null,
      };
      films.push(newFilm);
      writeFilms(films);
      res.status(201).json(newFilm);
    } catch (err) {
      console.error('[POST /films]', err instanceof Error ? err.message : err);
      res.status(500).json({ message: 'Erreur lors de la création du film' });
    }
  });
});

// PUT /api/films/:id
router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const body = req.body as Record<string, unknown>;

  mutex.run(async () => {
    try {
      const films = readFilms();
      const idx = films.findIndex((f) => f.id === id);

      if (idx === -1) {
        res.status(404).json({ message: 'Film non trouvé' });
        return;
      }

      const merged = { ...films[idx], ...body, id: films[idx].id };
      const { valid, errors } = validateFilm(merged as unknown as Record<string, unknown>);
      if (!valid) {
        res.status(400).json({ message: 'Données invalides', errors });
        return;
      }

      films[idx] = merged;
      writeFilms(films);
      res.json(films[idx]);
    } catch (err) {
      console.error('[PUT /films/:id]', err instanceof Error ? err.message : err);
      res.status(500).json({ message: 'Erreur lors de la modification du film' });
    }
  });
});

// DELETE /api/films/:id
router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  mutex.run(async () => {
    try {
      const films = readFilms();
      const idx = films.findIndex((f) => f.id === id);

      if (idx === -1) {
        res.status(404).json({ message: 'Film non trouvé' });
        return;
      }

      const [deleted] = films.splice(idx, 1);
      writeFilms(films);
      res.json(deleted);
    } catch (err) {
      console.error('[DELETE /films/:id]', err instanceof Error ? err.message : err);
      res.status(500).json({ message: 'Erreur lors de la suppression du film' });
    }
  });
});

export default router;

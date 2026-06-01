import { Film } from '../types/film';

/**
 * Recommendation algorithm
 *
 * Score (max 6) = genre_match × 3
 *               + (1 − |rev_a − rev_b| / rev_max) × 2
 *               + (1 − |note_a − note_b| / 10) × 1
 *
 * Genre carries the most weight (viewer preference is category-first).
 * Revenue proximity (normalised) catches similar budget/commercial appeal.
 * Rating proximity ensures consistent quality.
 */
export function getSimilarFilms(film: Film, allFilms: Film[], count = 3): Film[] {
  if (allFilms.length === 0) return [];

  // Guard against division by zero when all revenues are 0
  const maxRevenue = Math.max(...allFilms.map((f) => f.recettes_totales), 1);

  return allFilms
    .filter((f) => f.id !== film.id)
    .map((f) => {
      let score = 0;

      if (f.genre === film.genre) score += 3;

      const revenueDiff = Math.abs(f.recettes_totales - film.recettes_totales);
      score += 2 * (1 - revenueDiff / maxRevenue);

      const noteA = film.note_presse ?? 5;
      const noteB = f.note_presse ?? 5;
      const ratingDiff = Math.abs(noteA - noteB);
      score += 1 - ratingDiff / 10;

      return { film: f, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.film);
}

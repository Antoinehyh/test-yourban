import { Film } from '../types/film';

export interface GenreStat {
  genre: string;
  count: number;
  total_revenue: number;
  avg_rating: number | null;
}

export function computeGenreStats(films: Film[]): GenreStat[] {
  const map = new Map<string, { count: number; revenue: number; ratingSum: number; ratingCount: number }>();

  for (const film of films) {
    const existing = map.get(film.genre) ?? { count: 0, revenue: 0, ratingSum: 0, ratingCount: 0 };
    map.set(film.genre, {
      count: existing.count + 1,
      revenue: existing.revenue + film.recettes_totales,
      ratingSum: existing.ratingSum + (film.note_presse ?? 0),
      ratingCount: existing.ratingCount + (film.note_presse !== null && film.note_presse !== undefined ? 1 : 0),
    });
  }

  return Array.from(map.entries())
    .map(([genre, data]) => ({
      genre,
      count: data.count,
      total_revenue: data.revenue,
      avg_rating:
        data.ratingCount > 0
          ? Math.round((data.ratingSum / data.ratingCount) * 10) / 10
          : null,
    }))
    .sort((a, b) => b.total_revenue - a.total_revenue);
}

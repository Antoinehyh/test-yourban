import { Film } from '../types/film';

const API_BASE = '/api/films';

export async function getFilms(signal?: AbortSignal): Promise<Film[]> {
  const res = await fetch(API_BASE, { signal });
  if (!res.ok) throw new Error('Impossible de charger les films');
  return res.json();
}

export async function getFilm(id: number, signal?: AbortSignal): Promise<Film> {
  const res = await fetch(`${API_BASE}/${id}`, { signal });
  if (!res.ok) throw new Error('Film non trouvé');
  return res.json();
}

export async function createFilm(film: Omit<Film, 'id'>): Promise<Film> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(film),
  });
  if (!res.ok) {
    let message = 'Erreur création';
    try {
      const err = await res.json() as { message?: string };
      if (typeof err.message === 'string') message = err.message;
    } catch {
      // JSON parse failed, keep default message
    }
    throw new Error(message);
  }
  return res.json();
}

export async function updateFilm(id: number, film: Partial<Omit<Film, 'id'>>): Promise<Film> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(film),
  });
  if (!res.ok) {
    let message = 'Erreur modification';
    try {
      const err = await res.json() as { message?: string };
      if (typeof err.message === 'string') message = err.message;
    } catch {
      // JSON parse failed, keep default message
    }
    throw new Error(message);
  }
  return res.json();
}

export async function deleteFilm(id: number): Promise<Film> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur suppression');
  return res.json();
}

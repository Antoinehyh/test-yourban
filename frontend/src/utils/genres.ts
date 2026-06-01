const GENRE_STYLES: Record<string, { bg: string; color: string }> = {
  'Action':            { bg: 'rgb(239 68 68 / .12)',   color: '#fca5a5' },
  'Animation':         { bg: 'rgb(251 191 36 / .12)',  color: '#fcd34d' },
  'Aventure':          { bg: 'rgb(56 189 248 / .12)',  color: '#7dd3fc' },
  'Comédie':           { bg: 'rgb(74 222 128 / .12)',  color: '#86efac' },
  'Comédie Musicale':  { bg: 'rgb(217 70 239 / .12)',  color: '#e879f9' },
  'Documentaire':      { bg: 'rgb(148 163 184 / .12)', color: '#cbd5e1' },
  'Drame':             { bg: 'rgb(244 114 182 / .12)', color: '#f9a8d4' },
  'Fantaisie':         { bg: 'rgb(52 211 153 / .12)',  color: '#6ee7b7' },
  'Horreur':           { bg: 'rgb(100 116 139 / .15)', color: '#94a3b8' },
  'Romance':           { bg: 'rgb(251 113 133 / .12)', color: '#fda4af' },
  'Science-Fiction':   { bg: 'rgb(139 92 246 / .12)',  color: '#c4b5fd' },
  'Thriller':          { bg: 'rgb(248 113 113 / .12)', color: '#fca5a5' },
  'Western':           { bg: 'rgb(201 168 76 / .15)',  color: '#e2c06a' },
};

export function getGenreStyle(genre: string): { bg: string; color: string } {
  return GENRE_STYLES[genre] ?? { bg: '#e2e8f0', color: '#475569' };
}

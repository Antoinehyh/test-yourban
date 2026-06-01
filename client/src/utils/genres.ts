const GENRE_STYLES: Record<string, { bg: string; color: string }> = {
  'Action':            { bg: '#dbeafe', color: '#1d4ed8' },
  'Animation':         { bg: '#fef3c7', color: '#b45309' },
  'Aventure':          { bg: '#cffafe', color: '#0369a1' },
  'Comédie':           { bg: '#dcfce7', color: '#15803d' },
  'Comédie Musicale':  { bg: '#fae8ff', color: '#a21caf' },
  'Documentaire':      { bg: '#e0f2fe', color: '#0284c7' },
  'Drame':             { bg: '#fce7f3', color: '#be185d' },
  'Fantaisie':         { bg: '#f0fdf4', color: '#16a34a' },
  'Horreur':           { bg: '#f3f4f6', color: '#374151' },
  'Romance':           { bg: '#ffe4e6', color: '#e11d48' },
  'Science-Fiction':   { bg: '#ede9fe', color: '#6d28d9' },
  'Thriller':          { bg: '#fee2e2', color: '#dc2626' },
  'Western':           { bg: '#fef9c3', color: '#854d0e' },
};

export function getGenreStyle(genre: string): { bg: string; color: string } {
  return GENRE_STYLES[genre] ?? { bg: '#e2e8f0', color: '#475569' };
}

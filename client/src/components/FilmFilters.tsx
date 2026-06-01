import React from 'react';
import { SortKey } from '../types/film';

interface Props {
  genres: string[];
  selectedGenre: string;
  sortKey: SortKey;
  filmCount: number;
  onGenreChange: (genre: string) => void;
  onSortChange: (sort: SortKey) => void;
}

const FilmFilters: React.FC<Props> = React.memo(({
  genres,
  selectedGenre,
  sortKey,
  filmCount,
  onGenreChange,
  onSortChange,
}) => {
  return (
    <div className="filters-section">
      <div className="container">
        <div className="filters-content">
          <div className="filter-group">
            <label htmlFor="genre-filter">Genre</label>
            <select
              id="genre-filter"
              className="filter-select"
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
            >
              <option value="">Tous les genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter">Trier par</label>
            <select
              id="sort-filter"
              className="filter-select"
              value={sortKey}
              onChange={(e) => onSortChange(e.target.value as SortKey)}
            >
              <option value="recettes_desc">Recettes ↓</option>
              <option value="recettes_asc">Recettes ↑</option>
              <option value="date_desc">Date (récent)</option>
              <option value="date_asc">Date (ancien)</option>
            </select>
          </div>

          <div className="filters-spacer" />

          <span className="results-count">
            <strong>{filmCount}</strong> film{filmCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
});

FilmFilters.displayName = 'FilmFilters';

export default FilmFilters;

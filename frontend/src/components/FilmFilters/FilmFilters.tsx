import React from 'react';
import { SortKey } from '../../types/film';
import './FilmFilters.css';

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
    <div className="filters-bar">
      <div className="container filters-bar__inner">
        <div className="filters-bar__group">
          <label htmlFor="genre-filter" className="filters-bar__label">Genre</label>
          <select
            id="genre-filter"
            className="filters-bar__select"
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
          >
            <option value="">Tous les genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="filters-bar__group">
          <label htmlFor="sort-filter" className="filters-bar__label">Trier par</label>
          <select
            id="sort-filter"
            className="filters-bar__select"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
          >
            <option value="recettes_desc">Recettes ↓</option>
            <option value="recettes_asc">Recettes ↑</option>
            <option value="date_desc">Date (récent)</option>
            <option value="date_asc">Date (ancien)</option>
          </select>
        </div>

        <div className="filters-bar__spacer" />

        <span className="filters-bar__count">
          <strong>{filmCount}</strong> film{filmCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
});

FilmFilters.displayName = 'FilmFilters';

export default FilmFilters;


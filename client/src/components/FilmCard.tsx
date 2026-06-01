import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from '../types/film';
import { formatRevenue, formatDate, formatEntries } from '../utils/format';
import { getGenreStyle } from '../utils/genres';

interface Props {
  film: Film;
}

const FilmCard: React.FC<Props> = React.memo(({ film }) => {
  const style = getGenreStyle(film.genre);

  const rating = film.note_presse ?? null;
  const ratingClass =
    rating === null ? 'rating-mid' : rating >= 7 ? 'rating-high' : rating >= 5 ? 'rating-mid' : 'rating-low';

  return (
    <div className="film-card">
      <div className="film-card-header">
        <span
          className="film-card-genre"
          style={{ backgroundColor: style.bg, color: style.color }}
        >
          {film.genre}
        </span>
        <h3 className="film-card-title">{film.titre}</h3>
        <p className="film-card-date">{formatDate(film.date_sortie)}</p>
      </div>

      <div className="film-card-body">
        <div className="film-card-stat">
          <span className="stat-label">Recettes</span>
          <span className="stat-value">{formatRevenue(film.recettes_totales)}</span>
        </div>
        <div className="film-card-stat">
          <span className="stat-label">Entrées</span>
          <span className="stat-value">{formatEntries(film.nombre_entrees)}</span>
        </div>
      </div>

      <div className="film-card-footer">
        <span className={`rating-badge ${ratingClass}`}>
          <span className="rating-icon">★</span>
          {rating !== null ? `${rating.toFixed(1)} / 10` : 'N/A'}
        </span>
        <Link to={`/film/${film.id}`} className="btn-detail">
          Détails →
        </Link>
      </div>
    </div>
  );
});

FilmCard.displayName = 'FilmCard';

export default FilmCard;

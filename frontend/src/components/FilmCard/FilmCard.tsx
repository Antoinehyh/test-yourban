import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from '../../types/film';
import { formatRevenue, formatDate, formatEntries } from '../../utils/format';
import { getGenreStyle } from '../../utils/genres';
import './FilmCard.css';

interface Props {
  film: Film;
}

const FilmCard: React.FC<Props> = React.memo(({ film }) => {
  const genre = film.genre?.trim() || 'Non renseigné';
  const style = getGenreStyle(genre);
  const rating = film.note_presse ?? null;

  const ratingClass =
    rating === null ? 'rating--na'
    : rating >= 7   ? 'rating--high'
    : rating >= 5   ? 'rating--mid'
    :                 'rating--low';

  return (
    <article className="film-card">
      <div className="film-card__header">
        <span className="genre-badge" style={{ backgroundColor: style.bg, color: style.color }}>
          {genre}
        </span>
        <h3 className="film-card__title">{film.titre}</h3>
        <p className="film-card__date">{formatDate(film.date_sortie)}</p>
      </div>

      <div className="film-card__body">
        <div>
          <span className="film-card__stat-label">Recettes</span>
          <span className="film-card__stat-value">{formatRevenue(film.recettes_totales)}</span>
        </div>
        <div>
          <span className="film-card__stat-label">Entrées</span>
          <span className="film-card__stat-value">{formatEntries(film.nombre_entrees)}</span>
        </div>
      </div>

      <div className="film-card__footer">
        <span className={`rating ${ratingClass}`}>
          ★ {rating !== null ? `${rating.toFixed(1)} / 10` : 'N/A'}
        </span>
        <Link to={`/film/${film.id}`} className="film-card__link">
          Voir le détail
        </Link>
      </div>
    </article>
  );
});

FilmCard.displayName = 'FilmCard';

export default FilmCard;

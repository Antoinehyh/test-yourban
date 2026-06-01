import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilm, getFilms } from '../../api/films';
import { Film } from '../../types/film';
import { formatRevenue, formatDate, formatDuration, formatEntries } from '../../utils/format';
import { getGenreStyle } from '../../utils/genres';
import SimilarFilms from '../../components/SimilarFilms/SimilarFilms';
import FilmSummary from '../../components/FilmSummary/FilmSummary';
import './FilmDetailPage.css';

const FilmDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [film, setFilm] = useState<Film | null>(null);
  const [allFilms, setAllFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setFilm(null);
    setError(null);
    Promise.all([getFilm(parseInt(id, 10), controller.signal), getFilms(controller.signal)])
      .then(([f, all]) => {
        setFilm(f);
        setAllFilms(all);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('[FilmDetailPage] Failed to load film:', err);
        setError('Film introuvable.');
        setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Chargement…</p>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="error-state">
        <div className="error-state__icon">⚠</div>
        <p className="error-state__message">{error ?? 'Film introuvable'}</p>
        <button className="back-link" onClick={() => navigate('/')}>
          ← Retour
        </button>
      </div>
    );
  }

  const style = getGenreStyle(film.genre ?? 'Non renseigné');
  const rating = film.note_presse ?? null;
  const ratingClass =
    rating === null ? 'rating--na'
    : rating >= 7   ? 'rating--high'
    : rating >= 5   ? 'rating--mid'
    :                 'rating--low';

  return (
    <div className="detail-page">
      <div className="container">
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Retour
        </button>

        <div className="detail-card">
          <div className="detail-card__header">
            <span className="genre-badge" style={{ backgroundColor: style.bg, color: style.color }}>
              {film.genre}
            </span>
            <h1 className="detail-card__title">{film.titre}</h1>
            <p className="detail-card__subtitle">
              {formatDate(film.date_sortie)} · {formatDuration(film.duree_minutes)}
            </p>
          </div>

          <div className="detail-card__kpis">
            <div className="detail-kpi">
              <span className="detail-kpi__value">{formatRevenue(film.recettes_totales)}</span>
              <span className="detail-kpi__label">Recettes totales</span>
            </div>
            <div className="detail-kpi">
              <span className="detail-kpi__value">{formatEntries(film.nombre_entrees)}</span>
              <span className="detail-kpi__label">Entrées</span>
            </div>
            <div className="detail-kpi">
              <span className={`detail-kpi__value rating ${ratingClass}`}>
                ★ {rating !== null ? rating.toFixed(1) : 'N/A'}
              </span>
              <span className="detail-kpi__label">Note presse / 10</span>
            </div>
          </div>

          <div className="detail-card__meta">
            <div className="detail-meta-item">
              <span className="detail-meta-item__label">Pays d'origine</span>
              <span className="detail-meta-item__value">{film.pays_origine}</span>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-item__label">Distributeur</span>
              <span className="detail-meta-item__value">{film.distributeur}</span>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-item__label">Durée</span>
              <span className="detail-meta-item__value">{formatDuration(film.duree_minutes)}</span>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-item__label">Date de sortie</span>
              <span className="detail-meta-item__value">{formatDate(film.date_sortie)}</span>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-item__label">ID</span>
              <span className="detail-meta-item__value">#{film.id}</span>
            </div>
          </div>
        </div>

        <FilmSummary film={film} />

        <SimilarFilms film={film} allFilms={allFilms} />
      </div>
    </div>
  );
};

export default FilmDetailPage;

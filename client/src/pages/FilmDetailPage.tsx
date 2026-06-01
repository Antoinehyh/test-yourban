import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilm, getFilms } from '../api/films';
import { Film } from '../types/film';
import { formatRevenue, formatDate, formatDuration, formatEntries } from '../utils/format';
import { getGenreStyle } from '../utils/genres';
import SimilarFilms from '../components/SimilarFilms';

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
    Promise.all([getFilm(parseInt(id, 10), controller.signal), getFilms(controller.signal)])
      .then(([f, all]) => {
        setFilm(f);
        setAllFilms(all);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('[FilmDetailPage] Failed to load film:', err);
        setError('Film introuvable.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Chargement…</p>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>{error ?? 'Film introuvable'}</p>
        <button className="back-btn" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
          ← Retour
        </button>
      </div>
    );
  }

  const style = getGenreStyle(film.genre);
  const rating = film.note_presse ?? null;
  const ratingClass =
    rating === null ? 'rating-mid' : rating >= 7 ? 'rating-high' : rating >= 5 ? 'rating-mid' : 'rating-low';

  return (
    <div className="detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Retour
        </button>

        <div className="detail-card">
          <div className="detail-card-header">
            <span
              className="film-card-genre"
              style={{ backgroundColor: style.bg, color: style.color }}
            >
              {film.genre}
            </span>
            <h1 className="detail-title">{film.titre}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {formatDate(film.date_sortie)} · {formatDuration(film.duree_minutes)}
            </p>
          </div>

          <div className="detail-card-body">
            <div className="detail-highlights">
              <div className="highlight-card">
                <span className="highlight-value">{formatRevenue(film.recettes_totales)}</span>
                <span className="highlight-label">Recettes totales</span>
              </div>
              <div className="highlight-card">
                <span className="highlight-value">{formatEntries(film.nombre_entrees)}</span>
                <span className="highlight-label">Entrées</span>
              </div>
              <div className="highlight-card">
                <span className={`highlight-value ${ratingClass}`}>
                  ★ {rating !== null ? rating.toFixed(1) : 'N/A'}
                </span>
                <span className="highlight-label">Note presse / 10</span>
              </div>
            </div>

            <div className="detail-grid" style={{ marginTop: '1.5rem' }}>
              <div className="detail-item">
                <span className="item-label">Pays d'origine</span>
                <span className="item-value">{film.pays_origine}</span>
              </div>
              <div className="detail-item">
                <span className="item-label">Distributeur</span>
                <span className="item-value">{film.distributeur}</span>
              </div>
              <div className="detail-item">
                <span className="item-label">Durée</span>
                <span className="item-value">{formatDuration(film.duree_minutes)}</span>
              </div>
              <div className="detail-item">
                <span className="item-label">Date de sortie</span>
                <span className="item-value">{formatDate(film.date_sortie)}</span>
              </div>
              <div className="detail-item">
                <span className="item-label">ID</span>
                <span className="item-value">#{film.id}</span>
              </div>
            </div>
          </div>
        </div>

        <SimilarFilms film={film} allFilms={allFilms} />
      </div>
    </div>
  );
};

export default FilmDetailPage;

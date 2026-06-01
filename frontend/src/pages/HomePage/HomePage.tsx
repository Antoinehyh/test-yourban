import React, { useState, useEffect, useMemo } from 'react';
import { getFilms } from '../../api/films';
import { Film, SortKey } from '../../types/film';
import { formatRevenue } from '../../utils/format';
import FilmCard from '../../components/FilmCard/FilmCard';
import FilmFilters from '../../components/FilmFilters/FilmFilters';
import StatsSection from '../../components/StatsSection/StatsSection';
import './HomePage.css';

type Tab = 'films' | 'stats';

const HomePage: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('recettes_desc');
  const [activeTab, setActiveTab] = useState<Tab>('films');

  useEffect(() => {
    const controller = new AbortController();
    getFilms(controller.signal)
      .then(setFilms)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('[HomePage] Failed to load films:', err);
        setError('Impossible de charger les films. Vérifiez que le serveur est lancé.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const genres = useMemo(
    () => Array.from(new Set(films.map((f) => f.genre).filter((g): g is string => !!g?.trim()))).sort(),
    [films],
  );

  const filteredFilms = useMemo(() => {
    const base = selectedGenre ? films.filter((f) => f.genre === selectedGenre) : films;
    switch (sortKey) {
      case 'recettes_desc':
        return [...base].sort((a, b) => b.recettes_totales - a.recettes_totales);
      case 'recettes_asc':
        return [...base].sort((a, b) => a.recettes_totales - b.recettes_totales);
      case 'date_desc':
        return [...base].sort(
          (a, b) => new Date(b.date_sortie).getTime() - new Date(a.date_sortie).getTime(),
        );
      case 'date_asc':
        return [...base].sort(
          (a, b) => new Date(a.date_sortie).getTime() - new Date(b.date_sortie).getTime(),
        );
    }
  }, [films, selectedGenre, sortKey]);

  const totalRevenues = useMemo(
    () => filteredFilms.reduce((sum, f) => sum + f.recettes_totales, 0),
    [filteredFilms],
  );

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Chargement des films…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-state__icon">⚠</div>
        <p className="error-state__message">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="kpi-banner">
        <div className="container kpi-banner__grid">
          <div className="kpi-banner__item">
            <span className="kpi-banner__value">{filteredFilms.length}</span>
            <span className="kpi-banner__label">
              {selectedGenre ? `Films — ${selectedGenre}` : 'Films au total'}
            </span>
          </div>
          <div className="kpi-banner__item">
            <span className="kpi-banner__value">{formatRevenue(totalRevenues)}</span>
            <span className="kpi-banner__label">Recettes cumulées</span>
          </div>
        </div>
      </div>

      <div className="tabs-bar">
        <div className="container tabs-bar__inner" role="tablist" aria-label="Navigation principale">
          <button
            role="tab"
            aria-selected={activeTab === 'films'}
            className="tab-btn"
            onClick={() => setActiveTab('films')}
          >
            Films
            <span className="tab-btn__badge">{filteredFilms.length}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'stats'}
            className="tab-btn"
            onClick={() => setActiveTab('stats')}
          >
            Statistiques
          </button>
        </div>
      </div>

      {activeTab === 'films' && (
        <FilmFilters
          genres={genres}
          selectedGenre={selectedGenre}
          sortKey={sortKey}
          filmCount={filteredFilms.length}
          onGenreChange={setSelectedGenre}
          onSortChange={setSortKey}
        />
      )}

      <main className="main-content" role="tabpanel">
        <div className="container">
          {activeTab === 'films' ? (
            filteredFilms.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">◎</div>
                <p className="empty-state__title">Aucun film trouvé</p>
                <p className="empty-state__sub">Modifiez vos filtres pour voir des résultats.</p>
              </div>
            ) : (
              <div className="films-grid">
                {filteredFilms.map((film) => (
                  <FilmCard key={film.id} film={film} />
                ))}
              </div>
            )
          ) : (
            <StatsSection films={films} />
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;

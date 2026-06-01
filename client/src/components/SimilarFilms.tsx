import React from 'react';
import { Film } from '../types/film';
import { getSimilarFilms } from '../utils/recommendations';
import FilmCard from './FilmCard';

interface Props {
  film: Film;
  allFilms: Film[];
}

const SimilarFilms: React.FC<Props> = React.memo(({ film, allFilms }) => {
  const similar = getSimilarFilms(film, allFilms);

  if (similar.length === 0) return null;

  return (
    <section className="similar-section">
      <h2 className="section-title">Films similaires</h2>
      <div className="similar-grid">
        {similar.map((f) => (
          <FilmCard key={f.id} film={f} />
        ))}
      </div>
    </section>
  );
});

SimilarFilms.displayName = 'SimilarFilms';

export default SimilarFilms;

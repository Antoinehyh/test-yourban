import React from 'react';
import { Film } from '../../types/film';
import { getSimilarFilms } from '../../utils/recommendations';
import FilmCard from '../FilmCard/FilmCard';
import './SimilarFilms.css';

interface Props {
  film: Film;
  allFilms: Film[];
}

const SimilarFilms: React.FC<Props> = React.memo(({ film, allFilms }) => {
  const similar = getSimilarFilms(film, allFilms);

  if (similar.length === 0) return null;

  return (
    <section className="similar-films">
      <p className="section-title">Films similaires</p>
      <div className="similar-films__grid">
        {similar.map((f) => (
          <FilmCard key={f.id} film={f} />
        ))}
      </div>
    </section>
  );
});

SimilarFilms.displayName = 'SimilarFilms';

export default SimilarFilms;

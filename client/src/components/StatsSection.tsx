import React from 'react';
import { Film } from '../types/film';
import { computeGenreStats } from '../utils/stats';
import { formatRevenue } from '../utils/format';
import { getGenreStyle } from '../utils/genres';

interface Props {
  films: Film[];
}

const StatsSection: React.FC<Props> = React.memo(({ films }) => {
  const stats = computeGenreStats(films);

  return (
    <section className="stats-section">
      <h2 className="section-title">Statistiques par genre</h2>
      <div className="stats-table-wrapper">
        <table className="stats-table" role="table" aria-label="Statistiques par genre">
          <thead>
            <tr>
              <th scope="col">Genre</th>
              <th scope="col">Nb films</th>
              <th scope="col">Recettes totales</th>
              <th scope="col">Note presse moy.</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => {
              const style = getGenreStyle(s.genre);
              const ratingClass =
                s.avg_rating === null ? 'rating-mid'
                  : s.avg_rating >= 7 ? 'rating-high'
                  : s.avg_rating >= 5 ? 'rating-mid'
                  : 'rating-low';

              return (
                <tr key={s.genre}>
                  <td>
                    <span className="genre-cell">
                      <span
                        className="film-card-genre"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        {s.genre}
                      </span>
                    </span>
                  </td>
                  <td>{s.count}</td>
                  <td>{formatRevenue(s.total_revenue)}</td>
                  <td className={ratingClass}>
                    {s.avg_rating !== null ? `★ ${s.avg_rating.toFixed(1)}` : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
});

StatsSection.displayName = 'StatsSection';

export default StatsSection;

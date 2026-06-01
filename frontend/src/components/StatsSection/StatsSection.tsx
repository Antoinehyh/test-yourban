import React from 'react';
import { Film } from '../../types/film';
import { computeGenreStats } from '../../utils/stats';
import { formatRevenue } from '../../utils/format';
import { getGenreStyle } from '../../utils/genres';
import './StatsSection.css';

interface Props {
  films: Film[];
}

const StatsSection: React.FC<Props> = React.memo(({ films }) => {
  const stats = computeGenreStats(films);

  return (
    <section>
      <p className="section-title">Statistiques par genre</p>
      <div className="stats-table-wrap">
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
              const style = getGenreStyle(s.genre ?? 'Non renseigné');
              const ratingClass =
                s.avg_rating === null ? 'rating--na'
                : s.avg_rating >= 7   ? 'rating--high'
                : s.avg_rating >= 5   ? 'rating--mid'
                :                       'rating--low';

              return (
                <tr key={s.genre}>
                  <td>
                    <span className="genre-badge" style={{ backgroundColor: style.bg, color: style.color }}>
                      {s.genre}
                    </span>
                  </td>
                  <td className="stats-table__num">{s.count}</td>
                  <td className="stats-table__revenue">{formatRevenue(s.total_revenue)}</td>
                  <td>
                    <span className={`rating ${ratingClass}`}>
                      {s.avg_rating !== null ? `★ ${s.avg_rating.toFixed(1)}` : 'N/A'}
                    </span>
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

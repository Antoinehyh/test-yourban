import React, { useState } from 'react';
import { Film } from '../../types/film';
import './FilmSummary.css';

interface Props {
  film: Film;
}

const FilmSummary: React.FC<Props> = ({ film }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: film.titre,
          genre: film.genre,
          date_sortie: film.date_sortie,
          pays_origine: film.pays_origine,
          duree_minutes: film.duree_minutes,
          recettes_totales: film.recettes_totales,
          nombre_entrees: film.nombre_entrees,
          note_presse: film.note_presse,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Erreur serveur');
      }

      const data = await res.json() as { summary: string };
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="film-summary">
      <div className="film-summary__header">
        <p className="section-title">Résumé IA</p>
        {!summary && (
          <button
            className="film-summary__btn"
            onClick={generate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="film-summary__spinner" />
                Génération…
              </>
            ) : (
              <>✦ Générer</>
            )}
          </button>
        )}
        {summary && (
          <button
            className="film-summary__btn film-summary__btn--ghost"
            onClick={generate}
            disabled={loading}
          >
            ↺ Regénérer
          </button>
        )}
      </div>

      {error && (
        <p className="film-summary__error">{error}</p>
      )}

      {summary && (
        <p className="film-summary__text">{summary}</p>
      )}

      {!summary && !error && !loading && (
        <p className="film-summary__placeholder">
          Cliquez sur "Générer" pour obtenir un résumé de ce film.
        </p>
      )}
    </div>
  );
};

FilmSummary.displayName = 'FilmSummary';

export default FilmSummary;

import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';

const router = Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface SummaryRequestBody {
  titre: string;
  genre: string | null;
  date_sortie: string;
  pays_origine: string;
  duree_minutes: number;
  recettes_totales: number;
  nombre_entrees: number;
  note_presse: number | null;
}

router.post('/', async (req: Request, res: Response) => {
  const {
    titre,
    genre,
    date_sortie,
    pays_origine,
    duree_minutes,
    recettes_totales,
    nombre_entrees,
    note_presse,
  } = req.body as SummaryRequestBody;

  if (!titre || typeof titre !== 'string') {
    res.status(400).json({ error: 'Le champ "titre" est requis.' });
    return;
  }

  const annee = date_sortie?.slice(0, 4) ?? 'inconnue';
  const recettesMd = (recettes_totales / 1_000_000).toFixed(1);
  const note = note_presse !== null && note_presse !== undefined
    ? `${note_presse}/10`
    : 'non disponible';

  const prompt = `Tu es un critique de cinéma expert. Rédige un résumé professionnel et engageant du film suivant en 3 à 4 phrases en français. Parle uniquement du film, de son contexte, de son genre et de ce qui le rend remarquable. Ne mentionne pas les données chiffrées.

Film : ${titre}
Année de sortie : ${annee}
Genre : ${genre ?? 'Non renseigné'}
Pays d'origine : ${pays_origine}
Durée : ${duree_minutes} minutes
Recettes : ${recettesMd} M€
Entrées : ${nombre_entrees.toLocaleString('fr-FR')}
Note presse : ${note}

Résumé :`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const summary = completion.choices[0]?.message?.content?.trim() ?? '';
    res.json({ summary });
  } catch (err) {
    console.error('[POST /api/ai/summary]', err);
    res.status(502).json({ error: 'Impossible de générer le résumé.' });
  }
});

export default router;

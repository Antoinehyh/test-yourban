export interface Film {
  id: number;
  titre: string;
  date_sortie: string;
  genre: string;
  recettes_totales: number;
  nombre_entrees: number;
  pays_origine: string;
  distributeur: string;
  duree_minutes: number;
  note_presse: number | null;
}

export type SortKey = 'recettes_desc' | 'recettes_asc' | 'date_desc' | 'date_asc';

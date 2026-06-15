import { Pillar, Rating } from './data';

export type Ratings = Record<string, Rating>;

export function getRating(ratings: Ratings, id: string): Rating {
  return ratings[id] || { score: 0, notes: '' };
}

export interface PillarStats {
  total: number;
  rated: number;
  sum: number;
  avg: number;
}

export function getPillarStats(p: Pillar, ratings: Ratings): PillarStats {
  let total = 0;
  let rated = 0;
  let sum = 0;
  p.groups.forEach((g) =>
    g.skills.forEach((sk) => {
      total++;
      const r = getRating(ratings, sk.id);
      if (r.score > 0) {
        rated++;
        sum += r.score;
      }
    })
  );
  return { total, rated, sum, avg: rated > 0 ? sum / rated : 0 };
}

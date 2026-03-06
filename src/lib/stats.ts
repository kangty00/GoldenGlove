export interface BattingStats {
  at_bats: number;
  hits: number;
  doubles: number;
  triples: number;
  home_runs: number;
  walks: number;
  hbp: number;
  sac_fly: number;
}

export interface FieldingStats {
  putouts: number;
  assists: number;
  innings_played: number;
}

/**
 * 타율 (AVG) 계산
 */
export const calculateAVG = (hits: number, ab: number): string => {
  if (ab === 0) return '.000';
  return (hits / ab).toFixed(3).replace(/^0/, '');
};

/**
 * 출루율 (OBP) 계산
 * (H + BB + HBP) / (AB + BB + HBP + SF)
 */
export const calculateOBP = (stats: BattingStats): string => {
  const denominator = stats.at_bats + stats.walks + stats.hbp + stats.sac_fly;
  if (denominator === 0) return '.000';
  const numerator = stats.hits + stats.walks + stats.hbp;
  return (numerator / denominator).toFixed(3).replace(/^0/, '');
};

/**
 * 장타율 (SLG) 계산
 * TB / AB
 * TB = 1B(H-2B-3B-HR) + 2B*2 + 3B*3 + HR*4
 */
export const calculateSLG = (stats: BattingStats): string => {
  if (stats.at_bats === 0) return '.000';
  const singles = stats.hits - stats.doubles - stats.triples - stats.home_runs;
  const totalBases = singles + (stats.doubles * 2) + (stats.triples * 3) + (stats.home_runs * 4);
  return (totalBases / stats.at_bats).toFixed(3).replace(/^0/, '');
};

/**
 * OPS 계산
 */
export const calculateOPS = (stats: BattingStats): string => {
  const obp = parseFloat(calculateOBP(stats));
  const slg = parseFloat(calculateSLG(stats));
  return (obp + slg).toFixed(3).replace(/^0/, '');
};

/**
 * Range Factor (RF) 계산
 * (PO + A) / (innings / 9)
 */
export const calculateRF = (stats: FieldingStats): string => {
  if (stats.innings_played === 0) return '0.00';
  return ((stats.putouts + stats.assists) / (stats.innings_played / 9)).toFixed(2);
};

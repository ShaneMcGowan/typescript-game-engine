export const BRONZE_MEDAL_THRESHOLD = 10;
export const SILVER_MEDAL_THRESHOLD = 20;
export const GOLD_MEDAL_THRESHOLD = 30;
export const PLATINUM_MEDAL_THRESHOLD = 40;

export type MedalType = 'platinum' | 'gold' | 'silver' | 'bronze' | 'none';

export const MEDAL_SPRITES = {
  bronze: { spriteX: 7, spriteY: 29.75, },
  silver: { spriteX: 7, spriteY: 28.25, },
  gold: { spriteX: 7.5, spriteY: 17.5, },
  platinum: { spriteX: 7.5, spriteY: 16, },
};

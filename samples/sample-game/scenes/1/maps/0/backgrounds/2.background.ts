import { type BackgroundLayer } from '@core/src/model/background-layer';
import { BASE_BACKGROUND_TILE, type BackgroundTile } from '@core/src/model/background-tile';

const BRIDGE_TILE: BackgroundTile = {
  ...BASE_BACKGROUND_TILE,
  tileset: 'tileset_wood_bridge',
};

const BRIDGE_HORIZONTAL_START: BackgroundTile = {
  ...BRIDGE_TILE,
  animationFrames: [{ spriteX: 2, spriteY: 0, }],
};

const BRIDGE_HORIZONTAL: BackgroundTile = {
  ...BRIDGE_TILE,
  animationFrames: [{ spriteX: 3, spriteY: 0, }],
};

const BRIDGE_HORIZONTAL_END: BackgroundTile = {
  ...BRIDGE_TILE,
  animationFrames: [{ spriteX: 4, spriteY: 0, }],
};

export const SAMPLE_SCENE_1_MAP_0_BACKGROUND_2: BackgroundLayer = {
  index: 2,
  tiles: [
    [
      BRIDGE_HORIZONTAL_START
    ],
    [
      BRIDGE_HORIZONTAL
    ],
    [
      BRIDGE_HORIZONTAL
    ],
    [
      BRIDGE_HORIZONTAL
    ],
    [
      BRIDGE_HORIZONTAL
    ],
    [
      BRIDGE_HORIZONTAL_END
    ]
  ],
};

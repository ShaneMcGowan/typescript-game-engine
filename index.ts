import { Client } from '@core/client';
import { type Assets } from '@core/model/assets';
import { SAMPLE_SCENE_0 } from '@scenes/0.scene';
import { SAMPLE_SCENE_1 } from '@scenes/1.scene';

(function() {
  /**
 * Add your scenes here, the first scene will be loaded on startup
*/

// TODO(smg): having a union of all scenes sounds like an absolute nightmare so not sure what the best solution for this would be
type IScenes = typeof SAMPLE_SCENE_1; // | typeof OtherScene | typeof AnotherScene;

const scenes: any[] = [
  SAMPLE_SCENE_0,
  SAMPLE_SCENE_1
];

const assets: Assets = {
  images: {
    tileset_sample: '/assets/16x16.png',
    tileset_grass: '/assets/sample/Tilesets/Grass.png',
    tileset_hills: '/assets/sample/Tilesets/Hills.png',
    tileset_water: '/assets/sample/Tilesets/Water.png',
    tileset_player: '/assets/sample/Characters/Basic Charakter Spritesheet.png',
    tileset_chicken: '/assets/sample/Characters/Free Chicken Sprites.png',
    tileset_fence: '/assets/sample/Tilesets/Fences.png',
    tileset_egg: '/assets/sample/Characters/Egg_And_Nest.png',
    tileset_house: '/assets/sample/Tilesets/Wooden House.png',
    tileset_dirt: '/assets/sample/Tilesets/Tilled_Dirt.png',
    tileset_button: '/assets/sample/UI Big Play Button.png',
    tileset_ui: '/assets/sample/Sprite sheet for Basic Pack.png',
    tileset_wood_bridge: '/assets/sample/Objects/Wood_Bridge.png',
    tileset_chest: '/assets/sample/Objects/Chest.png',
    tileset_plants: '/assets/sample/Objects/Basic_Plants.png',
    tileset_dialogue_box: '/assets/sample/Dialouge UI/dialog box.png',
  },
  audio: {},
};

window.engine = new Client(
  document.getElementById('render-area'),
  scenes,
  assets
);
})();

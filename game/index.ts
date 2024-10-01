import { Client } from '@core/client';
import { EditorUtils } from '@core/editor/editor.utils';
import { type AssetsConfig } from '@core/model/assets';
import { type SceneConstructorSignature } from '@core/model/scene';
import { SCENE_MAIN_MENU } from '@game/scenes/main-menu/scene';
import { SCENE_GAME } from '@game/scenes/game/scene';

(function () {
  /**
   * Declare your canvas constants here
   */
  // e.g. CanvasConstants.CANVAS_TILE_HEIGHT = 18;

  /**
  * Add your scenes here, the first scene will be loaded on startup
  */
  const scenes: SceneConstructorSignature[] = [
    SCENE_MAIN_MENU,
    SCENE_GAME
  ];

  const assets: AssetsConfig = {
    images: {
      tileset_sample: 'assets/16x16.png',
      tileset_grass: 'assets/sample/Tilesets/Grass.png',
      tileset_hills: 'assets/sample/Tilesets/Hills.png',
      tileset_water: 'assets/sample/Tilesets/Water.png',
      tileset_player: 'assets/sample/Characters/Basic Charakter Spritesheet.png',
      tileset_chicken: 'assets/sample/Characters/Free Chicken Sprites.png',
      tileset_fence: 'assets/sample/Tilesets/Fences.png',
      tileset_egg: 'assets/sample/Characters/Egg_And_Nest.png',
      tileset_house: 'assets/sample/Tilesets/Wooden House.png',
      tileset_dirt: 'assets/sample/Tilesets/Tilled_Dirt.png',
      tileset_button: 'assets/sample/UI Big Play Button.png',
      tileset_ui: 'assets/sample/Sprite sheet for Basic Pack.png',
      tileset_wood_bridge: 'assets/sample/Objects/Wood_Bridge.png',
      tileset_chest: 'assets/sample/Objects/Chest.png',
      tileset_plants: 'assets/sample/Objects/Basic_Plants.png',
      tileset_dialogue_box: 'assets/sample/Dialouge UI/dialog box.png',
      tileset_tools: 'assets/sample/Characters/Tools.png',
    },
    audio: {},
  };

  EditorUtils.initHelpers()

  window.engine = new Client(
    document.getElementById('render-area'),
    scenes,
    assets,
    EditorUtils.engineObjectList,
    EditorUtils.engineObjectDetails,
    EditorUtils.engineControls
  );
})();

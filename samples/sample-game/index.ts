import { Client } from '@core/client';
import { type AssetsConfig } from '@core/model/assets';
import { type SceneConstructorSignature } from '@core/model/scene';
import { SAMPLE_SCENE_0 } from '@sample-game/scenes/0.scene';
import { SAMPLE_SCENE_1 } from '@sample-game/scenes/1.scene';

(function() {
  /**
   * Declare your canvas constants here
   */
  // e.g. CanvasConstants.CANVAS_TILE_HEIGHT = 18;

  /**
  * Add your scenes here, the first scene will be loaded on startup
  */
  const scenes: SceneConstructorSignature[] = [
    SAMPLE_SCENE_0,
    SAMPLE_SCENE_1
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
    },
    audio: {},
  };

  let defaultParams = {
    container: document.getElementById('render-area'),
    scenes,
    assets,
  };

  let debugParams = {
    engineObjectList: document.getElementById('object-list'),
    engineObjectDetails: document.getElementById('object-details'),
    engineControls: {
      gridLines: document.getElementById('btnGridLines'),
      gridNumbers: document.getElementById('btnGridNumbers'),
      breakpoint: document.getElementById('btnBreakpoint'),
      fps: document.getElementById('btnFps'),
      objectCount: document.getElementById('btnObjectCount'),
      timingFrame: document.getElementById('btnTimingFrame'),
      timingFrameBackground: document.getElementById('btnTimingFrameBackground'),
      timingFrameRender: document.getElementById('btnTimingFrameRender'),
      timingFrameUpdate: document.getElementById('btnTimingFrameUpdate'),
      canvasLayers: document.getElementById('btnCanvasLayers'),
      fullscreen: document.getElementById('btnFullscreen'),
    },
  };

  window.engine = new Client(
    defaultParams.container,
    defaultParams.scenes,
    defaultParams.assets,
    debugParams.engineObjectList,
    debugParams.engineObjectDetails,
    debugParams.engineControls
  );
})();

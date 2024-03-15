import { Client } from '@core/client';
import { type AssetsConfig } from '@core/model/assets';
import { type SceneConstructorSignature } from '@core/model/scene';
import { MAIN_MENU_SCENE } from './scenes/main-menu/main-menu.scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { GAME_SCENE } from './scenes/game/game.scene';
import { DefaultsConstants } from './scenes/game/maps/game/constants/defaults.constants';
import { EngineUtils } from '@core/engine/engine.utils';

(function() {
  /**
   * Declare your canvas constants here
   */
  CanvasConstants.CANVAS_TILE_HEIGHT = 16;
  CanvasConstants.CANVAS_TILE_WIDTH = 9;
  CanvasConstants.TILE_SIZE = 16;

  // cheat codes
  let params = new URLSearchParams(window.location.search);
  let cheatcode = params.get('cheatcode');
  let cheatcodeValue = params.get('cheatcodevalue');
  if (cheatcode === 'joanne' && cheatcodeValue !== null && !isNaN(Number(cheatcodeValue))) {
    DefaultsConstants.DEFAULT_PIPE_GAP = Number(cheatcodeValue);
    console.log('cheat code activated for pipe gap: ' + DefaultsConstants.DEFAULT_PIPE_GAP);
  }

  /**
  * Add your scenes here, the first scene will be loaded on startup
  */
  const scenes: SceneConstructorSignature[] = [
    MAIN_MENU_SCENE,
    GAME_SCENE
  ];

  const assets: AssetsConfig = {
    images: {
      sprites: 'assets/sprites.png',
    },
    audio: {},
  };

  window.engine = new Client(
    document.getElementById('render-area'),
    scenes,
    assets,
    EngineUtils.engineObjectList,
    EngineUtils.engineObjectDetails,
    EngineUtils.engineControls
  );
  EngineUtils.initHelpers();
})();

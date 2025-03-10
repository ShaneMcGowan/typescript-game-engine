import { Client } from '@core/client';
import { EditorUtils } from '@core/editor/editor.utils';
import { MapEditor } from '@core/editor/map-editor.utils';
import { Assets, type AssetsConfig } from '@core/utils/assets.utils';
import { type SceneConstructorSignature } from '@core/model/scene';
import { SCENE_MAIN_MENU } from '@game/scenes/main-menu/scene';
import { SCENE_GAME } from '@game/scenes/game/scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { DeviceType } from '@core/model/device-type';

(function () {
  /**
   * Declare your canvas constants here
   */
  // e.g. CanvasConstants.CANVAS_TILE_HEIGHT = 18;
  CanvasConstants.DEFAULT_FONT_FAMILY = 'bookxel';

  const params = new URLSearchParams(window.location.search);

  // debug
  if (params.get('debug')) {
    CanvasConstants.DEBUG_MODE = true;
  }

  // viewport
  const deviceParam = params.get('device');
  if (deviceParam === 'mobile') {
    CanvasConstants.CANVAS_TILE_WIDTH = 15;
    CanvasConstants.CANVAS_TILE_HEIGHT = 24;
    CanvasConstants.DEVICE_TYPE = DeviceType.Mobile;
    CanvasConstants.DEFAULT_FONT_SIZE = 16; // TODO: might need a smaller font for mobile devices
  }

  // this is for debugging, letting us launch into a specific scene
  const sceneParam = params.get('scene');

  const SCENE_MAP: Record<string, SceneConstructorSignature> = {
    'main-menu': SCENE_MAIN_MENU,
    game: SCENE_GAME,
  };
  const scene: SceneConstructorSignature = SCENE_MAP[sceneParam] ?? SCENE_MAIN_MENU;

  const config: AssetsConfig = {
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
      tileset_dialogue_box: 'assets/custom/dialog box.png',
      tileset_tools: 'assets/sample/Characters/Tools.png',
      tileset_fullscreen: 'assets/custom/fullscreen.png',
      tileset_basic: 'assets/sample/Sprite sheet for Basic Pack.png',
      tileset_shop_key: 'assets/custom/shop-key.png',
      tileset_grass_biome: 'assets/sample/Objects/Basic_Grass_Biom_things.png',
      tileset_emotes: 'assets/sample/Dialouge UI/Emotes/Teemo Basic emote animations sprite sheet.png',
      tileset_tool_shovel: 'assets/custom/tools/shovel.png',
      tileset_tool_pickaxe: 'assets/custom/tools/pickaxe.png',
      tileset_actions: 'assets/sample/Characters/Basic Charakter Actions.png',
      tileset_furniture: 'assets/sample/Objects/Basic_Furniture.png',
      tileset_bread: 'assets/custom/bread.png',
      // resource
      tileset_rocks_rock: 'assets/custom/rocks/rock.png',
      tileset_rocks_coal: 'assets/custom/rocks/coal.png',
      tileset_rocks_copper: 'assets/custom/rocks/copper.png',
      tileset_resource_copper: 'assets/custom/resource/copper.png',
      tileset_resource_copper_bar: 'assets/custom/resource/copper-bar.png',
      tileset_resource_iron: 'assets/custom/resource/iron.png',
      tileset_resource_iron_bar: 'assets/custom/resource/iron-bar.png',
      // machines
      tileset_machine_sprinkler: 'assets/custom/machine/sprinkler.png',
      tileset_machine_furnace: 'assets/custom/machine/furnace.png',
      tileset_machine_crafting_bench: 'assets/custom/machine/crafting-bench.png',
    },
    audio: {},
    fonts: {
      bookxel: 'assets/fonts/bookxel.woff',
    },
  };
  Assets.initialise(config);

  EditorUtils.initHelpers();

  if (params.get('map-editor')) {
    window.mapEditor = new MapEditor();
  } else {
    window.engine = new Client(
      document.getElementById('render-area'),
      scene,
      EditorUtils.engineMapList,
      EditorUtils.engineObjectList,
      EditorUtils.engineObjectDetails,
      EditorUtils.engineControls
    );
  }
})();

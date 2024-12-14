import { CanvasConstants } from '@core/constants/canvas.constants';
import { type BackgroundLayer } from '@core/model/background-layer';
import { type Scene } from '@core/model/scene';
import { SceneMap } from '@core/model/scene-map';
import { MouseUtils } from '@core/utils/mouse.utils';
import { SCENE_MAIN_MENU_MAP_MAIN_MENU_BACKGROUND_WATER } from './backgrounds/water.background';
import { MainMenuControllerObject } from '@game/objects/main-menu-controller.object';
import { StartButtonObject } from '@game/objects/start-button.object';

const MAP_HEIGHT: number = CanvasConstants.CANVAS_TILE_HEIGHT;
const MAP_WIDTH: number = CanvasConstants.CANVAS_TILE_WIDTH;

export class SCENE_MAIN_MENU_MAP_MAIN_MENU extends SceneMap {
  height = MAP_HEIGHT;
  width = MAP_WIDTH;
  backgroundLayers: BackgroundLayer[] = [
    SCENE_MAIN_MENU_MAP_MAIN_MENU_BACKGROUND_WATER
  ];


  constructor(protected scene: Scene) {
    super(scene);

    MouseUtils.setCursor(this.scene.displayContext.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png');

    // TODO: object layers so rendering order is correct
    this.scene.addObject(new StartButtonObject(scene, {
      renderLayer: 15,
      positionX: 16,
      positionY: 9,
    }));
    this.scene.addObject(new MainMenuControllerObject(scene, {}));
  }
}

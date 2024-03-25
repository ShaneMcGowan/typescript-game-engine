import { CanvasConstants } from '@core/constants/canvas.constants';
import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type SceneObject } from '@core/model/scene-object';
import { MAIN_MENU_BACKGROUND_LAYER_1 } from './main-menu/backgrounds/layer.1';
import { StartButtonObject } from './main-menu/objects/start-button.object';
import { type MAIN_MENU_SCENE } from '../main-menu.scene';
import { SpriteObject } from '@core/objects/sprite.object';
import { HtmlObject } from '@core/objects/html.object';

const MAP_HEIGHT: number = CanvasConstants.CANVAS_TILE_HEIGHT;
const MAP_WIDTH: number = CanvasConstants.CANVAS_TILE_WIDTH;

export class MAIN_MENU_MAP extends SceneMap {
  height = MAP_HEIGHT;
  width = MAP_WIDTH;

  backgroundLayers: BackgroundLayer[] = [
    MAIN_MENU_BACKGROUND_LAYER_1
  ];

  objects: SceneObject[] = [];

  constructor(protected scene: MAIN_MENU_SCENE) {
    super(scene);

    this.objects.push(new StartButtonObject(this.scene, {}));

    // logo
    let logoWidth = 6;
    let logoHeight = 1.8;
    this.objects.push(new SpriteObject(this.scene, {
      positionX: CanvasConstants.CANVAS_TILE_WIDTH / 2,
      positionY: 3,
      width: logoWidth,
      height: logoHeight,
      tileset: 'sprites',
      spriteX: 21.75,
      spriteY: 5.5,
    }));

    this.objects.push(new HtmlObject(this.scene, {}));
  }
}

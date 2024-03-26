import { CanvasConstants } from '@core/src/constants/canvas.constants';
import { type BackgroundLayer } from '@core/src/model/background-layer';
import { type Scene } from '@core/src/model/scene';
import { SceneMap } from '@core/src/model/scene-map';
import { type SceneObject } from '@core/src/model/scene-object';
import { MouseUtils } from '@core/src/utils/mouse.utils';
import { SAMPLE_SCENE_0_MAP_0_BACKGROUND_0 } from './0/backgrounds/0.background';
import { MainMenuControllerObject } from './0/objects/main-menu-controller.object';
import { StartButtonObject } from './0/objects/start-button.object';

const MAP_HEIGHT: number = CanvasConstants.CANVAS_TILE_HEIGHT;
const MAP_WIDTH: number = CanvasConstants.CANVAS_TILE_WIDTH;

export class SAMPLE_SCENE_0_MAP_0 extends SceneMap {
  height = MAP_HEIGHT;
  width = MAP_WIDTH;
  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_0_MAP_0_BACKGROUND_0
  ];

  objects: SceneObject[] = [];

  constructor(protected scene: Scene) {
    super(scene);

    MouseUtils.setCursor(this.context.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png');

    // TODO(smg): object layers so rendering order is correct
    this.objects.push(new StartButtonObject(scene, { renderLayer: 15, positionX: 12, positionY: 7.5, }));
    this.objects.push(new MainMenuControllerObject(scene, {}));
  }
}

import { CanvasConstants } from '@core/src/constants/canvas.constants';
import { type BackgroundLayer } from '@core/src/model/background-layer';
import { SceneMap } from '@core/src/model/scene-map';
import { type SceneObject } from '@core/src/model/scene-object';
import { type GAME_SCENE } from '../game.scene';
import { SpriteObject } from '@core/src/objects/sprite.object';
import { PlayerObject } from './game/objects/player.object';
import { ScoreObject } from './game/objects/score.object';
import { FloorObject } from './game/objects/floor.object';
import { ControllerObject } from './game/objects/controller.object';

const MAP_HEIGHT: number = CanvasConstants.CANVAS_TILE_HEIGHT;
const MAP_WIDTH: number = CanvasConstants.CANVAS_TILE_WIDTH;

export class GAME_MAP extends SceneMap {
  height = MAP_HEIGHT;
  width = MAP_WIDTH;

  backgroundLayers: BackgroundLayer[] = [

  ];

  objects: SceneObject[] = [];

  constructor(protected scene: GAME_SCENE) {
    super(scene);

    // Sprite Background (as object)
    this.objects.push(new SpriteObject(this.scene, {
      positionX: CanvasConstants.CANVAS_CENTER_TILE_X,
      positionY: CanvasConstants.CANVAS_CENTER_TILE_Y,
      width: CanvasConstants.CANVAS_TILE_WIDTH,
      height: CanvasConstants.CANVAS_TILE_HEIGHT,
      tileset: 'sprites',
      spriteY: 0,
      spriteX: 0,
    }));

    // Player
    let player = new PlayerObject(this.scene, {});
    this.objects.push(player);

    this.objects.push(new ControllerObject(this.scene, { player, }));

    this.objects.push(new ScoreObject(this.scene, {}));
    this.objects.push(new FloorObject(this.scene, { player, }));
  }
}

import { CanvasConstants } from '@core/constants/canvas.constants';
import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type SceneObject } from '@core/model/scene-object';
import { type GAME_SCENE } from '../game.scene';
import { SpriteObject } from '@core/objects/sprite.object';
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
      positionX: 0,
      positionY: 0,
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

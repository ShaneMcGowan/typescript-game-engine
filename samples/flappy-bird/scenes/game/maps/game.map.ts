import { CanvasConstants } from '@core/constants/canvas.constants';
import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type SceneObject } from '@core/model/scene-object';
import { type GAME_SCENE } from '../game.scene';
import { SpriteObject } from '@core/objects/sprite.object';
import { PipeObject } from './game/objects/pipe.object';
import { PlayerObject } from './game/objects/player.object';
import { PointObject } from './game/objects/point.object';
import { ScoreObject } from './game/objects/score.object';
import { IntervalObject } from '@core/objects/interval.object';
import { MathUtils } from '@core/utils/math.utils';
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

    let controller = new ControllerObject(this.scene, { player, });
    this.objects.push(controller);

    this.objects.push(new IntervalObject(this.scene, {
      duration: 3,
      onInterval: () => {
        let region = 8; // only ever move within X tiles
        let gap = 4; // gap between pipes
        let min = (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - (region / 2);
        let max = min + (region / 2);

        let height = MathUtils.randomNumberFromRange(min, max);

        // Pipes
        this.scene.addObject(new PipeObject(this.scene, {
          player,
          controller,
          type: 'top',
          height,
        }));

        this.scene.addObject(new PipeObject(this.scene, {
          player,
          controller,
          type: 'bottom',
          height: CanvasConstants.CANVAS_TILE_HEIGHT - height - gap,
        }));

        // point
        this.scene.addObject(new PointObject(this.scene, {
          player,
        }));
      },
    })
    );

    this.objects.push(new ScoreObject(this.scene, {}));
    this.objects.push(new FloorObject(this.scene, { player, controller, }));
  }
}

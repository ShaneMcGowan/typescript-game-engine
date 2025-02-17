import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { AreaObject } from './area.object';
import { MathUtils } from '@core/utils/math.utils';
import { type OnNewDay } from '@game/models/components/new-day.model';
import { type ObjectFilter } from '@core/model/scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { UiObject } from '@core/objects/ui.object';

interface Config extends SceneObjectBaseConfig {
  chance: number;
  callbacks: Array<(x: number, y: number) => void>;
}

export class ObjectSpawnAreaObject extends AreaObject implements OnNewDay {
  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    super(scene, config);
  }

  onNewDay(): void {
    const xStart = this.transform.position.world.x;
    const xEnd = this.transform.position.world.x + this.width - 1;
    const yStart = this.transform.position.world.y;
    const yEnd = this.transform.position.world.y + this.height - 1;

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        const filter: ObjectFilter = {
          boundingBox: SceneObject.calculateBoundingBox(
            x,
            y,
            CanvasConstants.TILE_PIXEL_SIZE,
            CanvasConstants.TILE_PIXEL_SIZE
          ),
          typeIgnore: [UiObject, AreaObject],
        };
        const object = this.scene.getObject(filter);
        if (object !== undefined) {
          continue;
        }

        const chance = MathUtils.randomIntFromRange(1, this.config.chance);
        if (chance !== this.config.chance) {
          continue;
        }

        const callback = MathUtils.getRandomElement(this.config.callbacks);
        if (callback === undefined) {
          continue;
        }

        callback(x, y);
      }
    }
  }

  get colour(): string {
    return '#E01A4F';
  }

  get positions(): number {
    return this.width * this.height;
  }
}

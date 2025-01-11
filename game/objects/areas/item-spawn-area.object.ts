
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { SCENE_GAME } from '@game/scenes/game/scene';
import { AreaObject } from './area.object';
import { ItemType } from '@game/models/inventory.model';
import { ItemObject } from '../item.object';
import { MathUtils } from '@core/utils/math.utils';

interface Config extends SceneObjectBaseConfig {
  spawnableObjects: ItemType[];
}

export class ItemSpawnAreaObject extends AreaObject {

  spawnTimer: number = 0;
  spawnTimerMax: number = 600; // timer per position

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    super(scene, config);
  }

  get colour(): string {
    return '#DAA52099';
  }

  get positions(): number {
    return this.width * this.height;
  }

  get relativeSpawnTimerMax(): number {
    return this.spawnTimerMax / this.positions;
  }

  onUpdate(delta: number): void {
    this.spawnTimer += delta;

    if(this.spawnTimer < this.relativeSpawnTimerMax){
      return;
    }

    // reset
    this.spawnTimer %= this.relativeSpawnTimerMax;

    const type = MathUtils.getRandomElement(this.config.spawnableObjects);
    const x = MathUtils.randomIntFromRange(this.transform.position.world.x, this.transform.position.world.x + this.width - 1);
    const y = MathUtils.randomIntFromRange(this.transform.position.world.y, this.transform.position.world.y + this.height - 1);

    this.scene.addObject(new ItemObject(
      this.scene,
      {
        x,
        y,
        type: type
      }
    ))
  }
  
}

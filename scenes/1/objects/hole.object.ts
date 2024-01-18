import { type Scene } from '../../../model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '../../../model/scene-object';
import { RenderUtils } from '../../../utils/render.utils';
import { PlayerObject } from './player.object';

interface Config extends SceneObjectBaseConfig {
}

export class HoleObject extends SceneObject {
  isRenderable = true;

  // consumption timer
  consumptionTimer = 0;
  consumptionTimerMax = 5; // how often the hole can consume

  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);
  }

  update(delta: number): void {
    this.consumptionTimer += delta;

    if (this.consumptionTimer < this.consumptionTimerMax) {
      return;
    }

    // the hole consumes
    let objects = this.scene.getAllObjectsAtPosition(this.positionX, this.positionY);
    if (objects.length === 1) {
      return;
    }

    objects.forEach(o => {
      if (o === this) {
        return;
      }

      // if player, change map
      if (o instanceof PlayerObject) {
        this.scene.changeMap(1);
        return;
      }

      // otherwise remove object from scene
      this.scene.removeObject(o);
    });

    this.consumptionTimer = 0;
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderCircle(
      context,
      this.positionX,
      this.positionY
    );
  }
}

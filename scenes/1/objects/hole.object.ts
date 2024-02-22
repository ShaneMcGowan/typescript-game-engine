import { type SceneObjectBaseConfig, SceneObject } from '@model/scene-object';
import { RenderUtils } from '@utils/render.utils';
import { PlayerObject } from './player.object';
import { TransitionObject } from './transition.object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';

interface Config extends SceneObjectBaseConfig {
}

export class HoleObject extends SceneObject {
  isRenderable = true;

  // consumption timer
  consumptionTimer = 0;
  consumptionTimerMax = 5; // how often the hole can consume

  constructor(
    protected scene: SAMPLE_SCENE_1,
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
        this.scene.addObject(new TransitionObject(this.scene, {
          animationType: 'circle',
          animationDirection: 'out',
          animationCenterX: this.positionX,
          animationCenterY: this.positionY,
        }));
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

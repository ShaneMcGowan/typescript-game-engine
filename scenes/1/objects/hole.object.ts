import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@utils/render.utils';
import { PlayerObject } from './player.object';
import { TransitionObject } from '../../../core/objects/transition.object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { TimerObject } from '@core/objects/timer.object';

interface Config extends SceneObjectBaseConfig {
}

export class HoleObject extends SceneObject {
  isRenderable = true;

  private playerConsumed: boolean = false;

  constructor(
    protected scene: SAMPLE_SCENE_1,
    config: Config
  ) {
    super(scene, config);
  }

  update(delta: number): void {
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
        if (this.playerConsumed) {
          return;
        }

        // TODO(smg): disable player movement
        let duration = 2;
        this.scene.addObject(new TimerObject(this.scene, {
          duration,
          onComplete: () => {
            this.scene.flagForMapChange(1);
          },
        }));

        this.scene.addObject(new TransitionObject(this.scene, {
          animationType: 'circle',
          animationDirection: 'out',
          animationCenterX: this.positionX,
          animationCenterY: this.positionY,
          animationLength: duration,
        }));

        this.playerConsumed = true;
        return;
      }

      // otherwise remove object from scene
      this.scene.removeObject(o);
    });
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderCircle(
      context,
      this.positionX,
      this.positionY
    );
  }
}

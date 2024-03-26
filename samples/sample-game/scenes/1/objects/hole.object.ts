import { type SceneObjectBaseConfig, SceneObject } from '@core/src/model/scene-object';
import { RenderUtils } from '@core/src/utils/render.utils';
import { PlayerObject } from './player.object';
import { TransitionObject } from '../../../../../core/src/objects/transition.object';
import { type SAMPLE_SCENE_1 } from '@sample-game/scenes/1.scene';
import { TimerObject } from '@core/src/objects/timer.object';
import { SAMPLE_SCENE_1_MAP_1 } from '../maps/1.map';

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
            this.scene.flagForMapChange(SAMPLE_SCENE_1_MAP_1);
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
      this.scene.removeObjectById(o.id);
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

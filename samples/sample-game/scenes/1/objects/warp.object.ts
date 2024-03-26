import { type Scene } from '@core/src/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/src/model/scene-object';
import { type PlayerObject } from './player.object';
import { TimerObject } from '@core/src/objects/timer.object';
import { TransitionObject } from '@core/src/objects/transition.object';
import { SAMPLE_SCENE_1_MAP_0 } from '../maps/0.map';

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
}

export class WarpObject extends SceneObject {
  private readonly player: PlayerObject;
  private isWarping: boolean = false;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
    this.player = config.player;
  }

  update(delta: number): void {
    if (this.isWarping) {
      return;
    }

    if (this.positionX !== this.player.positionX || this.positionY !== this.player.positionY) {
      return;
    }

    this.isWarping = true;

    let duration = 1.5;
    this.scene.addObject(
      new TimerObject(this.scene, {
        duration,
        onComplete: () => {
          this.scene.changeMap(SAMPLE_SCENE_1_MAP_0);
        },
      })
    );
    this.scene.addObject(
      new TransitionObject(this.scene, {
        animationType: 'circle',
        animationDirection: 'out',
        animationCenterX: this.positionX,
        animationCenterY: this.positionY,
        animationLength: duration,
      })
    );
  }

  destroy(): void {

  }
}

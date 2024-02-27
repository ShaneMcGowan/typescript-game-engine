import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from './player.object';
import { TimerObject } from '@core/objects/timer.object';
import { TransitionObject } from '@core/objects/transition.object';

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
          this.scene.changeMap(0);
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

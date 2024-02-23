import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';

const DEFAULT_DURATION = 1;
const DEFAULT_ON_COMPLETE = (): void => {};

interface Config extends SceneObjectBaseConfig {
  duration?: number;
  onComplete?: () => void;
}

/**
 * An object that runs a function after a set duration a single time
 */
export class TimerObject extends SceneObject {
  private timer = 0;
  private readonly duration: number;
  private readonly onComplete: () => void;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    this.duration = config.duration ? config.duration : DEFAULT_DURATION;
    this.onComplete = config.onComplete ? config.onComplete : DEFAULT_ON_COMPLETE;
  }

  update(delta: number): void {
    this.timer += delta;

    if (this.timer >= this.duration) {
      this.onComplete();
      this.scene.removeObject(this);
    }
  }

  destroy(): void {
    console.log('[TimerObject] destroyed');
  }
}

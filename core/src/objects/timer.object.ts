import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';

const DEFAULT_DURATION = 1;
const DEFAULT_ON_COMPLETE = (): void => { };

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
    this.transform.position.local.x = -1;
    this.transform.position.local.y = -1;

    this.duration = config.duration ?? DEFAULT_DURATION;
    this.onComplete = config.onComplete ?? DEFAULT_ON_COMPLETE;
  }

  onUpdate(delta: number): void {
    this.timer += delta;

    if (this.timer >= this.duration) {
      this.onComplete();
      this.destroy();
    }
  }
}

import { type Scene } from '@model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@model/scene-object';

const DEFAULT_DURATION = 1;
const DEFAULT_ON_INTERVAL = (): void => {};

export interface IntervalObjectConfig extends SceneObjectBaseConfig {
  duration?: number;
  onInterval?: () => void;
  maxIntervals?: number;
}

export class IntervalObject extends SceneObject {
  private timer = 0;
  private intervalsComplete = 0;
  private readonly maxIntervals: number | undefined;
  private readonly duration: number;
  private readonly onInterval: () => void;

  constructor(
    protected scene: Scene,
    config: IntervalObjectConfig
  ) {
    super(scene, config);

    this.duration = config.duration ? config.duration : DEFAULT_DURATION;
    this.onInterval = config.onInterval ? config.onInterval : DEFAULT_ON_INTERVAL;
    this.maxIntervals = config.maxIntervals;
  }

  update(delta: number): void {
    this.timer += delta;

    if (this.timer >= this.duration) {
      this.onInterval();
      this.timer -= this.duration; // remove the duration from the timer rather than set to 0 to avoid drift

      this.intervalsComplete++;

      if (this.maxIntervals && this.intervalsComplete >= this.maxIntervals) {
        this.scene.removeObject(this);
      }
    }
  }

  destroy(): void {
    console.log('[IntervalObject] destroyed');
  }
}

import { type Scene } from './scene';

export interface SceneObjectBaseConfig {
  positionX?: number;
  positionY?: number;
  targetX?: number;
  targetY?: number;
  renderLayer?: number;
}

const DEFAULT_RENDER_LAYER = 0;

export class SceneObject {
  isRenderable: boolean = false;
  hasCollision: boolean = false;
  renderLayer: number;

  // position
  positionX: number = -1;
  positionY: number = -1;
  targetX: number = -1;
  targetY: number = -1;

  protected mainContext: CanvasRenderingContext2D;
  protected assets: Record<string, any>;

  constructor(
    protected scene: Scene,
    protected config: SceneObjectBaseConfig
  ) {
    this.mainContext = this.scene.context;
    this.assets = this.scene.assets;

    // position default
    if (this.config.positionX !== undefined) {
      this.positionX = this.config.positionX;
      if (this.config.targetX === undefined) {
        this.targetX = this.positionX;
      }
    }

    if (this.config.positionY !== undefined) {
      this.positionY = this.config.positionY;
      if (this.config.targetY === undefined) {
        this.targetY = this.positionY;
      }
    }

    if (this.config.targetX !== undefined) {
      this.targetX = this.config.targetX;
    }

    if (this.config.targetY !== undefined) {
      this.targetY = this.config.targetY;
    }

    this.renderLayer = this.config.renderLayer ?? DEFAULT_RENDER_LAYER;
  }

  update?(delta: number): void;
  render?(context: CanvasRenderingContext2D): void;
  destroy?(): void;
}

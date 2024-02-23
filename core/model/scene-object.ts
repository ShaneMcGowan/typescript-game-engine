import { RenderUtils } from '@utils/render.utils';
import { type Scene } from './scene';
import { CanvasConstants } from '@constants/canvas.constants';

export interface SceneObjectBaseConfig {
  positionX?: number;
  positionY?: number;
  targetX?: number;
  targetY?: number;
  renderLayer?: number;
  collisionLayer?: number;
}

const DEFAULT_RENDER_LAYER = 0;
const DEFAULT_COLLISION_LAYER = 0;

export class SceneObject {
  id: string = crypto.randomUUID();

  isRenderable: boolean = false;
  hasCollision: boolean = false;
  renderLayer: number;
  collisionLayer: number;

  // position
  positionX: number = -1;
  positionY: number = -1;
  targetX: number = -1;
  targetY: number = -1;

  // dimensions
  width: number = 1;
  height: number = 1;

  // TODO(smg): I'm not convinced of this but I will go with it for now
  keyListeners: Record<string, (event: KeyboardEvent) => void> = {}; // for keyboard events
  eventListeners: Record<string, (event: CustomEvent) => void> = {}; // for scene events

  protected mainContext: CanvasRenderingContext2D;
  protected assets: Record<string, any>;

  // flags
  flaggedForRender: boolean = true; // TODO(smg): implement the usage of this flag to improve engine performance
  flaggedForUpdate: boolean = true; // TODO(smg): implement the usage of this flag to improve engine performance

  constructor(
    protected scene: Scene,
    config: SceneObjectBaseConfig
  ) {
    this.mainContext = this.scene.context;
    this.assets = this.scene.assets;

    // position default
    if (config.positionX !== undefined) {
      this.positionX = config.positionX;
      if (config.targetX === undefined) {
        this.targetX = this.positionX;
      }
    }

    if (config.positionY !== undefined) {
      this.positionY = config.positionY;
      if (config.targetY === undefined) {
        this.targetY = this.positionY;
      }
    }

    if (config.targetX !== undefined) {
      this.targetX = config.targetX;
    }

    if (config.targetY !== undefined) {
      this.targetY = config.targetY;
    }

    this.renderLayer = config.renderLayer ?? DEFAULT_RENDER_LAYER;
    this.collisionLayer = config.collisionLayer ?? DEFAULT_COLLISION_LAYER;
  }

  update?(delta: number): void;
  render?(context: CanvasRenderingContext2D): void;
  destroy?(): void;

  /**
   * Used for debugging
   * @param context
   */
  debuggerRenderBoundary(context: CanvasRenderingContext2D): void {
    RenderUtils.strokeRectangle(
      context,
      Math.floor(this.positionX * CanvasConstants.TILE_SIZE),
      Math.floor(this.positionY * CanvasConstants.TILE_SIZE),
      Math.floor(this.width * CanvasConstants.TILE_SIZE),
      Math.floor(this.height * CanvasConstants.TILE_SIZE),
      'red'
    );
  }

  get cameraRelativePositionX(): number {
    return this.positionX + this.scene.globals.cameraPosition.startX;
  }

  get cameraRelativePositionY(): number {
    return this.positionY + this.scene.globals.cameraPosition.startY;
  }
}

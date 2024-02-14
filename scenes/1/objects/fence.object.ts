import { type Scene } from '@model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@model/scene-object';
import { RenderUtils } from '@utils/render.utils';
import { type Interactable } from '../models/interactable.model';

export class FenceType {
  static TopLeft = { x: 1, y: 0, };
  static TopRight = { x: 3, y: 0, };
  static BottomLeft = { x: 1, y: 2, };
  static BottomRight = { x: 3, y: 2, };
  static MiddleHorizontal = { x: 2, y: 3, };
  static MiddleVertical = { x: 0, y: 1, };
  static FencePost = { x: 0, y: 3, };
  static Open = { x: 0.5, y: 3, };
}

const TILE_SET = 'tileset_fence';

interface Config extends SceneObjectBaseConfig {
  type?: { x: number; y: number; };
}

export class FenceObject extends SceneObject implements Interactable {
  isRenderable = true;
  hasCollision = true;
  width = 1;
  height = 1;

  private readonly type: { x: number; y: number; } = FenceType.FencePost;
  private open = false;

  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);

    if (this.config.type) {
      this.type = this.config.type;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      this.open ? FenceType.Open.x : this.type.x,
      this.open ? FenceType.Open.y : this.type.y,
      this.positionX,
      this.positionY
    );
  }

  interact(): void {
    if (this.open) {
      this.open = false;
      this.hasCollision = true;
    } else {
      this.open = true;
      this.hasCollision = false;
    }
  }
}

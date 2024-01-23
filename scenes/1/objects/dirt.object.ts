import { SceneObject, type SceneObjectBaseConfig } from '@model/scene-object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { RenderUtils } from '@utils/render.utils';

const DIRT = { x: 3, y: 3, };
const DIRT_TOP_LEFT = { x: 0.5, y: 0.5, };
const DIRT_TOP = { x: 1, y: 0.5, };
const DIRT_TOP_RIGHT = { x: 1.5, y: 0.5, };
const DIRT_LEFT = { x: 0, y: 1, };
const DIRT_CENTER = { x: 1, y: 1, };
const DIRT_RIGHT = { x: 2, y: 1, };
const DIRT_BOTTOM_LEFT = { x: 3, y: 3, };
const DIRT_BOTTOM = { x: 3, y: 3, };
const DIRT_BOTTOM_RIGHT = { x: 3, y: 3, };

const TILE_SET = 'tileset_dirt';
const DEFAULT_RENDER_LAYER = 6;

interface Config extends SceneObjectBaseConfig {

}

export class DirtObject extends SceneObject {
  hasCollision = false;
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  private spriteX: number = DIRT.x;
  private spriteY: number = DIRT.y;

  constructor(protected scene: SAMPLE_SCENE_1, protected config: Config) {
    super(scene, config);

    this.scene.addEventListener(this.scene.eventTypes.DIRT_PLACED, this.onDirtPlaced.bind(this));
  }

  onDirtPlaced(event: CustomEvent): void {
    // TODO(smg): update sprite based on surrounding dirt
    if ((event.detail.x + 1) === this.positionX) {
      this.spriteX = DIRT_CENTER.x;
      this.spriteY = DIRT_CENTER.y;
    };
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
  }

  private renderSprite(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.scene.assets.images[TILE_SET],
      this.spriteX,
      this.spriteY,
      this.positionX,
      this.positionY,
      1,
      1
    );
  }
}

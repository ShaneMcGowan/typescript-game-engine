import { SceneObject, type SceneObjectBaseConfig } from '@model/scene-object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { RenderUtils } from '@utils/render.utils';

const DIRT = { x: 3, y: 3, };
const DIRT_LEFT = { x: 0.5, y: 3, };
const DIRT_CENTER = { x: 1, y: 3, };
const DIRT_RIGHT = { x: 1.5, y: 3, };

const TILE_SET = 'tileset_dirt';
const DEFAULT_RENDER_LAYER = 6;
const COUNTER_MAX = 6;

interface Config extends SceneObjectBaseConfig {

}

export class DirtObject extends SceneObject {
  hasCollision = false;
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  private spriteX: number = DIRT.x;
  private spriteY: number = DIRT.y;

  counter: number = 0;

  constructor(protected scene: SAMPLE_SCENE_1, protected config: Config) {
    super(scene, config);

    this.scene.addEventListener(this.scene.eventTypes.DIRT_PLACED, this.onDirtPlaced.bind(this));
    this.scene.addEventListener(this.scene.eventTypes.DIRT_REMOVED, this.onDirtPlaced.bind(this));
  }

  onDirtPlaced(event: CustomEvent): void {
    // update sprite based on surrounding dirt
    let left = this.scene.getAllObjectsAtPosition(this.positionX - 1, this.positionY);
    let right = this.scene.getAllObjectsAtPosition(this.positionX + 1, this.positionY);

    let hasLeft = left.filter(object => object instanceof DirtObject).length > 0;
    let hasRight = right.filter(object => object instanceof DirtObject).length > 0;

    let tile;
    if (hasLeft && hasRight) {
      tile = DIRT_CENTER;
    } else if (hasLeft && !hasRight) {
      tile = DIRT_RIGHT;
    } else if (!hasLeft && hasRight) {
      tile = DIRT_LEFT;
    } else {
      tile = DIRT;
    }

    this.spriteX = tile.x;
    this.spriteY = tile.y;
  }

  update(delta: number): void {
    this.counter += delta;
    if (this.counter > COUNTER_MAX) {
      this.scene.removeObject(this);
      this.scene.dispatchEvent(this.scene.eventTypes.DIRT_PLACED);
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
  }

  destroy(): void {
    console.log('DirtObject destroyed');
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

import { SceneObject, type SceneObjectBaseConfig } from '@model/scene-object';
import { RenderUtils } from '@utils/render.utils';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { type InventoryItemObject } from './inventory-item.object';

const TILE_SET: string = 'tileset_chest';
const DEFAULT_RENDER_LAYER = 8;

interface Config extends SceneObjectBaseConfig {

}

export class ChestObject extends SceneObject {
  hasCollision = true;
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  private isOpen: boolean = false;
  inventory: InventoryItemObject[] = [];

  constructor(protected scene: SAMPLE_SCENE_1, protected config: Config) {
    super(scene, config);

    // register
    this.eventListeners.onOpenChest = this.onOpenChest.bind(this);
    this.eventListeners.onCloseChest = this.onCloseChest.bind(this);

    // enable
    this.enableEventListeners();
  }

  private enableEventListeners(): void {
    this.scene.addEventListener(this.scene.eventTypes.OPEN_CHEST, this.eventListeners.onOpenChest);
    this.scene.addEventListener(this.scene.eventTypes.CLOSE_CHEST, this.eventListeners.onCloseChest);
  }

  private onOpenChest(event: CustomEvent): void {
    if (event.detail.object !== this) {
      return;
    }
    this.openChest();
  }

  private onCloseChest(event: CustomEvent): void {
    if (event.detail.object !== this) {
      return;
    }
    this.closeChest();
  }

  private openChest(): void {
    this.scene.dispatchEvent(this.scene.eventTypes.CHEST_OPENED, { object: this, });
    this.isOpen = true;
  }

  private closeChest(): void {
    this.scene.dispatchEvent(this.scene.eventTypes.CHEST_CLOSED, { object: this, });
    this.isOpen = false;
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
  }

  private renderSprite(context: CanvasRenderingContext2D): void {
    if (this.isOpen) {
      RenderUtils.renderSprite(
        context,
        this.scene.assets.images[TILE_SET],
        13,
        0.5,
        this.positionX,
        this.positionY - 0.5,
        1,
        2
      );
    } else {
      RenderUtils.renderSprite(
        context,
        this.scene.assets.images[TILE_SET],
        1,
        0.5,
        this.positionX,
        this.positionY - 0.5,
        1,
        2
      );
    }
  }
}

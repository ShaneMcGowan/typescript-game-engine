import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SAMPLE_SCENE_1 } from '@game/scenes/1.scene';
import { type InventoryItemObject } from './inventory-item.object';
import { type Interactable } from '../models/interactable.model';

const TILE_SET: string = 'tileset_chest';
const DEFAULT_RENDER_LAYER = 8;

interface Config extends SceneObjectBaseConfig {

}

export class ChestObject extends SceneObject implements Interactable {
  hasCollision = true;
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  width = 1;
  height = 1;

  private isOpen: boolean = false;
  inventory: InventoryItemObject[] = [];

  constructor(protected scene: SAMPLE_SCENE_1, config: Config) {
    super(scene, config);

    // register
    this.eventListeners.onToggleChest = this.onToggleChest.bind(this);

    // enable
    this.enableEventListeners();
  }

  private enableEventListeners(): void {
    this.scene.addEventListener(this.scene.eventTypes.TOGGLE_CHEST, this.eventListeners.onToggleChest);
  }

  private onToggleChest(event: CustomEvent): void {
    if (this.isOpen) {
      this.closeChest();
    } else if (event.detail.object === this) {
      this.openChest();
    }
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

  interact(): void {
    if (this.isOpen) {
      this.closeChest();
    } else {
      this.openChest();
    }
  }
}

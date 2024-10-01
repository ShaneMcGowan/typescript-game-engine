import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type InventoryItemObject } from '@game/objects/inventory-item.object';
import { type Interactable } from '@game/models/interactable.model';
import { InventoryObject } from '@game/objects/inventory.object';

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

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
  }

  interact(): void {
    this.actionOpen();
  }

  private actionOpen(): void {
    this.isOpen = true;

    this.scene.addObject(new InventoryObject(
      this.scene,
      {
        positionX: 0,
        positionY: 0,
        chest: this
      }
    ));
  }

  actionClose(): void {
    this.isOpen = false;
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

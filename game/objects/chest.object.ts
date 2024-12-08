import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type InventoryItem } from '@game/objects/inventory-item.object';
import { type Interactable } from '@game/models/interactable.model';
import { InventoryObject } from '@game/objects/inventory.object';
import { Assets } from '@core/utils/assets.utils';

const TILE_SET: string = 'tileset_chest';
const RENDERER_LAYER = 8;

interface Config extends SceneObjectBaseConfig {

}

export class ChestObject extends SceneObject implements Interactable {

  private isOpen: boolean = false;
  inventory: InventoryItem[] = [];

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = RENDERER_LAYER;
  }

  onRender(context: CanvasRenderingContext2D): void {
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
        Assets.images[TILE_SET],
        13,
        0.5,
        this.transform.position.world.x,
        this.transform.position.world.y - 0.5,
        1,
        2,
        {
          centered: true,
        }
      );
    } else {
      RenderUtils.renderSprite(
        context,
        Assets.images[TILE_SET],
        1,
        0.5,
        this.transform.position.world.x,
        this.transform.position.world.y - 0.5,
        1,
        2,
        {
          centered: true,
        }
      );
    }
  }

}

import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { InventoryObject } from '@game/objects/inventory/inventory.object';
import { Assets } from '@core/utils/assets.utils';
import { Inventory } from '@game/models/inventory.model';
import { PlayerObject } from '@game/objects/player.object';

const TILE_SET: string = 'tileset_chest';
const RENDERER_LAYER = 8;

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
}

export class ChestObject extends SceneObject implements Interactable {
  private player: PlayerObject;

  inventory: Inventory;
  rows: number = 5;
  columns: number = 5;

  private isOpen: boolean = false;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = RENDERER_LAYER;

    this.player = config.player;

    this.inventory = new Inventory(this.rows, this.columns);
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
  }

  get totalSlots(): number {
    return this.rows * this.columns;
  }

  interact(): void {
    this.actionOpen();
  }

  private actionOpen(): void {
    this.isOpen = true;

    this.scene.addObject(new InventoryObject(
      this.scene,
      {
        x: 0,
        y: 0,
        chest: this,
        player: this.player,
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
        1,
        this.transform.position.world.x,
        this.transform.position.world.y,
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
        1,
        this.transform.position.world.x,
        this.transform.position.world.y,
        1,
        2,
        {
          centered: true,
        }
      );
    }
  }

}

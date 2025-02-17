import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { Assets } from '@core/utils/assets.utils';
import { type Interactable } from '@game/models/components/interactable.model';
import { MessageUtils } from '@game/utils/message.utils';
import { Inventory, ItemType } from '@game/models/inventory.model';

interface Config extends SceneObjectBaseConfig {}

export class FurnaceObject extends SceneObject implements Interactable {
  fuel: boolean;
  smelting: ItemType | undefined;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images['tileset_furnace'],
      0,
      0,
      this.transform.position.world.x,
      this.transform.position.world.y,
      1,
      1,
      {
        type: 'tile',
      }
    );

    if (this.fuel) {
      RenderUtils.fillRectangle(
        context,
        this.transform.position.world.x,
        this.transform.position.world.y,
        1,
        1,
        {
          type: 'tile',
          colour: '#FF000099',
        }
      );
    }
  }

  interact(): void {
    if (!this.fuel) {
      this.onNoFuel();
    }

    this.onFuel();
  };

  private onNoFuel(): void {
    const item = this.scene.selectedInventoryItem;
    if (item !== undefined && item.type === ItemType.Coal) {
      this.fuel = true;
      this.scene.globals.inventory.removeFromInventoryByIndex(this.scene.globals.hotbar_selected_index, 1);
      return;
    }

    MessageUtils.showMessage(this.scene, `The ${Inventory.getItemName(ItemType.Furnace)} has no fuel.`);
  }

  private onFuel(): void {
    const item = this.scene.selectedInventoryItem;
    if (item !== undefined && item.type === ItemType.Copper) {
      this.smelting = item.type;
      this.scene.globals.inventory.removeFromInventoryByIndex(this.scene.globals.hotbar_selected_index, 1);
      return;
    }

    MessageUtils.showMessage(this.scene, `The ${Inventory.getItemName(ItemType.Furnace)} has fuel.`);
  }
}

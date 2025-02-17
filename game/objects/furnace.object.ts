import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { Assets } from '@core/utils/assets.utils';
import { type Interactable } from '@game/models/components/interactable.model';
import { MessageUtils } from '@game/utils/message.utils';
import { Inventory, ItemType } from '@game/models/inventory.model';

const SMELTABLE: ItemType[] = [ItemType.Copper, ItemType.Wheat];

// time in seconds
const SMELT_TIME: Partial<Record<ItemType, number>> = {
  [ItemType.Wheat]: 5,
  [ItemType.Copper]: 5,
};

const INPUT_TO_OUTPUT_MAP: Partial<Record<ItemType, ItemType>> = {
  [ItemType.Wheat]: ItemType.Bread,
  [ItemType.Copper]: ItemType.Axe,
};

interface Config extends SceneObjectBaseConfig {}

export class FurnaceObject extends SceneObject implements Interactable {
  fuel: boolean;
  smelting: ItemType | undefined;
  smeltingTimer: number = 0;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.layer = 10;
    this.renderer.enabled = true;
  }

  onUpdate(delta: number): void {
    if (this.smelting === undefined) {
      this.smeltingTimer = 0;
    }

    this.smeltingTimer += delta;
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

    if (this.smelting) {
      // bar
      RenderUtils.fillRectangle(
        context,
        this.transform.position.world.x,
        this.transform.position.world.y - 0.5,
        1,
        0.25,
        {
          type: 'tile',
          colour: '#FF000099',
        }
      );
      RenderUtils.fillRectangle(
        context,
        this.transform.position.world.x,
        this.transform.position.world.y - 0.5,
        this.smeltPercentage,
        0.25,
        {
          type: 'tile',
          colour: '#00FF00',
        }
      );
    }

    if (this.smeltPercentage === 1) {
      RenderUtils.fillRectangle(
        context,
        this.transform.position.world.x,
        this.transform.position.world.y - 1.25,
        1,
        1,
        {
          type: 'tile',
          colour: '#00FF00',
        }
      );
    }
  }

  interact(): void {
    if (!this.fuel) {
      this.onNoFuel();
    } else if (this.smelting === undefined) {
      this.onFuel();
    } else if (this.smeltPercentage !== 1) {
      this.onSmelting();
    } else {
      this.onComplete();
    }
  };

  get smeltTime(): number | undefined {
    return SMELT_TIME[this.smelting];
  }

  get smeltPercentage(): number {
    if (this.smelting === undefined || this.smeltTime === undefined) {
      return 0;
    }

    return Math.min(this.smeltingTimer / this.smeltTime, 1);
  }

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
    if (item !== undefined && SMELTABLE.includes(item.type)) {
      this.smelting = item.type;
      this.scene.globals.inventory.removeFromInventoryByIndex(this.scene.globals.hotbar_selected_index, 1);
      return;
    }

    MessageUtils.showMessage(this.scene, `The ${Inventory.getItemName(ItemType.Furnace)} has fuel.`);
  }

  private onSmelting(): void {
    MessageUtils.showMessage(this.scene, `The ${Inventory.getItemName(ItemType.Furnace)} is currently smelting ${Inventory.getItemName(this.smelting)}.`);
  }

  private onComplete(): void {
    const output = INPUT_TO_OUTPUT_MAP[this.smelting];
    if (output === undefined) {
      return;
    }

    this.scene.globals.inventory.addToInventory(output);

    // give player item
    this.fuel = false;
    this.smelting = undefined;
  }
}

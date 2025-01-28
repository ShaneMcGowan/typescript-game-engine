import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { Assets } from '@core/utils/assets.utils';
import { Inventory, Item, ItemType, ItemTypeKeys } from '@game/models/inventory.model';
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants"
import { TilesetBasic } from '@game/constants/tilesets/basic.tileset';
import { MessageUtils } from '@game/utils/message.utils';
import { TilesetHouse } from '@game/constants/tilesets/house.tileset';

export enum LockType {
  Gate,
  Door,
}

const DEFAULT_TYPE: LockType = LockType.Door;
const DEFAULT_KEY: ItemType = ItemType.Axe; // the ultimate key

export interface LockConfig extends SceneObjectBaseConfig {
}

/**
 * A barrier that can be used to block the player, for use with a Story
 */
export class LockObject extends SceneObject implements Interactable {

  // config
  width = 1;
  
  height = 1;
  
  // state

  constructor(protected scene: SCENE_GAME, config: LockConfig) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  onRender(context: CanvasRenderingContext2D): void {
    switch(this.type) {
      case LockType.Gate: {
        this.renderGate(context);
        return;
      }
      case LockType.Door: {
        this.renderDoor(context);
        return;
      }
    }
  }

  interact(): void {
    this.scene.globals.player.enabled = false;
    if(this.item === undefined || !ItemTypeKeys.some(type => type === this.item.type)){
      MessageUtils.showMessage(
        this.scene,
        this.messageIntro,
        () => this.interactNoKey(),
        false,
      );
    } else if (this.item.type !== this.key) {
      this.interactWrongKey();
    } else {
      this.interactWithKey();
    }
  }

  get type(): LockType {
    return DEFAULT_TYPE;
  }
  
  get key(): ItemType {
    return DEFAULT_KEY;
  }

  get flag(): StoryFlag {
    return StoryFlag.default_completed;
  }

  get item(): Item | undefined {
    return this.scene.selectedInventoryItem;
  }

  get messageIntro(): string {
    return SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.intro;
  }

  get messageNoKey(): string | undefined {
    return undefined;
  }

  get messageWrongKey(): string | undefined {
    return `The ${Inventory.getItemName(this.item.type)} doesn't fit. I'll need to find the correct key.`;
  }

  get messageCorrectKey(): string {
    return `I insert the ${Inventory.getItemName(this.item.type)} into the lock. The lock clicks open. The key gets stuck though, oopsie...`;
  }

  private renderGate(context: CanvasRenderingContext2D): void {
    const LeftHorizontal = { x: 1, y: 3, width: 1, height: 1 };
    const RightHorizontal = { x: 3, y: 3, width: 1, height: 1 };

    RenderUtils.renderSprite(
      context,
      Assets.images['tileset_fence'],
      LeftHorizontal.x,
      LeftHorizontal.y,
      this.transform.position.world.x - 1,
      this.transform.position.world.y,
      LeftHorizontal.width,
      LeftHorizontal.height,
    );

    RenderUtils.renderSprite(
      context,
      Assets.images['tileset_fence'],
      RightHorizontal.x,
      RightHorizontal.y,
      this.transform.position.world.x + 1,
      this.transform.position.world.y,
      RightHorizontal.width,
      RightHorizontal.height,
    );

    // icon
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      TilesetBasic.Blocked.White.Default.x,
      TilesetBasic.Blocked.White.Default.y,
      this.transform.position.world.x - (1 / 16),
      this.transform.position.world.y - (1 / 16),
      TilesetBasic.Blocked.White.Default.width,
      TilesetBasic.Blocked.White.Default.height,
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      TilesetBasic.Blocked.Dark.Default.x,
      TilesetBasic.Blocked.Dark.Default.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetBasic.Blocked.Dark.Default.width,
      TilesetBasic.Blocked.Dark.Default.height,
    );
  }

  private renderDoor(context: CanvasRenderingContext2D): void {
    const tile = TilesetHouse.Door.Default.Closed;

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetHouse.id],
      tile.x,
      tile.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      tile.width,
      tile.height,
    );
  }

  private interactNoKey(): void {
    if(this.messageNoKey === undefined){
      this.scene.globals.player.enabled = true;
      return;
    }

    // message saying gate is locked
    MessageUtils.showMessage(
      this.scene,
      this.messageNoKey,
    );
  }

  private interactWrongKey(): void {
    if(this.messageWrongKey === undefined){
      this.scene.globals.player.enabled = true;
      return;
    }

    // message saying a different key is needed
    MessageUtils.showMessage(
      this.scene,
      this.messageWrongKey,
    );
  }

  private interactWithKey(): void {

    const callback = () => {
      // remove key from inventory
      this.scene.globals.inventory.removeFromInventoryByIndex(this.scene.globals.hotbar_selected_index, 1);
      
      // set scene flag
      this.scene.setStoryFlag(this.flag, true);
    };

    MessageUtils.showMessage(
      this.scene,
      SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.key(this.item.type),
      callback,
    );
  }

}

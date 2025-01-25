import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { Assets } from '@core/utils/assets.utils';
import { Item, ItemType, ItemTypeKeys } from '@game/models/inventory.model';
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants"
import { TilesetBasic } from '@game/constants/tilesets/basic.tileset';
import { MessageUtils } from '@game/utils/message.utils';

interface Config extends SceneObjectBaseConfig {
  key: ItemType;
  flag: StoryFlag
}

/**
 * A barrier that can be used to block the player, for use with a Story
 */
export class GateObject extends SceneObject implements Interactable {

  // config
  width = 1;
  
  height = 1;
  
  key: ItemType;
  flag: StoryFlag;

  // state

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;

    this.key = config.key;
    this.flag = config.flag;
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderGate(context);
  }

  interact(): void {
    this.scene.globals.player.enabled = false;

    const callback = (): void => {
      if(this.item === undefined || !ItemTypeKeys.some(type => type === this.item.type)){
        this.interactNoKey();
      } else if (this.item.type !== this.key) {
        this.interactWrongKey();
      } else {
        this.interactWithKey();
      }
    }

    MessageUtils.showMessage(
      this.scene,
      SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.intro,
      callback,
      false,
    );
  }

  get item(): Item | undefined {
    return this.scene.selectedInventoryItem;
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

  private interactNoKey(): void {
    // message saying gate is locked
    MessageUtils.showMessage(
      this.scene,
      SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.no_key,
    );
  }

  private interactWrongKey(): void {
    // message saying a different key is needed
    MessageUtils.showMessage(
      this.scene,
      SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.wrong_key(this.item.type),
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

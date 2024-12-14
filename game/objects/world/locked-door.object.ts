import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/interactable.model';
import { Assets } from '@core/utils/assets.utils';
import { TilesetHouse } from '@game/constants/tileset-house.constants';
import { ItemType } from '@game/models/inventory.model';
import { TextboxObject } from '../textbox.object';

interface Config extends SceneObjectBaseConfig {

}

export class LockedDoorObject extends SceneObject implements Interactable {
  width = 1;
  height = 1;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderDoor(context);
  }

  interact(): void {
    this.scene.globals.disable_player_inputs = true;
    this.scene.addObject(new TextboxObject(
      this.scene,
      {
        text: `It looks like some sort of Shop. The light inside appears to be off. I wonder if anyone is there...`,
        portrait: undefined,
        name: undefined,
        onComplete: () => {
          const index = this.scene.globals.inventory.getFirstIndexForType(ItemType.ShopKey);
          if(index === undefined){
            this.interactNoKey();
          } else {
            this.interactWithKey(index);
          }
        }
      }
    ));
  }

  private renderDoor(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetHouse.id],
      TilesetHouse.Door.Default.Closed.x,
      TilesetHouse.Door.Default.Closed.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.width,
      this.height,
      {
        centered: true,
      }
    );
  }

  private interactNoKey(): void {
    // message saying door is locked
    this.scene.addObject(new TextboxObject(
      this.scene,
      {
        text: `The door is locked. Looks like I'll need to find a key. Or I could break in... but Mum would be disappointed in me if I did that :( `,
        portrait: undefined,
        name: undefined,
        onComplete: () => {
          this.scene.globals.disable_player_inputs = false;
        }
      }
    ));
  }

  private interactWithKey(index: number): void {
    // remove key from inventory
    this.scene.globals.inventory.removeFromInventoryByIndex(index, 1);

    // display message
    this.addChild(new TextboxObject(
      this.scene,
      {
        text: 'I insert the Shop Key into the lock. The lock clicks open. The key gets stuck though, oopsie...',
        portrait: undefined,
        name: undefined,
        onComplete: () => {
          // enable inputs
          this.scene.globals.disable_player_inputs = false;
          // destroy door
          this.destroy();
        }
      }
    ));
  }

}

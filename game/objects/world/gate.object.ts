import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/interactable.model';
import { Assets } from '@core/utils/assets.utils';
import { TilesetHouse } from '@game/constants/tileset-house.constants';
import { ItemType } from '@game/models/inventory.model';
import { TextboxObject } from '../textbox.object';
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants"

interface Config extends SceneObjectBaseConfig {

}

export class GateObject extends SceneObject implements Interactable {
  width = 1;
  height = 1;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderGate(context);
  }

  interact(): void {
    this.scene.globals.player.enabled = false;
    
    this.scene.addObject(new TextboxObject(
      this.scene,
      {
        text: SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.intro,
        onComplete: () => {
          const index = this.scene.globals.inventory.getFirstIndexForType(ItemType.GateKey);
          if (index === undefined) {
            this.interactNoKey();
          } else {
            this.interactWithKey(index);
          }
        }
      }
    ));
  }

  private renderGate(context: CanvasRenderingContext2D): void {
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
        text: SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.no_key,
        onComplete: () => {
          this.scene.globals.player.enabled = true;
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
        text: SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.key,
        onComplete: () => {
          // enable inputs
          this.scene.globals.player.enabled = true;
          // destroy door
          this.destroy();
        }
      }
    ));
  }

}

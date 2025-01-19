import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { SceneFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { Assets } from '@core/utils/assets.utils';
import { ItemType } from '@game/models/inventory.model';
import { TextboxObject } from '../textbox.object';
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants"
import { TilesetBasic } from '@game/constants/tilesets/basic.tileset';
import { MessageUtils } from '@game/utils/message.utils';

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
    // message saying door is locked
    MessageUtils.showMessage(
      this.scene,
      SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.no_key,
    );
  }

  private interactWithKey(index: number): void {
    // remove key from inventory
    this.scene.globals.inventory.removeFromInventoryByIndex(index, 1);

    MessageUtils.showMessage(
      this.scene,
      SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.key,
      () => {
        this.destroy();
      }
    );
  }

}

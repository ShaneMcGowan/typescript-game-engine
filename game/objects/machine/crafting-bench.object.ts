import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { Assets } from '@core/utils/assets.utils';
import { type Interactable } from '@game/models/components/interactable.model';
import { MessageUtils } from '@game/utils/message.utils';
import { Inventory, ItemType } from '@game/models/inventory.model';

interface Config extends SceneObjectBaseConfig { }

export class CraftingBenchObject extends SceneObject implements Interactable {

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.layer = 10;
    this.renderer.enabled = true;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images['tileset_machine_crafting_bench'],
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
  }

  interact(): void {
    MessageUtils.showMessage(this.scene, `TODO: crafting bench ui`);
  };

}

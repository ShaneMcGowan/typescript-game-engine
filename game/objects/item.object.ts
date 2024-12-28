import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { Assets } from "@core/utils/assets.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { Interactable } from "@game/models/interactable.model";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "./textbox.object";
import { Inventory, ItemSprite, ItemType, TYPE_TO_NAME_MAP, TYPE_TO_SPRITE_MAP } from "@game/models/inventory.model";

interface Config extends SceneObjectBaseConfig {
  type: ItemType;
}

export class ItemObject extends SceneObject implements Interactable {
  constructor(protected scene: SCENE_GAME, protected config: Config){
    super(scene, config);

    this.collision.enabled = false;
    this.renderer.enabled = true;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[this.sprite.tileset],
      this.sprite.x,
      this.sprite.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      1,
      1,
    )
  }

  interact(): void {
    this.scene.globals.player.enabled = false;

    const textbox = new TextboxObject(
      this.scene,
      {
        text: `You pick up the ${this.name}.`,
        onComplete: () => {
          this.inventory.addToInventory(this.type);
          // TODO: handle case of inventory full
          this.scene.globals.player.enabled = true;
          this.destroy();
        },
      }
    );

    this.scene.addObject(textbox);
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get name(): string {
    return TYPE_TO_NAME_MAP[this.type];
  }

  get sprite(): ItemSprite {
    return TYPE_TO_SPRITE_MAP[this.type];
  }

  get type(): ItemType {
    return this.config.type;
  }

}
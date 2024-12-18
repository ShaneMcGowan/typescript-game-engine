import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { Assets } from '@core/utils/assets.utils';
import { Inventory, Item } from '@game/models/inventory.model';

interface Config extends SceneObjectBaseConfig {
}

export class HotbarObject extends SceneObject {
  height: number = 2;
  width: number = 10;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
    this.collision.layer = CanvasConstants.UI_COLLISION_LAYER;
  }

  onUpdate(delta: number): void { }

  onRender(context: CanvasRenderingContext2D): void {
    if(this.scene.globals.disable_player_inputs === true){
      return;
    }
    
    this.renderContainers(context);
    this.renderItems(context, this.inventory.items.slice(0, this.hotbar.size));
    this.renderHotbarSelector(context);
  }

  private renderHotbarSelector(context: CanvasRenderingContext2D): void {
    const x = this.boundingBox.world.left + 1 + (this.hotbarSelectedIndex * 2);
    const y = this.boundingBox.world.top + 1;

    RenderUtils.renderSprite(
      context,
      Assets.images.tileset_ui,
      9,
      9,
      x,
      y,
      2,
      2,
      {
        centered: true,
      }
    );
  }


  private renderContainers(context: CanvasRenderingContext2D): void {
    for (let i = 0; i < 5; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images.tileset_ui,
        0.5,
        3.5,
        this.boundingBox.world.left + 1 + (i * 2),
        this.boundingBox.world.top + 1,
        2,
        2,
        {
          centered: true,
        }
      );
    }
  }

  private renderItems(context: CanvasRenderingContext2D, inventory: Item[]): void {
    for (let i = 0; i < 5; i++) {
      let item = inventory[i];
      if (item === undefined) {
        continue;
      }

      this.renderInventoryItem(
        context,
        item.sprite.tileset,
        item.currentStackSize,
        item.maxStackSize,
        item.sprite.spriteX,
        item.sprite.spriteY,
        (this.boundingBox.world.left + 1) + (i * 2),
        (this.boundingBox.world.top + 1)
      );
    }
  }

  private renderInventoryItem(context: CanvasRenderingContext2D, tileset: string, stackSize: number, maxStackSize: number, spriteX: number, spriteY: number, positionX: number, positionY: number): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[tileset],
      spriteX,
      spriteY,
      positionX,
      positionY,
      1,
      1,
      {
        centered: true,
      }
    );

    if (maxStackSize > 1) {
      RenderUtils.renderText(
        context,
        `${stackSize}`,
        positionX + 0.75,
        positionY + 1,
        { size: 8, }
      );
    }
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get hotbar(): Inventory {
    return this.scene.globals.hotbar;
  }

  get hotbarSelectedIndex(): number {
    return this.scene.globals['hotbar_selected_index'];
  }

}

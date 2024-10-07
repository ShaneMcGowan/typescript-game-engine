import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type InventoryItemObject } from '@game/objects/inventory-item.object';
import { RenderUtils } from '@core/utils/render.utils';

const DEFAULT_RENDER_LAYER: number = CanvasConstants.UI_RENDER_LAYER;
const DEFAULT_COLLISION_LAYER: number = CanvasConstants.UI_COLLISION_LAYER;

interface Config extends SceneObjectBaseConfig {

}

export class HotbarObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  collisionLayer = DEFAULT_COLLISION_LAYER;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  update(delta: number): void { }

  render(context: CanvasRenderingContext2D): void {
    this.renderBackground(context);
    this.renderContainers(context);
    this.renderItems(context, this.inventory.slice(0, this.hotbarSize));
    this.renderHotbarSelector(context);
  }

  private renderHotbarSelector(context: CanvasRenderingContext2D): void {
    const x = this.positionX + (this.hotbarSelectedIndex * 2);
    const y = this.positionY;

    RenderUtils.renderSprite(
      context,
      this.assets.images.tileset_ui,
      9,
      9,
      x,
      y,
      2,
      2
    );
  }

  private renderBackground(context: CanvasRenderingContext2D): void {
    let width = CanvasConstants.TILE_SIZE * 2 * this.hotbarSize;
    let height = CanvasConstants.TILE_SIZE * 2;

    RenderUtils.fillRectangle(
      context,
      this.positionX,
      this.positionY,
      width,
      height,
      { colour: 'saddlebrown', }
    );
  }

  private renderContainers(context: CanvasRenderingContext2D): void {
    for (let i = 0; i < 5; i++) {
      RenderUtils.renderSprite(
        context,
        this.assets.images.tileset_ui,
        0.5,
        3.5,
        this.positionX + (i * 2),
        this.positionY,
        2,
        2
      );
    }
  }

  private renderItems(context: CanvasRenderingContext2D, inventory: InventoryItemObject[]): void {
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
        (this.positionX + 0.5) + (i * 2),
        (this.positionY + 0.5)
      );
    }
  }

  private renderInventoryItem(context: CanvasRenderingContext2D, tileset: string, stackSize: number, maxStackSize: number, spriteX: number, spriteY: number, positionX: number, positionY: number): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[tileset],
      spriteX,
      spriteY,
      positionX,
      positionY
    );

    if (maxStackSize > 1) {
      RenderUtils.renderText(
        context,
        `${stackSize}`,
        positionX + 0.75,
        positionY + 1,
        { size: 8, colour: 'black', }
      );
    }
  }

  get inventory(): InventoryItemObject[] {
    return this.scene.globals['inventory'];
  }

  get inventorySize(): number {
    return this.scene.globals['inventory_size'];
  }

  get hotbarSize(): number {
    return this.scene.globals['hotbar_size'];
  }

  get hotbarSelectedIndex(): number {
    return this.scene.globals['hotbar_selected_index'];
  }

}

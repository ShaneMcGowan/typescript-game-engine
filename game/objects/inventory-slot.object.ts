import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { MouseUtils } from "@core/utils/mouse.utils";
import { Input, MouseKey } from "@core/utils/input.utils";
import { Assets } from "@core/utils/assets.utils";
import { InventoryItem, InventoryItemSprite, TYPE_TO_SPRITE_MAP } from "./inventory-item.object";
import { InventoryObject } from "./inventory.object";


interface Config extends SceneObjectBaseConfig {
  inventoryIndex: number;
}

export class InventorySlotObject extends SceneObject {
  width: number = 2;
  height: number = 2;
  inventoryIndex: number;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
    this.inventoryIndex = config.inventoryIndex;
  }

  onUpdate(delta: number): void {
    this.updateClicked();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderContainer(context);
    this.renderItem(context);
  }

  private updateClicked(): void {
    // currently dragging
    if((this.parent as InventoryObject).itemDraggingIndex !== undefined){
      return;
    }

    if (!Input.isMousePressed()) {
      return;
    }

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    if(this.item === undefined){
      return;
    }

    (this.parent as InventoryObject).startDraggingItem(this.inventoryIndex);
  }

  private renderContainer(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images.tileset_ui,
      0.5,
      3.5,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.width,
      this.height,
      {
        centered: true,
      }
    );
  }

  private renderItem(context: CanvasRenderingContext2D): void {
    if(this.sprite === undefined){
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[this.sprite.tileset],
      this.sprite.spriteX,
      this.sprite.spriteY,
      this.transform.position.world.x,
      this.transform.position.world.y,
      undefined,
      undefined,
      {centered: true}
    );
  }

  get item(): InventoryItem | undefined {
    return this.scene.globals.inventory[this.inventoryIndex];
  }

  get sprite(): InventoryItemSprite | undefined {
    if(this.item === undefined){
      return undefined;
    }

    return TYPE_TO_SPRITE_MAP[this.item.type];
  }
}
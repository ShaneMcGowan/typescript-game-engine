import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { MouseUtils } from "@core/utils/mouse.utils";
import { Input } from "@core/utils/input.utils";
import { Assets } from "@core/utils/assets.utils";
import { InventoryObject } from "./inventory.object";
import { ChestObject } from '@game/objects/world-objects/chest.object';
import { ItemSprite, Item, TYPE_TO_SPRITE_MAP, Inventory } from "@game/models/inventory.model";
import { TilesetUI } from "@game/constants/tilesets/ui.tileset";

enum Controls {
  QuickMove = 'shift'
}

interface Config extends SceneObjectBaseConfig {
  chest?: ChestObject;
  index: number;
}

export class InventorySlotObject extends SceneObject {
  width: number = 2;
  height: number = 2;

  chest?: ChestObject;
  index: number;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER + 1;

    this.chest = config.chest;
    this.index = config.index;
  }

  onUpdate(delta: number): void {
    this.updateClicked();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderContainer(context);
    this.renderItem(context);
    this.renderStackSize(context);
  }

  private updateClicked(): void {
    // currently dragging
    if ((this.parent as InventoryObject).dragging !== undefined) {
      return;
    }

    if (!Input.isMousePressed()) {
      return;
    }

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    if (this.item === undefined) {
      return;
    }

    if (Input.isKeyPressed(Controls.QuickMove)) {
      (this.parent as InventoryObject).quickMove(this.chest ? 'chest' : 'inventory', this.index);
    } else {
      (this.parent as InventoryObject).startDraggingItem('mouse', this.chest ? 'chest' : 'inventory', this.index);
    }

  }

  private renderContainer(context: CanvasRenderingContext2D): void {
    const tile = MouseUtils.isMouseWithinObject(this) ? TilesetUI.Container.Darker.Default : TilesetUI.Container.Default.Default;

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetUI.id],
      tile.x,
      tile.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      tile.width,
      tile.height,
      {
        centered: true,
      }
    );
  }

  private renderItem(context: CanvasRenderingContext2D): void {
    if (this.sprite === undefined) {
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[this.sprite.tileset],
      this.sprite.x,
      this.sprite.y,
      this.transform.position.world.x + 0.5,
      this.transform.position.world.y + 0.5,
      1,
      1,
      { centered: true }
    );
  }

  private renderStackSize(context: CanvasRenderingContext2D): void {
    if (this.item === undefined) {
      return;
    }

    if (Inventory.getItemMaxStackSize(this.item.type) === 1) {
      return;
    }

    RenderUtils.renderText(
      context,
      `${this.item.currentStackSize}`,
      this.transform.position.world.x + 1.25,
      this.transform.position.world.y + 1.75,
    );
  }

  get item(): Item | undefined {
    if (this.chest) {
      return this.chest.inventory.items[this.index];
    }

    return this.inventory.items[this.index];
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get sprite(): ItemSprite | undefined {
    if (this.item === undefined) {
      return undefined;
    }

    return TYPE_TO_SPRITE_MAP[this.item.type];
  }
}
import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type ChestObject } from '@game/objects/chest.object';
import { type InventoryItemObject } from '@game/objects/inventory-item.object';
import { RenderUtils } from '@core/utils/render.utils';
import { Input } from '@core/utils/input.utils';

const DEFAULT_RENDER_LAYER: number = CanvasConstants.UI_RENDER_LAYER;
const DEFAULT_COLLISION_LAYER: number = CanvasConstants.UI_COLLISION_LAYER;
const INVENTORY_INDEX_TO_POSITION_MAP = [
  // hot bar
  { x: 7, y: 15, },
  { x: 9, y: 15, },
  { x: 11, y: 15, },
  { x: 13, y: 15, },
  { x: 15, y: 15, },
  { x: 17, y: 15, },
  { x: 19, y: 15, },
  { x: 21, y: 15, },
  { x: 23, y: 15, },
  // inventory - row 1
  { x: 7, y: 8, },
  { x: 9, y: 8, },
  { x: 11, y: 8, },
  { x: 13, y: 8, },
  { x: 15, y: 8, },
  { x: 17, y: 8, },
  { x: 19, y: 8, },
  { x: 21, y: 8, },
  { x: 23, y: 8, },
  // inventory - row 2
  { x: 7, y: 10, },
  { x: 9, y: 10, },
  { x: 11, y: 10, },
  { x: 13, y: 10, },
  { x: 15, y: 10, },
  { x: 17, y: 10, },
  { x: 19, y: 10, },
  { x: 21, y: 10, },
  { x: 23, y: 10, },
  // inventory - row 3
  { x: 7, y: 12, },
  { x: 9, y: 12, },
  { x: 11, y: 12, },
  { x: 13, y: 12, },
  { x: 15, y: 12, },
  { x: 17, y: 12, },
  { x: 19, y: 12, },
  { x: 21, y: 12, },
  { x: 23, y: 12, }
];

const CHEST_INDEX_TO_POSITION_MAP = [
  // chest - row 1
  { x: 7, y: 1, },
  { x: 9, y: 1, },
  { x: 11, y: 1, },
  { x: 13, y: 1, },
  { x: 15, y: 1, },
  { x: 17, y: 1, },
  { x: 19, y: 1, },
  { x: 21, y: 1, },
  { x: 23, y: 1, },
  // chest - row 2
  { x: 7, y: 3, },
  { x: 9, y: 3, },
  { x: 11, y: 3, },
  { x: 13, y: 3, },
  { x: 15, y: 3, },
  { x: 17, y: 3, },
  { x: 19, y: 3, },
  { x: 21, y: 3, },
  { x: 23, y: 3, },
  // chest - row 3
  { x: 7, y: 5, },
  { x: 9, y: 5, },
  { x: 11, y: 5, },
  { x: 13, y: 5, },
  { x: 15, y: 5, },
  { x: 17, y: 5, },
  { x: 19, y: 5, },
  { x: 21, y: 5, },
  { x: 23, y: 5, }
];

enum Controls {
  Close = 'tab',
  CloseAlt = 'escape',
}

interface Config extends SceneObjectBaseConfig {
  chest?: ChestObject
}

export class ShopObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  collisionLayer = DEFAULT_COLLISION_LAYER;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  update(delta: number): void {

  }

  render(context: CanvasRenderingContext2D): void {
    this.renderBackground(context);
    this.renderShopBackground(context);
    this.renderInventoryBackground(context);
  }

  destroy(): void {
    this.scene.globals.disable_player_inputs = false;
  }

  get inventory(): InventoryItemObject[] {
    return this.scene.globals['inventory'];
  }

  get inventorySize(): number {
    return this.scene.globals['inventory_size'];
  }

  private renderBackground(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      0,
      0,
      32,
      18,
      {
        colour: '#00000055',
        type: 'tile'
      }
    )
  }

  private renderShopBackground(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      1,
      1,
      14,
      8,
      {
        colour: 'brown',
        type: 'tile'
      }
    )
  }

  private renderInventoryBackground(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      17,
      1,
      14,
      8,
      {
        colour: 'brown',
        type: 'tile'
      }
    )
  }

}

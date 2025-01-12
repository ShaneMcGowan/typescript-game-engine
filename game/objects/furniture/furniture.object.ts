import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Assets } from '@core/utils/assets.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { TilesetFurniture } from '@game/constants/tilesets/furniture.tileset';
import { ItemType, ItemTypeFurniture } from '@game/models/inventory.model';
import { TileConfig } from '@game/models/tile.model';
import { type SCENE_GAME } from '@game/scenes/game/scene';

const RENDERER_LAYER: number = 8;

const SPRITES: Record<ItemTypeFurniture, {
  id: string,
  config: TileConfig
}> = {
  [ItemType.FurnitureBed]: {
    id: TilesetFurniture.id,
    config: TilesetFurniture.Bed.Blue.Default,
  },
  [ItemType.FurniturePainting]: {
    id: TilesetFurniture.id,
    config: TilesetFurniture.Painting.Flowers.Default,
  },
  [ItemType.FurnitureRugLarge]: {
    id: TilesetFurniture.id,
    config: TilesetFurniture.Rug.Blue.Large,
  },
  [ItemType.FurnitureTable]: {
    id: TilesetFurniture.id,
    config: TilesetFurniture.Table.Default.Default,
  },
  [ItemType.FurnitureLamp]: {
    id: TilesetFurniture.id,
    config: TilesetFurniture.Lamp.Blue.Default,
  }
}

export interface FurnitureConfig extends SceneObjectBaseConfig {

}

export abstract class FurnitureObject extends SceneObject {

  constructor(
    protected scene: SCENE_GAME,
    config: FurnitureConfig
  ) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = RENDERER_LAYER;
  }
  
  get type(): ItemTypeFurniture {
    return ItemType.FurnitureBed; // default type
  }

  get sprite(): {
    id: string,
    config: TileConfig
  } { 
    return SPRITES[this.type];
  }

  /**
   * offset for making sprites feel better in the world
   */
  get offsetX(): number {
    return 0;
  }

  /**
   * offset for making sprites feel better in the world
   */
  get offsetY(): number {
    return 0;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[this.sprite.id],
      this.sprite.config.x,
      this.sprite.config.y,
      this.transform.position.world.x + this.offsetX,
      this.transform.position.world.y + this.offsetY,
      this.sprite.config.width,
      this.sprite.config.height,
      {
        type: 'tile'
      }
    )
  }

}

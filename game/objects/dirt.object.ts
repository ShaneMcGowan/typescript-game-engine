import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { type Interactable } from '@game/models/components/interactable.model';
import { Assets } from '@core/utils/assets.utils';
import { type Inventory, Item, ItemType } from '@game/models/inventory.model';
import { MessageUtils } from '@game/utils/message.utils';
import { type OnNewDay } from '@game/models/components/new-day.model';

const DIRT = { x: 1, y: 1, };
const DIRT_LEFT = { x: 0.5, y: 3, };
const DIRT_CENTER = { x: 1, y: 3, };
const DIRT_RIGHT = { x: 1.5, y: 3, };

const TILESET_SOIL = 'tileset_dirt';
const TILESET_SOIL_DARKER = 'tileset_dirt';

const RENDERER_LAYER = 6;
const DRY_COUNTER_MAX = 15; // seconds until dirt dries up
const GROW_COUNTER_MAX = 5; // seconds until plant grows
const SPOIL_COUNTER_MAX = 60 * 60 * 24; // seconds until plant spoils
const PLANTABLE = [ItemType.TomatoSeeds, ItemType.WheatSeeds];
type PlantableType = ItemType.TomatoSeeds | ItemType.WheatSeeds
export function isPlantableType(type: ItemType): type is PlantableType {
  return PLANTABLE.includes(type);
}

export enum CropStage {
  Empty,
  Growing,
  FullyGrown
}

const CROP_TO_GROWTH_DURATION: Record<PlantableType, number> = {
  [ItemType.WheatSeeds]: 3,
  [ItemType.TomatoSeeds]: 3,
};

interface CropStageSprite { tileset: string; spriteX: number; spriteY: number; }

const TYPE_TO_SPRITE_MAP: Record<PlantableType, {
  [CropStage.Growing]: CropStageSprite | undefined;
  [CropStage.FullyGrown]: CropStageSprite | undefined;
}> = {
  [ItemType.WheatSeeds]: {
    [CropStage.Growing]: { tileset: 'tileset_plants', spriteX: 1, spriteY: 0, },
    [CropStage.FullyGrown]: { tileset: 'tileset_plants', spriteX: 4, spriteY: 0, },
  },
  [ItemType.TomatoSeeds]: {
    [CropStage.Growing]: { tileset: 'tileset_plants', spriteX: 1, spriteY: 1, },
    [CropStage.FullyGrown]: { tileset: 'tileset_plants', spriteX: 4, spriteY: 1, },
  },
};

interface Config extends SceneObjectBaseConfig {
  growing?: {
    stage: CropStage;
    itemType: PlantableType;
  };
}

export class DirtObject extends SceneObject implements Interactable, OnNewDay {
  private spriteX: number = DIRT.x;
  private spriteY: number = DIRT.y;

  crop: PlantableType | undefined = undefined;

  isWatered: boolean = false;
  watered: number = 0;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = RENDERER_LAYER;

    if (config.growing) {
      // preconfigure growing
      this.collision.enabled = true;
      this.crop = config.growing.itemType;
    }
  }

  onNewDay(): void {
    console.log('onNewDay');

    if (!this.isWatered) {
      return;
    }

    this.isWatered = false;

    if (this.isEmpty) {
      return;
    }

    this.watered++;

    if (!this.isGrown) {

    }

    // TODO: new season check
  };

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get produces(): ItemType | undefined {
    switch (this.crop) {
      case ItemType.TomatoSeeds:
        return ItemType.Tomato;
      case ItemType.WheatSeeds:
        return ItemType.Wheat;
      default:
        return undefined;
    }
  }

  private onDirtPlaced(event: CustomEvent): void {
    // update sprite based on surrounding dirt
    let left = this.scene.getObjects({ position: { x: this.transform.position.world.x - 1, y: this.transform.position.world.y, }, });
    let right = this.scene.getObjects({ position: { x: this.transform.position.world.x + 1, y: this.transform.position.world.y, }, });

    let hasLeft = left.filter(object => object instanceof DirtObject).length > 0;
    let hasRight = right.filter(object => object instanceof DirtObject).length > 0;

    let tile = DIRT;
    // TODO: fix this later
    // if (hasLeft && hasRight) {
    //   tile = DIRT_CENTER;
    // } else if (hasLeft && !hasRight) {
    //   tile = DIRT_RIGHT;
    // } else if (!hasLeft && hasRight) {
    //   tile = DIRT_LEFT;
    // } else {
    //   tile = DIRT;
    // }

    this.spriteX = tile.x;
    this.spriteY = tile.y;
  }

  interact(): void {
    switch (this.stage) {
      case CropStage.Empty:
        this.interactStageEmpty();
        return;
      case CropStage.Growing:
        this.interactStageGrowing();
        return;
      case CropStage.FullyGrown:
        this.interactStageFullyGrown();
    }
  }

  get stage(): CropStage {
    if (this.isEmpty) {
      return CropStage.Empty;
    }

    if (!this.isGrown) {
      return CropStage.Growing;
    }

    return CropStage.FullyGrown;
  }

  get isGrown(): boolean {
    return this.watered >= CROP_TO_GROWTH_DURATION[this.crop];
  }

  private interactStageEmpty(): void {
    MessageUtils.showMessage(
      this.scene,
      'It\'s a beautiful patch of dirt, brimming with potential. I can plant crops here.'
    );
  }

  private interactStageGrowing(): void {
    MessageUtils.showMessage(
      this.scene,
      'The plant is growing nicely, it will be ready for harvest soon.'
    );
  }

  private interactStageFullyGrown(): void {
    if (this.produces === undefined) {
      return;
    }

    if (!this.inventory.hasRoomForItem(this.produces)) {
      MessageUtils.showMessage(
        this.scene,
        'I don\'t have enough room.'
      );
      return;
    }

    this.inventory.addToInventory(this.produces);

    this.clearCrop();
  }

  get isEmpty(): boolean {
    return this.crop === undefined;
  }

  onUpdate(delta: number): void {

  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderDirt(context);
    this.renderCrop(context);
  }

  private renderDirt(context: CanvasRenderingContext2D): void {
    const tileset = this.isWatered ? TILESET_SOIL_DARKER : TILESET_SOIL;

    RenderUtils.renderSprite(
      context,
      Assets.images[tileset],
      this.spriteX,
      this.spriteY,
      this.transform.position.world.x,
      this.transform.position.world.y,
      1,
      1
    );

    if (!this.isWatered) {
      return;
    }

    // watered dirt
    RenderUtils.fillRectangle(
      context,
      this.boundingBox.local.left,
      this.boundingBox.local.top,
      1,
      1,
      {
        colour: '#00000011',
        type: 'tile',
      }
    );
  }

  private renderCrop(context: CanvasRenderingContext2D): void {
    if (this.stage === CropStage.Empty) {
      return;
    }

    // TODO: this is a messy check, whole system could be greatly improved
    if (this.crop !== ItemType.TomatoSeeds && this.crop !== ItemType.WheatSeeds) {
      return;
    }

    const sprite = TYPE_TO_SPRITE_MAP[this.crop][this.stage];
    if (sprite === undefined) {
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[sprite.tileset],
      sprite.spriteX,
      sprite.spriteY,
      this.transform.position.world.x,
      this.transform.position.world.y,
      1,
      1
    );
  }

  actionWater(): void {
    if (this.isWatered) {
      return;
    }

    this.isWatered = true;
  }

  actionPlantHeldItem(): void {
    let item = this.scene.selectedInventoryItem;
    // no item selected
    if (item === undefined) {
      return;
    }

    // item cannot be planted
    if (!isPlantableType(item.type)) {
      return;
    }

    this.crop = item.type;

    this.inventory.removeFromInventoryByIndex(this.scene.globals.hotbar_selected_index, 1);
  }

  private clearCrop(): void {
    this.crop = undefined;
    this.watered = 0;
  }
}

import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { type Interactable } from '@game/models/interactable.model';
import { TextboxObject } from '@game/objects/textbox.object';
import { Assets } from '@core/utils/assets.utils';
import { Inventory, ItemType } from '@game/models/inventory.model';
import { MessageUtils } from '@game/utils/message.utils';

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

export enum CropStage {
  Empty,
  Watered,
  Growing,
  FullyGrown,
  Spoiled,
}

type CropStageSprite = { tileset: string, spriteX: number, spriteY: number, };

const TYPE_TO_SPRITE_MAP: Record<PlantableType, {
  [CropStage.Growing]: CropStageSprite | undefined,
  [CropStage.FullyGrown]: CropStageSprite | undefined,
  [CropStage.Spoiled]: CropStageSprite | undefined,
}> = {
  [ItemType.WheatSeeds]: {
    [CropStage.Growing]: { tileset: 'tileset_plants', spriteX: 1, spriteY: 0, },
    [CropStage.FullyGrown]: { tileset: 'tileset_plants', spriteX: 4, spriteY: 0, },
    [CropStage.Spoiled]: undefined
  },
  [ItemType.TomatoSeeds]: {
    [CropStage.Growing]: { tileset: 'tileset_plants', spriteX: 1, spriteY: 1, },
    [CropStage.FullyGrown]: { tileset: 'tileset_plants', spriteX: 4, spriteY: 1, },
    [CropStage.Spoiled]: undefined
  }
};

interface Config extends SceneObjectBaseConfig {
  growing?: {
    stage: CropStage,
    itemType: ItemType
  }
}

export class DirtObject extends SceneObject implements Interactable {
  private spriteX: number = DIRT.x;
  private spriteY: number = DIRT.y;

  counterDry: number = 0;
  counterGrow: number = 0;
  counterSpoil: number = 0;

  currentlyGrowing: ItemType | undefined = undefined;

  cropStage: CropStage;


  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = RENDERER_LAYER;

    this.cropStage = CropStage.Empty;

    if (config.growing) {
      // preconfigure growing
      this.collision.enabled = true;
      this.cropStage = config.growing.stage;
      this.currentlyGrowing = config.growing.itemType;
    }
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get produces(): ItemType | undefined {
    switch (this.currentlyGrowing) {
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
    let left = this.scene.getObjects({ position: { x: this.transform.position.world.x - 1, y: this.transform.position.world.y } });
    let right = this.scene.getObjects({ position: { x: this.transform.position.world.x + 1, y: this.transform.position.world.y } });

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
    switch (this.cropStage) {
      case CropStage.Empty:
        this.interactStageEmpty();
        return;
      case CropStage.Watered:
        this.interactStageWatered();
        return;
      case CropStage.Growing:
        this.interactStageGrowing();
        return;
      case CropStage.FullyGrown:
        this.interactStageFullyGrown();
        return;
    }
  }

  private interactStageEmpty(): void {
    MessageUtils.showMessage(
      this.scene,
      `It's a beautiful patch of dirt, brimming with potential. I can plant crops here.`
    );
  }

  private interactStageWatered(): void {
    MessageUtils.showMessage(
      this.scene,
      `The patch of dirt is watered, better plant something before it dries up.`
    );
  }

  private interactStageGrowing(): void {
    MessageUtils.showMessage(
      this.scene,
      `The plant is growing nicely, it will be ready for harvest soon.`
    );
  }

  private interactStageFullyGrown(): void {
    if(this.produces === undefined){
      return;
    }

    if(!this.inventory.hasRoomForItem(this.produces)){
      MessageUtils.showMessage(
        this.scene,
        `I don't have enough room.`
      )
      return;
    }

    this.inventory.addToInventory(this.produces);

    this.destroy();
  }

  private get isEmpty(): boolean {
    return this.currentlyGrowing === undefined;
  }

  onUpdate(delta: number): void {
    if (this.cropStage === CropStage.Empty || this.cropStage === CropStage.Watered) {
      this.counterDry += delta;
    } else if (this.cropStage === CropStage.Growing) {
      this.counterGrow += delta;
    } else if (this.cropStage === CropStage.FullyGrown) {
      this.counterSpoil += delta;
    }

    if (this.isEmpty && this.counterDry > DRY_COUNTER_MAX) {
      // dirt dried out
      this.destroy();
      return;
    } else if (this.cropStage === CropStage.Growing && this.counterGrow > GROW_COUNTER_MAX) {
      // plant fully grown
      this.cropStage = CropStage.FullyGrown;
    } else if (this.cropStage === CropStage.FullyGrown && this.counterSpoil > SPOIL_COUNTER_MAX) {
      // plant spoiled
      this.cropStage = CropStage.Spoiled;
    }
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderDirt(context);
    this.renderCrop(context);
  }

  private renderDirt(context: CanvasRenderingContext2D): void {
    let tileset = this.cropStage === CropStage.Empty ? TILESET_SOIL : TILESET_SOIL_DARKER;
    RenderUtils.renderSprite(
      context,
      Assets.images[tileset],
      this.spriteX,
      this.spriteY,
      this.transform.position.world.x,
      this.transform.position.world.y,
      1,
      1,
      {
        centered: true,
      }
    );

    if (this.cropStage === CropStage.Empty) {
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
        type: 'tile'
      }
    );
  }

  private renderCrop(context: CanvasRenderingContext2D): void {
    if (this.cropStage === CropStage.Empty || this.cropStage === CropStage.Watered) {
      return;
    }

    // TODO: this is a messy check, whole system could be greatly improved
    if (this.currentlyGrowing !== ItemType.TomatoSeeds && this.currentlyGrowing !== ItemType.WheatSeeds) {
      return;
    }

    let sprite = TYPE_TO_SPRITE_MAP[this.currentlyGrowing][this.cropStage];
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
      1,
      {
        centered: true,
      }
    );
  }

  actionWater(): void {
    if (this.cropStage !== CropStage.Empty) {
      return;
    }

    this.counterDry = 0;
    this.cropStage = CropStage.Watered;
  }

  actionPlant(): void {
    let item = this.scene.selectedInventoryItem;
    // no item selected
    if (item === undefined) {
      return;
    }

    // item cannot be planted
    if (!PLANTABLE.includes(item.type)) {
      return;
    }

    // only plant on watered soil
    if (this.cropStage !== CropStage.Watered) {
      return;
    }

    this.collision.enabled = true;
    this.currentlyGrowing = item.type;
    this.cropStage = CropStage.Growing;

    this.inventory.removeFromInventoryByIndex(this.scene.globals.hotbar_selected_index, 1);
  }

}

import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { InventoryItemType } from '@game/models/inventory-item.model';
import { type Interactable } from '@game/models/interactable.model';
import { TextboxObject } from '@game/objects/textbox.object';

const DIRT = { x: 1, y: 1, };
const DIRT_LEFT = { x: 0.5, y: 3, };
const DIRT_CENTER = { x: 1, y: 3, };
const DIRT_RIGHT = { x: 1.5, y: 3, };

const TILESET_SOIL = 'tileset_dirt';
const TILESET_SOIL_DARKER = 'tileset_dirt';

const DEFAULT_RENDER_LAYER = 6;
const DRY_COUNTER_MAX = 15; // seconds until dirt dries up
const GROW_COUNTER_MAX = 5; // seconds until plant grows
const SPOIL_COUNTER_MAX = 60 * 60 * 24; // seconds until plant spoils
const PLANTABLE = [InventoryItemType.TomatoSeeds, InventoryItemType.WheatSeeds];
type PlantableType = InventoryItemType.TomatoSeeds | InventoryItemType.WheatSeeds

enum CropStage {
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
  [InventoryItemType.WheatSeeds]: {
    [CropStage.Growing]: { tileset: 'tileset_plants', spriteX: 1, spriteY: 0, },
    [CropStage.FullyGrown]: { tileset: 'tileset_plants', spriteX: 4, spriteY: 0, },
    [CropStage.Spoiled]: undefined
  },
  [InventoryItemType.TomatoSeeds]: {
    [CropStage.Growing]: { tileset: 'tileset_plants', spriteX: 1, spriteY: 1, },
    [CropStage.FullyGrown]: { tileset: 'tileset_plants', spriteX: 4, spriteY: 1, },
    [CropStage.Spoiled]: undefined
  }
};

interface Config extends SceneObjectBaseConfig {

}

export class DirtObject extends SceneObject implements Interactable {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  private spriteX: number = DIRT.x;
  private spriteY: number = DIRT.y;

  counterDry: number = 0;
  counterGrow: number = 0;
  counterSpoil: number = 0;

  currentlyGrowing: InventoryItemType | undefined = undefined;

  cropStage: CropStage;


  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.cropStage = CropStage.Empty;
  }

  private onDirtPlaced(event: CustomEvent): void {
    // update sprite based on surrounding dirt
    let left = this.scene.getAllObjectsAtPosition(this.transform.position.x - 1, this.transform.position.y);
    let right = this.scene.getAllObjectsAtPosition(this.transform.position.x + 1, this.transform.position.y);

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
      case CropStage.FullyGrown:
        this.interactStageFullyGrown();
        return;
    }
  }

  private interactStageEmpty(): void {
    this.scene.globals.disable_player_inputs = true;

    let textbox = new TextboxObject(
      this.scene,
      {
        text: `It's a beautiful patch of dirt, brimming with potential.`,
        onComplete: () => this.scene.globals.disable_player_inputs = false
      }
    );
    this.scene.addObject(textbox);
  }

  private interactStageFullyGrown(): void {
    console.log(`harvesting fully grown ${this.currentlyGrowing}`);
    switch (this.currentlyGrowing) {
      case InventoryItemType.TomatoSeeds:
        this.scene.addToInventory(InventoryItemType.Tomato);
        break;
      case InventoryItemType.WheatSeeds:
        this.scene.addToInventory(InventoryItemType.Wheat);
        break;
    }
    this.scene.removeObjectById(this.id);
    return;
  }

  private get isEmpty(): boolean {
    return this.currentlyGrowing === undefined;
  }

  update(delta: number): void {
    if (this.cropStage === CropStage.Empty || this.cropStage === CropStage.Watered) {
      this.counterDry += delta;
    } else if (this.cropStage === CropStage.Growing) {
      this.counterGrow += delta;
    } else if (this.cropStage === CropStage.FullyGrown) {
      this.counterSpoil += delta;
    }

    if (this.isEmpty && this.counterDry > DRY_COUNTER_MAX) {
      // dirt dried out
      this.scene.removeObjectById(this.id);
    } else if (this.cropStage === CropStage.Growing && this.counterGrow > GROW_COUNTER_MAX) {
      // plant fully grown
      this.cropStage = CropStage.FullyGrown;
    } else if (this.cropStage === CropStage.FullyGrown && this.counterSpoil > SPOIL_COUNTER_MAX) {
      // plant spoiled
      this.cropStage = CropStage.Spoiled;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderDirt(context);
    this.renderCrop(context);
  }

  destroy(): void { }

  private renderDirt(context: CanvasRenderingContext2D): void {
    let tileset = this.cropStage === CropStage.Empty ? TILESET_SOIL : TILESET_SOIL_DARKER;
    RenderUtils.renderSprite(
      context,
      this.scene.assets.images[tileset],
      this.spriteX,
      this.spriteY,
      this.transform.position.x,
      this.transform.position.y,
      1,
      1,
      {
        centered: true,
      }
    );
  }

  private renderCrop(context: CanvasRenderingContext2D): void {
    if (this.cropStage === CropStage.Empty || this.cropStage === CropStage.Watered) {
      return;
    }

    // TODO: this is a messy check, whole system could be greatly improved
    if (this.currentlyGrowing !== InventoryItemType.TomatoSeeds && this.currentlyGrowing !== InventoryItemType.WheatSeeds) {
      return;
    }

    let sprite = TYPE_TO_SPRITE_MAP[this.currentlyGrowing][this.cropStage];
    if (sprite === undefined) {
      return;
    }

    RenderUtils.renderSprite(
      context,
      this.scene.assets.images[sprite.tileset],
      sprite.spriteX,
      sprite.spriteY,
      this.transform.position.x,
      this.transform.position.y,
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

    this.scene.removeFromInventory(this.scene.globals.hotbar_selected_index);
  }

}

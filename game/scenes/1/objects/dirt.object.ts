import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SAMPLE_SCENE_1 } from '@game/scenes/1.scene';
import { RenderUtils } from '@core/utils/render.utils';
import { InventoryItemType } from '../models/inventory-item.model';
import { type Interactable } from '../models/interactable.model';

const DIRT = { x: 3, y: 3, };
const DIRT_LEFT = { x: 0.5, y: 3, };
const DIRT_CENTER = { x: 1, y: 3, };
const DIRT_RIGHT = { x: 1.5, y: 3, };

const TILE_SET = 'tileset_dirt';
const DEFAULT_RENDER_LAYER = 6;
const DRY_COUNTER_MAX = 15; // seconds until dirt dries up
const GROW_COUNTER_MAX = 5; // seconds until plant grows
const SPOIL_COUNTER_MAX = 15; // seconds until plant spoils
const PLANTABLE = [InventoryItemType.TomatoSeeds, InventoryItemType.WheatSeeds];

interface Config extends SceneObjectBaseConfig {

}

export class DirtObject extends SceneObject implements Interactable {
  hasCollision = false;
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  private spriteX: number = DIRT.x;
  private spriteY: number = DIRT.y;

  counterDry: number = 0;
  counterGrow: number = 0;
  counterSpoil: number = 0;

  currentlyGrowing: InventoryItemType | undefined = undefined;
  isFullyGrown: boolean = false;
  isSpoiled: boolean = false;

  constructor(protected scene: SAMPLE_SCENE_1, config: Config) {
    super(scene, config);

    this.scene.addEventListener(this.scene.eventTypes.DIRT_PLACED, this.onDirtPlaced.bind(this));
    this.scene.addEventListener(this.scene.eventTypes.DIRT_REMOVED, this.onDirtPlaced.bind(this));
  }

  private onDirtPlaced(event: CustomEvent): void {
    // update sprite based on surrounding dirt
    let left = this.scene.getAllObjectsAtPosition(this.positionX - 1, this.positionY);
    let right = this.scene.getAllObjectsAtPosition(this.positionX + 1, this.positionY);

    let hasLeft = left.filter(object => object instanceof DirtObject).length > 0;
    let hasRight = right.filter(object => object instanceof DirtObject).length > 0;

    let tile;
    if (hasLeft && hasRight) {
      tile = DIRT_CENTER;
    } else if (hasLeft && !hasRight) {
      tile = DIRT_RIGHT;
    } else if (!hasLeft && hasRight) {
      tile = DIRT_LEFT;
    } else {
      tile = DIRT;
    }

    this.spriteX = tile.x;
    this.spriteY = tile.y;
  }

  interact(): void {
    if (this.isEmpty) {
      this.plant();
    } else {
      this.harvest();
    }
  }

  /**
   * returns false if could not plant
   * @param type
   * @returns
   */
  private plant(): void {
    let item = this.scene.selectedInventoryItem;
    if (item === undefined) {
      console.log('no item selected');
      return;
    }

    if (!PLANTABLE.includes(item.type)) {
      console.log('item cannot be planted');
      return;
    }

    console.log(`planting ${item.type}`);

    this.currentlyGrowing = item.type;
    this.hasCollision = true;
    this.scene.removeFromInventory(this.scene.globals.hotbar_selected_index);
  }

  private harvest(): void {
    if (!this.isFullyGrown) {
      console.log(`harvesting growing ${this.currentlyGrowing}`);
      this.scene.removeObjectById(this.id);
      return;
    }

    if (!this.isSpoiled) {
      console.log(`harvesting fully grown ${this.currentlyGrowing}`);
      this.scene.removeObjectById(this.id);
      return;
    }

    console.log(`harvesting spoiled ${this.currentlyGrowing}`);
    this.scene.removeObjectById(this.id);
  }

  private get isEmpty(): boolean {
    return this.currentlyGrowing === undefined;
  }

  update(delta: number): void {
    if (this.isEmpty) {
      this.counterDry += delta;
    } else {
      if (!this.isFullyGrown) {
        this.counterGrow += delta;
      } else {
        this.counterSpoil += delta;
      }
    }

    if (this.isEmpty && this.counterDry > DRY_COUNTER_MAX) {
      // dirt dried out
      this.scene.removeObjectById(this.id);
    } else if (!this.isFullyGrown && this.counterGrow > GROW_COUNTER_MAX) {
      // plant fully grown
      this.isFullyGrown = true;
    } else if (this.isFullyGrown && this.counterSpoil > SPOIL_COUNTER_MAX) {
      // plant spoiled
      this.isSpoiled = true;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
  }

  destroy(): void {
    this.scene.dispatchEvent(this.scene.eventTypes.DIRT_REMOVED);
  }

  private renderSprite(context: CanvasRenderingContext2D): void {
    if (this.isEmpty) {
      RenderUtils.renderSprite(
        context,
        this.scene.assets.images[TILE_SET],
        this.spriteX,
        this.spriteY,
        this.positionX,
        this.positionY,
        1,
        1
      );
    } else {
      if (!this.isFullyGrown) {
        RenderUtils.renderCircle(
          context,
          this.positionX,
          this.positionY,
          { colour: 'lightgreen', }
        );
      } else {
        if (!this.isSpoiled) {
          RenderUtils.renderCircle(
            context,
            this.positionX,
            this.positionY,
            { colour: 'green', }
          );
        } else {
          RenderUtils.renderCircle(
            context,
            this.positionX,
            this.positionY,
            { colour: 'brown', }
          );
        }
      }
    }
  }
}

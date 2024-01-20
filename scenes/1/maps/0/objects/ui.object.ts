import { CanvasConstants } from '@constants/canvas.constants';
import { type Scene } from '@model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@model/scene-object';
import { MouseUtils } from '@utils/mouse.utils';
import { RenderUtils } from '@utils/render.utils';

const DEFAULT_RENDER_LAYER: number = CanvasConstants.UI_RENDER_LAYER;
const DEFAULT_COLLISION_LAYER: number = CanvasConstants.UI_COLLISION_LAYER;
const INDEX_TO_POSITION_MAP = [
  // hot bar
  { x: 6, y: 15, },
  { x: 8, y: 15, },
  { x: 10, y: 15, },
  { x: 12, y: 15, },
  { x: 14, y: 15, },
  { x: 16, y: 15, },
  { x: 18, y: 15, },
  { x: 20, y: 15, },
  { x: 22, y: 15, },
  // inventory - row 1
  { x: 6, y: 5, },
  { x: 8, y: 5, },
  { x: 10, y: 5, },
  { x: 12, y: 5, },
  { x: 14, y: 5, },
  { x: 16, y: 5, },
  { x: 18, y: 5, },
  { x: 20, y: 5, },
  { x: 22, y: 5, },
  // inventory - row 2
  { x: 6, y: 7, },
  { x: 8, y: 7, },
  { x: 10, y: 7, },
  { x: 12, y: 7, },
  { x: 14, y: 7, },
  { x: 16, y: 7, },
  { x: 18, y: 7, },
  { x: 20, y: 7, },
  { x: 22, y: 7, },
  // inventory - row 3
  { x: 6, y: 9, },
  { x: 8, y: 9, },
  { x: 10, y: 9, },
  { x: 12, y: 9, },
  { x: 14, y: 9, },
  { x: 16, y: 9, },
  { x: 18, y: 9, },
  { x: 20, y: 9, },
  { x: 22, y: 9, }
];

interface Config extends SceneObjectBaseConfig {

}

export class UiObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  collisionLayer = DEFAULT_COLLISION_LAYER;

  // TODO(smg): should properties be stored directly on the scene or in some sort of private object?
  private showInventory: boolean = false;

  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);

    // key listeners references
    this.keyListeners.onMouseDown = this.onMouseDown.bind(this);
    this.keyListeners.onMouseUp = this.onMouseUp.bind(this);

    // event listener references
    this.eventListeners.onToggleInventory = this.onToggleInventory.bind(this);

    // add listeners
    this.disableClickListeners();

    // add event listener
    this.scene.addEventListener(this.scene.eventTypes.TOGGLE_INVENTORY, this.eventListeners.onToggleInventory);
  }

  private onToggleInventory(event: CustomEvent): void {
    if (this.showInventory) {
      // close inventory
      this.disableClickListeners();
      this.scene.dispatchEvent(this.scene.eventTypes.INVENTORY_CLOSED);
    } else {
      // open inventory
      this.enableClickListeners();
      this.scene.dispatchEvent(this.scene.eventTypes.INVENTORY_OPENED);
    }
    this.showInventory = !this.showInventory;
  }

  render(context: CanvasRenderingContext2D): void {
    // hotbar
    this.renderHotbarBackground(context);
    this.renderHotbarContainers(context);
    this.renderHotbarItems(context);
    if (!this.showInventory) {
      this.renderHotbarSelector(context);
    }

    // inventory
    if (this.showInventory) {
      this.renderInventoryBackground(context);
      this.renderInventoryContainers(context);
      this.renderInventoryItems(context);
    }
  }

  private renderHotbarBackground(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      5.75,
      14.75,
      CanvasConstants.TILE_SIZE * 18.5,
      CanvasConstants.TILE_SIZE * 2.5,
      'saddlebrown'
    );
  }

  private renderHotbarContainers(context: CanvasRenderingContext2D): void {
    for (let i = 0; i < 9; i++) {
      RenderUtils.renderSprite(
        context,
        this.assets.images.tileset_ui,
        0.5,
        3.5,
        6 + (i * 2),
        15,
        2,
        2
      );
    }
  }

  private renderHotbarItems(context: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.hotbarSize; i++) {
      let object = this.inventory[i];
      if (object === undefined) {
        continue;
      }

      // TODO(smg): this is terrible
      let spriteSheet;
      let spriteX = 0;
      let spriteY = 0;
      // TODO(smg): this is terrible
      if (object.name === 'EggObject') {
        spriteSheet = this.assets.images.tileset_egg;
      } else if (object.name === 'ChickenObject') {
        spriteSheet = this.assets.images.tileset_chicken;
      } else {
        spriteSheet = this.assets.images.tileset_egg;
      }

      RenderUtils.renderSprite(
        context,
        spriteSheet,
        spriteX,
        spriteY,
        6.5 + (i * 2),
        15.5
      );
    }
  }

  private renderHotbarSelector(context: CanvasRenderingContext2D): void {
    const x = 6 + (this.hotbarSelectedIndex * 2);
    const y = 15;
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

  private renderInventoryBackground(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      5.75,
      4.75,
      CanvasConstants.TILE_SIZE * 18.5,
      CanvasConstants.TILE_SIZE * 6.75,
      'saddlebrown'
    );
  }

  private renderInventoryContainers(context: CanvasRenderingContext2D): void {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 3; col++) {
        RenderUtils.renderSprite(
          context,
          this.assets.images.tileset_ui,
          0.5,
          3.5,
          6 + (row * 2),
          5 + (col * 2),
          2,
          2
        );
      }
    }
  }

  private renderInventoryItems(context: CanvasRenderingContext2D): void {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        let index = (row * 9 + col) + this.hotbarSize;
        let object = this.inventory[index];
        if (object === undefined) {
          continue;
        }

        let spriteSheet;
        let spriteX = 0;
        let spriteY = 0;
        // TODO(smg): this is terrible
        if (object.name === 'EggObject') {
          spriteSheet = this.assets.images.tileset_egg;
        } else if (object.name === 'ChickenObject') {
          spriteSheet = this.assets.images.tileset_chicken;
        } else {
          spriteSheet = this.assets.images.tileset_egg;
        }

        RenderUtils.renderSprite(
          context,
          spriteSheet,
          spriteX,
          spriteY,
          6.5 + (col * 2),
          5.5 + (row * 2),
          1,
          1
        );
      }
    }
  }

  get inventory(): any[] {
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

  private onMouseDown(event: MouseEvent): void {
    console.log('mouse down');
    let mousePosition = MouseUtils.getMousePosition(this.mainContext.canvas, event);
    console.log(mousePosition);
    INDEX_TO_POSITION_MAP.forEach((position, index) => {
      if (
        mousePosition.x >= position.x &&
        mousePosition.x <= (position.x + 1) &&
        mousePosition.y >= position.y &&
        mousePosition.y <= (position.y + 1)
      ) {
        console.log('clicked on index', index);
        this.scene.globals['hotbar_selected_index'] = index;
      }
    });
  }

  private onMouseUp(event: MouseEvent): void {
    console.log('mouse up');
    console.log(MouseUtils.getMousePosition(this.mainContext.canvas, event));
  }

  private enableClickListeners(): void {
    this.mainContext.canvas.addEventListener('mousedown', this.keyListeners.onMouseDown);
    this.mainContext.canvas.addEventListener('mouseup', this.keyListeners.onMouseUp);
  }

  private disableClickListeners(): void {
    this.mainContext.canvas.removeEventListener('mousedown', this.keyListeners.onMouseDown);
    this.mainContext.canvas.removeEventListener('mouseup', this.keyListeners.onMouseUp);
  }
}

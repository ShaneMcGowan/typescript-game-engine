import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { Inventory, Item } from '@game/models/inventory.model';

interface Config extends SceneObjectBaseConfig {
  item: Item,
  index: number,
}

export class InventoryTooltipObject extends SceneObject {
  
  private item: Item;
  index: number;

  private rows: string[];

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER + 3;

    this.item = config.item;
    this.index = config.index;
    this.rows = this.calculateDescriptionLines();
    this.height = this.calculateHeight();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderTooltipBackground(context, this.transform.position.world.x, this.transform.position.world.y);
    this.renderTooltipTitle(context, this.transform.position.world.x, this.transform.position.world.y);
    this.renderTooltipDescription(context, this.transform.position.world.x, this.transform.position.world.y);
  }

  onDestroy(): void {

  }

  get title(): string {
    return Inventory.getItemName(this.item)
  }

  get description(): string {
    return Inventory.getItemDescription(this.item)
  }

  private renderTooltipBackground(context: CanvasRenderingContext2D, x: number, y: number): void {
    x = this.isHorizontallyOutOfBounds(x, y) ? x - this.width : x;
    y = this.isVerticallyOutOfBounds(x, y) ? y - this.height : y;

    RenderUtils.fillRectangle(
      context,
      x,
      y,
      this.width,
      this.height,
      {
        type: 'tile',
        colour: '#ffffffcc'
      }
    );
  }

  private renderTooltipTitle(context: CanvasRenderingContext2D, x: number, y: number): void {
    x = this.isHorizontallyOutOfBounds(x, y) ? x - this.width : x;
    y = this.isVerticallyOutOfBounds(x, y) ? y - this.height : y;

    RenderUtils.renderText(
      context,
      `${this.title}`,
      x + 0.5,
      y + 1
    );
  }

  private renderTooltipDescription(context: CanvasRenderingContext2D, x: number, y: number): void {
    x = this.isHorizontallyOutOfBounds(x, y) ? x - this.width : x;
    y = this.isVerticallyOutOfBounds(x, y) ? y - this.height : y;

    this.rows.forEach((row, index) => {
      RenderUtils.renderText(
        context,
        `${row.trim()}`,
        x + 0.5,
        y + 2 + index
      );
    });
  }

  private calculateDescriptionLines(): string[] {
    return RenderUtils.textToArray(this.description, (this.width - 4) * CanvasConstants.TILE_SIZE);
  }

  private calculateHeight(): number {
    return this.rows.length + 2;
  }

  private isHorizontallyOutOfBounds(x: number, y: number): boolean {
    return x + this.width > CanvasConstants.CANVAS_TILE_WIDTH;
  }

  private isVerticallyOutOfBounds(x: number, y: number): boolean {
    return y + this.height > CanvasConstants.CANVAS_TILE_HEIGHT;
  }

}


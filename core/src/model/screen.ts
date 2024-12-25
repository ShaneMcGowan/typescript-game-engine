import { RenderUtils } from '@core/utils/render.utils';
import { type SceneRenderingContexts, type Renderer } from './renderer';
import { type SceneMap } from './scene-map';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from './scene';
import { defaultRenderer } from '@core/objects/renderer/default.renderer';

export class Camera {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export class ClientScreen {
  readonly id: string = crypto.randomUUID();

  width: number;
  height: number;

  readonly camera: Camera;
  readonly contexts: SceneRenderingContexts;

  private customerRenderer: Renderer;

  constructor(screens: number) {
    this.camera = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    };

    this.setupContexts(screens);
  }

  render(scene: Scene): void {
    this.renderer(
      scene,
      this
    );
  }

  addRenderer(renderer: Renderer): void {
    this.customerRenderer = renderer;
  }

  removeRenderer(): void {
    this.customerRenderer = undefined;
  }

  private get renderer(): Renderer {
    return this.customerRenderer ?? defaultRenderer;
  }

  /**
   * to be called each time a map is changed
   * @param screens
   * @param map
   */
  setupContexts(screens: number, map?: SceneMap): void {
    // TODO: for splitscreen, we are going to want to do some width and height changes to the canvas
    // this should take in the number of screens to be created and the orientation of those screens (e.g. 2 vertical, 3 horizontal, 2x2)
    // for now, we will simply do horitzontal

    this.width = Math.floor(CanvasConstants.CANVAS_TILE_WIDTH / screens);
    this.height = CanvasConstants.CANVAS_TILE_HEIGHT;

    // initialise rendering context
    this.contexts.rendering = RenderUtils.getContext(
      this.createCanvas(
        CanvasConstants.CANVAS_TILE_WIDTH,
        CanvasConstants.CANVAS_TILE_HEIGHT
      )
    );

    // initialise display ontext
    this.contexts.display = RenderUtils.getContext(
      this.createCanvas(
        CanvasConstants.CANVAS_TILE_WIDTH,
        CanvasConstants.CANVAS_TILE_HEIGHT
      )
    );

    this.contexts.display.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    // clear background contexts
    this.contexts.background = [];

    // clear object contexts
    this.contexts.objects = [];

    if (map === undefined) {
      return;
    }

    // create new background contexts
    for (let i = 0; i < map.background.layers.length; i++) {
      const canvas = this.createCanvas(this.width, this.height);
      this.contexts.background[i] = RenderUtils.getContext(canvas);
    }

    // create new object contexts
    for (let i = 0; i < CanvasConstants.TOTAL_RENDERING_LAYERS; i++) {
      const canvas = this.createCanvas(this.width, this.height);
      this.contexts.objects[i] = RenderUtils.getContext(canvas);
    }
  }

  /**
   *
   * @param width in tiles
   * @param height in tiles
   * @returns
   */
  private createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = RenderUtils.createCanvas(width, height);

    return canvas;
  }
}

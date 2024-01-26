import { CanvasConstants } from '@constants/canvas.constants';
import { RenderUtils } from '@utils/render.utils';
import { type Client } from 'client';
import { type BackgroundLayer } from './background-layer';
import { type SceneMap } from './scene-map';
import { type SceneObject } from './scene-object';
import { MouseUtils } from '@utils/mouse.utils';

export interface SceneRenderingContext {
  background: CanvasRenderingContext2D[];
  objects: CanvasRenderingContext2D[];
}

export interface SceneGlobalsBaseConfig {
  mousePosition: {
    x: number;
    y: number;
    exactX: number; // not rounded to tile
    exactY: number; // not rounded to tile
  };
  latestMouseEvent: MouseEvent;
}

export type CustomRendererSignature = (renderingContext: SceneRenderingContext) => void;
/**

  adding a quick description here as this shape is pretty gross but I think it will be somewhat performant at scale
  where <number> from left to right is, <scene index>, <x position>, <y position>, <animation timer in seconds>

  backgroundLayersAnimationTimer: Record<number, Record<number, Record<number, number>>>
  backgroundLayersAnimationTimer = {
    0: {
      0: {
        0: 0
      }
    }
  }

*/

export class Scene {
  // background
  backgroundLayers: BackgroundLayer[];
  backgroundLayersAnimationTimer: Record<number, Record<number, Record<number, number>>> = {}; // used for timings for background layer animations

  // objects
  objects: SceneObject[] = [];
  // TODO(smg): how do we access types for this from the scene object?

  // a place to store flags for the scene
  globals: SceneGlobalsBaseConfig = {
    mousePosition: {
      x: 0,
      y: 0,
      exactX: 0,
      exactY: 0,
    },
    latestMouseEvent: new MouseEvent(''),
  };

  // maps
  maps: any[] = []; // TODO(smg): some sort of better typing for this, it is a list of uninstanciated classes that extend SceneMap
  map: SceneMap; // the current map

  // rendering contexts
  renderingContext: SceneRenderingContext = {
    background: [],
    objects: [],
  };

  // for firing events
  private readonly eventEmitter: Element = document.createElement('eventEmitter');
  readonly eventTypes: Record<string, string> = {}; // TODO(smg): some way typing this so there is intellisense for event types for a scene

  private customRenderer?: CustomRendererSignature;

  // from client
  context: CanvasRenderingContext2D;
  assets: Record<string, any>;

  constructor(
    protected client: Client
  ) {
    this.context = this.client.context;
    this.assets = this.client.assets;

    // set up mouse listener
    client.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      this.globals.mousePosition = MouseUtils.getMousePosition(client.canvas, event);
      this.globals.latestMouseEvent = event;
    });
  }

  backgroundLayerAnimationFrame: Record<string, number> = {};

  // TODO(smg): move client rendering code into here
  frame(delta: number): void {
    this.renderBackground(delta);
    this.updateObjects(delta);
    this.renderObjects(delta);

    if (this.customRenderer) {
      this.customRenderer(this.renderingContext);
    } else {
      this.defaultRenderer();
    }
  }

  renderBackground(delta: number): void {
    if (this.client.debug.timing.frameBackground) {
      console.time('[frame] background');
    }

    this.backgroundLayers.forEach((layer, index) => {
      let context = this.renderingContext.background[index];
      RenderUtils.clearCanvas(context);

      for (let x = 0; x < this.map.width; x++) {
        for (let y = 0; y < this.map.height; y++) {
          let tile = layer.tiles[x] ? layer.tiles[x][y] : undefined;

          if (tile === undefined) {
            continue;
          }

          let animationFrame;
          if (tile.animationFrames.length === 1) {
            // skip animations if only 1 sprite
            animationFrame = tile.animationFrames[0];
          } else {
            // check if timer has started for specific tile on specific layer
            if (this.backgroundLayersAnimationTimer[layer.index] === undefined) {
              this.backgroundLayersAnimationTimer[layer.index] = {};
            }

            if (this.backgroundLayersAnimationTimer[layer.index][x] === undefined) {
              this.backgroundLayersAnimationTimer[layer.index][x] = {};
            }

            let timer;
            if (this.backgroundLayersAnimationTimer[layer.index][x][y] === undefined) {
              timer = 0;
            } else {
              timer = this.backgroundLayersAnimationTimer[layer.index][x][y] + delta;
            }

            // wrap timer if over animation frame duration
            if (timer > tile.animationFrameDuration) {
              timer = timer % tile.animationFrameDuration;
            }

            for (let i = 0; i < tile.animationMap.length; i++) {
              if (timer <= tile.animationMap[i]) {
                animationFrame = tile.animationFrames[i];
                break;
              }
            }

            this.backgroundLayersAnimationTimer[layer.index][x][y] = timer;
          }

          RenderUtils.renderSprite(
            context,
            this.assets.images[tile.tileset],
            animationFrame.spriteX,
            animationFrame.spriteY,
            x,
            y
          );
        }
      }
    });

    if (this.client.debug.timing.frameBackground) {
      console.timeEnd('[frame] background');
    }
  }

  updateObjects(delta: number): void {
    if (this.client.debug.timing.frameUpdate) {
      console.time('[frame] update');
    }

    this.objects.forEach((object) => {
      if (object.update) {
        object.update(delta);
      }
    });

    if (this.client.debug.timing.frameUpdate) {
      console.timeEnd('[frame] update');
    }
  }

  renderObjects(delta: number): void {
    if (this.client.debug.timing.frameRender) {
      console.time('[frame] render');
    }

    // clear object canvases
    this.renderingContext.objects.forEach((context) => {
      RenderUtils.clearCanvas(context);
    });

    // render objects
    this.objects.forEach((object) => {
      if (object.render && object.isRenderable) {
        object.render(
          this.renderingContext.objects[object.renderLayer]
        );
      }

      if (this.client.debug.object.renderBoundary) {
        object.debuggerRenderBoundary(
          this.renderingContext.objects[object.renderLayer]
        );
      }
    });

    if (this.client.debug.timing.frameRender) {
      console.timeEnd('[frame] render');
    }
  }

  defaultRenderer(): void {
    this.renderingContext.background.forEach((context) => {
      this.context.drawImage(context.canvas, 0, 0);
    });
    this.renderingContext.objects.forEach((context) => {
      this.context.drawImage(context.canvas, 0, 0);
    });
  }

  addObject(sceneObject: SceneObject): void {
    this.objects.push(sceneObject);
  }

  removeObject(sceneObject: SceneObject): void {
    if (sceneObject.destroy) {
      sceneObject.destroy();
    }
    this.objects.splice(this.objects.indexOf(sceneObject), 1);
  }

  /**
   * Returns all instances of the provided class
   * @param type
   * @returns
   */
  getObjectsByType(type: any): SceneObject[] {
    // TODO(smg): horribly underperformant, perhaps use a hash on object type instead?
    return this.objects.filter(o => o instanceof type);
  }

  /**
   * Checks if an object exists at the provided position and has collision
   * @param x
   * @param y
   * @returns
   */
  hasCollisionAtPosition(positionX: number, positionY: number, sceneObject?: SceneObject): boolean {
    let object = this.objects.find(o => o.positionX === positionX && o.positionY === positionY && o.hasCollision);
    if (object === undefined) {
      return false;
    }

    // ignore provided object (usually self)
    if (sceneObject === object) {
      return false;
    }

    return true;
  }

  /**
   * Checks if an object is on it's way to the provided position and has collision
   * @param x
   * @param y
   * @returns
   */
  willHaveCollisionAtPosition(positionX: number, positionY: number, sceneObject?: SceneObject): boolean {
    let object = this.objects.find(o => o.targetX === positionX && o.targetY === positionY && o.hasCollision);
    if (object === undefined) {
      return false;
    }

    // ignore provided object (usually self)
    if (sceneObject === object) {
      return false;
    }

    return true;
  }

  isOutOfBounds(positionX: number, positionY: number): boolean {
    return (positionX > this.map.width - 1 || positionY > this.map.height - 1 || positionX < 0 || positionY < 0);
  }

  /**
   * A combination of hasCollisionAtPosition and willHaveCollisionAtPosition
   * @param positionX
   * @param positionY
   * @param sceneObject
   * @returns
   */
  hasOrWillHaveCollisionAtPosition(positionX: number, positionY: number, sceneObject?: SceneObject): boolean {
    return this.hasCollisionAtPosition(positionX, positionY, sceneObject) || this.willHaveCollisionAtPosition(positionX, positionY, sceneObject);
  }

  /**
   * returns the first object found at the provided position
   * @param positionX
   * @param positionY
   * @param type
   * @returns
   */
  getObjectAtPosition(positionX: number, positionY: number, type?: any): SceneObject | undefined {
    // TODO(smg): add optional type check
    // TODO(smg): this is a very heavy operation
    return this.objects.find(o => o.positionX === positionX && o.positionY === positionY && o.collisionLayer !== CanvasConstants.UI_COLLISION_LAYER);
  }

  /**
   * returns all objects found at the provided position
   * @param positionX
   * @param positionY
   * @param type
   * @returns
   */
  getAllObjectsAtPosition(positionX: number, positionY: number, type?: any): SceneObject[] {
    // TODO(smg): add optional type check
    // TODO(smg): this is a very heavy operation
    return this.objects.filter(o => o.positionX === positionX && o.positionY === positionY && o.collisionLayer !== CanvasConstants.UI_COLLISION_LAYER);
  }

  private removeAllObjects(): void {
    while (this.objects.length > 0) {
      this.removeObject(this.objects[0]);
    }
    // this.objects = [];
  }

  private removeAllBackgroundLayers(): void {
    this.backgroundLayers = [];
  }

  setUpRenderingContexts(): void {
    this.renderingContext = {
      background: [],
      objects: [],
    };

    for (let i = 0; i < this.backgroundLayers.length; i++) {
      this.renderingContext.background[i] = this.createCanvas().getContext('2d');
    }
    for (let i = 0; i < CanvasConstants.OBJECT_RENDERING_LAYERS; i++) {
      this.renderingContext.objects[i] = this.createCanvas().getContext('2d');
    }
  }

  private createCanvas(): HTMLCanvasElement {
    let canvas = RenderUtils.createCanvas(this.map.width, this.map.height);

    if (this.client.debug.ui.canvasLayers) {
      this.client.container.append(canvas);
    }

    return canvas;
  }

  changeMap(index: number): void {
    // clean up map
    if (this.map !== undefined) {
      this.map.destroy();
    }

    // clean up scene
    // TODO(smg): some sort of scene reset function
    this.removeAllObjects();
    this.removeAllBackgroundLayers();

    // set up new map
    this.map = Reflect.construct(this.maps[index], [this, this.context, this.assets]);
    this.backgroundLayers.push(...this.map.backgroundLayers);
    this.objects.push(...this.map.objects);

    // set up rendering contexts
    // custom renderers in objects for maps require this
    this.setUpRenderingContexts();
  }

  changeScene(sceneClass: any): void {
    this.client.changeScene(sceneClass);
  }

  setCustomRenderer(renderer: CustomRendererSignature): void {
    this.customRenderer = renderer;
  }

  removeCustomerRenderer(): void {
    this.customRenderer = undefined;
  }

  addEventListener(eventName: string, callback: any): void {
    this.eventEmitter.addEventListener(eventName, callback);
  }

  removeEventListener(eventName: string, callback: any): void {
    this.eventEmitter.removeEventListener(eventName, callback);
  }

  dispatchEvent(eventName: string, detail?: any): void {
    let event = new CustomEvent(eventName, { detail, });
    console.log('[dispatchEvent]', event);
    this.eventEmitter.dispatchEvent(event);
  }
}

import { CanvasConstants } from '@core/constants/canvas.constants';
import { RenderUtils } from '@core/utils/render.utils';
import { type BackgroundLayer } from './background-layer';
import { type SceneMapConstructorSignature, type SceneMap } from './scene-map';
import { type SceneObjectBoundingBox, type SceneObject } from './scene-object';
import { type Client } from '@core/client';
import { type Assets } from './assets';

export type SceneConstructorSignature = new (client: Client) => Scene;

export interface SceneRenderingContext {
  background: CanvasRenderingContext2D[];
  objects: CanvasRenderingContext2D[];
}

export interface SceneGlobalsBaseConfig {
  // TODO: cameraPosition is referring to customRenderer, perhaps rename customRenderer to camera?
  camera: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
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

export abstract class Scene {
  // background
  backgroundLayers: BackgroundLayer[];
  backgroundLayersAnimationTimer: Record<number, Record<number, Record<number, number>>> = {}; // used for timings for background layer animations

  // objects
  objects: SceneObject[] = [];
  // TODO: how do we access types for this from the scene object?

  // a place to store flags for the scene
  readonly globals: SceneGlobalsBaseConfig = {
    camera: {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    },
  };

  // maps
  flaggedForMapChange: SceneMapConstructorSignature | undefined = undefined; // if this is set, the scene will change to the map of the provided class on the next frame
  map: SceneMap; // the current map

  // rendering contexts
  renderingContext: SceneRenderingContext = {
    background: [],
    objects: [],
  };

  // for firing events
  private readonly eventEmitter: Element = document.createElement('eventEmitter');
  readonly eventTypes: Record<string, string> = {}; // TODO: some way typing this so there is intellisense for event types for a scene

  private customRenderer?: CustomRendererSignature;

  // from client
  context: CanvasRenderingContext2D;
  assets: Assets;

  constructor(
    protected client: Client
  ) {
    this.context = this.client.context;
    this.assets = this.client.assets;
  }

  backgroundLayerAnimationFrame: Record<string, number> = {};

  // TODO: move client rendering code into here
  frame(delta: number): void {
    this.awakeObjects();
    this.renderBackground(delta);
    this.updateObjects(delta);
    this.renderObjects(delta);

    if (this.customRenderer) {
      this.customRenderer(this.renderingContext);
    } else {
      this.defaultRenderer();
    }

    this.destroyObjects(delta);
  }

  private awakeObjects(): void {
    if (this.client.debug.timing.frameUpdate) {
      console.time('[frame] awake');
    }

    this.objects.forEach((object) => {
      if (object.awake && !object.awakeRan) {
        object.awake();
        object.awakeRan = true;
      }
    });

    if (this.client.debug.timing.frameUpdate) {
      console.timeEnd('[frame] awake');
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
      if (this.client.debug.object.renderBackground) {
        object.debuggerRenderBackground(
          this.renderingContext.objects[object.renderLayer]
        );
      }

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

  destroyObjects(delta: number): void {
    if (this.client.debug.timing.frameDestroy) {
      console.time('[frame] destroy');
    }

    this.objects.forEach((object) => {
      if (object.flaggedForDestroy) {
        this.removeObjectById(object.id);
      }
    });

    if (this.client.debug.timing.frameDestroy) {
      console.timeEnd('[frame] destroy');
    }
  }

  defaultRenderer(): void {
    // set camera positions
    this.globals.camera.startX = 0;
    this.globals.camera.startY = 0;
    this.globals.camera.endX = 0;
    this.globals.camera.endY = 0;

    // render
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

  // TODO: I am rethinking the concept of removing the object from the scene during another object's update.
  // I think it would be better to have a flag that is checked during the scene's update loop to rmove the obejct before it's next update
  // perhaps using flaggedForDestroy
  removeObjectById(sceneObjectId: string): void {
    // TODO: review this later, loops are inefficient
    let object = this.objects.find(o => o.id === sceneObjectId);
    if (object === undefined) {
      return;
    }

    if (object.destroy) {
      object.destroy();
    }
    this.objects.splice(this.objects.indexOf(object), 1);
  }

  /**
   * Returns all instances of the provided class
   * @param type
   * @returns
   */
  getObjectsByType(type: any): SceneObject[] {
    // TODO: horribly underperformant, perhaps use a hash on object type instead?
    return this.objects.filter(o => o instanceof type);
  }

  /**
   * Checks if an object exists at the provided position and has collision
   * @param x
   * @param y
   * @returns
   */
  hasCollisionAtPosition(positionX: number, positionY: number, sceneObject?: SceneObject): boolean {
    for (const object of this.objects) {
      if (!object.collision.enabled) {
        continue;
      }

      if (object === sceneObject) {
        continue;
      }

      if (
        positionX < object.boundingBox.right &&
        positionX > object.boundingBox.left &&
        positionY < object.boundingBox.bottom &&
        positionY > object.boundingBox.top
      ) {
        return true;
      }
    }

    return false;
  }

  /**
 * Checks if an object exists at the provided position and has collision
 * @param x
 * @param y
 * @returns
 */
  hasCollisionAtBoundingBox(boundingBox: SceneObjectBoundingBox, sceneObject?: SceneObject): SceneObject | undefined {
    for (const object of this.objects) {
      if (!object.collision.enabled) {
        continue;
      }

      if (object === sceneObject) {
        continue;
      }

      if (
        boundingBox.left < object.boundingBox.right &&
        boundingBox.right > object.boundingBox.left &&
        boundingBox.top < object.boundingBox.bottom &&
        boundingBox.bottom > object.boundingBox.top
      ) {
        return object;
      }
    }
    return undefined;
  }

  isOutOfBounds(positionX: number, positionY: number): boolean {
    return (positionX > this.map.width - 1 || positionY > this.map.height - 1 || positionX < 0 || positionY < 0);
  }

  /**
 * Checks if an object exists at the provided position and has collision
 * @param x
 * @param y
 * @returns
 */
  getObjectAtPosition(positionX: number, positionY: number, sceneObject?: SceneObject): SceneObject | undefined {
    for (const object of this.objects) {
      if (object === sceneObject) {
        continue;
      }

      if (
        positionX < object.boundingBox.right &&
        positionX > object.boundingBox.left &&
        positionY < object.boundingBox.bottom &&
        positionY > object.boundingBox.top
      ) {
        return object;
      }
    }

    return undefined;
  }

  /**
   * returns all objects found at the provided position
   * @param positionX
   * @param positionY
   * @param type
   * @returns
   */
  getAllObjectsAtPosition(positionX: number, positionY: number, type?: any): SceneObject[] {
    // TODO: add optional type check
    // TODO: this is a very heavy operation
    return this.objects.filter(o => o.transform.position.x === positionX && o.transform.position.y === positionY && o.collision.layer !== CanvasConstants.UI_COLLISION_LAYER);
  }

  private removeAllObjects(): void {
    while (this.objects.length > 0) {
      this.removeObjectById(this.objects[0].id);
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
      let canvas = this.createCanvas();
      this.renderingContext.background[i] = RenderUtils.getContext(canvas);
    }
    for (let i = 0; i < CanvasConstants.OBJECT_RENDERING_LAYERS; i++) {
      let canvas = this.createCanvas();
      this.renderingContext.objects[i] = RenderUtils.getContext(canvas);
    }
  }

  private createCanvas(): HTMLCanvasElement {
    let canvas = RenderUtils.createCanvas(this.map.width, this.map.height);

    if (this.client.debug.ui.canvasLayers) {
      this.client.container.append(canvas);
    }

    return canvas;
  }

  flagForMapChange(mapClass: SceneMapConstructorSignature): void {
    this.flaggedForMapChange = mapClass;
  }

  changeMap(mapClass: SceneMapConstructorSignature): void {
    // clean up map
    if (this.map !== undefined) {
      this.map.destroy();
    }

    // clean up scene
    // TODO: some sort of scene reset function
    this.removeAllObjects();
    this.removeAllBackgroundLayers();

    // set up new map
    console.log('[Scene] changing map to', mapClass);
    this.map = Reflect.construct(mapClass, [this]);
    this.backgroundLayers.push(...this.map.backgroundLayers);
    this.objects.push(...this.map.objects);

    // set up rendering contexts
    // custom renderers in objects for maps require this
    this.setUpRenderingContexts();

    // remove flag
    this.flaggedForMapChange = undefined;
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
    console.log('addEventListener is deprecated. refactor your code.');
  }

  removeEventListener(eventName: string, callback: any): void {
    console.log('removeEventListener is deprecated. refactor your code.');
  }

  dispatchEvent(eventName: string, detail?: any): void {
    console.log('dispatchEvent is deprecated. refactor your code.');
  }
}

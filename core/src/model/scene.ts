import { CanvasConstants } from '@core/constants/canvas.constants';
import { RenderUtils } from '@core/utils/render.utils';
import { type BackgroundLayer } from './background-layer';
import { type SceneMapConstructorSignature, type SceneMap } from './scene-map';
import { type SceneObjectBoundingBox, type SceneObject } from './scene-object';
import { type Client } from '@core/client';
import { Assets } from '@core/utils/assets.utils';

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

  // store an in memory canvas for each background layer and each rendering layer (based on CanvasConstants.OBJECT_RENDERING_LAYERS)
  renderingContext: SceneRenderingContext = {
    background: [],
    objects: [],
  };

  private customRenderer?: CustomRendererSignature;

  // from client
  renderContext: CanvasRenderingContext2D;
  displayContext: CanvasRenderingContext2D;

  constructor(
    protected client: Client
  ) {
    this.renderContext = this.client.renderContext;
    this.displayContext = this.client.displayContext;
  }

  backgroundLayerAnimationFrame: Record<string, number> = {};

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

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];

      if (object.flags.awake) {
        continue;
      }

      object.flags.awake = true;

      if (object.awake === undefined) {
        continue;
      }

      object.awake();
    }

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

      // +1 offset due to the -0.5 offset below
      for (let x = 0; x < this.map.width + 1; x++) {
        for (let y = 0; y < this.map.height + 1; y++) {
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

          // offsetting x and y by 0.5 in order to center tile on coordinates
          RenderUtils.renderSprite(
            context,
            Assets.images[tile.tileset],
            animationFrame.spriteX,
            animationFrame.spriteY,
            x - 0.5,
            y - 0.5
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

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];

      if (!object.flags.update) {
        continue;
      }

      if (object.update === undefined) {
        continue;
      }

      object.update(delta);
    }

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
    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];

      if (!object.flags.render) {
        continue;
      }

      if (this.client.debug.object.renderBackground) {
        object.debuggerRenderBackground(
          this.renderingContext.objects[object.renderer.layer]
        );
      }

      if (object.render && object.renderer.enabled) {
        object.render(
          this.renderingContext.objects[object.renderer.layer]
        );
      }

      if (this.client.debug.object.renderBoundary) {
        object.debuggerRenderBoundary(
          this.renderingContext.objects[object.renderer.layer]
        );
      }
    }

    if (this.client.debug.timing.frameRender) {
      console.timeEnd('[frame] render');
    }
  }

  destroyObjects(delta: number): void {
    if (this.client.debug.timing.frameDestroy) {
      console.time('[frame] destroy');
    }

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];

      if (!object.flags.destroy) {
        continue;
      }

      this.removeObjectById(object.id);
    }

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
      this.renderContext.drawImage(context.canvas, 0, 0);
    });
    this.renderingContext.objects.forEach((context) => {
      this.renderContext.drawImage(context.canvas, 0, 0);
    });
  }

  addObject(sceneObject: SceneObject): void {
    this.objects.push(sceneObject);
  }

  removeObjectById(sceneObjectId: string): void {
    // TODO: review this later, loops are inefficient
    let object = this.objects.find(o => o.id === sceneObjectId);
    if (object === undefined) {
      return;
    }

    object.removeAllChildren();

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
        positionX < object.boundingBox.world.right &&
        positionX > object.boundingBox.world.left &&
        positionY < object.boundingBox.world.bottom &&
        positionY > object.boundingBox.world.top
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
        boundingBox.left < object.boundingBox.world.right &&
        boundingBox.right > object.boundingBox.world.left &&
        boundingBox.top < object.boundingBox.world.bottom &&
        boundingBox.bottom > object.boundingBox.world.top
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
        positionX < object.boundingBox.world.right &&
        positionX > object.boundingBox.world.left &&
        positionY < object.boundingBox.world.bottom &&
        positionY > object.boundingBox.world.top
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
    return this.objects.filter(o => o.transform.position.local.x === positionX && o.transform.position.local.y === positionY && o.collision.layer !== CanvasConstants.UI_COLLISION_LAYER);
  }

  private removeAllObjects(): void {
    while (this.objects.length > 0) {
      this.removeObjectById(this.objects[0].id);
    }
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

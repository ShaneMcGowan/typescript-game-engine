import { CanvasConstants } from '@core/constants/canvas.constants';
import { RenderUtils } from '@core/utils/render.utils';
import { type SceneMapConstructorSignature, type SceneMap } from './scene-map';
import { type SceneObjectBoundingBox, type SceneObject } from './scene-object';
import { type Client } from '@core/client';
import { Assets } from '@core/utils/assets.utils';
import { defaultRenderer } from '@core/objects/renderer/default.renderer';

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

export interface ObjectFilter {
  boundingBox?: SceneObjectBoundingBox;
  position?: {
    x: number;
    y: number;
  };
  objectIgnore?: Map<SceneObject, boolean>;
  objectMatch?: Map<SceneObject, boolean>;
  typeMatch?: any[];
  typeIgnore?: any[];
  collision?: {
    enabled?: boolean;
    layerMatch?: Map<number, boolean>;
    layerIgnore?: Map<number, boolean>;
  };
}

export type CustomRendererSignature = (renderingContext: SceneRenderingContext) => void;

export abstract class Scene {

  // objects
  objects: Map<string, SceneObject> = new Map<string, SceneObject>();
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
  private flaggedForMapChange: SceneMapConstructorSignature | undefined = undefined; // if this is set, the scene will change to the map of the provided class on the next frame
  private activeMap: SceneMapConstructorSignature;
  private readonly maps: Map<SceneMapConstructorSignature, SceneMap> = new Map<SceneMapConstructorSignature, SceneMap>(); // Yo dawg, I heard you like maps, so we put your maps in a map so you can map while you map

  // store an in memory canvas for each background layer and each rendering layer (based on CanvasConstants.TOTAL_RENDER_LAYERS)
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

  frame(delta: number): void {
    this.awake();
    this.update(delta);
    this.render(delta);


    if (this.customRenderer) {
      // Scene.background needs to be called in custom renderers 
      this.customRenderer(this.renderingContext);
    } else {
      this.background();
      defaultRenderer(this);
    }

    this.destroy(delta);

    if (this.flaggedForMapChange) {
      this.changeMap(this.flaggedForMapChange);
    }
  }

  private awake(): void {
    if (this.client.flags.frame.log.awakeDuration) {
      console.time('[frame] awake');
    }

    for (let [, object] of this.objects) {
      object.awake();
    }

    if (this.client.flags.frame.log.awakeDuration) {
      console.timeEnd('[frame] awake');
    }
  }

  background(options: { xStart?: number; yStart?: number; xEnd?: number; yEnd?: number } = {}): void {
    if (this.client.flags.frame.log.backgroundDuration) {
      console.time('[frame] background');
    }

    if (this.map.background === undefined) {
      return;
    }

    this.map.background.layers.forEach((layer, index) => {
      let context = this.renderingContext.background[index];
      RenderUtils.clearCanvas(context);

      const xStart = options.xStart ?? 0;
      const yStart = options.yStart ?? 0;
      const xEnd = options.xEnd ?? this.map.width - 1;
      const yEnd = options.yEnd ?? this.map.height - 1;

      for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
          const tile = layer.tiles[y][x];

          if (tile === null) {
            continue;
          }

          if (Assets.images[layer.tileset] === undefined) {
            console.error(`${layer.tileset} tileset is missing`);
            continue;
          }

          RenderUtils.renderSprite(
            context,
            Assets.images[layer.tileset],
            tile.sprite.x,
            tile.sprite.y,
            x,
            y,
            tile.sprite.width,
            tile.sprite.height
          );

        }
      }
    });

    if (this.client.flags.frame.log.backgroundDuration) {
      console.timeEnd('[frame] background');
    }
  }

  private update(delta: number): void {
    if (this.client.flags.frame.log.updateDuration) {
      console.time('[frame] update');
    }

    for (let [, object] of this.objects) {
      object.update(delta);
    }

    if (this.client.flags.frame.log.updateDuration) {
      console.timeEnd('[frame] update');
    }
  }

  render(delta: number): void {
    if (this.client.flags.frame.log.renderDuration) {
      console.time('[frame] render');
    }

    // clear object canvases
    this.renderingContext.objects.forEach((context) => {
      RenderUtils.clearCanvas(context);
    });

    // render objects
    for (let [, object] of this.objects) {
      if (this.client.debug.object.renderBackground) {
        object.debuggerRenderBackground(
          this.renderingContext.objects[object.renderer.layer]
        );
      }

      object.render(
        this.renderingContext.objects[object.renderer.layer]
      );

      if (this.client.debug.object.renderBoundary) {
        object.debuggerRenderBoundary(
          this.renderingContext.objects[object.renderer.layer]
        );
      }
    }

    if (this.client.flags.frame.log.renderDuration) {
      console.timeEnd('[frame] render');
    }
  }

  private destroy(delta: number): void {
    if (this.client.flags.frame.log.destroyDuration) {
      console.time('[frame] destroy');
    }

    for (let [, object] of this.objects) {
      if (!object.flags.destroy) {
        continue;
      }

      this.removeObjectById(object.id);
    }

    if (this.client.flags.frame.log.destroyDuration) {
      console.timeEnd('[frame] destroy');
    }
  }

  get map(): SceneMap {
    return this.maps.get(this.activeMap);
  }

  addObjects(sceneObjects: SceneObject[]): void {
    sceneObjects.forEach(o => { this.addObject(o); });
  }

  addObject(sceneObject: SceneObject): void {
    this.objects.set(sceneObject.id, sceneObject);
  }

  private removeObjectById(sceneObjectId: string): void {
    const object = this.objects.get(sceneObjectId);
    if (object === undefined) {
      return;
    }

    if (object.onDestroy) {
      object.onDestroy();
    }

    this.objects.delete(sceneObjectId);

    // remove reference to child from parent
    if (object.parent) {
      object.parent.children.delete(object.id);
    }
  }

  /**
   * Gets the first object based on the provided filter values
   * @param filter
   * @param enableDefaults applies some smart defaults
   * @returns
   */
  getObject(filter: ObjectFilter = {}, enableDefaults: boolean = true): SceneObject | undefined {
    for (const [, object] of this.objects) {
      if (match(object, filter, enableDefaults)) {
        return object;
      }
    }

    return undefined;
  }

  /**
 * Gets the first object based on the provided filter values
 * @param filter
 * @param enableDefaults applies some smart defaults
 * @returns
 */
  getObjects(filter: ObjectFilter = {}, enableDefaults: boolean = true): SceneObject[] {
    const objects = [];

    for (const [, object] of this.objects) {
      if (match(object, filter, enableDefaults)) {
        objects.push(object);
      }
    }

    return objects;
  }

  isOutOfBounds(positionX: number, positionY: number): boolean {
    return (positionX > this.map.width - 1 || positionY > this.map.height - 1 || positionX < 0 || positionY < 0);
  }

  setUpRenderingContexts(): void {
    this.renderingContext = {
      background: [],
      objects: [],
    };

    for (let i = 0; i < this.map.background.layers.length; i++) {
      let canvas = this.createCanvas();
      this.renderingContext.background[i] = RenderUtils.getContext(canvas);
    }
    for (let i = 0; i < CanvasConstants.TOTAL_RENDERING_LAYERS; i++) {
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
      if (this.map.onLeave) {
        this.map.onLeave();
      }

      if (this.map.flags.suspend) {
        // clear previous object cache on map
        this.map.objects.clear();
        // store objects in cache
        this.objects.forEach(o => this.map.objects.set(o.id, o));
      } else {
        // only call onDestroy if map.flags.suspend is false
        if (this.map.onDestroy) {
          this.map.onDestroy();
        }
      }
    }

    // remove objects from scene
    this.objects.clear();

    // set up new map
    if (this.maps.get(mapClass) === undefined || !this.maps.get(mapClass).flags.suspend) {
      console.log('[Scene] changing map to new instance of', mapClass.name);
      this.maps.set(mapClass, Reflect.construct(mapClass, [this]));
    } else {
      console.log('[Scene] changing map to cached instance of', mapClass.name);
    }

    this.activeMap = mapClass;

    // copy objects from map cache to scene
    this.map.objects.forEach(o => this.objects.set(o.id, o));

    // set up rendering contexts
    // custom renderers in objects for maps require this
    this.setUpRenderingContexts();

    // remove flag
    this.flaggedForMapChange = undefined;

    if (this.map.onEnter) {
      this.map.onEnter();
    }
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
}

function match(object: SceneObject, filter: ObjectFilter, enableDefaults = true): SceneObject | undefined {
  // collision enabled
  if (filter.collision?.enabled !== undefined) {
    if (object.collision.enabled !== filter.collision.enabled) {
      return;
    }
  }

  // collision - layer match
  if (filter.collision?.layerMatch && !filter.collision.layerMatch.get(object.collision.layer)) {
    return;
  }

  // collision - layer ignore
  if (filter.collision?.layerIgnore === undefined && enableDefaults && object.collision.layer === CanvasConstants.UI_COLLISION_LAYER) {
    // by default, ignore CanvasConstants.UI_COLLISION_LAYER
    return;
  } else if (filter.collision?.layerIgnore && filter.collision.layerIgnore.get(object.collision.layer)) {
    return;
  }

  // type - match
  if (filter.typeMatch && !filter.typeMatch.some(type => object instanceof type)) {
    return;
  }

  // type - ignore
  if (filter.typeIgnore && filter.typeIgnore.some(type => object instanceof type)) {
    return;
  }

  // object - match
  if (filter.objectMatch && !filter.objectMatch.get(object)) {
    return;
  }

  // object - ignore
  if (filter.objectIgnore && filter.objectIgnore.get(object)) {
    return;
  }

  // boundingBox
  if (
    filter.boundingBox && !isBoundingBoxWithinBoundingBox(object, filter)
  ) {
    return;
  }

  // position
  if (
    filter.position && !isPositionWithinBoundingBox(object, filter)
  ) {
    return;
  }

  return object;
}

function isPositionWithinBoundingBox(object: SceneObject, filter: ObjectFilter): boolean {
  if (
    filter.position.x < object.boundingBox.world.right &&
    filter.position.x > object.boundingBox.world.left &&
    filter.position.y < object.boundingBox.world.bottom &&
    filter.position.y > object.boundingBox.world.top
  ) {
    return true;
  }

  return false;
}

function isBoundingBoxWithinBoundingBox(object: SceneObject, filter: ObjectFilter): boolean {
  if (
    filter.boundingBox.left < object.boundingBox.world.right &&
    filter.boundingBox.right > object.boundingBox.world.left &&
    filter.boundingBox.top < object.boundingBox.world.bottom &&
    filter.boundingBox.bottom > object.boundingBox.world.top
  ) {
    return true;
  }

  return false;
}

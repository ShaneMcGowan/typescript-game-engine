import { RenderUtils } from "../utils/render.utils";
import { BackgroundLayer } from "./background-layer";
import { SceneMap } from "./scene-map";
import { SceneObject } from "./scene-object";

export class Scene {
  backgroundLayers: BackgroundLayer[];
  backgroundLayerTimer: Record<number, number> = {}; // used for timings for background layer animations
  backgroundLayerAnimationIndex: Record<number, number> = {} // used for timings for background layer animations
  objects: SceneObject[];
  width: number; // width in tiles (e.g. 16 would be 16 tiles wide)
  height: number; // height in tiles
  globals: Record<string, any> = {}; // a place to store flags for the scene

  // maps
  maps: any[] = []; // TODO(smg): some sort of better typing for this, it is a list of uninstanciated classes that extend SceneMap 
  private map: SceneMap; // the current map

  constructor(
    public context: CanvasRenderingContext2D, 
    public assets: Record<string, any>
  ){}

  backgroundLayerAnimationFrame: Record<string, number> = {};

  // TODO(smg): this is currently set up to work with the sample scene, make this generic
  renderBackground(delta: number): void {
    this.backgroundLayers.forEach((layer) => {
      
      // increment timer for layer
      if(this.backgroundLayerTimer[layer.index] === undefined){
        this.backgroundLayerTimer[layer.index] = 0;
      } else {
        this.backgroundLayerTimer[layer.index] += delta;
      }

      // animation test for water
      if(layer.index === 0) {
        if(this.backgroundLayerTimer[layer.index] < 0.25) {
          this.backgroundLayerAnimationIndex[layer.index] = 0;
        } else if (this.backgroundLayerTimer[layer.index] < 0.5){
          this.backgroundLayerAnimationIndex[layer.index] = 1;
        } else if (this.backgroundLayerTimer[layer.index] < 0.75){
          this.backgroundLayerAnimationIndex[layer.index] = 2;
        } else {
          this.backgroundLayerAnimationIndex[layer.index] = 3;
        }

        if(this.backgroundLayerTimer[layer.index] > 1){
          this.backgroundLayerTimer[layer.index] = 0;
        }
      }
      
      for(let x = 0; x < layer.tiles.length; x++){
        for(let y = 0; y < layer.tiles[x].length; y++){
          const tile = layer.tiles[x][y];
          if(tile === undefined){
            continue;
          }
          RenderUtils.renderSprite(
            this.context,
            this.assets.images[tile.tileset],
            tile.spriteX + (layer.index === 0 ? this.backgroundLayerAnimationIndex[layer.index] : 0),
            tile.spriteY,
            x,
            y
          );
        }
      }
    });
  }

  addObject(sceneObject: SceneObject): void {
    this.objects.push(sceneObject);
  }

  removeObject(sceneObject: SceneObject): void {
    if(sceneObject.destroy){
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
    if(object === undefined){
      return false;
    }

    // ignore provided object (usually self)
    if(sceneObject === object){
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
    if(object === undefined){
      return false;
    }

    // ignore provided object (usually self)
    if(sceneObject === object){
      return false;
    }

    return true;
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
  getObjectAtPosition(positionX: number, positionY: number, type: any){
    return this.objects.find(o => o.positionX === positionX && o.positionY === positionY);
  }

  private removeAllObjects(): void {
    this.objects = [];
  }

  private removeAllBackgroundLayers(): void {
    this.backgroundLayers = [];
  }

  loadNewMap(index: number): void {
    // clean up map
    if(this.map !== undefined){
      this.map.destroy();
    }

    // clean up scene
    // TODO(smg): some sort of scene reset function
    this.removeAllObjects();
    this.removeAllBackgroundLayers();

    // set up new map
    this.map = Reflect.construct(this.maps[index], [this, this.context, this.assets]) as SceneMap;
    this.backgroundLayers.push(...this.map.backgroundLayers);
    this.objects.push(...this.map.objects);
  }

}
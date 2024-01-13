import { RenderUtils } from "../utils/render.utils";
import { BackgroundLayer } from "./background-layer";
import { SceneMap } from "./scene-map";
import { SceneObject } from "./scene-object";

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
  backgroundLayers: BackgroundLayer[];
  backgroundLayersAnimationTimer: Record<number, Record<number, Record<number, number>>> = {}; // used for timings for background layer animations
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

  renderBackground(delta: number): void {
    this.backgroundLayers.forEach((layer) => {
      
      for(let x = 0; x < this.map.width; x++){
        for(let y = 0; y < this.map.height; y++){
          let tile = layer.tiles[x] ? layer.tiles[x][y] : undefined;
          
          if(tile === undefined){
            continue;
          }

          let animationFrame;
          if(tile.animationFrames.length === 1){
            // skip animations if only 1 sprite
            animationFrame = tile.animationFrames[0];
          } else {
            // check if timer has started for specific tile on specific layer
            if(this.backgroundLayersAnimationTimer[layer.index] === undefined){
              this.backgroundLayersAnimationTimer[layer.index] = {};
            }
            
            if(this.backgroundLayersAnimationTimer[layer.index][x] === undefined){
              this.backgroundLayersAnimationTimer[layer.index][x] = {};
            }

            let timer;
            if(this.backgroundLayersAnimationTimer[layer.index][x][y] === undefined) {
              timer = 0;
            } else {
              timer = this.backgroundLayersAnimationTimer[layer.index][x][y] + delta;
            }
                
            // wrap timer if over animation frame duration
            if(timer > tile.animationFrameDuration) {
              timer = timer % tile.animationFrameDuration;
            }
            
            for(let i = 0; i < tile.animationMap.length; i++){
              if(timer <= tile.animationMap[i]){
                animationFrame = tile.animationFrames[i];
                break;
              }
            }

            this.backgroundLayersAnimationTimer[layer.index][x][y] = timer;
          }

          RenderUtils.renderSprite(
            this.context,
            this.assets.images[tile.tileset],
            animationFrame.spriteX,
            animationFrame.spriteY,
            x,
            y
          );
          
        }
      }
    });

    return;
  }

  updateObjects(delta: number): void {
    this.objects.forEach((object) => {
      if(object.update){
        object.update(delta);
      }
    });
  }

  renderObjects(delta: number): void {
    this.objects.forEach((object) => {
      if(object.render){
        object.render();
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
  getObjectAtPosition(positionX: number, positionY: number, type?: any){
    // TODO(smg): add optional type check
    // TODO(smg): this is a very heavy operation
    return this.objects.find(o => o.positionX === positionX && o.positionY === positionY);
  }

  /**
   * returns all objects found at the provided position 
   * @param positionX
   * @param positionY 
   * @param type 
   * @returns 
   */
  getAllObjectsAtPosition(positionX: number, positionY: number, type?: any){
    // TODO(smg): add optional type check
    // TODO(smg): this is a very heavy operation
    return this.objects.filter(o => o.positionX === positionX && o.positionY === positionY);
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
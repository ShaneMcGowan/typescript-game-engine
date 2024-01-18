import { BackgroundLayer } from "./background-layer";
import { Scene } from "./scene";
import { SceneObject } from "./scene-object";

export class SceneMap {  
  width: number;
  height: number;
  backgroundLayers: BackgroundLayer[];
  objects: SceneObject[];
  globals: Record<string, any> = {};

  protected context: CanvasRenderingContext2D;
  protected assets: Record<string, any>;

  constructor(
    protected scene: Scene,
  ){
    this.context = this.scene.context;
    this.assets = this.scene.assets;
  }

  /**
   * Called when the map is destroyed
   */
  destroy?(): void {
    // do nothing by default
  } 
}
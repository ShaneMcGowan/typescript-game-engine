import { RenderUtils } from "../utils/render.utils";
import { BackgroundLayer } from "./background-layer";
import { SceneObject } from "./scene-object";

export class Scene {
  id: string;
  backgroundLayers: BackgroundLayer[];
  objects: SceneObject[];
  width: number; // width in tiles (e.g. 16 would be 16 tiles wide)
  height: number; // height in tiles

  constructor(
    public context: CanvasRenderingContext2D, 
    public assets: Record<string, any>
  ){}

  backgroundLayerAnimationFrame: Record<string, number> = {};

  renderBackground(): void {
    this.backgroundLayers.forEach((layer) => {
      
      // 0 , 1 , 2 , 3

      // animation test for water
      if(layer.index === 0) {
        if(this.backgroundLayerAnimationFrame[layer.index] !== undefined){
          this.backgroundLayerAnimationFrame[layer.index]++;
          if(this.backgroundLayerAnimationFrame[layer.index] > 3){
            this.backgroundLayerAnimationFrame[layer.index] = 0;
          }
        } else {
          this.backgroundLayerAnimationFrame[layer.index] = 0;
        }
      }
      
      for(let x = 0; x < layer.tiles.length; x++){
        for(let y = 0; y < layer.tiles[x].length; y++){
          const tile = layer.tiles[x][y];
          if(tile === undefined){
            continue;
          }
          
          if(layer.index === 0) {
            // console.log(tile.spriteX + (layer.index === 0 ? this.backgroundLayerAnimationFrame[layer.index] : 0));
          }

          RenderUtils.renderSprite(
            this.context,
            this.assets.images[tile.tileset],
            tile.spriteX + (layer.index === 0 ? this.backgroundLayerAnimationFrame[layer.index] : 0),
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

}
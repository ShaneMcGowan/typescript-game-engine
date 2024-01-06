import { CanvasConstants } from "./constants/canvas.constants";
import { SCENES } from "./constants/scene.constants";
import { Scene } from "./model/scene";
import { RenderUtils } from "./utils/render.utils";

export class Client {

  // Constants
  private readonly CANVAS_HEIGHT: number = CanvasConstants.TILE_SIZE * CanvasConstants.CANVIS_TILE_HEIGHT;
  private readonly CANVAS_WIDTH: number = CanvasConstants.TILE_SIZE * CanvasConstants.CANVIS_TILE_WIDTH;
  
  // UI
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private delta: number = 0;
  private lastRenderTimestamp: number = 0;

  // Data
  private scenes = [...SCENES];
  private currentScene: Scene;

  // Assets
  assets: {
    images: Record<string, HTMLImageElement>
  } = {
    images: {
      background: new Image(),
      player: new Image(),
    }
  };

  // Debug
  // console.time('[frame] update');
  // console.timeEnd('[frame] render');
  debug = {
    timing: {
      frame: false,
      frameUpdate: false,
      frameRender: false
    }
  }


  constructor(container: HTMLElement){
    // load assets
    this.assets.images.background.src = '/assets/sample/tile-set.png';
    this.assets.images.player.src = '/assets/sample/player-sprites.png';

    // initialise canvas
    this.canvas = this.createCanvas();
    this.context = this.canvas.getContext('2d');

    // attach canvas to ui
    container.prepend(this.canvas);
    
    // load first scene
    this.changeScene(this.scenes[0]);

    // Run game logic
    this.frame(0);
  }

  private createCanvas(): HTMLCanvasElement {
    // create canvas
    const canvas = document.createElement('canvas');

    // configure canvas
    canvas.height = this.CANVAS_HEIGHT;
    canvas.width = this.CANVAS_WIDTH;

    return canvas
  }

  // TODO(smg): need some sort of scene class list
  private changeScene(sceneClass: any): void {
    this.currentScene = Reflect.construct(sceneClass, [this.context, this.assets]);
  }


  /**
   * One frame of game logic
   * @param timestamp 
   */
  private frame(timestamp: number): void {
    if(this.debug.timing.frame){
      console.log(`[frame] ${this.delta}`);
    }
    
    // Set Delata
    this.setDelta(timestamp);

    // Clear canvas before render
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render background
    this.renderBackground();

    // Run object logic
    this.updateObjects();

    // Render objects
    this.renderObjects();

    // Call next frame
    // (we set `this` context for when using window.requestAnimationFrame)
    window.requestAnimationFrame(this.frame.bind(this));
  }

  /**
   * Calculate the time since the previous frame
   * @param timestamp 
   */
  private setDelta(timestamp: number): void {
    this.delta = (timestamp - this.lastRenderTimestamp) / 1000;
    this.lastRenderTimestamp = timestamp;
  }

  private renderBackground(): void {
    // TODO(smg): only render within viewport as it is expensive to render the whole background
    this.currentScene.backgroundLayers.forEach((layer) => {
      for(let x = 0; x < layer.tiles.length; x++){
        for(let y = 0; y < layer.tiles[x].length; y++){
          const tile = layer.tiles[x][y];
          if(tile === undefined){
            continue;
          }
          
          RenderUtils.renderSprite(
            this.context,
            this.assets.images[tile.tileset],
            tile.spriteX,
            tile.spriteY,
            x,
            y
          );
        }
      }
    });
  }

  private updateObjects(): void {
    if(this.debug.timing.frameUpdate){
      console.time('[frame] update');
    }

    this.currentScene.objects.forEach((object) => {
      if(object.update){
        object.update();
      }
    });

    if(this.debug.timing.frameUpdate){
      console.timeEnd('[frame] update');
    }
  }

  private renderObjects(): void {
    if(this.debug.timing.frameRender){
      console.time('[frame] render');
    }

    this.currentScene.objects.forEach((object) => {
      if(object.render){
        object.render();
      }
    });

    if(this.debug.timing.frameRender){
      console.timeEnd('[frame] render');
    }
  }

}

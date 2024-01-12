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
      tileset_grass: new Image(),
      tileset_water: new Image(),
      tileset_player: new Image(),
      tileset_chicken: new Image(),
      tileset_fence: new Image(),
      tileset_egg: new Image(),
      tileset_house: new Image(),
      tileset_dirt: new Image(),
    }
  };

  // Debug
  debug = {
    stats: {
      fps: true, // show fps
      fpsCounter: 0, // time since last check
      objectCount: false, // show object count
    },
    breakpoint: {
      frame: false
    },
    timing: {
      frame: false,
      frameBackground: false,
      frameUpdate: false,
      frameRender: false
    },
    ui: {
      grid: {
        lines: false,
        numbers: false
      }
    }
  }

  constructor(container: HTMLElement){
    // load assets
    this.assets.images.tileset_grass.src = '/assets/sample/Tilesets/Grass.png';
    this.assets.images.tileset_water.src = '/assets/sample/Tilesets/Water.png';
    this.assets.images.tileset_player.src = '/assets/sample/Characters/Basic Charakter Spritesheet.png';
    this.assets.images.tileset_chicken.src = '/assets/sample/Characters/Free Chicken Sprites.png';
    this.assets.images.tileset_fence.src = '/assets/sample/Tilesets/Fences.png';
    this.assets.images.tileset_egg.src = '/assets/sample/Characters/Egg_And_Nest.png';
    this.assets.images.tileset_house.src = '/assets/sample/Tilesets/Wooden House.png';
    this.assets.images.tileset_dirt.src = '/assets/sample/Tilesets/Tilled_Dirt.png';

    // initialise canvas
    this.canvas = this.createCanvas();
    this.context = this.canvas.getContext('2d');

    // attach canvas to ui
    container.prepend(this.canvas);

    // go fullscreen
    // this.canvas.addEventListener('click', () => {
    //   this.canvas.requestFullscreen();
    // })
    
    // load first scene
    this.changeScene(this.scenes[0]);

    // Run game logic
    this.frame(0);
  }

  private createCanvas(): HTMLCanvasElement {
    // create canvas
    const canvas = document.createElement('canvas');

    // prevent right click menu
    canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

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
    if(this.debug.breakpoint.frame){
      debugger;
    }

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

    // Render stats
    if(this.debug.stats.fps){
      if (this.debug.stats.fpsCounter) {
        this.renderStats(`${Math.round(1000/((performance.now() - this.debug.stats.fpsCounter)))} FPS`);
      }
      this.debug.stats.fpsCounter = timestamp;
    }
    if(this.debug.stats.objectCount){
      this.renderStats(`${this.currentScene.objects.length} objects`);
    }

    // debug grid
    this.renderGrid();

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
    if(this.debug.timing.frameBackground){
      console.time('[frame] background');
    }

    // TODO(smg): only render within viewport as it is expensive to render the whole background
    this.currentScene.renderBackground(this.delta);

    if(this.debug.timing.frameBackground){
      console.timeEnd('[frame] background');
    }
  }

  private updateObjects(): void {
    if(this.debug.timing.frameUpdate){
      console.time('[frame] update');
    }

    this.currentScene.objects.forEach((object) => {
      if(object.update){
        object.update(this.delta);
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

  private renderStats(text: string): void {
    this.context.font = "12px serif";
    this.context.fillText(text, this.CANVAS_WIDTH - 50, 16);
  }

  private renderGrid(): void {
    if(this.debug.ui.grid.lines)
    for(let x = 0; x < this.CANVAS_WIDTH; x += CanvasConstants.TILE_SIZE){
      for(let y = 0; y < this.CANVAS_HEIGHT; y += CanvasConstants.TILE_SIZE){
        this.context.strokeRect(x, y, CanvasConstants.TILE_SIZE, CanvasConstants.TILE_SIZE);
      }
    }

    if(this.debug.ui.grid.numbers) {
      for(let x = 0; x < CanvasConstants.CANVIS_TILE_WIDTH; x++){
        for(let y = 0; y < CanvasConstants.CANVIS_TILE_HEIGHT; y++){
          this.context.font = "8px helvetica";
          this.context.fillText(`${x},${y}`, x * CanvasConstants.TILE_SIZE, (y + .5) * CanvasConstants.TILE_SIZE);
        }
      }
    }
  }
}


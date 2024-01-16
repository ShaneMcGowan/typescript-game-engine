import { ASSETS } from "./constants/assets.constants";
import { CanvasConstants } from "./constants/canvas.constants";
import { SCENES } from "./constants/scene.constants";
import { Scene } from "./model/scene";
import { RenderUtils } from "./utils/render.utils";

export class Client {

  // Constants
  private readonly CANVAS_HEIGHT: number = CanvasConstants.CANVAS_HEIGHT
  private readonly CANVAS_WIDTH: number = CanvasConstants.CANVAS_WIDTH;
  
  // UI
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public delta: number = 0;
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
    enabled: true, // if true, debug keys are enabled
    stats: {
      fps: false, // show fps
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
      },
      canvasLayers: false,
    }
  }

  constructor(public container: HTMLElement){
    // load assets
    // TODO(smg): some sort of loading screen / rendering delay until assets are loaded
    Object.keys(ASSETS.images).forEach((key) => {
      this.assets.images[key] = new Image();
      this.assets.images[key].src = ASSETS.images[key]
    });

    // initialise debug controls
    if(this.debug.enabled){
      this.initialiseDebuggerListeners();
    }

    // initialise canvas
    this.canvas = this.createCanvas();
    this.context = this.canvas.getContext('2d');

    // attach canvas to ui
    container.append(this.canvas);

    // go fullscreen
    // this.canvas.addEventListener('click', () => {
    //   this.canvas.requestFullscreen();
    // })

    // handle tabbed out state
    document.addEventListener("visibilitychange", (event) => {
      if (document.visibilityState == "visible") {
        // TODO: pause frame execution
        console.log("tab is active")
      } else {
        // TODO: continue frame execution
        console.log("tab is inactive")
      }
    });
    
    // load first scene
    this.changeScene(this.scenes[1]);

    // Run game logic
    this.frame(0);
  }

  private createCanvas(): HTMLCanvasElement {
    // create canvas
    const canvas = RenderUtils.createCanvas();

    // prevent right click menu
    canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });


    return canvas
  }

  // TODO(smg): need some sort of scene class list type
  changeScene(sceneClass: any): void {
    this.currentScene = Reflect.construct(sceneClass, [this]);
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
    RenderUtils.clearCanvas(this.context);

    // run frame logic
    this.currentScene.frame(this.delta);

    // Render stats
    if(this.debug.stats.fps){
      if (this.debug.stats.fpsCounter) {
        this.renderStats(0, 'FPS', `${Math.round(1000/((performance.now() - this.debug.stats.fpsCounter)))} FPS`);
      }
      this.debug.stats.fpsCounter = timestamp;
    }
    if(this.debug.stats.objectCount){
      this.renderStats(1, 'Objects', `${this.currentScene.objects.length} objects`);
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

  private renderStats(index: number, label: string, value: string): void {
    this.context.fillStyle = "red";
    this.context.font = "12px serif";
    this.context.fillText(value, this.CANVAS_WIDTH - 50, (index + 1) * CanvasConstants.TILE_SIZE);
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
          this.context.fillStyle = "red";
          this.context.font = "8px helvetica";
          this.context.fillText(`${x},${y}`, x * CanvasConstants.TILE_SIZE, (y + .5) * CanvasConstants.TILE_SIZE);
        }
      }
    }
  }

  private initialiseDebuggerListeners(): void {
    document.addEventListener('keyup', (event) => {
      switch(event.key){
        case '1':
          this.debug.ui.grid.lines = !this.debug.ui.grid.lines; 
          break;
        case '2':
          this.debug.ui.grid.numbers = !this.debug.ui.grid.numbers; 
          break;
        case '3':
          this.debug.breakpoint.frame = !this.debug.breakpoint.frame; 
          break;
        case '4':
          this.debug.stats.fps = !this.debug.stats.fps; 
          break;
        case '5':
          this.debug.stats.objectCount = !this.debug.stats.objectCount; 
          break;
        case '6':
          this.debug.timing.frame = !this.debug.timing.frame; 
          break;
        case '7':
          this.debug.timing.frameBackground = !this.debug.timing.frameBackground;
          break;
        case '8':
          this.debug.timing.frameRender = !this.debug.timing.frameRender;
          break;
        case '9':
          this.debug.timing.frameUpdate = !this.debug.timing.frameUpdate;
          break;
        case '0':
          this.debug.ui.canvasLayers = !this.debug.ui.canvasLayers;
          break;
        case '+':
          // nothing yet
          break;
        case '-':
          // nothing yet
          break;
      }
    });
  }
}


import { CanvasConstants } from './constants/canvas.constants';
import { type SceneConstructorSignature, type Scene } from './model/scene';
import { RenderUtils } from '../utils/render.utils';
import { type AssetsConfig, type Assets } from './model/assets';

export class Client {
  // Constants
  private readonly CANVAS_HEIGHT: number = CanvasConstants.CANVAS_HEIGHT;
  private readonly CANVAS_WIDTH: number = CanvasConstants.CANVAS_WIDTH;

  // UI
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public delta: number = 0;
  private lastRenderTimestamp: number = 0;

  // Data
  private readonly scenes: SceneConstructorSignature[];
  private currentScene: Scene;

  // Assets
  assets: Assets = {
    images: {},
    audio: {},
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
      frame: false,
    },
    timing: {
      frame: false,
      frameBackground: false,
      frameUpdate: false,
      frameRender: false,
    },
    ui: {
      grid: {
        lines: false,
        numbers: false,
      },
      canvasLayers: false,
    },
    object: {
      renderBoundary: false,
    },
  };

  // controllers
  gamepad: Gamepad | undefined = undefined;

  constructor(
    public container: HTMLElement,
    scenes: SceneConstructorSignature[],
    assets: AssetsConfig
  ) {
    // scenes
    this.scenes = [...scenes];

    // load assets
    // TODO(smg): some sort of loading screen / rendering delay until assets are loaded
    Object.keys(assets.images).forEach((key) => {
      this.assets.images[key] = new Image();
      this.assets.images[key].src = assets.images[key];
    });
    Object.keys(assets.audio).forEach((key) => {
      this.assets.audio[key] = new Audio(assets.audio[key]);
    });

    // initialise debug controls
    if (this.debug.enabled) {
      this.initialiseDebuggerListeners();
    }

    // initialise canvas
    this.canvas = this.createCanvas();
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    // attach canvas to ui
    container.append(this.canvas);

    // go fullscreen
    this.canvas.addEventListener('click', () => {
      // this.canvas.requestFullscreen();
    });

    // handle tabbed out state
    document.addEventListener('visibilitychange', (event) => {
      if (document.visibilityState === 'visible') {
        // TODO(smg): pause frame execution
        console.log('tab is active');
      } else {
        // TODO(smg): continue frame execution
        console.log('tab is inactive');
      }
    });

    // initialise gamepad listeners
    this.intialiseGamepadListeners();

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

    return canvas;
  }

  // TODO(smg): need some sort of scene class list type
  changeScene(sceneClass: SceneConstructorSignature): void {
    this.currentScene = Reflect.construct(sceneClass, [this]);
  }

  /**
   * One frame of game logic
   * @param timestamp
   */
  private frame(timestamp: number): void {
    if (this.debug.breakpoint.frame) {
      debugger;
    }

    if (this.debug.timing.frame) {
      console.log(`[frame] ${this.delta}`);
    }

    // Set Delata
    this.setDelta(timestamp);

    // Clear canvas before render
    RenderUtils.clearCanvas(this.context);

    // run frame logic
    this.currentScene.frame(this.delta);

    // Render stats
    if (this.debug.stats.fps) {
      if (this.debug.stats.fpsCounter) {
        this.renderStats(0, 'FPS', `${Math.round(1000 / ((performance.now() - this.debug.stats.fpsCounter)))} FPS`);
      }
      this.debug.stats.fpsCounter = timestamp;
    }
    if (this.debug.stats.objectCount) {
      this.renderStats(1, 'Objects', `${this.currentScene.objects.length} objects`);
    }

    // debug grid
    this.renderGrid();

    // check for map change
    if (this.currentScene.flaggedForMapChange) {
      this.currentScene.changeMap(this.currentScene.flaggedForMapChange);
    }

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
    this.context.fillStyle = 'red';
    this.context.font = '12px serif';
    this.context.fillText(value, this.CANVAS_WIDTH - 50, (index + 1) * CanvasConstants.TILE_SIZE);
  }

  private renderGrid(): void {
    if (this.debug.ui.grid.lines || this.debug.ui.grid.numbers) {
      RenderUtils.fillRectangle(this.context, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, { colour: 'rgba(0, 0, 0, 0.25)', });
    }

    if (this.debug.ui.grid.lines) {
      for (let x = 0; x < this.CANVAS_WIDTH; x += CanvasConstants.TILE_SIZE) {
        for (let y = 0; y < this.CANVAS_HEIGHT; y += CanvasConstants.TILE_SIZE) {
          RenderUtils.strokeRectangle(this.context, x, y, CanvasConstants.TILE_SIZE, CanvasConstants.TILE_SIZE, 'black');
        }
      }
    }

    if (this.debug.ui.grid.numbers) {
      for (let x = 0; x < CanvasConstants.CANVAS_TILE_WIDTH; x++) {
        for (let y = 0; y < CanvasConstants.CANVAS_TILE_HEIGHT; y++) {
          this.context.fillStyle = 'black';
          this.context.font = '8px helvetica';
          this.context.fillText(`${x}`, (x * CanvasConstants.TILE_SIZE) + 1, (y * CanvasConstants.TILE_SIZE) + 8); // 8 is 8 px
          this.context.fillText(`${y}`, (x * CanvasConstants.TILE_SIZE) + 6, (y * CanvasConstants.TILE_SIZE) + 14); // 16 is 16px
        }
      }
    }
  }

  private initialiseDebuggerListeners(): void {
    document.addEventListener('keyup', (event) => {
      switch (event.key) {
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

  private intialiseGamepadListeners(): void {
    window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
      console.log(
        'Gamepad connected at index %d: %s. %d buttons, %d axes.',
        event.gamepad.index,
        event.gamepad.id,
        event.gamepad.buttons.length,
        event.gamepad.axes.length
      );
      this.gamepad = event.gamepad;
    });
    window.addEventListener('gamepaddisconnected', (event: GamepadEvent) => {
      this.gamepad = undefined;
    });
  }
}

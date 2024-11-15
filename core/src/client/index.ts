import { type SceneConstructorSignature, type Scene } from '../model/scene';
import { RenderUtils } from '../utils/render.utils';
import { CanvasConstants } from '../constants/canvas.constants';
import { Input } from '../utils/input.utils';
import { MouseUtils } from '../utils/mouse.utils';
import { EditorUtils } from '@core/editor/editor.utils';

interface DebugButtons {
  gridLines?: HTMLElement;
  gridNumbers?: HTMLElement;
  breakpoint?: HTMLElement;
  fps?: HTMLElement;
  objectCount?: HTMLElement;
  timingFrame?: HTMLElement;
  timingFrameBackground?: HTMLElement;
  timingFrameRender?: HTMLElement;
  timingFrameUpdate?: HTMLElement;
  canvasLayers?: HTMLElement;
  fullscreen?: HTMLElement;
  renderBoundary?: HTMLElement;
  renderBackground?: HTMLElement;
}

export class Client {
  // Constants
  private readonly CANVAS_HEIGHT: number = CanvasConstants.CANVAS_HEIGHT;
  private readonly CANVAS_WIDTH: number = CanvasConstants.CANVAS_WIDTH;

  // display canvas - used for display, copies the fully rendered frame from the in memory render canvas
  private readonly displayCanvas: HTMLCanvasElement;
  public readonly displayContext: CanvasRenderingContext2D;

  // render canvas - in memory canvas used for building a frame that will then be pushed to the display canvas once it is complete
  private readonly renderCanvas: HTMLCanvasElement;
  public readonly renderContext: CanvasRenderingContext2D;

  private delta: number = 0;
  private lastRenderTimestamp: number = 0;

  scene: Scene;

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
      frameDestroy: false,
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
      renderBackground: false,
    },
  };

  // controllers
  gamepad: Gamepad | undefined = undefined;

  // engine
  engineSelectedObjectId: string | undefined;
  editorTimer: number = 0; // how often to refresh

  constructor(
    public container: HTMLElement,
    openingScene: SceneConstructorSignature,
    public engineMapList: HTMLElement | null,
    public engineObjectList: HTMLElement | null,
    public engineObjectDetails: HTMLElement | null,
    private readonly engineControls?: DebugButtons
  ) {
    // initialise debug controls
    if (this.debug.enabled) {
      this.initialiseDebuggerState();
      this.initialiseDebuggerListeners();
    }

    // initialise display canvas
    this.displayCanvas = this.createCanvas();
    this.displayContext = RenderUtils.getContext(this.displayCanvas);

    // initialise render canvas
    this.renderCanvas = this.createCanvas();
    this.renderContext = RenderUtils.getContext(this.renderCanvas);

    // attach canvas to ui
    container.append(this.displayCanvas);

    // handle tabbed out state
    document.addEventListener('visibilitychange', (event) => {
      if (document.visibilityState === 'visible') {
        // TODO: pause frame execution
        console.log('tab is active');
      } else {
        // TODO: continue frame execution
        console.log('tab is inactive');
      }
    });

    // intialise mouse listeners
    this.initialiseMouseListeners();

    // initialise keyboard listeners
    this.initialiseKeyboardListeners();

    // initialise gamepad listeners
    this.intialiseGamepadListeners();

    // load first scene
    this.changeScene(openingScene);

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

  changeScene(sceneClass: SceneConstructorSignature): void {
    this.scene = Reflect.construct(sceneClass, [this]);
  }

  /**
   * One frame of game logic
   * @param timestamp
   */
  private frame(timestamp: number): void {
    if (this.debug.breakpoint.frame) {
      // eslint-disable-next-line no-debugger
      debugger;
    }

    if (this.debug.timing.frame) {
      console.log(`[frame] ${this.delta}`);
    }

    // Set Delata
    this.setDelta(timestamp);

    // Clear render canvas before render
    RenderUtils.clearCanvas(this.renderContext);

    // run frame logic
    this.scene.frame(this.delta);

    // copy full frame from render canvas to display canvas
    RenderUtils.clearCanvas(this.displayContext);
    this.displayContext.drawImage(this.renderCanvas, 0, 0);

    // Render stats
    if (this.debug.stats.fps) {
      if (this.debug.stats.fpsCounter) {
        this.renderStats(0, 'FPS', `${Math.round(1000 / ((performance.now() - this.debug.stats.fpsCounter)))} FPS`);
      }
      this.debug.stats.fpsCounter = timestamp;
    }
    if (this.debug.stats.objectCount) {
      this.renderStats(1, 'Objects', `${this.scene.objects.length} objects`);
    }

    // debug grid
    this.renderGrid();

    // check for map change
    if (this.scene.flaggedForMapChange) {
      this.scene.changeMap(this.scene.flaggedForMapChange);
    }

    // update engine
    this.editorTimer += this.delta;
    if (this.editorTimer > 1) {
      this.editor();
      this.editorTimer = 0;
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
    this.displayContext.fillStyle = 'red';
    this.displayContext.font = '12px serif';
    this.displayContext.fillText(value, this.CANVAS_WIDTH - 50, (index + 1) * CanvasConstants.TILE_SIZE);
  }

  private renderGrid(): void {
    if (this.debug.ui.grid.lines || this.debug.ui.grid.numbers) {
      RenderUtils.fillRectangle(this.displayContext, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, { colour: 'rgba(0, 0, 0, 0.25)', });
    }

    if (this.debug.ui.grid.lines) {
      for (let x = 0; x < this.CANVAS_WIDTH; x += CanvasConstants.TILE_SIZE) {
        for (let y = 0; y < this.CANVAS_HEIGHT; y += CanvasConstants.TILE_SIZE) {
          RenderUtils.strokeRectangle(this.displayContext, x, y, CanvasConstants.TILE_SIZE, CanvasConstants.TILE_SIZE, { colour: 'black', });
        }
      }
    }

    if (this.debug.ui.grid.numbers) {
      for (let x = 0; x < CanvasConstants.CANVAS_TILE_WIDTH; x++) {
        for (let y = 0; y < CanvasConstants.CANVAS_TILE_HEIGHT; y++) {
          this.displayContext.fillStyle = 'black';
          this.displayContext.font = '8px helvetica';
          this.displayContext.fillText(`${x}`, (x * CanvasConstants.TILE_SIZE) + 1, (y * CanvasConstants.TILE_SIZE) + 8); // 8 is 8 px
          this.displayContext.fillText(`${y}`, (x * CanvasConstants.TILE_SIZE) + 6, (y * CanvasConstants.TILE_SIZE) + 14); // 16 is 16px
        }
      }
    }
  }

  private initialiseDebuggerState(): void {
    if (this.engineControls === undefined) {
      return;
    }

    if (this.engineControls.renderBoundary) {
      const value: boolean = JSON.parse(
        localStorage.getItem('object.renderBoundary')
      );
      (this.engineControls.renderBoundary as HTMLInputElement).checked = value;
      this.debug.object.renderBoundary = value;
    }
  }

  private initialiseDebuggerListeners(): void {
    if (this.engineControls === undefined) {
      return;
    }

    if (this.engineControls.gridLines) {
      this.engineControls.gridLines.addEventListener('click', () => { this.debug.ui.grid.lines = !this.debug.ui.grid.lines; });
    }

    if (this.engineControls.gridNumbers) {
      this.engineControls.gridNumbers.addEventListener('click', () => { this.debug.ui.grid.numbers = !this.debug.ui.grid.numbers; });
    }

    if (this.engineControls.breakpoint) {
      this.engineControls.breakpoint.addEventListener('click', () => { this.debug.breakpoint.frame = !this.debug.breakpoint.frame; });
    }

    if (this.engineControls.fps) {
      this.engineControls.fps.addEventListener('click', () => { this.debug.stats.fps = !this.debug.stats.fps; });
    }

    if (this.engineControls.objectCount) {
      this.engineControls.objectCount.addEventListener('click', () => { this.debug.stats.objectCount = !this.debug.stats.objectCount; });
    }

    if (this.engineControls.timingFrame) {
      this.engineControls.timingFrame.addEventListener('click', () => { this.debug.timing.frame = !this.debug.timing.frame; });
    }

    if (this.engineControls.timingFrameBackground) {
      this.engineControls.timingFrameBackground.addEventListener('click', () => { this.debug.timing.frameBackground = !this.debug.timing.frameBackground; });
    }

    if (this.engineControls.timingFrameRender) {
      this.engineControls.timingFrameRender.addEventListener('click', () => { this.debug.timing.frameRender = !this.debug.timing.frameRender; });
    }

    if (this.engineControls.timingFrameUpdate) {
      this.engineControls.timingFrameUpdate.addEventListener('click', () => { this.debug.timing.frameUpdate = !this.debug.timing.frameUpdate; });
    }

    if (this.engineControls.canvasLayers) {
      this.engineControls.canvasLayers.addEventListener('click', () => { this.debug.ui.canvasLayers = !this.debug.ui.canvasLayers; });
    }

    if (this.engineControls.renderBoundary) {
      this.engineControls.renderBoundary.addEventListener('click', () => {
        this.debug.object.renderBoundary = !this.debug.object.renderBoundary;
        localStorage.setItem('object.renderBoundary', JSON.stringify(this.debug.object.renderBoundary));
      });
    }

    if (this.engineControls.renderBackground) {
      this.engineControls.renderBackground.addEventListener('click', () => { this.debug.object.renderBackground = !this.debug.object.renderBackground; });
    }

    if (this.engineControls.fullscreen) {
      this.engineControls.fullscreen.addEventListener('click', () => {
        this.displayCanvas.requestFullscreen().catch((error) => {
          throw new Error(error);
        });
      });
    }
  }

  private initialiseKeyboardListeners(): void {
    console.log('[listener added] keydown');
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.repeat) {
        return;
      }

      console.log('[keydown]', event);
      let key = event.key.toLocaleLowerCase();
      Input.setKeyPressed(key);
    });

    console.log('[listener added] keyup');
    document.addEventListener('keyup', (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.repeat) {
        return;
      }

      console.log('[keyup]', event);
      let key = event.key.toLocaleLowerCase();
      Input.clearKeyPressed(key);
    });
  }

  private initialiseMouseListeners(): void {
    console.log('[listener added] mousemove');
    this.displayCanvas.addEventListener('mousemove', (event: MouseEvent) => {
      Input.mouse.position = MouseUtils.getMousePosition(this.displayCanvas, event);
      Input.mouse.latestEvent = event;
    });

    console.log('[listener added] mousedown');
    this.displayCanvas.addEventListener('mousedown', (event: MouseEvent) => {
      console.log('[mousedown]', event);
      switch (event.button) {
        case 0:
          Input.mouse.click.left = true;
          break;
        case 1:
          Input.mouse.click.middle = true;
          break;
        case 2:
          Input.mouse.click.right = true;
          break;
      }
    });

    console.log('[listener added] mouseup');
    this.displayCanvas.addEventListener('mouseup', (event: MouseEvent) => {
      console.log('[mouseup]', event);
      switch (event.button) {
        case 0:
          Input.mouse.click.left = false;
          break;
        case 1:
          Input.mouse.click.middle = false;
          break;
        case 2:
          Input.mouse.click.right = false;
          break;
      }
    });

    // touch - this is for mobile only
    console.log('[listener added] touchstart');
    this.displayCanvas.addEventListener('touchstart', (event: TouchEvent) => {
      console.log('[touchstart]', event);
      Input.mouse.click.left = true;
    });

    // touch - this is for mobile only
    console.log('[listener added] touchend');
    this.displayCanvas.addEventListener('touchend', (event: TouchEvent) => {
      console.log('[touchend]', event);
      Input.mouse.click.left = false;
    });

    // for mouse scroll
    console.log('[listener added] wheel');
    this.displayCanvas.addEventListener('wheel', (event: WheelEvent) => {
      console.log('[wheel]', event);
      Input.mouse.wheel.event = event;
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

  /**
   * Update the editor information
   */
  private editor(): void {
    if (this.engineObjectList === null || this.engineMapList === null) {
      return;
    }

    // update map list
    let mapList = document.createElement('ul');
    this.engineMapList.innerHTML = '';
    this.engineMapList.appendChild(mapList);

    const maps = [...EditorUtils.TEST_MAPS];
    maps.forEach((map) => {
      let item = document.createElement('li');
      item.innerHTML = map.name;
      mapList.appendChild(item);

      item.addEventListener('click', () => {
        EditorUtils.changeMap(map.map);
      });
    });

    // update object list
    let list = document.createElement('ul');
    this.engineObjectList.innerHTML = '';
    this.engineObjectList.appendChild(list);

    this.scene.objects.forEach((object) => {
      let item = document.createElement('li');
      item.innerHTML = object.constructor.name;
      list.appendChild(item);

      item.addEventListener('click', () => {
        this.engineSelectedObjectId = object.id;
        this.updateEngineObjectDetails();
      });
    });
  }

  private updateEngineObjectDetails(): void {
    if (this.engineSelectedObjectId === undefined) {
      return;
    }

    if (this.engineObjectDetails === null) {
      return;
    }

    let object = this.scene.objects.find((object) => object.id === this.engineSelectedObjectId);
    if (object === undefined) {
      return;
    }

    const header = this.engineObjectDetails.querySelector('#object-details-header');
    const content = this.engineObjectDetails.querySelector('#object-details-content');

    // clear
    header.innerHTML = `<h3>${object.constructor.name}</h3>`;
    content.innerHTML = '';

    // details
    Object.keys(object).forEach((key) => {
      if (key === 'transform') {
        content.innerHTML += generateDebuggerLine(object.transform.positionLocal, 'x');
        content.innerHTML += generateDebuggerLine(object.transform.positionLocal, 'y');
      } else {
        content.innerHTML += generateDebuggerLine(object, key);
      }
    });

    // log the object to the console
    console.log(object);
  }
}

function generateDebuggerLine(object: any, key: string): string {
  let html = '';

  html += '<div style="display:flex; padding: 0.25rem 0;">';
  html += `<span style="margin-right: auto;">${key}</span>`;
  html += `<code>${(object)[key]}</code>`;
  html += '</div>';

  return html;
}

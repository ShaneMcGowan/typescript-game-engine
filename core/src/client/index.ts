import { type SceneConstructorSignature, type Scene } from '../model/scene';
import { RenderUtils } from '../utils/render.utils';
import { CanvasConstants } from '../constants/canvas.constants';
import { Input } from '../utils/input.utils';
import { MouseUtils } from '../utils/mouse.utils';
import { EditorUtils } from '@core/editor/editor.utils';
import { ClientScreen } from '@core/model/screen';

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

interface Flags {
  frame: {
    interrupted: boolean;
    log: {
      start: boolean;
      end: boolean;
      delta: boolean;
      timestamp: boolean;
      backgroundDuration: boolean;
      awakeDuration: boolean;
      updateDuration: boolean;
      renderDuration: boolean;
      destroyDuration: boolean;
    };
  };
}

export class Client {
  private delta: number = 0;
  private lastRenderTimestamp: number = 0;
  readonly flags: Flags = {
    frame: {
      interrupted: false,
      log: {
        start: false,
        end: false,
        delta: false,
        timestamp: false,
        backgroundDuration: false,
        awakeDuration: false,
        updateDuration: false,
        renderDuration: false,
        destroyDuration: false,
      },
    },
  };

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

  readonly screens = new Map<string, ClientScreen>();
  activeScreenId: string; // TODO: hack until things are figured out later

  constructor(
    public container: HTMLElement,
    openingScene: SceneConstructorSignature,
    public engineMapList: HTMLElement | null,
    public engineObjectList: HTMLElement | null,
    public engineObjectDetails: HTMLElement | null,
    private readonly engineControls?: DebugButtons
  ) {
    // configure first screen
    // this needs to be first as everything else relies on it existing
    const screen = this.addScreen();
    this.activeScreenId = screen.id;

    // initialise debug controls
    if (this.debug.enabled) {
      this.initialiseDebuggerState();
      this.initialiseDebuggerListeners();
    }

    // attach canvas to ui
    container.append(screen.contexts.display.canvas);

    // handle tabbed out state
    document.addEventListener('visibilitychange', (event) => {
      if (document.visibilityState === 'visible') {
        console.log('tab is active');
        this.flags.frame.interrupted = true;
      } else {
        console.log('tab is inactive');
      }
    });

    document.addEventListener('fullscreenchange', (event) => {
      // TODO: callback to handle this in a frame friendly way
    });

    document.addEventListener('fullscreenerror', (event) => {
      // TODO: callback to handle this in a frame friendly way
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
    window.requestAnimationFrame(this.firstFrame.bind(this));
  }

  changeScene(sceneClass: SceneConstructorSignature): void {
    this.scene = Reflect.construct(sceneClass, [this]);
  }

  /**
   * Starts our frame loop with a valid starting delta,
   * @param timestamp
   */
  private firstFrame(timestamp: number): void {
    this.setDelta(timestamp);

    window.requestAnimationFrame(this.frame.bind(this));
  }

  /**
   * When tabbing out, window.requestAnimationFrame will stop being executed.
   * This will lead to a massive delta between frames.
   * To resolve this, we set a new timestamp on tab back in, effectively pausing the game when tabbed out and pretending no time has passed since then
   * @param timestamp
   */
  private interruptedFrame(timestamp: number): void {
    console.log('frameInterrupted');

    // create a new updated timestamp to base delta off
    this.lastRenderTimestamp = timestamp;
    // remove flag for frame interrupted
    this.flags.frame.interrupted = false;

    window.requestAnimationFrame(this.frame.bind(this));
  }

  /**
   * One frame of game logic, calls the next frame on completion
   * @param timestamp
   */
  private frame(timestamp: number): void {
    if (this.flags.frame.log.start) {
      console.log('[frame] start');
    }

    if (this.debug.breakpoint.frame) {
      // eslint-disable-next-line no-debugger
      debugger;
    }

    if (this.flags.frame.interrupted) {
      window.requestAnimationFrame(this.interruptedFrame.bind(this));
      return;
    }

    // Set Delata
    this.setDelta(timestamp);

    if (this.flags.frame.log.timestamp) {
      console.log(`[timestamp] ${timestamp}`);
    }

    if (this.flags.frame.log.delta) {
      console.log(`[delta] ${this.delta}`);
    }

    // run frame logic
    this.scene.frame(this.delta);

    // Render stats
    if (this.debug.stats.fps) {
      if (this.debug.stats.fpsCounter) {
        this.renderStats(0, 'FPS', `${Math.round(1000 / ((performance.now() - this.debug.stats.fpsCounter)))} FPS`);
      }
      this.debug.stats.fpsCounter = timestamp;
    }
    if (this.debug.stats.objectCount) {
      this.renderStats(1, 'Objects', `${this.scene.objects.size} objects`);
    }

    // debug grid
    this.renderGrid();

    // update engine
    this.editorTimer += this.delta;
    if (this.editorTimer > 1) {
      this.editor();
      this.editorTimer = 0;
    }

    // Call next frame
    // (we set `this` context for when using window.requestAnimationFrame)
    window.requestAnimationFrame(this.frame.bind(this));

    if (this.flags.frame.log.end) {
      console.log('[frame] end');
    }
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
    const screen = this.screens.get(this.activeScreenId);

    screen.contexts.display.fillStyle = 'red';
    screen.contexts.display.font = '12px serif';
    screen.contexts.display.fillText(
      value,
      CanvasConstants.CANVAS_WIDTH - 50,
      (index + 1) * CanvasConstants.TILE_SIZE
    );
  }

  private renderGrid(): void {
    const screen = this.screens.get(this.activeScreenId);

    if (this.debug.ui.grid.lines || this.debug.ui.grid.numbers) {
      RenderUtils.fillRectangle(
        screen.contexts.display,
        0,
        0,
        screen.width,
        screen.height,
        {
          type: 'tile',
          colour: 'rgba(0, 0, 0, 0.25)',
        }
      );
    }

    if (this.debug.ui.grid.lines) {
      for (let x = 0; x < screen.width; x += 1) {
        for (let y = 0; y < screen.height; y += 1) {
          RenderUtils.strokeRectangle(
            screen.contexts.display,
            x,
            y,
            CanvasConstants.TILE_SIZE,
            CanvasConstants.TILE_SIZE,
            {
              colour: 'black',
              type: 'tile',
            }
          );
        }
      }
    }

    if (this.debug.ui.grid.numbers) {
      for (let x = 0; x < screen.width; x++) {
        for (let y = 0; y < screen.height; y++) {
          screen.contexts.display.fillStyle = 'black';
          screen.contexts.display.font = '8px helvetica';
          screen.contexts.display.fillText(`${x}`, (x * CanvasConstants.TILE_SIZE) + 1, (y * CanvasConstants.TILE_SIZE) + 8); // 8 is 8 px
          screen.contexts.display.fillText(`${y}`, (x * CanvasConstants.TILE_SIZE) + 6, (y * CanvasConstants.TILE_SIZE) + 14); // 16 is 16px
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
    const screen = this.screens.get(this.activeScreenId);

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
      this.engineControls.timingFrame.addEventListener('click', () => { this.flags.frame.log.delta = !this.flags.frame.log.delta; });
    }

    if (this.engineControls.timingFrameBackground) {
      this.engineControls.timingFrameBackground.addEventListener('click', () => { this.flags.frame.log.backgroundDuration = !this.flags.frame.log.backgroundDuration; });
    }

    if (this.engineControls.timingFrameRender) {
      this.engineControls.timingFrameRender.addEventListener('click', () => { this.flags.frame.log.renderDuration = !this.flags.frame.log.renderDuration; });
    }

    if (this.engineControls.timingFrameUpdate) {
      this.engineControls.timingFrameUpdate.addEventListener('click', () => { this.flags.frame.log.updateDuration = !this.flags.frame.log.updateDuration; });
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
        screen.contexts.display.canvas.requestFullscreen().catch((error) => {
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
    const screen = this.screens.get(this.activeScreenId);

    console.log('[listener added] mousemove');
    screen.contexts.display.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      Input.mouse.position = MouseUtils.getMousePosition(screen.contexts.display.canvas, event);
      Input.mouse.latestEvent = event;
    });

    console.log('[listener added] mousedown');
    screen.contexts.display.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      // console.log('[mousedown]', event);
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
    screen.contexts.display.canvas.addEventListener('mouseup', (event: MouseEvent) => {
      // console.log('[mouseup]', event);
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
    screen.contexts.display.canvas.addEventListener('touchstart', (event: TouchEvent) => {
      console.log('[touchstart]', event);
      Input.mouse.click.left = true;
    });

    // touch - this is for mobile only
    console.log('[listener added] touchend');
    screen.contexts.display.canvas.addEventListener('touchend', (event: TouchEvent) => {
      console.log('[touchend]', event);
      Input.mouse.click.left = false;
    });

    // for mouse scroll
    console.log('[listener added] wheel');
    screen.contexts.display.canvas.addEventListener('wheel', (event: WheelEvent) => {
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

    let object = this.scene.objects.get(this.engineSelectedObjectId);
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
        content.innerHTML += generateDebuggerLine(object.transform.position.local, 'x');
        content.innerHTML += generateDebuggerLine(object.transform.position.local, 'y');
      } else {
        content.innerHTML += generateDebuggerLine(object, key);
      }
    });

    // log the object to the console
    console.log(object);
  }

  addScreen(): ClientScreen {
    const screen = new ClientScreen(1);
    this.screens.set(screen.id, screen);

    this.screens.forEach(screen => {
      // screen.reset()
    });

    return screen;
  }

  removeScreen(screen: ClientScreen): void {
    this.screens.delete(screen.id);
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

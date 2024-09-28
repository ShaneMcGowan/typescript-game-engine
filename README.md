# typescript-game-engine
A work in progress game engine, written in typescript.

## Sample Games
Check out the samples folder for sample games.
- Sample Game 2d https://shanemcgowan.com/typescript-game-engine/game/dist/

## Core Components
A game will be comprised of the following core components
- Scene
- Maps
- Background
- Objects

## Setting up this repo
There are 2 ways to run this repo, `local` mode and `npm` mode.
- `local` mode will pull directly from the `core` folder in the repo, meaning any changes you make in the `core` folder will update live with your game. This is for people who want full control over the engine.
- `npm` mode is for people who don't care about altering the engine and will just use whatever version of the engine is in the `package.json` file. 

NOTE: if you wish to use `npm` mode, you need to update the `tsconfig.json` so that your editor will have correct syntax highlighting etc. Check the `tsconfig.json` file for comments on how to do this.

- Clone the repo
- `cd core`
- `npm install`
- `npm pack` This will build the package locally which the game relies on
- `cd ..`
- `cd game`
- `npm install`
- `npm run dev`

Your browser should now open on localhost:8080 with the game live in the editor.

If you do not want the editor running, you can run `npm run build-watch` instead

# ALL BELOW IS POTENTIALLY OUTDATED

### index.ts
```TypeScript
import { Client } from '@core/client';
import { type AssetsConfig } from '@core/model/assets';
import { type SceneConstructorSignature } from '@core/model/scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { MY_SCENE } from './scenes/game/game.scene';

(function() {
  /**
   * Declare your canvas constants here
   */
  CanvasConstants.CANVAS_TILE_HEIGHT = 16;
  CanvasConstants.CANVAS_TILE_WIDTH = 9;
  CanvasConstants.TILE_SIZE = 16;

  /**
  * Add your scenes here, the first scene will be loaded on startup
  */
  const scenes: SceneConstructorSignature[] = [
    MY_SCENE
  ];

  const assets: AssetsConfig = {
    images: {
      sprites: 'assets/sprites.png',
    },
    audio: {},
  };

  window.engine = new Client(
    document.getElementById('render-area'),
    scenes,
    assets
  );
})();

```

### Scene
```TypeScript
import { Scene } from '@core/model/scene';
import { type Client } from '@core/client';
import { MY_MAP } from 'my-map.map'; // some map

export class MY_SCENE extends Scene {
  maps = [
    MY_MAP
  ];

  constructor(protected client: Client) {
    super(client);
    this.changeMap(0);
  }
}
```

### Maps
```TypeScript
import { CanvasConstants } from '@core/constants/canvas.constants';
import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';

export class MY_MAP extends SceneMap {
  height = CanvasConstants.CANVAS_TILE_HEIGHT;
  width = CanvasConstants.CANVAS_TILE_WIDTH;

  backgroundLayers: BackgroundLayer[] = [
    // ... background layers
  ];

  objects: SceneObject[] = [
    // ... scene objects
  ];

  constructor(protected scene: MY_SCENE) {
    super(scene);

    // this.objects.push(new MyObject(this.scene, { }));
  }
}
```

### Background
The background shall consist of layers. We will allow for an infinite number of layers, rendering each in order. Background rendering shall be the first thing done, rendering each layer in order.

```TypeScript
// TODO(smg):  
```

### Objects
Objects are a generic, programable class. Objects can spawn other objects and are controller by the scene.

```TypeScript
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';

interface Config extends SceneObjectBaseConfig {
}

export class MyObject extends SceneObject {
  constructor(protected scene: Scene, config: Config) {
    super(scene, config);
  }
}
```

## Utils
Included utils to make certain objects easier

### MathUtils
```TypeScript
// Generates a random int
MathUtils.randomIntFromRange(min: number, max: number);
```

```TypeScript
// Generates a random number
MathUtils.randomNumberFromRange(min: number, max: number);
```

```TypeScript
// Used for adding some randomness to animations
MathUtils.randomStartingDelta(seconds: number);
```

### MouseUtils
```TypeScript
// Gets the current mouse position in the canvas
MouseUtils.getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent);
```

```TypeScript
// Sets the mouse cursor
MouseUtils.setCursor(canvas: HTMLCanvasElement, cursor: string);
```

```TypeScript
// Returns true if current mouse position is within coordinates
MouseUtils.isClickWithin(mousePosition: MousePosition, x: number, y: number, width: number, height: number);
```

### MovementUtils
TODO(smg): description of MovementUtils

### RenderUtils
TODO(smg): description of RenderUtils

## Known Issues
Nothing specific at the minute to highlight
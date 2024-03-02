# typescript-game-engine
A work in progress game engine, written in typescript.

## Sample Games
Check out the samples folder for sample games.
- Sample Game 2d
- Flappy Bird clone https://shanemcgowan.com/typescript-game-engine/dist/flappy-bird/

## Core Components
A game will be comprised of the following core components
- Scene
- Maps
- Background
- Objects

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
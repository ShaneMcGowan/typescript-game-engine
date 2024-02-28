# typescript-game-engine
A work in progress game engine, written in typescript

## Core Components
A game will be comprised of the following core components
- Scene
- Maps
- Background
- Objects

### Scene
Todo(smg): description of scene

### Maps
TODO(smg): description of maps

### Background
The background shall consist of layers. We will allow for an infinite number of layers, rendering each in order. Background rendering shall be the first thing done, rendering each layer in order.

### Objects
Objects are a generic, programable class. Objects can spawn other objects and are controller by the scene.

```TypeScript

// the most basic object will include

import { type Scene } from '@model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@model/scene-object';

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

- MathUtils
- MouseUtils
- MovementUtils
- RenderUtils

### MathUtils
TODO(smg): description of MathUtils

### MouseUtils
TODO(smg): description of MouseUtils

### MovementUtils
TODO(smg): description of MovementUtils

### RenderUtils
TODO(smg): description of RenderUtils

## Known Issues
Nothing specific at the minute to highlight
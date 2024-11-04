# typescript-game-engine
A work in progress 2D Game Engine, written in TypeScript using HTML5 Canvas for rendering.

This engine is designed for pixel art games primarily but can be used for other styles of games.

# Sample Game
Check out the sample game here https://shanemcgowan.com/typescript-game-engine/game/dist/

# Setting up this repo
There are 2 ways to run this repo, `local` mode and `npm` mode. Alternatively you can simply install the package yourself with `npm install typescript-game-engine`.

# Local Mode
`local` mode will pull directly from the `core` folder in the repo, meaning any changes you make in the `core` folder will update live with your game. This is for people who want full control over the engine.

- Clone the repo

- `cd game`
- `npm install`
- To use the editor `npm run dev-local`
- To use just the game `npm run build-local-watch`

Your browser should now open on localhost:8080

# NPM Mode
`npm` mode is for people who don't care about altering the engine and will just use whatever version of the engine is in the `package.json` file. This packages up the core library into an NPM package and uses it as if you were using an actual npm package.

NOTE: if you wish to use `npm` mode, you need to update the `tsconfig.json` so that your editor will have correct syntax highlighting etc. Check the `tsconfig.json` file for comments on how to do this.

- Clone the repo
- `cd core`
- `npm install`
- `npm pack` This will build the package locally which the game relies on
- `cd ..`
- `cd game`
- `npm install`
- `npm run dev-npm`

Your browser should now open on localhost:8080

If you do not want the editor running, you can run `npm run build-watch` instead

## Core Components
A game will be comprised of the following core components
- Scene
- Maps
- Background
- Objects

### index.ts
This is the entry point to your game, you will configure your canvas, assets etc here.
```TypeScript
import { Client } from '@core/client';
import { EditorUtils } from '@core/editor/editor.utils';
import { type AssetsConfig } from '@core/model/assets';
import { type SceneConstructorSignature } from '@core/model/scene';
import { SCENE_MAIN_MENU } from '@game/scenes/main-menu/scene';

(function () {

  // Declare your canvas constants here
  CanvasConstants.CANVAS_TILE_HEIGHT = 18;


  const assets: AssetsConfig = {
    // all image assets need to be defined here, this list will be loaded into memory
    images: {
      someSprite: 'assets/some-sprite.png',
    },
    // audio is not currently supported but will be defined here at a later stage
    audio: { },
  };
  
  // This adds helpers to your client, e.g. the short hand object query `o(id)` helper which becomes available on the `window` object
  EditorUtils.initHelpers();

  window.engine = new Client(
    document.getElementById('render-area'),
    SCENE_MAIN_MENU, // your opening scene
    assets, // your asset config declared above
    EditorUtils.engineMapList,
    EditorUtils.engineObjectList,
    EditorUtils.engineObjectDetails,
    EditorUtils.engineControls
  );
})();
```

## Scene
Think of a scene like a container for your many maps. Set up constants for your scene and logic you want to share that doesn't suit being in a object.

For an example, view the sample game.

## Map
A map is a collection of objects and backgrounds. Use these to organise your game into different sections. If you really want your game just be one massive map but that would be a bit tedious to maintain.

For an example, view the sample game.

#### Background
The background shall consist of layers. We will allow for an infinite number of layers, rendering each in order. Background rendering shall be the first thing done, rendering each layer in order.

For an example, view the sample game.

## SceneObject
Objects are a generic, reusable, programable class. Objects can spawn other objects and are controller by the scene. Objects have various lifecycle functions

#### Awake
Runs once when the object is created

#### Update
Ran every frame after `Awake` is ran for all objects.

#### Render
Ran every frame after `Update` is ran for all objects.

#### Destory
Ran every frame after `Render` if the object has `flaggedForDestroy` set to true.
After this is ran, then the object is removed from the Scene.

# All APIs are incomplete and subject to massive change
I am developing this iteratively as a hobby project so expect massive change if you opt to use this engine. I recommend staying at a fixed version or forking the repo yourself for best stability.
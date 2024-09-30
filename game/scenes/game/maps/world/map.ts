import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type SceneObject } from '@core/model/scene-object';
import { ChickenObject } from '@game/objects/chicken.object';
import { FenceObject, FenceType } from '@game/objects/fence.object';
import { HoleObject } from '@game/objects/hole.object';
import { PlayerObject } from '@game/objects/player.object';
import { SAMPLE_SCENE_1_MAP_0_BACKGROUND_0 } from './backgrounds/0.background';
import { SAMPLE_SCENE_1_MAP_0_BACKGROUND_1 } from './backgrounds/1.background';
import { SAMPLE_SCENE_1_MAP_0_BACKGROUND_2 } from './backgrounds/2.background';
import { CameraObject } from '@game/objects/camera.object';
import { InventoryUiObject } from '@game/objects/inventory-ui.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { ChestObject } from '@game/objects/chest.object';
import { IntervalObject } from '@core/objects/interval.object';
import { TimerObject } from '@core/objects/timer.object';
import { TransitionObject } from '@core/objects/transition.object';

export class SCENE_GAME_MAP_WORLD extends SceneMap {
  height = 100;
  width = 100;

  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_1_MAP_0_BACKGROUND_0,
    SAMPLE_SCENE_1_MAP_0_BACKGROUND_1,
    SAMPLE_SCENE_1_MAP_0_BACKGROUND_2
  ];

  objects: SceneObject[] = [];

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    // TODO: remove this when no longer debugging as it will be set in start menu map
    MouseUtils.setCursor(this.context.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png');

    this.objects.push(new InventoryUiObject(scene, { positionX: 0, positionY: 0, }));

    // TODO: allow for the concept of entities vs objects, or some sort of rendering layer to ensure objects at the proper z-index.
    // e.g. HoleObject needs to be added to the scene before the player currently in order to have it render below the player
    this.objects.push(new HoleObject(scene, { positionX: 17, positionY: 3, }));

    // instanciate objects
    // this is quite verbose but it will do for now, we want control over individual objects and their constructors
    let player = new PlayerObject(scene, { positionX: 4, positionY: 4, });
    this.objects.push(player);

    this.objects.push(new ChestObject(scene, { positionX: 3, positionY: 3, }));
    this.objects.push(new ChestObject(scene, { positionX: 4, positionY: 3, }));
    this.objects.push(new ChestObject(scene, { positionX: 5, positionY: 3, }));

    // chickens
    this.objects.push(new ChickenObject(scene, { positionX: 17, positionY: 11, follows: player, canLayEggs: true, canMove: true, }));

    // fences
    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 2, type: FenceType.TopLeft, }));
    this.objects.push(new FenceObject(scene, { positionX: 3, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 4, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 5, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 6, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 7, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 8, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 9, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 10, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 11, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 12, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 13, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 14, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 15, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 16, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 17, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 2, type: FenceType.TopRight, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 3, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 3, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 4, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 4, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 5, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 5, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 6, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 6, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 7, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 7, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 8, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 8, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 9, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 9, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 10, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 10, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 11, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 11, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 12, type: FenceType.BottomLeft, }));
    this.objects.push(new FenceObject(scene, { positionX: 3, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 4, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 5, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 6, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 7, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 8, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 9, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 10, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 11, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 12, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 13, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 14, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 15, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 16, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 17, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 12, type: FenceType.BottomRight, }));

    // load test
    // for (let i = 0; i < 20000; i++) {
    //   this.objects.push(new ChickenObject(scene, { positionX: 10, positionY: 10, canMove: true, follows: player, }));
    // }

    // camera
    this.objects.push(new CameraObject(scene, { object: player, }));

    // fade in
    this.objects.push(new TransitionObject(scene, {
      animationCenterX: player.positionX,
      animationCenterY: player.positionY,
      animationType: 'circle',
      animationLength: 1,
    }));

    // interval tests
    this.objects.push(new IntervalObject(scene, {
      duration: 1,
      onInterval: () => {
        // console.log('[onInterval] test interval - max 5');
      },
      onDestroy: () => {
        // console.log('[onDestroy] test interval - max 5');
      },
      maxIntervals: 5,
    }));

    this.objects.push(new IntervalObject(scene, {
      duration: 1,
      onInterval: () => {
        // console.log('[onInterval] test interval - no max');
      },
      onDestroy: () => {
        // console.log('[onDestroy] test interval - no max');
      },
    }));

    this.objects.push(new TimerObject(scene, {
      duration: 1,
      onComplete: () => {
        // console.log('test timer');
      },
    }));

    // this.objects.push(new GenericSpriteObject(scene, { positionX: 5, positionY: 4, spriteX: 0, spriteY: 0, tileset: 'tileset_sample', }));
  }
}

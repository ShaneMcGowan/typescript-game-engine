import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type SceneObject } from '@core/model/scene-object';
import { ChickenObject } from '@game/objects/chicken.object';
import { HoleObject } from '@game/objects/hole.object';
import { PlayerObject } from '@game/objects/player.object';
import { SCENE_GAME_MAP_WORLD_BACKGROUND_WATER } from './backgrounds/water.background';
import { SCENE_GAME_MAP_WORLD_BACKGROUND_MOUNTAINS } from './backgrounds/mountains.background';
import { SCENE_GAME_MAP_WORLD_BACKGROUND_BRIDGES } from './backgrounds/bridges.background';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { CollisionObject } from '@game/objects/collision.object';
import { SCENE_GAME_MAP_WORLD_BACKGROUND_GROUND } from './backgrounds/ground.background';
import { CameraObject } from '@game/objects/camera.object';
import { HotbarObject } from '@game/objects/hotbar.object';
import { ShopKeeperObject } from '@game/objects/npcs/shop-keeper.npc';
import { FenceObject, FenceType } from '@game/objects/fence.object';
import { ShopObject } from '@game/objects/shop.object';

export class SCENE_GAME_MAP_WORLD extends SceneMap {
  height = 100;
  width = 100;

  backgroundLayers: BackgroundLayer[] = [
    SCENE_GAME_MAP_WORLD_BACKGROUND_WATER,
    SCENE_GAME_MAP_WORLD_BACKGROUND_GROUND,
    SCENE_GAME_MAP_WORLD_BACKGROUND_MOUNTAINS,
    // SCENE_GAME_MAP_WORLD_BACKGROUND_BRIDGES,
  ];

  objects: SceneObject[] = [];

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    // TODO: remove this when no longer debugging as it will be set in start menu map
    MouseUtils.setCursor(this.context.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png');

    this.objects.push(new HotbarObject(scene, { positionX: 16, positionY: 16, }));

    // this.objects.push(new ShopObject(scene, { positionX: 0, positionY: 0 }));

    // TODO: allow for the concept of entities vs objects, or some sort of rendering layer to ensure objects at the proper z-index.
    // e.g. HoleObject needs to be added to the scene before the player currently in order to have it render below the player
    // this.objects.push(new HoleObject(scene, { positionX: 17, positionY: 3, }));

    // instanciate objects
    // this is quite verbose but it will do for now, we want control over individual objects and their constructors
    let player = new PlayerObject(scene, { positionX: 4, positionY: 4.5, });
    this.objects.push(player);

    this.objects.push(new ShopKeeperObject(scene, {
      positionX: 4,
      positionY: 5.5,
    }));

    // chickens
    this.objects.push(new ChickenObject(scene, { positionX: 17, positionY: 11, follows: player, canLayEggs: true, canMove: true, }));

    // fences
    this.objects.push(new CollisionObject(scene, { positionX: 6.5, positionY: 8.5, width: 6 }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 8.5, width: 9 }));

    this.objects.push(new CollisionObject(scene, { positionX: 4, positionY: 9, }));
    this.objects.push(new CollisionObject(scene, { positionX: 4, positionY: 10, }));
    this.objects.push(new CollisionObject(scene, { positionX: 4, positionY: 11, }));
    this.objects.push(new CollisionObject(scene, { positionX: 4, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 4, positionY: 13, }));
    this.objects.push(new CollisionObject(scene, { positionX: 4, positionY: 14, }));


    this.objects.push(new CollisionObject(scene, { positionX: 0, positionY: 15, }));
    this.objects.push(new CollisionObject(scene, { positionX: 1, positionY: 15, }));
    this.objects.push(new CollisionObject(scene, { positionX: 2, positionY: 15, }));
    this.objects.push(new CollisionObject(scene, { positionX: 3, positionY: 15, }));
    this.objects.push(new CollisionObject(scene, { positionX: 4, positionY: 15, }));

    this.objects.push(new FenceObject(scene, { positionX: 0, positionY: 16, type: FenceType.FencePost }));
    this.objects.push(new FenceObject(scene, { positionX: 0, positionY: 17, type: FenceType.FencePost }));
    this.objects.push(new FenceObject(scene, { positionX: 0, positionY: 18, type: FenceType.FencePost }));

    this.objects.push(new CollisionObject(scene, { positionX: 0, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 1, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 2, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 3, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 4, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 5, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 6, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 7, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 8, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 9, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 11, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 12, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 14, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 16, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 17, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 19, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 20, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 21, positionY: 18, }));
    this.objects.push(new CollisionObject(scene, { positionX: 22, positionY: 18, }));

    this.objects.push(new CameraObject(scene, { object: player, }));

    /*

    // load test
    // for (let i = 0; i < 20000; i++) {
    //   this.objects.push(new ChickenObject(scene, { positionX: 10, positionY: 10, canMove: true, follows: player, }));
    // }

    // camera

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
    */
  }
}

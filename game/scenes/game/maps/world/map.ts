import { SceneMap } from '@core/model/scene-map';
import { SpriteObject } from '@core/objects/sprite.object';
import { ChickenObject } from '@game/objects/chicken.object';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { CollisionObject } from '@game/objects/collision.object';
import { ShopKeeperObject } from '@game/objects/npcs/shop-keeper.npc';
import { TransitionObject } from '@core/objects/transition.object';
import { CropStage, DirtObject } from '@game/objects/dirt.object';
import { IntervalObject } from '@core/objects/interval.object';
import { GenericSpriteObject } from '@game/objects/generic-sprite.object';
import { MathUtils } from '@core/utils/math.utils';
import { FullscreenToggleObject } from '@game/objects/fullscreen-toggle.object';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { ItemType } from '@game/models/inventory.model';
import { WarpObject } from '@game/objects/warp.object';
import { TilesetHouse } from '@game/constants/tileset-house.constants';
import { LockedDoorObject } from '@game/objects/world/locked-door.object';
import { HoleObject } from '@game/objects/world/hole.object';
import { SCENE_GAME_MAP_SHOP } from '../shop/map';
import { JsonBackgroundMap } from '@core/model/background';
import background from './background.json';

export class SCENE_GAME_MAP_WORLD extends SceneMap {

  background: JsonBackgroundMap = background;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    // Set up UI
    MouseUtils.setCursor(this.scene.displayContext.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png'); // TODO: remove this when no longer debugging as it will be set in start menu map
    this.scene.addObject(new FullscreenToggleObject(scene, { positionX: 31, positionY: 1 }))

    // instanciate objects
    // this is quite verbose but it will do for now, we want control over individual objects and their constructors
    let player = new PlayerObject(scene, {playerIndex: 0, positionX: 10, positionY: 2, });
    this.scene.addObject(player);
    this.scene.addObject(new ShopKeeperObject(scene, { positionX: 2, positionY: 12, }));

    // chickens
    this.scene.addObject(new ChickenObject(scene, { positionX: 10, positionY: 13, follows: player, canLayEggs: true, canMove: true, }));

    // crops
    const dirtConfig = { positionX: 2, positionY: 2, growing: { stage: CropStage.FullyGrown, itemType: ItemType.WheatSeeds } };
    this.scene.addObjects([
      // 2
      ...([...Array(5)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 2 + i, positionY: 2 }))),
      ...([...Array(4)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 14 + i, positionY: 2 }))),
      // 3
      ...([...Array(8)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 2 + i, positionY: 3 }))),
      ...([...Array(7)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 11 + i, positionY: 3 }))),
      // 4
      ...([...Array(8)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 2 + i, positionY: 4 }))),
      ...([...Array(7)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 11 + i, positionY: 4 }))),
      // 5
      ...([...Array(8)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 2 + i, positionY: 5 }))),
      ...([...Array(7)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 11 + i, positionY: 5 }))),
    ]);


    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 13; col++) {
        this.scene.addObject(new DirtObject(scene, { positionX: 12 + col, positionY: 10 + row, growing: { stage: CropStage.FullyGrown, itemType: ItemType.WheatSeeds } }));
      }
    }

    // horizontal
    this.scene.addObject(new CollisionObject(scene, { positionX: 8, positionY: 0, width: 5 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 8, positionY: 1, width: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 11, positionY: 1, width: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 25, positionY: 0, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 19, positionY: 3, width: 7, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 4, positionY: 7, width: 6, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 11, positionY: 7, width: 9, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 0, positionY: 14, width: 5, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 0, positionY: 18, width: 28 }));
    // vertical
    this.scene.addObject(new CollisionObject(scene, { positionX: 4, positionY: 8, height: 6 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 19, positionY: 4, height: 3 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 25, positionY: 1, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 27, positionY: 1, height: 17 }));

    this.scene.addObject(new ObjectTrackingCameraObject(scene, { object: player }));

    // fade in
    this.scene.addObject(new TransitionObject(scene, {
      animationCenterX: player.transform.position.world.x + (player.width / 2),
      animationCenterY: player.transform.position.world.y + (player.height / 2),
      animationType: 'circle',
      animationLength: 2,
    }));

    // ambient floating items
    this.scene.addObject(new IntervalObject(this.scene, {
      duration: 4.5,
      onInterval: () => {
        let randomY = MathUtils.randomIntFromRange(19, 28);

        let randomItem = MathUtils.randomIntFromRange(0, 2);
        let tileset = '';
        let spriteX = 0;
        let spriteY = 0;
        if (randomItem === 0 || randomItem === 1) {
          tileset = 'tileset_egg';
          spriteX = 1;
          spriteY = 0;
        } else {
          tileset = 'tileset_chicken';
          spriteX = 0;
          spriteY = -0.25;
        }

        this.scene.addObject(new GenericSpriteObject(
          this.scene,
          {
            positionX: 40,
            positionY: randomY,
            targetX: -1,
            targetY: randomY,
            tileset: tileset,
            spriteX: spriteX,
            spriteY: spriteY,
            destroyAtTarget: true,
            canMove: true,
          }
        ));
      }
    }));

    // warps
    this.scene.addObject(new HoleObject(this.scene, { positionX: 25, positionY: 16 }))


    // mission - 
    // TODO: perhaps move these into some sort of Story Controller scene object
    this.scene.addObject(new LockedDoorObject(this.scene, {
      positionX: 10,
      positionY: 1,
      onDestroy: () => {
        this.scene.addObject(new WarpObject(scene, { positionX: 10, positionY: 1, player: player, map: SCENE_GAME_MAP_SHOP }))
        this.scene.addObject(new SpriteObject(scene, {
          positionX: 10,
          positionY: 1,
          tileset: TilesetHouse.id,
          spriteX: TilesetHouse.Door.Default.AlmostClosed.x,
          spriteY: TilesetHouse.Door.Default.AlmostClosed.y,
        }));
      }
    }));
  }
}
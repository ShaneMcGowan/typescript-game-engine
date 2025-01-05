import { SceneMap } from '@core/model/scene-map';
import { SpriteObject } from '@core/objects/sprite.object';
import { ChickenObject } from '@game/objects/chicken.object';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { CollisionObject } from '@game/objects/collision.object';
import { TransitionObject } from '@core/objects/transition.object';
import { IntervalObject } from '@core/objects/interval.object';
import { GenericSpriteObject } from '@game/objects/generic-sprite.object';
import { MathUtils } from '@core/utils/math.utils';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { WarpObject } from '@game/objects/warp.object';
import { TilesetHouse } from '@game/constants/tilesets/house.tileset';
import { LockedDoorObject } from '@game/objects/world/locked-door.object';
import { SCENE_GAME_MAP_FARM_HOUSE } from '../farm-house/map';
import { JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { GateObject } from '@game/objects/world/gate.object';
import { FarmersSonObject } from '@game/objects/world/npcs/farmers-son.npc';
import { RockObject } from '@game/objects/rock.object';
import { TreeObject } from '@game/objects/tree.object';
import { IconsObject } from '@game/objects/icons/icons.object';
import { QuestCollectLogs } from '@game/objects/world/npcs/farmer/collect-logs.quest';
import { QuestCollectRocks } from '@game/objects/world/npcs/farmer/collect-rocks.quest';
import { QuestBreakRocks } from '@game/objects/world/npcs/farmer/break-rocks.quest';
import { QuestCollectBerries } from '@game/objects/world/npcs/farmer/collect-berries.quest';
import { QuestClearPathToFarm } from '@game/objects/world/npcs/farmer/clear-path-to-farm.quest';
import { Scene } from '@core/model/scene';
import { SCENE_GAME_MAP_FARM } from '../farm/map';

export class SCENE_GAME_MAP_WORLD extends SceneMap {

  // config
  background: JsonBackgroundMap = background;

  // state
  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    // Set up UI
    MouseUtils.setCursor(this.scene.displayContext.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png'); // TODO: remove this when no longer debugging as it will be set in start menu map

    this.scene.addObject(new IconsObject(this.scene, { positionX: 0, positionY: 0 }));
    // instanciate objects
    // this is quite verbose but it will do for now, we want control over individual objects and their constructors
    this.player = new PlayerObject(this.scene, {playerIndex: 0, positionX: 17, positionY: 13, });
    this.scene.addObject(this.player);

    // farmer's son
    this.scene.addObject(new FarmersSonObject(this.scene, {
      positionX: 25, 
      positionY: 16,
    }));

    // chickens
    this.scene.addObject(new ChickenObject(scene, { positionX: 10, positionY: 13, canMove: true, }));

    // crops
    // const dirtConfig = { positionX: 2, positionY: 2, growing: { stage: CropStage.FullyGrown, itemType: ItemType.WheatSeeds } };
    // this.scene.addObjects([
    //   // 2
    //   ...([...Array(5)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 2 + i, positionY: 2 }))),
    //   ...([...Array(4)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 14 + i, positionY: 2 }))),
    //   // 3
    //   ...([...Array(8)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 2 + i, positionY: 3 }))),
    //   ...([...Array(7)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 11 + i, positionY: 3 }))),
    //   // 4
    //   ...([...Array(8)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 2 + i, positionY: 4 }))),
    //   ...([...Array(7)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 11 + i, positionY: 4 }))),
    //   // 5
    //   ...([...Array(8)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 2 + i, positionY: 5 }))),
    //   ...([...Array(7)].map((_, i) => new DirtObject(scene, { ...dirtConfig, positionX: 11 + i, positionY: 5 }))),
    // ]);

    // horizontal
    this.scene.addObject(new CollisionObject(scene, { positionX: 20, positionY: 0, width: 7 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 1, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 20, positionY: 1, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 24, positionY: 1, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 6, positionY: 2, width: 4 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 1, positionY: 5, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 11, positionY: 2, width: 8 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 4, positionY: 3, width: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 2, positionY: 4, width: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 4, positionY: 7, width: 6, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 11, positionY: 7, width: 9, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 0, positionY: 14, width: 5, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 25, positionY: 22, width: 5 }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 0, positionY: 23, width: 25 }));
    // vertical
    this.scene.addObject(new CollisionObject(scene, { positionX: 0, positionY: 6, height: 6 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 4, positionY: 8, height: 6 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 19, positionY: 2, height: 5 }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 30, positionY: 19, height: 3 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 31, positionY: 18, height: 1 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 32, positionY: 0, height: 18 }));

    this.scene.addObject(new ObjectTrackingCameraObject(scene, { object: this.player }));

    // ambient floating items
    this.scene.addObject(new IntervalObject(this.scene, {
      duration: 4.5,
      onInterval: () => {
        let randomY = MathUtils.randomIntFromRange(24, 29);

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
    // this.scene.addObject(new HoleObject(this.scene, { positionX: 25, positionY: 16 }))

    // mission - 
    // TODO: perhaps move these into some sort of Story Controller scene object
    this.scene.addObject(new LockedDoorObject(this.scene, {
      positionX: 23,
      positionY: 1,
      onDestroy: () => {
        this.scene.addObject(new WarpObject(scene, { positionX: 23, positionY: 1, player: this.player, map: SCENE_GAME_MAP_FARM_HOUSE }))
        this.scene.addObject(new SpriteObject(scene, {
          positionX: 23,
          positionY: 1,
          tileset: TilesetHouse.id,
          spriteX: TilesetHouse.Door.Default.AlmostClosed.x,
          spriteY: TilesetHouse.Door.Default.AlmostClosed.y,
        }));
      }
    }));

    this.scene.addObject(new GateObject(this.scene, { positionX: 10, positionY: 7 }))

    // rocks
    this.scene.addObject(new RockObject(this.scene, { positionX: 26, positionY: 2, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 27, positionY: 1, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 28, positionY: 1, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 29, positionY: 0, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 30, positionY: 0, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 31, positionY: 1, canBeBroken: false }));

    this.scene.addObject(new RockObject(this.scene, { positionX: 10, positionY: 2, canBeBroken: false }));

    this.scene.addObject(new RockObject(this.scene, { positionX: 1, positionY: 16, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 3, positionY: 16, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 2, positionY: 17, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 1, positionY: 18, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 1, positionY: 19, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 2, positionY: 20, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 1, positionY: 21, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { positionX: 0, positionY: 22, canBeBroken: false }));

    // trees
    this.scene.addObject(new TreeObject(this.scene, { positionX: 1, positionY: 2, type: 'small' }));
    this.scene.addObject(new TreeObject(this.scene, { positionX: 14, positionY: 1, type: 'small'}));
    this.scene.addObject(new TreeObject(this.scene, { positionX: 16, positionY: 4, type: 'small'}));
    this.scene.addObject(new TreeObject(this.scene, { positionX: 2, positionY: 7, type: 'small'}));
    this.scene.addObject(new TreeObject(this.scene, { positionX: 25, positionY: 7, type: 'small'}));
    this.scene.addObject(new TreeObject(this.scene, { positionX: 1, positionY: 11, type: 'small' }));
    this.scene.addObject(new TreeObject(this.scene, { positionX: 13, positionY: 11, type: 'small'}));
    this.scene.addObject(new TreeObject(this.scene, { positionX: 7, positionY: 13, type: 'small' }));

    // quests
    QuestCollectLogs.setup(this.scene);
    QuestCollectRocks.setup(this.scene);
    QuestBreakRocks.setup(this.scene);
    QuestCollectBerries.setup(this.scene);
    QuestClearPathToFarm.setup(this.scene);

    // warps
    const WARP_CONFIG_FARM = {
      positionX: 0,
      player: this.player,
      map: SCENE_GAME_MAP_FARM,
      width: 1,
      isColliding: true,
    };
    this.scene.addObject(new WarpObject(scene, {
      ...WARP_CONFIG_FARM,
      positionY: 12
    }));
    this.scene.addObject(new WarpObject(scene, {
      ...WARP_CONFIG_FARM,
      positionY: 13
    }));
  }

  onEnter(scene: Scene): void {
    // fade in
    this.scene.addObject(new TransitionObject(scene, {
      animationCenterX: this.player.transform.position.world.x + (this.player.width / 2),
      animationCenterY: this.player.transform.position.world.y + (this.player.height / 2),
      animationType: 'circle',
      animationLength: 2,
    }));
  }
}
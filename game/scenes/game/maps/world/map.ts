import { SceneMap } from '@core/model/scene-map';
import { SpriteObject } from '@core/objects/sprite.object';
import { ChickenObject } from '@game/objects/chicken.object';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { CollisionObject } from '@game/objects/collision.object';
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
import { FarmersSonObject } from '@game/objects/world/npcs/farmers-son.npc';
import { RockObject } from '@game/objects/rock.object';
import { TreeObject } from '@game/objects/tree.object';
import { QuestCollectLogs } from '@game/objects/world/npcs/farmer/collect-logs.quest';
import { QuestCollectRocks } from '@game/objects/world/npcs/farmer/collect-rocks.quest';
import { QuestBreakRocks } from '@game/objects/world/npcs/farmer/break-rocks.quest';
import { QuestCollectBerries } from '@game/objects/world/npcs/farmer/collect-berries.quest';
import { Scene } from '@core/model/scene';
import { SCENE_GAME_MAP_FARM } from '../farm/map';
import { SCENE_GAME_MAP_TOWN } from '../town/map';
import { Warps } from '@game/constants/warp.constants';
import { StoryWorldHillGateObject } from '@game/objects/story/world/hill-gate/story';
import { StoryWorldHillPathToTownBlockadeObject } from '@game/objects/story/world/hill-path-to-town-blockade/story';
import { StoryWorldHillPathToFarmBlockadeObject } from '@game/objects/story/world/hill-path-to-farm-blockade/story';

export class SCENE_GAME_MAP_WORLD extends SceneMap {

  // config
  background: JsonBackgroundMap = background;

  // state
  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    // instanciate objects
    this.player = new PlayerObject(this.scene, { playerIndex: 0, x: 17, y: 13, });
    this.scene.addObject(this.player);

    // npcs
    this.scene.addObject(new FarmersSonObject(this.scene, { x: 25, y: 16 }));

    // stories
    this.scene.addObject(new StoryWorldHillGateObject(scene, { x: 0, y: 0 }));
    this.scene.addObject(new StoryWorldHillPathToTownBlockadeObject(scene, {x: 0, y: 0}));
    this.scene.addObject(new StoryWorldHillPathToFarmBlockadeObject(scene, {x: 0, y: 0}));

    // chickens
    this.scene.addObject(new ChickenObject(scene, { x: 10, y: 13, canMove: true, }));

    // horizontal
    this.scene.addObject(new CollisionObject(scene, { x: 20, y: 0, width: 7 }));
    this.scene.addObject(new CollisionObject(scene, { x: 20, y: 1, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 24, y: 1, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 6, y: 2, width: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 1, y: 5, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 11, y: 2, width: 8 }));
    this.scene.addObject(new CollisionObject(scene, { x: 4, y: 3, width: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 2, y: 4, width: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 4, y: 7, width: 6, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 11, y: 7, width: 9, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 0, y: 14, width: 5, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 25, y: 22, width: 5 }));
    this.scene.addObject(new CollisionObject(scene, { x: 0, y: 23, width: 25 }));
    // vertical
    this.scene.addObject(new CollisionObject(scene, { x: 0, y: 6, height: 6 }));
    this.scene.addObject(new CollisionObject(scene, { x: 4, y: 8, height: 6 }));
    this.scene.addObject(new CollisionObject(scene, { x: 9, y: 0, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 11, y: 0, height: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 2, height: 5 }));
    this.scene.addObject(new CollisionObject(scene, { x: 30, y: 19, height: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 31, y: 18, height: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 32, y: 0, height: 18 }));

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
            x: 40,
            y: randomY,
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

    // mission - 
    // TODO: perhaps move these into some sort of Story Controller scene object
    this.scene.addObject(new LockedDoorObject(this.scene, {
      x: 23,
      y: 1,
      onDestroy: () => {
        this.scene.addObject(new WarpObject(scene, { x: 23, y: 1, player: this.player, map: SCENE_GAME_MAP_FARM_HOUSE }))
        this.scene.addObject(new SpriteObject(scene, {
          x: 23,
          y: 1,
          tileset: TilesetHouse.id,
          spriteX: TilesetHouse.Door.Default.AlmostClosed.x,
          spriteY: TilesetHouse.Door.Default.AlmostClosed.y,
        }));
      }
    }));

    // rocks - beach town blockade
    this.scene.addObject(new RockObject(this.scene, { x: 26, y: 2, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 28, y: 1, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 31, y: 1, canBeBroken: false }));

    // rocks - beach farm blockade
    this.scene.addObject(new RockObject(this.scene, { x: 4, y: 16, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 2, y: 19, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 1, y: 22, canBeBroken: false }));

    // trees
    this.scene.addObject(new TreeObject(this.scene, { x: 1, y: 2, type: 'small' }));
    this.scene.addObject(new TreeObject(this.scene, { x: 14, y: 1, type: 'small' }));
    this.scene.addObject(new TreeObject(this.scene, { x: 16, y: 4, type: 'small' }));
    this.scene.addObject(new TreeObject(this.scene, { x: 2, y: 7, type: 'small' }));
    this.scene.addObject(new TreeObject(this.scene, { x: 25, y: 7, type: 'small' }));
    this.scene.addObject(new TreeObject(this.scene, { x: 1, y: 10, type: 'small' }));
    this.scene.addObject(new TreeObject(this.scene, { x: 13, y: 11, type: 'small' }));
    this.scene.addObject(new TreeObject(this.scene, { x: 7, y: 13, type: 'small' }));

    // quests
    QuestCollectLogs.setup(this.scene);
    QuestCollectRocks.setup(this.scene);
    QuestBreakRocks.setup(this.scene);
    QuestCollectBerries.setup(this.scene);

    // warp - farm - through the hill
    this.scene.addObject(new WarpObject(scene, {
      x: 0,
      y: 12,
      width: 1,
      height: 2,
      player: this.player,
      isColliding: true,
      map: SCENE_GAME_MAP_FARM,
      position: {
        x: Warps.World.Hill.Farm.Hill.position.x, 
        y: Warps.World.Hill.Farm.Hill.position.y,
      },
    }));

    // warp - town - through the hill
    this.scene.addObject(new WarpObject(scene, {
      x: 10,
      y: 0,
      width: 1,
      height: 1,
      player: this.player,
      map: SCENE_GAME_MAP_TOWN,
      position: {
        x: Warps.World.Hill.Town.Hill.position.x, 
        y: Warps.World.Hill.Town.Hill.position.y,
      },
    }));

    // warp - town - beach
    this.scene.addObject(new WarpObject(scene, {
      x: 27,
      y: 0,
      width: 5,
      height: 1,
      player: this.player,
      map: SCENE_GAME_MAP_TOWN,
      position: {
        x: Warps.World.Beach.Town.position.x, 
        y: Warps.World.Beach.Town.position.y,
      },
    }));

    this.scene.addObject(new WarpObject(scene, {
      x: 0,
      y: 16,
      width: 1,
      height: 7,
      player: this.player,
      map: SCENE_GAME_MAP_FARM,
      position: {
        x: Warps.World.Beach.Farm.position.x, 
        y: Warps.World.Beach.Farm.position.y,
      },
    }));
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player }));

    Warps.onMapEnter(this.scene, this.player);
  }

  onLeave(scene: Scene): void {
    this.scene.removeCustomerRenderer();
  }
}
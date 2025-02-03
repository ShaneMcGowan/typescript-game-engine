import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { SceneFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { Scene } from '@core/model/scene';
import { WarpObject } from '@game/objects/warp.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { CollisionObject } from '@game/objects/collision.object';
import { RockObject } from '@game/objects/rock.object';
import { FarmableAreaObject } from '@game/objects/areas/farmable-area.object';
import { MessageUtils } from '@game/utils/message.utils';
import { TimerObject } from '@core/objects/timer.object';
import { ItemSpawnAreaObject } from '@game/objects/areas/item-spawn-area.object';
import { ItemType } from '@game/models/inventory.model';
import { Warps } from '@game/constants/warp.constants';
import { WaterAreaObject } from '@game/objects/areas/water-area.object';
import { SCENE_GAME_MAP_HOUSE } from '../house/map';
import { hasOnNewDay } from '@game/models/components/new-day.model';

export class SCENE_GAME_MAP_FARM extends SceneMap {

  background: JsonBackgroundMap = background;

  player: PlayerObject;

  day: number = 0;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.player = new PlayerObject(this.scene, { playerIndex: 0, x: 83, y: 4, });

    this.scene.addObject(this.player);

    // areas
    // areas - farmable
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 68, y: 2, width: 2, height: 12 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 70, y: 6, width: 3, height: 3 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 70, y: 12, width: 3, height: 2 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 73, y: 6, width: 3, height: 8 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 76, y: 4, width: 5, height: 10 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 81, y: 4, width: 1, height: 10 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 82, y: 5, width: 3, height: 8 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 85, y: 4, width: 5, height: 10 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 90, y: 3, width: 3, height: 11 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 93, y: 1, width: 1, height: 13 }));

    // this.scene.addObject(new FarmableAreaObject(this.scene, { x: 65, y: 3, width: 2, height: 15 }));
    // this.scene.addObject(new FarmableAreaObject(this.scene, { x: 68, y: 1, width: 27, height: 13 }));
    // this.scene.addObject(new FarmableAreaObject(this.scene, { x: 67, y: 16, width: 17, height: 1 }));
    // this.scene.addObject(new FarmableAreaObject(this.scene, { x: 87, y: 16, width: 4, height: 1 }));
    // this.scene.addObject(new FarmableAreaObject(this.scene, { x: 67, y: 17, width: 23, height: 1 }));
    // areas - water
    this.scene.addObject(new ItemSpawnAreaObject(this.scene, { x: 63, y: 19, width: 27, height: 1, spawnableObjects: [ItemType.Log] }));
    this.scene.addObject(new ItemSpawnAreaObject(this.scene, { x: 63, y: 20, width: 26, height: 1, spawnableObjects: [ItemType.Log] }));
    this.scene.addObject(new ItemSpawnAreaObject(this.scene, { x: 63, y: 21, width: 22, height: 1, spawnableObjects: [ItemType.Log] }));
    this.scene.addObject(new ItemSpawnAreaObject(this.scene, { x: 63, y: 22, width: 19, height: 1, spawnableObjects: [ItemType.Log] }));
    // areas - water
    this.scene.addObject(new WaterAreaObject(this.scene, { x: 70, y: 9, width: 3, height: 3, }));

    // collision
    // horizontal
    this.scene.addObject(new CollisionObject(this.scene, { x: 67, y: 1, width: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 67, y: 14, width: 16, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 70, y: 5, width: 6 }))
    this.scene.addObject(new CollisionObject(this.scene, { x: 76, y: 3, width: 5 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 81, y: 0, width: 5, height: 3, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 81, y: 3, width: 2, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 84, y: 3, width: 2, }));

    this.scene.addObject(new CollisionObject(this.scene, { x: 84, y: 14, width: 16, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 86, y: 3, width: 4 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 90, y: 2, width: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 93, y: 0, width: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 94, y: 11, width: 6 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 62, y: 23, width: 20 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 82, y: 22, width: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 85, y: 21, width: 4 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 89, y: 20, width: 1 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 91, y: 16, width: 1 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 98, y: 23, width: 2 }));

    // vertical
    this.scene.addObject(new CollisionObject(this.scene, { x: 62, y: 0, height: 23 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 66, y: 0, height: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 92, y: 0, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 80, y: 0, height: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 86, y: 0, height: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 95, y: 1, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 67, y: 2, height: 12 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 70, y: 2, height: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 70, y: 9, height: 3, width: 3, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 75, y: 3, height: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 90, y: 17, height: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 94, y: 3, height: 8 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 95, y: 16, height: 5 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 96, y: 21, height: 1 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 97, y: 22, height: 1 }));

    // boundaries
    this.scene.addObject(new RockObject(this.scene, { x: 62, y: 1, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 63, y: 2, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 64, y: 3, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 65, y: 2, canBeBroken: false }));

    // warps - house
    this.scene.addObject(new WarpObject(scene, {
      x: 83,
      y: 3,
      width: 1,
      height: 1,
      player: this.player,
      map: SCENE_GAME_MAP_HOUSE,
      position: {
        x: Warps.Farm.Hill.Town.Hill.position.x,
        y: Warps.Farm.Hill.Town.Hill.position.y,
      },
      isColliding: true,
    }));

    // warps - hill - world
    this.scene.addObject(new WarpObject(scene, {
      x: 99,
      y: 12,
      width: 1,
      height: 2,
      player: this.player,
      map: SCENE_GAME_MAP_WORLD,
      position: {
        x: Warps.Farm.Hill.Town.Hill.position.x,
        y: Warps.Farm.Hill.Town.Hill.position.y,
      },
      isColliding: true,
    }));

    // warps - beach - world
    this.scene.addObject(new WarpObject(scene, {
      x: 99,
      y: 16,
      width: 1,
      height: 7,
      player: this.player,
      map: SCENE_GAME_MAP_WORLD,
      position: {
        x: Warps.Farm.Beach.Town.Beach.position.x,
        y: Warps.Farm.Beach.Town.Beach.position.y,
      },
      isColliding: true,
    }));
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player }));

    Warps.onMapEnter(this.scene, this.player);

    // run onNewDay for each day since
    while(this.day < this.scene.globals.day){
      this.day++;
      
      this.scene.objects.forEach(object => {
        if(hasOnNewDay(object)){
          object.onNewDay();
        }
      });
    }
    
    // first visit
    // TODO: only show if entering from a certain direction
    if (!this.scene.globals.flags[SceneFlag.farm_visited]) {
      this.scene.globals.flags[SceneFlag.farm_visited] = true;
      this.scene.globals.player.enabled = false;

      this.scene.addObject(new TimerObject(this.scene, {
        duration: 2,
        onComplete: () => {
          MessageUtils.showMessage(
            this.scene,
            `This must be the Farm. There is basically nothing here. This is going to be a lot of work...`
          )
        }
      }));
    }
  }

  onLeave(): void {
    this.scene.removeCustomerRenderer();
  }
}
import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { CollisionObject } from '@game/objects/collision.object';
import { WarpObject } from '@game/objects/warp.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { Warps } from '@game/constants/warp.constants';
import { FurnitureSalesmanObject } from '@game/objects/npcs/town/furniture-salesman.npc';
import { FarmingSalesmanObject } from '@game/objects/npcs/town/farming-salesman.npc';
import { ToolSalesmanObject } from '@game/objects/npcs/town/tool-salesman.npc';
import { StoryTownRockslideObject } from '@game/objects/story/town/rockslide/story';
import { LightingObject } from '@game/objects/lights/lighting.object';

export class SCENE_GAME_MAP_TOWN extends SceneMap {

  background: JsonBackgroundMap = background;

  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.player = new PlayerObject(scene, { playerIndex: 0, x: 6, y: 20, });
    
    this.scene.addObject(this.player);

    this.scene.addObject(new LightingObject(scene, { enabled: true, timeBased: true }));

    // npcs
    this.scene.addObject(new FurnitureSalesmanObject(scene, { x: 8, y: 22 }));
    this.scene.addObject(new FarmingSalesmanObject(scene, { x: 4, y: 24 }));
    this.scene.addObject(new ToolSalesmanObject(scene, { x: 8, y: 27 }));

    // story
    this.scene.addObject(new StoryTownRockslideObject(scene, { x: 0, y: 0 }));

    // collision - horizontal
    this.scene.addObject(new CollisionObject(scene, { x: 0, y: 14, width: 5 }));
    this.scene.addObject(new CollisionObject(scene, { x: 2, y: 11, width: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 2, y: 38, width: 5 }));
    this.scene.addObject(new CollisionObject(scene, { x: 3, y: 19, width: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 4, y: 10, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 8, y: 14, width: 12 }));    
    this.scene.addObject(new CollisionObject(scene, { x: 5, y: 9, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 6, y: 8, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 7, y: 7, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 7, y: 39, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 8, y: 6, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 8, y: 19, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 9, y: 5, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 12, y: 4, width: 20 }));
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 31, width: 5 }));
    this.scene.addObject(new CollisionObject(scene, { x: 24, y: 32, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 27, y: 33, width: 5 }));

    // collision - vertical
    this.scene.addObject(new CollisionObject(scene, { x: 0, y: 36 }));
    this.scene.addObject(new CollisionObject(scene, { x: 0, y: 27, height: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 1, y: 11, height: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 1, y: 22, height: 5 }));
    this.scene.addObject(new CollisionObject(scene, { x: 1, y: 28 }));
    this.scene.addObject(new CollisionObject(scene, { x: 1, y: 33, height: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 1, y: 37 }));
    this.scene.addObject(new CollisionObject(scene, { x: 2, y: 19, height: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 2, y: 29, height: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 5, y: 12, height: 8 }));
    this.scene.addObject(new CollisionObject(scene, { x: 7, y: 12, height: 8 }));
    this.scene.addObject(new CollisionObject(scene, { x: 11, y: 19, height: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 11, y: 39 }));
    this.scene.addObject(new CollisionObject(scene, { x: 12, y: 22, height: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 12, y: 29, height: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 12, y: 36, height: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 13, y: 24, height: 5 }));
    this.scene.addObject(new CollisionObject(scene, { x: 13, y: 31, height: 5 }));
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 14, height: 26 }));
    this.scene.addObject(new CollisionObject(scene, { x: 32, y: 4, height: 36 }));

    // warps
    // bottom of map, warp to farm
    this.scene.addObject(new WarpObject(scene, { 
      player: this.player, 
      map: SCENE_GAME_MAP_WORLD, 
      x: 10, 
      y: 39,
      position: {
        x: Warps.Town.Hill.World.Hill.position.x,
        y: Warps.Town.Hill.World.Hill.position.y,
      } 
    }));

    this.scene.addObject(new WarpObject(scene, { 
      player: this.player, 
      map: SCENE_GAME_MAP_WORLD, 
      x: 20, 
      y: 39, 
      width: 12,
      position: {
        x: Warps.Town.Beach.World.Beach.position.x,
        y: Warps.Town.Beach.World.Beach.position.y,
      }
    }));
  }

  onEnter(scene: SCENE_GAME): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player }));

    Warps.onMapEnter(scene, this.player);
  }

  onLeave(): void {
    this.scene.removeCustomerRenderer();
  }
}

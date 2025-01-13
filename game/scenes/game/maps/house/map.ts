import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { WarpObject } from '@game/objects/warp.object';
import { CollisionObject } from '@game/objects/collision.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { JsonBackgroundMap } from '@core/model/background';
import * as background from './background.json'
import { FurnitureWallAreaObject } from '@game/objects/areas/furniture-wall.object';
import { FurnitureFloorAreaObject } from '@game/objects/areas/furniture-floor.object';
import { FurnitureLampObject } from '@game/objects/furniture/item/furniture-lamp.object';
import { LightObject } from '@game/objects/lights/light.object';

export class SCENE_GAME_MAP_HOUSE extends SceneMap {

  background: JsonBackgroundMap = background;

  private player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.flags.suspend = true;

    // player
    this.player = new PlayerObject(scene, { playerIndex: 0, x: 16, y: 10, });
    this.scene.addObject(this.player);

    for(let x = 0; x < 2; x++){
      for(let y = 0; y < 2; y++){
        this.scene.addObject(new FurnitureLampObject(this.scene, { x: 13 + (x * 3), y: 7 + (y * 2), active: true, }));
      }
    }

    // walls
    // top
    this.scene.addObject(new CollisionObject(scene, { x: 11, y: 6, width: 10 }));
    // left
    this.scene.addObject(new CollisionObject(scene, { x: 11, y: 7, height: 5 }));
    // right
    this.scene.addObject(new CollisionObject(scene, { x: 20, y: 7, height: 5 }));
    // bottom
    this.scene.addObject(new CollisionObject(scene, { x: 11, y: 12, width: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 17, y: 12, width: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 15, y: 13, width: 2 }));

    // areas
    this.scene.addObject(new FurnitureWallAreaObject(scene, { x: 12, y: 6, width: 8 }));
    this.scene.addObject(new FurnitureFloorAreaObject(scene, { x: 12, y: 7, width: 8, height: 5 }));

    // lighting
    this.scene.addObject(new LightObject(scene, { x: 0, y: 0,}));

    // exit door
    const warpConfig = {
      y: 12,
      player: this.player,
      map: SCENE_GAME_MAP_WORLD,
      width: 1,
      isColliding: true,
    };

    this.scene.addObject(new WarpObject(scene, {
      ...warpConfig,
      x: 15
    }));
    this.scene.addObject(new WarpObject(scene, {
      ...warpConfig,
      x: 16
    }));
  }

  onEnter(): void {
  }

  onLeave(): void {
  }

}
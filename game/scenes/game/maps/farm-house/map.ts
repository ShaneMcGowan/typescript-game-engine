import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { SceneFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { WarpObject } from '@game/objects/warp.object';
import { CollisionObject } from '@game/objects/collision.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { JsonBackgroundMap } from '@core/model/background';
import * as background from './background.json'
import { FarmerObject } from '@game/objects/npcs/farm-house/farmer.npc';
import { FurnitureBedObject } from '@game/objects/furniture/item/furniture-bed.object';
import { FurnitureLampObject } from '@game/objects/furniture/item/furniture-lamp.object';
import { Warps } from '@game/constants/warp.constants';
import { StoryFarmHouseBedroomDoorLockedObject } from '@game/objects/story/farm-house/bedroom-door-locked/story';
import { ChestObject } from '@game/objects/world-objects/chest.object';
import { ItemType } from '@game/models/inventory.model';
import { FarmersSonObject } from '@game/objects/npcs/farm-house/farmers-son.npc';

export class SCENE_GAME_MAP_FARM_HOUSE extends SceneMap {

  background: JsonBackgroundMap = background;
  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);
    this.flags.suspend = true;

    // player
    this.player = new PlayerObject(scene, { playerIndex: 0, x: 16, y: 12, });
    this.scene.addObject(this.player);

    // npcs
    this.scene.addObject(new FarmerObject(scene, { x: 11, y: 9, }));
    this.scene.addObject(new FarmersSonObject(this.scene, { x: 17, y: 9 }));

    // stories
    this.scene.addObject(new StoryFarmHouseBedroomDoorLockedObject(scene, { }))

    // collision - vertical - sort by y
    this.scene.addObject(new CollisionObject(scene, { x: 8, y: 3, width: 16 }));
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 4, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 9, y: 7, width: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 7, width: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 10, y: 8, width: 1 }));
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 9, width: 3 }));
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 10, width: 3 }));

    // collision - horizontal - sort by x
    this.scene.addObject(new CollisionObject(scene, { x: 8, y: 12, width: 7 }));
    this.scene.addObject(new CollisionObject(scene, { x: 17, y: 12, width: 7 }));
    this.scene.addObject(new CollisionObject(scene, { x: 15, y: 13, width: 2 }));
    this.scene.addObject(new CollisionObject(scene, { x: 8, y: 4, height: 8 }));
    this.scene.addObject(new CollisionObject(scene, { x: 14, y: 4, height: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 17, y: 4, height: 4 }));
    this.scene.addObject(new CollisionObject(scene, { x: 23, y: 4, height: 8 }));

    // warps
    this.scene.addObject(new WarpObject(scene, {
      x: 15,
      y: 12,
      width: 2,
      height: 1,
      player: this.player,
      map: SCENE_GAME_MAP_WORLD,
      isColliding: true,
      position: {
        x: Warps.FarmHouse.Door.World.House.position.x,
        y: Warps.FarmHouse.Door.World.House.position.y,
      }
    }));

    // furniture - sorted by y then x
    this.scene.addObject(new FurnitureLampObject(scene, { x: 9, y: 4 }));
    this.scene.addObject(new FurnitureBedObject(scene, { x: 10, y: 4, canSave: true, }));
    this.scene.addObject(new FurnitureBedObject(scene, { x: 21, y: 4, canSave: true, onSave: () => { this.scene.setFlag(SceneFlag.slept_in_farm_house_bed, true); } }));
    this.scene.addObject(new FurnitureLampObject(scene, { x: 22, y: 4 }));
    this.scene.addObject(new FurnitureLampObject(scene, { x: 15, y: 5 }));

    // farmer's chest
    const farmersChest = new ChestObject(scene, { x: 12, y: 4, player: this.player})
    farmersChest.inventory.addToInventory(ItemType.Chicken);
    this.scene.addObject(farmersChest);
  }

  onEnter(): void {
    // this.scene.globals.player.actionsEnabled = false;
  }

  onLeave(): void {
    // this.scene.globals.player.actionsEnabled = true;
  }

}
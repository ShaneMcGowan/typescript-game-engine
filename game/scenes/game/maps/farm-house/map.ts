import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { WarpObject } from '@game/objects/warp.object';
import { CollisionObject } from '@game/objects/collision.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { JsonBackgroundMap } from '@core/model/background';
import * as background from './background.json'
import { FarmerObject } from '@game/objects/world/npcs/farmer.npc';

export class SCENE_GAME_MAP_FARM_HOUSE extends SceneMap {

  background: JsonBackgroundMap = background;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.flags.suspend = true;

    // Set up UI
    MouseUtils.setCursor(this.scene.displayContext.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png'); // TODO: remove this when no longer debugging as it will be set in start menu map

    // player
    let player = new PlayerObject(scene, { playerIndex: 0, x: 16, y: 12, });
    // NPCS
    this.scene.addObject(player);
    this.scene.addObject(new FarmerObject(scene, { x: 16, y: 8, }));

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

    // exit door
    const warpConfig = {
      y: 12,
      player: player,
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
    this.scene.globals.player.actionsEnabled = false;
  }

  onLeave(): void {
    this.scene.globals.player.actionsEnabled = true;
  }

}
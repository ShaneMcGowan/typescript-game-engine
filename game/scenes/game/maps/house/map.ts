import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { SceneFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { WarpObject } from '@game/objects/warp.object';
import { CollisionObject } from '@game/objects/collision.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { JsonBackgroundMap } from '@core/model/background';
import * as background from './background.json'
import { FurnitureWallAreaObject } from '@game/objects/areas/furniture-wall.object';
import { FurnitureFloorAreaObject } from '@game/objects/areas/furniture-floor.object';
import { FurnitureLampObject } from '@game/objects/furniture/item/furniture-lamp.object';
import { LightingObject } from '@game/objects/lights/lighting.object';
import { TimerObject } from '@core/objects/timer.object';
import { MessageUtils } from '@game/utils/message.utils';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { TransitionObject } from '@core/objects/transition.object';
import { SCENE_GAME_MAP_FARM } from '@game/scenes/game/maps/farm/map';
import { Warps } from '@game/constants/warp.constants';

export class SCENE_GAME_MAP_HOUSE extends SceneMap {

  background: JsonBackgroundMap = background;

  private player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.flags.suspend = true;

    // player
    this.player = new PlayerObject(scene, { playerIndex: 0, x: 16, y: 12, });
    this.scene.addObject(this.player);

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
    this.scene.addObject(new LightingObject(scene, { enabled: true, timeBased: false }));

    // warp - door
    this.scene.addObject(new WarpObject(scene, {
      x: 15,
      y: 12,
      width: 2,
      height: 1,
      player: this.player,
      map: SCENE_GAME_MAP_FARM,
      position: {
        x: Warps.House.Door.Farm.House.position.x,
        y: Warps.House.Door.Farm.House.position.y,
      },
      isColliding: true,
    }));
  }

  onEnter(): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player }));

    MessageUtils.showToast(this.scene, `My Home`);

    // fade in
    const transitionLength = 2;
    this.scene.addObject(new TransitionObject(this.scene, {
      animationCenterX: this.player.transform.position.world.x + (this.player.width / 2),
      animationCenterY: this.player.transform.position.world.y + (this.player.height / 2),
      animationType: 'circle',
      animationLength: transitionLength,
    }));

    // first visit
    if (!this.scene.globals.flags[SceneFlag.house_visited]) {
      this.scene.globals.flags[SceneFlag.house_visited] = true;
      this.scene.globals.player.enabled = false;

      this.scene.addObject(new TimerObject(this.scene, {
        duration: transitionLength,
        onComplete: () => {
          MessageUtils.showMessage(
            this.scene,
            `So this is my new home. This place is quite dark and depressing... I need to decorate.`
          )
        }
      }));
    }
  }

  onLeave(): void {
  }

}
import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { SceneFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { TransitionObject } from '@core/objects/transition.object';
import { JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { IconsObject } from '@game/objects/icons/icons.object';
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

export class SCENE_GAME_MAP_FARM extends SceneMap {

  background: JsonBackgroundMap = background;

  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.scene.addObject(new IconsObject(this.scene, { x: 0, y: 0 }));
    this.player = new PlayerObject(this.scene, { playerIndex: 0, x: 99, y: 12, });

    this.scene.addObject(this.player);

    // areas
    // areas - farmable
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 65, y: 3, width: 2, height: 15 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 68, y: 1, width: 27, height: 13 }));

    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 67, y: 16, width: 17, height: 2 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 84, y: 17, width: 3, height: 1 }));
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 87, y: 16, width: 6, height: 2 }));
    // areas - 
    this.scene.addObject(new ItemSpawnAreaObject(this.scene, { x: 63, y: 19, width: 30, height: 4, spawnableObjects: [ItemType.Log] }));

    // collision
    // horizontal
    this.scene.addObject(new CollisionObject(this.scene, { x: 67, y: 1, width: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 67, y: 14, width: 18, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 70, y: 5, width: 6 }))
    this.scene.addObject(new CollisionObject(this.scene, { x: 76, y: 3, width: 5 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 81, y: 1, width: 5 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 86, y: 14, width: 15, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 86, y: 3, width: 4 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 90, y: 2, width: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 93, y: 0, width: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 94, y: 11, width: 6 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 62, y: 23, width: 38 }));

    // vertical
    this.scene.addObject(new CollisionObject(this.scene, { x: 62, y: 0, height: 23 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 66, y: 0, height: 3 }));

    this.scene.addObject(new CollisionObject(this.scene, { x: 92, y: 0, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 80, y: 1, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 86, y: 1, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 95, y: 1, height: 2 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 67, y: 2, height: 12 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 70, y: 2, height: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 75, y: 3, height: 3 }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 94, y: 3, height: 8 }));


    // boundaries
    this.scene.addObject(new RockObject(this.scene, { x: 62, y: 1, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 63, y: 2, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 64, y: 3, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 65, y: 2, canBeBroken: false }));

    this.scene.addObject(new RockObject(this.scene, { x: 92, y: 16, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 91, y: 17, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 92, y: 18, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 93, y: 19, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 93, y: 20, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 94, y: 21, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 93, y: 22, canBeBroken: false }));
    this.scene.addObject(new RockObject(this.scene, { x: 94, y: 23, canBeBroken: false }));

    // warp
    // warps
    const WARP_CONFIG_FARM = {
      x: 99,
      player: this.player,
      map: SCENE_GAME_MAP_WORLD,
      width: 1,
      height: 1,
      isColliding: true,
    };
    this.scene.addObject(new WarpObject(scene, {
      ...WARP_CONFIG_FARM,
      y: 12
    }));
    this.scene.addObject(new WarpObject(scene, {
      ...WARP_CONFIG_FARM,
      y: 13
    }));
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player }));

    // fade in
    const transitionLength = 2;
    this.scene.addObject(new TransitionObject(this.scene, {
      animationCenterX: this.player.transform.position.world.x + (this.player.width / 2),
      animationCenterY: this.player.transform.position.world.y + (this.player.height / 2),
      animationType: 'circle',
      animationLength: transitionLength,
    }));

    // first visit
    if (!this.scene.globals.flags[SceneFlag.farm_visited]) {
      this.scene.globals.flags[SceneFlag.farm_visited] = true;
      this.scene.globals.player.enabled = false;

      this.scene.addObject(new TimerObject(this.scene, {
        duration: transitionLength,
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
import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { TransitionObject } from '@core/objects/transition.object';
import { CollisionObject } from '@game/objects/collision.object';
import { WarpObject } from '@game/objects/warp.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { Scene } from '@core/model/scene';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';

export class SCENE_GAME_MAP_TOWN extends SceneMap {

  background: JsonBackgroundMap = background;

  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.player = new PlayerObject(scene, { playerIndex: 0, x: 1, y: 36, });
    this.scene.addObject(this.player);

    // scene init
    this.scene.addObject(new TransitionObject(scene, {
      animationType: 'circle',
      animationLength: 7,
      animationCenterX: this.player.transform.position.world.x + 0.5,
      animationCenterY: this.player.transform.position.world.y + 0.5
    }));

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
    this.scene.addObject(new CollisionObject(scene, { x: 32, y: 4, height: 36 }));
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 14, height: 26 }));

    // warps
    // bottom of map, warp to farm
    this.scene.addObject(new WarpObject(scene, { 
      player: this.player, 
      map: SCENE_GAME_MAP_WORLD, 
      x: 10, 
      y: 39, 
    }));
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player }));
  }

  onLeave(): void {
    this.scene.removeCustomerRenderer();
  }
}

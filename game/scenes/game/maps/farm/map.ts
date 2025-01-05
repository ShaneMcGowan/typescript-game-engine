import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { TransitionObject } from '@core/objects/transition.object';
import { JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { IconsObject } from '@game/objects/icons/icons.object';
import { Scene } from '@core/model/scene';
import { WarpObject } from '@game/objects/warp.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';

export class SCENE_GAME_MAP_FARM extends SceneMap {

  background: JsonBackgroundMap = background;

  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.scene.addObject(new IconsObject(this.scene, { x: 0, y: 0 }));
    this.player = new PlayerObject(this.scene, { playerIndex: 0, x: 90, y: 10, });

    this.scene.addObject(this.player);

    // warp
     // warps
     const WARP_CONFIG_FARM = {
      x: 99,
      player: this.player,
      map: SCENE_GAME_MAP_WORLD,
      width: 1,
      height: 3,
      isColliding: true,
    };
    this.scene.addObject(new WarpObject(scene, {
      ...WARP_CONFIG_FARM,
      y: 12
    }));
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player }));

    // fade in
    this.scene.addObject(new TransitionObject(scene, {
      animationCenterX: this.player.transform.position.world.x + (this.player.width / 2),
      animationCenterY: this.player.transform.position.world.y + (this.player.height / 2),
      animationType: 'circle',
      animationLength: 2,
    }));
  }

  onLeave(): void {
    this.scene.removeCustomerRenderer();
  }
}
import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { type JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { type Scene } from '@core/model/scene';
import { MovementType, NpcObject } from '@game/objects/npc.object';
import { CollisionObject } from '@game/objects/collision.object';

export class SCENE_GAME_MAP_TEST_PATHING_3 extends SceneMap {
  // config
  background: JsonBackgroundMap = background;

  // state
  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    // instanciate objects
    this.player = new PlayerObject(this.scene, { playerIndex: 0, x: 14, y: 9, });
    this.scene.addObject(this.player);

    // npcs
    this.scene.addObject(new NpcObject(
      this.scene,
      {
        x: 30,
        y: 1,
        movementType: MovementType.Follow,
        follows: this.player,
      }
    ));

    // collisions - container
    this.scene.addObject(new CollisionObject(this.scene, { x: 0, y: 0, width: 32, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 0, y: 17, width: 32, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 0, y: 1, height: 16, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 31, y: 1, height: 16, }));

    // collisions - blocking
    for (let x = 0; x < 32; x += 2) {
      for (let y = 0; y < 18; y += 2) {
        this.scene.addObject(new CollisionObject(this.scene, { x, y, }));
      }
    }
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player, }));
  }

  onLeave(scene: Scene): void {
    this.scene.removeCustomerRenderer();
  }
}

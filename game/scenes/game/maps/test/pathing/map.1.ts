import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { type JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { type Scene } from '@core/model/scene';
import { MovementType, NpcObject } from '@game/objects/npc.object';
import { CollisionObject } from '@game/objects/collision.object';

export class SCENE_GAME_MAP_TEST_PATHING_1 extends SceneMap {
  // config
  background: JsonBackgroundMap = background;

  // state
  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    // instanciate objects
    this.player = new PlayerObject(this.scene, { playerIndex: 0, x: 2, y: 16, });
    this.scene.addObject(this.player);

    // npcs
    this.scene.addObject(new NpcObject(this.scene, { x: 7, y: 1, goal: { x: 2, y: 16, }, movementType: MovementType.Goal, }));
    this.scene.addObject(new NpcObject(this.scene, { x: 15, y: 1, goal: { x: 2, y: 16, }, movementType: MovementType.Goal, }));
    this.scene.addObject(new NpcObject(this.scene, { x: 30, y: 1, goal: { x: 2, y: 16, }, movementType: MovementType.Goal, }));

    // collisions - container
    this.scene.addObject(new CollisionObject(this.scene, { x: 0, y: 0, width: 32, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 0, y: 17, width: 32, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 0, y: 1, height: 16, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 31, y: 1, height: 16, }));

    // collisions - blocking
    this.scene.addObject(new CollisionObject(this.scene, { x: 3, y: 2, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 5, y: 1, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 7, y: 2, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 9, y: 1, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 11, y: 2, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 13, y: 1, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 15, y: 2, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 17, y: 1, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 19, y: 2, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 21, y: 1, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 23, y: 2, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 25, y: 1, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 27, y: 2, height: 15, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 29, y: 1, height: 15, }));
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player, }));
  }

  onLeave(scene: Scene): void {
    this.scene.removeCustomerRenderer();
  }
}

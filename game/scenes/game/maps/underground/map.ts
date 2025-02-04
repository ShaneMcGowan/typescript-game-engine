import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { TransitionObject } from '@core/objects/transition.object';
import { CollisionObject } from '@game/objects/collision.object';
import { WarpObject } from '@game/objects/warp.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { UndergroundIntroStoryControllerObject } from '@game/objects/underground/underground-intro.story';
import { MessageUtils } from '@game/utils/message.utils';
import { Scene } from '@core/model/scene';

export class SCENE_GAME_MAP_UNDERGROUND extends SceneMap {

  background: JsonBackgroundMap = background;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    const player = new PlayerObject(scene, { playerIndex: 0, x: 15, y: 8, });
    this.scene.addObject(player);

    // scene init
    this.scene.addObject(new TransitionObject(scene, {
      animationType: 'circle',
      animationLength: 7,
      animationCenterX: player.transform.position.world.x + 0.5,
      animationCenterY: player.transform.position.world.y + 0.5
    }));
    this.scene.addObject(new UndergroundIntroStoryControllerObject(this.scene, { player }))

    // collision
    // top
    this.scene.addObject(new CollisionObject(scene, { x: 12, y: 5, width: 6 }))
    // bottom
    this.scene.addObject(new CollisionObject(scene, { x: 12, y: 12, width: 8 }))
    // left
    this.scene.addObject(new CollisionObject(scene, { x: 12, y: 5, height: 8 }))
    // right
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 5, height: 8 }))

    // collision - ladder
    this.scene.addObject(new CollisionObject(scene, { x: 17, y: 0, height: 5 }))
    this.scene.addObject(new CollisionObject(scene, { x: 19, y: 0, height: 5 }))

    // exit
    this.scene.addObject(new WarpObject(scene, { player, map: SCENE_GAME_MAP_WORLD, x: 18, y: 0, }));
  }

  onEnter(scene: Scene): void {
    MessageUtils.showToast(this.scene, `Somewhere underground...`);
  }
}

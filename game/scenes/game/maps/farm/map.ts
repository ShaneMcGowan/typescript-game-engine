import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { TransitionObject } from '@core/objects/transition.object';
import { JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { IconsObject } from '@game/objects/icons/icons.object';
import { Scene } from '@core/model/scene';

export class SCENE_GAME_MAP_FARM extends SceneMap {

  background: JsonBackgroundMap = background;

  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.scene.addObject(new IconsObject(this.scene, { positionX: 0, positionY: 0 }));
    this.player = new PlayerObject(this.scene, {playerIndex: 0, positionX: 17, positionY: 13, });

    this.scene.addObject(this.player);
  }

  onEnter(scene: Scene): void {
    // fade in
    this.scene.addObject(new TransitionObject(scene, {
      animationCenterX: this.player.transform.position.world.x + (this.player.width / 2),
      animationCenterY: this.player.transform.position.world.y + (this.player.height / 2),
      animationType: 'circle',
      animationLength: 2,
    }));
  }
}
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from '@game/objects/player.object';
import { TimerObject } from '@core/objects/timer.object';
import { TransitionObject } from '@core/objects/transition.object';
import { SCENE_GAME_MAP_WORLD } from '@game/scenes/game/maps/world/map';
import { SCENE_GAME } from '@game/scenes/game/scene';

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
}

export class WarpObject extends SceneObject {
  private readonly player: PlayerObject;
  private isWarping: boolean = false;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.player = config.player;
  }

  update(delta: number): void {
    if (this.isWarping) {
      return;
    }

    if (this.transform.position.x !== this.player.positionX || this.transform.position.y !== this.player.positionY) {
      return;
    }

    // disable input
    this.scene.globals.disable_player_inputs = true;

    this.isWarping = true;

    let duration = 1.5;
    this.scene.addObject(
      new TimerObject(this.scene, {
        duration,
        onComplete: () => {
          // enable input
          this.scene.globals.disable_player_inputs = false;
          this.scene.changeMap(SCENE_GAME_MAP_WORLD);
        },
      })
    );
    this.scene.addObject(
      new TransitionObject(this.scene, {
        animationType: 'circle',
        animationDirection: 'out',
        animationCenterX: this.transform.position.x,
        animationCenterY: this.transform.position.y,
        animationLength: duration,
      })
    );
  }

  destroy(): void {

  }
}

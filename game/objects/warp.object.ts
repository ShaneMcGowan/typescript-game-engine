import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from '@game/objects/player.object';
import { TimerObject } from '@core/objects/timer.object';
import { TransitionObject } from '@core/objects/transition.object';
import { SCENE_GAME } from '@game/scenes/game/scene';
import { SceneMapConstructorSignature } from '@core/model/scene-map';

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
  map: SceneMapConstructorSignature;
}

export class WarpObject extends SceneObject {
  private readonly player: PlayerObject;
  private readonly map: SceneMapConstructorSignature;

  private isWarping: boolean = false;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.player = config.player;
    this.map = config.map;
  }

  onUpdate(delta: number): void {
    if (this.isWarping) {
      return;
    }

    if (this.transform.position.world.x !== this.player.transform.position.world.x || this.transform.position.world.y !== this.player.transform.position.world.y) {
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
          this.scene.flagForMapChange(this.map);
        },
      })
    );
    this.scene.addObject(
      new TransitionObject(this.scene, {
        animationType: 'circle',
        animationDirection: 'out',
        animationCenterX: this.transform.position.world.x,
        animationCenterY: this.transform.position.world.y,
        animationLength: duration,
      })
    );
  }
 
}

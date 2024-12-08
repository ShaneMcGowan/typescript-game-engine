import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { PlayerObject } from '@game/objects/player.object';
import { TransitionObject } from '@core/objects/transition.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { TimerObject } from '@core/objects/timer.object';
import { SCENE_GAME_MAP_UNDERGROUND } from '@game/scenes/game/maps/underground/map';
import { ObjectFilter } from '@core/model/scene';

interface Config extends SceneObjectBaseConfig {
}

export class HoleObject extends SceneObject {
  private playerConsumed: boolean = false;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
  }

  onUpdate(delta: number): void {
    // the hole consumes
    const filter: ObjectFilter = {
      boundingBox: this.boundingBox.world,
      objectIgnore: new Map([
        [this, true]
      ])
    };
    let objects = this.scene.getObjects(filter);
    if (objects.length === 1) {
      return;
    }

    objects.forEach(o => {
      // if player, change map
      if (o instanceof PlayerObject) {
        if (this.playerConsumed) {
          return;
        }

        this.scene.globals.disable_player_inputs = true;

        let duration = 2;
        this.scene.addObject(new TimerObject(this.scene, {
          duration,
          onComplete: () => {
            this.scene.globals.disable_player_inputs = false;
            this.scene.flagForMapChange(SCENE_GAME_MAP_UNDERGROUND);
          },
        }));

        this.scene.addObject(new TransitionObject(this.scene, {
          animationType: 'circle',
          animationDirection: 'out',
          animationCenterX: this.transform.position.local.x,
          animationCenterY: this.transform.position.local.y,
          animationLength: duration,
        }));

        this.playerConsumed = true;
        return;
      }

      // otherwise remove object from scene
      this.destroy();
    });
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderCircle(
      context,
      this.transform.position.local.x,
      this.transform.position.local.y
    );
  }
}

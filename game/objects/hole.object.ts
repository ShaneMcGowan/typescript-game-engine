import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { Interactable } from '@game/models/components/interactable.model';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MessageUtils } from '@game/utils/message.utils';

interface Config extends SceneObjectBaseConfig {
}

export class HoleObject extends SceneObject implements Interactable {

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderCircle(
      context,
      this.boundingBox.world.left,
      this.boundingBox.world.top,
      {
        width: 0.5
      }
    );
  }

  interact(): void {
    MessageUtils.showMessage(
      this.scene,
      `It's a hole in the ground, I'd better not fall in. I can plant things here.`,
    );
  }
}

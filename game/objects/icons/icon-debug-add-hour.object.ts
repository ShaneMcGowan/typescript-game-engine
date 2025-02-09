import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { IconObject } from './icon.object';
import { Assets } from '@core/utils/assets.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { TilesetBasic } from '@game/constants/tilesets/basic.tileset';

interface Config extends SceneObjectBaseConfig {
}

export class IconDebugAddHourObject extends IconObject {
  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
  }

  onRender(context: CanvasRenderingContext2D): void {
    if (!this.enabled) {
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      TilesetBasic.Plus.White.Default.x,
      TilesetBasic.Plus.White.Default.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetBasic.Plus.White.Default.width,
      TilesetBasic.Plus.White.Default.height
    );
  }

  onClick(): void {
    this.scene.newDay();
  }
}

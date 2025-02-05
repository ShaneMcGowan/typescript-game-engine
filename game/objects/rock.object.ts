import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { Assets } from '@core/utils/assets.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { TilesetGrassBiome } from '@game/constants/tilesets/grass-biome.tileset';
import { type Interactable } from '@game/models/components/interactable.model';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MessageUtils } from '@game/utils/message.utils';

const CAN_BE_BROKEN_DEFAULT: boolean = true;

interface Config extends SceneObjectBaseConfig {
  canBeBroken?: boolean;
}

export class RockObject extends SceneObject implements Interactable {
  canBeBroken: boolean;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.enabled = true;

    this.canBeBroken = config.canBeBroken ?? CAN_BE_BROKEN_DEFAULT;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetGrassBiome.id],
      TilesetGrassBiome.Rock.Default.Dry.x,
      TilesetGrassBiome.Rock.Default.Dry.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetGrassBiome.Rock.Default.Dry.width,
      TilesetGrassBiome.Rock.Default.Dry.height
    );
  }

  interact(): void {
    this.scene.globals.player.enabled = false;

    const text = this.canBeBroken
      ? 'This rock is too tough to break by hand, maybe if I used a Pickaxe...'
      : 'This rock looks too tough to be broken, even with a pickaxe.';

    MessageUtils.showMessage(
      this.scene,
      text
    );
  }
}

import { type ObjectFilter } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { PlayerObject } from './player.object';
import { Assets } from '@core/utils/assets.utils';
import { TilesetWoodenBridge } from '@game/constants/tilesets/wooden-bridge.tileset';

interface Config extends SceneObjectBaseConfig {
  onReachingTop: () => void;
}

export class LadderObject extends SceneObject {
  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
  }

  onUpdate(delta: number): void {
    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        this.transform.position.world.x,
        this.transform.position.world.y,
        this.width,
        this.height - 1
      ),
      typeMatch: [PlayerObject],
    };

    const player = this.scene.getObject(filter) as (PlayerObject | undefined);
    if (player === undefined) {
      return;
    }

    player.targetX = this.transform.position.world.x;
    player.targetY = this.transform.position.world.y;

    if (player.isMoving) {
      return;
    }

    this.scene.globals.player.enabled = true;

    // at top of ladder, do callback
    this.config.onReachingTop();
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetWoodenBridge.id],
      TilesetWoodenBridge.Vertical.Default.Top.x,
      TilesetWoodenBridge.Vertical.Default.Top.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetWoodenBridge.Vertical.Default.Top.width,
      TilesetWoodenBridge.Vertical.Default.Top.height,
      {
        type: 'tile',
      }
    );

    for (let y = this.boundingBox.world.top + 1; y < this.boundingBox.world.bottom - 1; y++) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetWoodenBridge.id],
        TilesetWoodenBridge.Vertical.Default.Middle.x,
        TilesetWoodenBridge.Vertical.Default.Middle.y,
        this.transform.position.world.x,
        y,
        TilesetWoodenBridge.Vertical.Default.Middle.width,
        TilesetWoodenBridge.Vertical.Default.Middle.height,
        {
          type: 'tile',
        }
      );
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetWoodenBridge.id],
      TilesetWoodenBridge.Vertical.Default.Bottom.x,
      TilesetWoodenBridge.Vertical.Default.Bottom.y,
      this.transform.position.world.x,
      this.boundingBox.world.bottom - 1,
      TilesetWoodenBridge.Vertical.Default.Bottom.width,
      TilesetWoodenBridge.Vertical.Default.Bottom.height,
      {
        type: 'tile',
      }
    );
  }
}

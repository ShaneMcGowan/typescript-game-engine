import { SceneObjectBaseConfig } from "@core/model/scene-object";
import { DAYS_PER_SEASON, SCENE_GAME } from "@game/scenes/game/scene";
import { IconObject } from "./icon.object";
import { Assets } from "@core/utils/assets.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { TilesetBasic } from "@game/constants/tilesets/basic.tileset";

interface Config extends SceneObjectBaseConfig {
}

export class IconDebugNewSeasonObject extends IconObject {

  constructor(protected scene: SCENE_GAME, config: Config){
    super(scene, config);
  }
  
  onRender(context: CanvasRenderingContext2D): void {
    if(!this.enabled){
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      TilesetBasic.ArrowRight.White.Default.x,
      TilesetBasic.ArrowRight.White.Default.y,
      this.transform.position.world.x - 0.25,
      this.transform.position.world.y,
      TilesetBasic.ArrowRight.White.Default.width,
      TilesetBasic.ArrowRight.White.Default.height
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      TilesetBasic.ArrowRight.White.Default.x,
      TilesetBasic.ArrowRight.White.Default.y,
      this.transform.position.world.x + 0.25,
      this.transform.position.world.y,
      TilesetBasic.ArrowRight.White.Default.width,
      TilesetBasic.ArrowRight.White.Default.height
    );
  }
  
  onClick(): void {
    for(let i = 0; i < DAYS_PER_SEASON; i++){
      this.scene.newDay();
    };
  }

}
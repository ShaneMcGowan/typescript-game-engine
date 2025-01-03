import { SceneObjectBaseConfig } from "@core/model/scene-object";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { MenuObject } from "../menu/menu.object";
import { IconObject } from "./icon.object";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { Assets } from "@core/utils/assets.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { TilesetBasic } from "@game/constants/tilesets/basic.tileset";

interface Config extends SceneObjectBaseConfig {
}

export class IconMenuObject extends IconObject {

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
      TilesetBasic.Cog.Darker.Default.x,
      TilesetBasic.Cog.Darker.Default.y,
      this.transform.position.world.x - CanvasConstants.TILE_PIXEL_SIZE,
      this.transform.position.world.y - CanvasConstants.TILE_PIXEL_SIZE,
      TilesetBasic.Cog.Darker.Default.width,
      TilesetBasic.Cog.Darker.Default.height
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      TilesetBasic.Cog.Dark.Default.x,
      TilesetBasic.Cog.Dark.Default.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetBasic.Cog.Dark.Default.width,
      TilesetBasic.Cog.Dark.Default.height
    );
  }
  
  onClick(): void {
    this.scene.addObject(
      new MenuObject(this.scene, {
        positionX: 0,
        positionY: 0,
      })
    );
  }

}
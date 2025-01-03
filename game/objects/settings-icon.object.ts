import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { Assets } from "@core/utils/assets.utils";
import { Input, MouseKey } from "@core/utils/input.utils";
import { MouseUtils } from "@core/utils/mouse.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { TilesetBasic } from "@game/constants/tilesets/basic.tileset";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { MenuObject } from "./menu/menu.object";

interface Config extends SceneObjectBaseConfig {
}

export class SettingsIconObject extends SceneObject {
  width: number = 1;
  height: number = 1;

  constructor(protected scene: SCENE_GAME, config: Config){
    super(scene, config);

    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
  }

  onUpdate(delta: number): void {
    this.onClick();
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

  get enabled(): boolean {
    return this.scene.globals.player.enabled;
  }

  private onClick(): void {
    if(!this.enabled){
      return;
    }

    if(!MouseUtils.isMouseWithinObject(this)){
      return;
    }

    if(!Input.isMousePressed(MouseKey.Left)){
      return;
    }

    Input.clearMousePressed(MouseKey.Left);

    this.scene.addObject(
      new MenuObject(this.scene, {
        positionX: 13,
        positionY: 0,
      })
    );
  }

}
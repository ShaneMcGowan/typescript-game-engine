import { SceneObjectBaseConfig } from "@core/model/scene-object";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { MenuObject } from "../menu/menu.object";
import { IconObject } from "./icon.object";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { Assets } from "@core/utils/assets.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { TilesetBasic } from "@game/constants/tilesets/basic.tileset";
import { PlayerObject } from "../player.object";
import { InventoryObject } from "../inventory/inventory.object";

interface Config extends SceneObjectBaseConfig {
}

export class IconInventoryObject extends IconObject {

  player: PlayerObject;

  constructor(protected scene: SCENE_GAME, config: Config){
    super(scene, config);
  }

  onAwake(): void {
    this.player = this.scene.getObject({ typeMatch: [PlayerObject]}) as PlayerObject;
  }
  
  onRender(context: CanvasRenderingContext2D): void {
    if(!this.enabled){
      return;
    }
    
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      TilesetBasic.House.Darker.Default.x,
      TilesetBasic.House.Darker.Default.y,
      this.transform.position.world.x - CanvasConstants.TILE_PIXEL_SIZE,
      this.transform.position.world.y - CanvasConstants.TILE_PIXEL_SIZE,
      TilesetBasic.House.Darker.Default.width,
      TilesetBasic.House.Darker.Default.height
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      TilesetBasic.House.Dark.Default.x,
      TilesetBasic.House.Dark.Default.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetBasic.House.Dark.Default.width,
      TilesetBasic.House.Dark.Default.height
    );
  }
  
  onClick(): void {
    if(this.player === undefined){
      return;
    }

    this.scene.addObject(
      new InventoryObject(
        this.scene,
        {
          positionX: 0,
          positionY: 0,
          player: this.player,
        }
      )
    );
  }

}
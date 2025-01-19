import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { CollisionObject } from "./collision.object";
import { WarpObject } from "./warp.object";
import { PlayerObject } from "./player.object";
import { SCENE_GAME_MAP_HOUSE } from "@game/scenes/game/maps/house/map";
import { RenderUtils } from "@core/utils/render.utils";
import { Assets } from "@core/utils/assets.utils";
import { TilesetHouse } from "@game/constants/tilesets/house.tileset";

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
}

export class HouseObject extends SceneObject {

  constructor(protected scene: SCENE_GAME, protected config: Config){
    super(scene, config);

    this.renderer.enabled = true;
  }

  onAwake(): void {
    // TODO: add collisions
    // collision - back
    this.addChild(new CollisionObject(this.scene, { x: 0, y: 0, width: this.width, height: this.height - 1 }));
    // collision - front 
    const w = Math.floor(this.width / 2);
    this.addChild(new CollisionObject(this.scene, { x: 0, y: this.height - 1, width: w }));
    this.addChild(new CollisionObject(this.scene, { x: w + 1, y: this.height - 1, width: w }));
    // warp
    this.addChild(new WarpObject(this.scene, {
      x: w, 
      y: this.height - 1,
      player: this.config.player, 
      map: SCENE_GAME_MAP_HOUSE
    }));
    // TODO: add warp
    // TODO: add lock
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderWalls(context);
    this.renderRoof(context);
  }

  renderWalls(context: CanvasRenderingContext2D): void {
    const y = this.height - 1;

    for(let x = 0; x < this.width; x++){
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetHouse.id],
        TilesetHouse.Wall.Default.Bottom.x,
        TilesetHouse.Wall.Default.Bottom.y,
        this.transform.position.world.x + x,
        this.transform.position.world.y + y,
        TilesetHouse.Wall.Default.Bottom.width,
        TilesetHouse.Wall.Default.Bottom.height,
      );
    }
  }
  renderRoof(context: CanvasRenderingContext2D): void {
    // TODO: looks a little weird, check if something is wrong here
    
    let y = this.transform.position.world.y - 0.5;
    const width = this.width + 1;

    for(let x = 0; x < width; x++){
      let tile;
      
      if(x === 0){
        // first
        tile = TilesetHouse.Roof.Default.TopLeft;
      } else if(x === width - 1){
        // last
        tile = TilesetHouse.Roof.Default.TopRight;
      } else {
        // middle
        tile = TilesetHouse.Roof.Default.Top;
      }

      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetHouse.id],
        tile.x,
        tile.y,
        this.transform.position.world.x + x - 0.5,
        y,
        tile.width,
        tile.height,
      );
    }

    y += 1;

    for(let x = 0; x < width; x++){
      let tile;
      
      if(x === 0){
        // first
        tile = TilesetHouse.Roof.Default.BottomLeft;
      } else if(x === width - 1){
        // last
        tile = TilesetHouse.Roof.Default.BottomRight;
      } else {
        // middle
        tile = TilesetHouse.Roof.Default.Bottom;
      }

      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetHouse.id],
        tile.x,
        tile.y,
        this.transform.position.world.x + x - 0.5,
        y,
        tile.width,
        tile.height,
      );
    }
  }

}
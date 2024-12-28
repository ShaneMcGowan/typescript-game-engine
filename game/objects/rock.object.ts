import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { Assets } from "@core/utils/assets.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { TilesetGrassBiome } from "@game/constants/tileset-grass-biome.constants";
import { Interactable } from "@game/models/interactable.model";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "./textbox.object";

interface Config extends SceneObjectBaseConfig {}

export class RockObject extends SceneObject implements Interactable {
  constructor(protected scene: SCENE_GAME, config: Config){
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.enabled = true;
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
    )
  }

  interact(): void {
    this.scene.globals.player.enabled = false;

    const textbox = new TextboxObject(
      this.scene,
      {
        text: `This rock is too tough to break by hand, maybe if I used a Pickaxe...`,
        onComplete: () => {
          this.scene.globals.player.enabled = true;
        },
      }
    );

    this.scene.addObject(textbox);
  }

}
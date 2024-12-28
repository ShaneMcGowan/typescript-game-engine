import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { Assets } from "@core/utils/assets.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { TilesetGrassBiome } from "@game/constants/tileset-grass-biome.constants";
import { Interactable } from "@game/models/interactable.model";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "./textbox.object";

interface Config extends SceneObjectBaseConfig {}

export class TreeObject extends SceneObject implements Interactable {

  chopCounter: number = 0; // used to store the number of times the tree has been chopped
  chopCounterMax: number = 5; 

  constructor(protected scene: SCENE_GAME, config: Config){
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = 11; // TODO: this should be some sort of constant that is PLAYER RENDER LAYER + 1
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetGrassBiome.id],
      TilesetGrassBiome.SmallTree.Default.Default.x,
      TilesetGrassBiome.SmallTree.Default.Default.y,
      this.transform.position.world.x,
      this.transform.position.world.y - 1,
      TilesetGrassBiome.SmallTree.Default.Default.width,
      TilesetGrassBiome.SmallTree.Default.Default.height
    )
  }

  interact(): void {
    this.scene.globals.player.enabled = false;

    const textbox = new TextboxObject(
      this.scene,
      {
        text: `A mighty tree, I should be able to cut it down with an Axe...`,
        onComplete: () => {
          this.scene.globals.player.enabled = true;
        },
      }
    );

    this.scene.addObject(textbox);
  }

}
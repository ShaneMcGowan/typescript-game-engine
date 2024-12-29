import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { Assets } from "@core/utils/assets.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { TilesetGrassBiome } from "@game/constants/tileset-grass-biome.constants";
import { Interactable } from "@game/models/interactable.model";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "./textbox.object";
import { TreeObject } from "./tree.object";

interface Config extends SceneObjectBaseConfig {
  type?: 'big' | 'small';
}

export class TreeStumpObject extends SceneObject implements Interactable {

  chopCounter: number = 0; // used to store the number of times the tree stump has been chopped
  chopCounterMax: number = 5;

  regrowthTimer: number = 0;
  regrowthTimerMax: number = 5;

  constructor(protected scene: SCENE_GAME, protected config: Config){
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = 11; // TODO: this should be some sort of constant that is PLAYER RENDER LAYER + 1
  }

  onUpdate(delta: number): void {
    this.updateRegrowthTimer(delta);
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderStump(context);
  }

  get type() {
    return this.config.type;
  }

  private updateRegrowthTimer(delta: number): void {
    this.regrowthTimer += delta;

    if(this.regrowthTimer <= this.regrowthTimerMax){
      return;
    }

    this.destroy();

    this.scene.addObject(
      new TreeObject(
        this.scene,
        {
          positionX: this.transform.position.world.x,
          positionY: this.transform.position.world.y,
          type: this.type
        }
      )
    );
  }

  private renderStump(context: CanvasRenderingContext2D): void {
    // TODO: stump size
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetGrassBiome.id],
      TilesetGrassBiome.Stump.Default.Big.x,
      TilesetGrassBiome.Stump.Default.Big.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetGrassBiome.Stump.Default.Big.width,
      TilesetGrassBiome.Stump.Default.Big.height
    )
  }

  interact(): void {
    this.scene.globals.player.enabled = false;

    const textbox = new TextboxObject(
      this.scene,
      {
        text: `A tree stump, a tree should grow from it eventually.`,
        onComplete: () => {
          this.scene.globals.player.enabled = true;
        },
      }
    );

    this.scene.addObject(textbox);
  }

}
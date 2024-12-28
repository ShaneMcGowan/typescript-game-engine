import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { Assets } from "@core/utils/assets.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { TilesetGrassBiome } from "@game/constants/tileset-grass-biome.constants";
import { Interactable } from "@game/models/interactable.model";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "./textbox.object";
import { ItemObject } from "./item.object";
import { ItemType } from "@game/models/inventory.model";
import { MathUtils } from "@core/utils/math.utils";

type Type = 'big' | 'small';

interface Config extends SceneObjectBaseConfig {
  type: Type;
}

export class TreeObject extends SceneObject implements Interactable {

  chopCounter: number = 0; // used to store the number of times the tree has been chopped
  chopCounterMax: number = 5;

  fruitTimer: number = MathUtils.randomStartingDelta(4);
  fruitTimerMax: number = 60; // time in seconds until fruit is grown
  fruit: number = 0; // current amount of fruit on the tree
  fruitMax: number = 3; // max fruit that can grow at once

  constructor(protected scene: SCENE_GAME, protected config: Config){
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = 11; // TODO: this should be some sort of constant that is PLAYER RENDER LAYER + 1
  }

  onUpdate(delta: number): void {
    // only grow fruit on big trees
    if(this.type === 'big'){
      this.updateFruit(delta);
    }
  }

  onRender(context: CanvasRenderingContext2D): void {
    switch(this.config.type){
      case 'big':
        this.renderTree(context);
        break;
      case 'small':
      default:
        this.renderSmallTree(context);
        break;
    }

    this.renderFruit(context);
  }

  get type(): Type {
    return this.config.type;
  }

  private updateFruit(delta: number): void {
    this.fruitTimer += delta;

    if(this.fruitTimer < this.fruitTimerMax){
      return;
    }

    this.fruitTimer -= this.fruitTimerMax;

    if(this.fruit > this.fruitMax){
      return;
    }

    this.fruit++;
  }

  private renderTree(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetGrassBiome.id],
      TilesetGrassBiome.Tree.Default.Default.x,
      TilesetGrassBiome.Tree.Default.Default.y,
      this.transform.position.world.x - 0.5,
      this.transform.position.world.y - 1,
      TilesetGrassBiome.Tree.Default.Default.width,
      TilesetGrassBiome.Tree.Default.Default.height
    )
  }

  private renderSmallTree(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetGrassBiome.id],
      TilesetGrassBiome.SmallTree.Default.Default.x,
      TilesetGrassBiome.SmallTree.Default.Default.y,
      this.transform.position.world.x,
      this.transform.position.world.y - (12 / 16),
      TilesetGrassBiome.SmallTree.Default.Default.width,
      TilesetGrassBiome.SmallTree.Default.Default.height
    );
  }

  private renderFruit(context: CanvasRenderingContext2D): void {
    if(this.fruit > 0){
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetGrassBiome.id],
        TilesetGrassBiome.Fruit.Berry.OnTree.x,
        TilesetGrassBiome.Fruit.Berry.OnTree.y,
        this.transform.position.world.x,
        this.transform.position.world.y - (19 / 16),
        TilesetGrassBiome.Fruit.Berry.OnTree.width,
        TilesetGrassBiome.Fruit.Berry.OnTree.height
      )
    }

    if(this.fruit > 1){
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetGrassBiome.id],
        TilesetGrassBiome.Fruit.Berry.OnTree.x,
        TilesetGrassBiome.Fruit.Berry.OnTree.y,
        this.transform.position.world.x + (7 / 16),
        this.transform.position.world.y - (12 / 16),
        TilesetGrassBiome.Fruit.Berry.OnTree.width,
        TilesetGrassBiome.Fruit.Berry.OnTree.height
      )
    }

    if(this.fruit > 2){
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetGrassBiome.id],
        TilesetGrassBiome.Fruit.Berry.OnTree.x,
        TilesetGrassBiome.Fruit.Berry.OnTree.y,
        this.transform.position.world.x - (6 / 16),
        this.transform.position.world.y - (8 / 16),
        TilesetGrassBiome.Fruit.Berry.OnTree.width,
        TilesetGrassBiome.Fruit.Berry.OnTree.height
      )
    }
  }

  interact(): void {
    if(this.fruit === 0){
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
      return;
    }

    // drop a piece of fruit
    this.fruit--;
    this.fruitTimer = 0;

    const item = new ItemObject(
      this.scene, 
      { 
        type: ItemType.Rock, // TODO: change this to berry object
        positionX: this.transform.position.world.x,
        positionY: this.transform.position.world.y + 1, // TODO: should fruit always drop in this position?
      });
    this.scene.addObject(item);
  }

}
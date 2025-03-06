import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { Assets } from '@core/utils/assets.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { TilesetGrassBiome } from '@game/constants/tilesets/grass-biome.tileset';
import { type Interactable } from '@game/models/components/interactable.model';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { TextboxObject } from './textbox.object';
import { ItemObject } from './item.object';
import { ItemType } from '@game/models/inventory.model';
import { MathUtils } from '@core/utils/math.utils';
import { type ObjectFilter } from '@core/model/scene';
import { PlayerObject } from './player.object';
import { type OnNewDay } from '@game/models/components/new-day.model';
import { FarmableAreaObject } from './areas/farmable-area.object';
import { AreaObject } from './areas/area.object';

const DEFAULT_STUMP_ON_DESTROY: boolean = true;
const DEFAULT_LOG_ON_DESTROY: boolean = true;
const DEFAULT_BERRY_ON_DESTROY: boolean = true;

type Type = 'big' | 'small';

interface Config extends SceneObjectBaseConfig {
  type: Type;
  stumpOnDestroy?: boolean;
  logOnDestroy?: boolean;
  berryOnDestroy?: boolean;
}

export class TreeObject extends SceneObject implements Interactable, OnNewDay {
  // config
  stumpOnDestroy: boolean;
  logOnDestroy: boolean;
  berryOnDestroy: boolean;

  // state
  chopCounter: number = 0; // used to store the number of times the tree has been chopped
  chopCounterMax: number = 5;

  fruit: number = 0; // current amount of fruit on the tree
  fruitMax: number = 3; // max fruit that can grow at once

  constructor(protected scene: SCENE_GAME, protected config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = 11; // TODO: this should be some sort of constant that is PLAYER RENDER LAYER + 1

    this.stumpOnDestroy = config.stumpOnDestroy ?? DEFAULT_STUMP_ON_DESTROY;
    this.logOnDestroy = config.logOnDestroy ?? DEFAULT_LOG_ON_DESTROY;
    this.berryOnDestroy = config.berryOnDestroy ?? DEFAULT_BERRY_ON_DESTROY;
  }

  onRender(context: CanvasRenderingContext2D): void {
    switch (this.config.type) {
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

  onDestroy(): void {
    if (super.onDestroy) {
      super.onDestroy();
    }
  }

  onNewDay(): void {
    if (this.type === 'big') {
      this.fruit = this.fruitMax;
    }
  }

  get type(): Type {
    return this.config.type;
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
    );
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
    if (this.fruit > 0) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetGrassBiome.id],
        TilesetGrassBiome.Fruit.Berry.OnTree.x,
        TilesetGrassBiome.Fruit.Berry.OnTree.y,
        this.transform.position.world.x,
        this.transform.position.world.y - (19 / 16),
        TilesetGrassBiome.Fruit.Berry.OnTree.width,
        TilesetGrassBiome.Fruit.Berry.OnTree.height
      );
    }

    if (this.fruit > 1) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetGrassBiome.id],
        TilesetGrassBiome.Fruit.Berry.OnTree.x,
        TilesetGrassBiome.Fruit.Berry.OnTree.y,
        this.transform.position.world.x + (7 / 16),
        this.transform.position.world.y - (12 / 16),
        TilesetGrassBiome.Fruit.Berry.OnTree.width,
        TilesetGrassBiome.Fruit.Berry.OnTree.height
      );
    }

    if (this.fruit > 2) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetGrassBiome.id],
        TilesetGrassBiome.Fruit.Berry.OnTree.x,
        TilesetGrassBiome.Fruit.Berry.OnTree.y,
        this.transform.position.world.x - (6 / 16),
        this.transform.position.world.y - (8 / 16),
        TilesetGrassBiome.Fruit.Berry.OnTree.width,
        TilesetGrassBiome.Fruit.Berry.OnTree.height
      );
    }
  }

  interact(): void {
    if (this.fruit === 0) {
      this.scene.globals.player.enabled = false;

      const textbox = new TextboxObject(
        this.scene,
        {
          text: this.type === 'small' ? `It's a tree, I should be able to cut it down with an Axe...` : `It's a berry tree.`,
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

    // drop at a random position around the tree
    const positions = this.findDropPositions();
    const position = MathUtils.getRandomElement<{ x: number; y: number; }>(positions);

    // no valid position
    // this shouldn't really ever happen but just being safe
    if (position === undefined) {
      return;
    }

    const item = new ItemObject(
      this.scene,
      {
        type: ItemType.Berry,
        x: position.x,
        y: position.y,
      });
    this.scene.addObject(item);
  }

  /**
   * find a position to drop around the tree, ignoring the tree itself or behind the tree
   * @returns
   */
  private findDropPositions(): Array<{ x: number; y: number; }> {
    const available: Array<{ x: number; y: number; }> = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        // on top of the tree itself is not a valid position
        if (x === 0 && y === 0) {
          continue;
        }

        // behind the tree is not a valid position
        if (x === 0 && y === -1) {
          continue;
        }

        const filter: ObjectFilter = {
          boundingBox: SceneObject.calculateBoundingBox(
            this.transform.position.world.x + x,
            this.transform.position.world.y + y,
            1,
            1
          ),
          typeIgnore: [PlayerObject, ItemObject, AreaObject],
        };
        const object = this.scene.getObject(filter);

        // on top of another object is not a valid position
        if (object !== undefined) {
          continue;
        }

        available.push({
          x: this.transform.position.world.x + x,
          y: this.transform.position.world.y + y,
        });
      }
    }
    return available;
  }
}

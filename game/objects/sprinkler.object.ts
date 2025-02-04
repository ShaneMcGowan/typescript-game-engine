import { ObjectFilter } from "@core/model/scene";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { DirtObject } from "./dirt.object";

interface Config extends SceneObjectBaseConfig {}

const CACHE_MAX: number = 5;

export class SprinklerObject extends SceneObject {

  cache: number = 0;
  
  constructor(protected scene: SCENE_GAME, config: Config){
    super(scene, config);

    this.renderer.enabled = true;
  }

  onUpdate(delta: number): void {
    this.cache += delta;

    if(this.cache < CACHE_MAX){
      return;
    }

    this.cache %= CACHE_MAX;
    this.waterSurroundings();
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.width,
      this.height,
      {
        colour: 'grey',
        type: 'tile',
      }
    );

    RenderUtils.renderText(
      context,
      'S',
      this.centre.world.x,
      this.centre.world.y,
      {
        colour: 'white',
        align: 'center',
        baseline: 'middle',
      }
    )
  }
  
  private waterSurroundings(): void {
    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        this.transform.position.world.x - this.width,
        this.transform.position.world.y - this.height,
        this.width * 3,
        this.height * 3,
      ),
      typeMatch: [DirtObject]
    }
    const objects = this.scene.getObjects(filter);

    for(const object of objects){
      if(object instanceof DirtObject){
        object.isWatered = true;
      }
    }
  }

}
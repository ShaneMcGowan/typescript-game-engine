import { SCENE_GAME } from "@game/scenes/game/scene";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { isLightSource, LightSource } from "@game/models/components/lightsource.model";
import { RenderUtils } from "@core/utils/render.utils";

const DEFAULT_DARKNESS_COLOUR: string = '#000000';
const DEFAULT_DARKNESS_INTENSITY: number = 0.5;

interface Config extends SceneObjectBaseConfig {

}

export class LightObject extends SceneObject {

  lightSources: (SceneObject & LightSource)[] = [];
  lightSourceCacheTimer: number = 0;
  lightSourceCacheTimerMax: number = 0;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.LAST_OBJECT_RENDER_LAYER;
  }

  onUpdate(delta: number): void {
    this.cacheLightSources(delta);
    // TODO: update alpha for time of day
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderLight(context);
  }

  /**
   * Store light sources
   * @param delta 
   * @returns 
   */
  private cacheLightSources(delta: number): void {
    this.lightSourceCacheTimer += delta;

    if(this.lightSourceCacheTimer < this.lightSourceCacheTimerMax){
      return;
    }

    // reset timer
    this.lightSourceCacheTimer %= this.lightSourceCacheTimerMax;

    // cache expiered - clear cache
    this.lightSources = [];

    for(const [_ ,object] of this.scene.objects){
      if(!isLightSource(object)){
        continue;
      }
      this.lightSources.push(object);
    }
  }

  private renderLightSource(context: CanvasRenderingContext2D, object: SceneObject & LightSource): void {
    if(!object.lightSource.enabled){
      return;
    }

    const x = object.centre.world.x;
    const y = object.centre.world.y;
    const radius = object.lightSource.radius;

    // moveTo resolves issue with random intersections
    // https://stackoverflow.com/a/31737509
    // move to new position
    context.moveTo(
      (x + radius) * CanvasConstants.TILE_SIZE,
      y * CanvasConstants.TILE_SIZE
    );

    context.arc(
      x * CanvasConstants.TILE_SIZE,
      y * CanvasConstants.TILE_SIZE,
      radius * CanvasConstants.TILE_SIZE,
      0,
      2 * Math.PI
    );
  }

  private renderDarkness(context: CanvasRenderingContext2D): void {
    context.fillStyle = `${DEFAULT_DARKNESS_COLOUR}`;

    context.beginPath();

    context.rect(
      0,
      0,
      CanvasConstants.CANVAS_WIDTH,
      CanvasConstants.CANVAS_HEIGHT
    );

    context.fill();
  }

  private renderLight(context: CanvasRenderingContext2D): void {
    // draw arc clockwise then draw rect counter clockwise to have rect with circle cut out of it
    // https://stackoverflow.com/a/11770000

    // set up
    context.globalCompositeOperation = 'xor';
    
    // darkness
    this.renderDarkness(context);
    
    // loop all lights sources
    context.beginPath();
    this.lightSources.forEach(source => this.renderLightSource(context, source))
    context.fill();
  }

}
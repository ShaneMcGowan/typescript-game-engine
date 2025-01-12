import { SCENE_GAME } from "@game/scenes/game/scene";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { isLightSource, LightSource } from "@game/models/components/lightsource.model";

interface Config extends SceneObjectBaseConfig {

}

export class LightObject extends SceneObject {

  lightSources: (SceneObject & LightSource)[] = [];
  lightSourceCacheTimer: number = 0;
  lightSourceCacheTimerMax: number = 1;

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
    console.log(this.lightSourceCacheTimer);

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

    context.arc(
      (object.centre.world.x) * CanvasConstants.TILE_SIZE,
      (object.centre.world.y) * CanvasConstants.TILE_SIZE,
      object.lightSource.radius * CanvasConstants.TILE_SIZE,
      0,
      2 * Math.PI
    );
  }

  private renderLight(context: CanvasRenderingContext2D): void {
    // draw arc clockwise then draw rect counter clockwise to have rect with circle cut out of it
    // https://stackoverflow.com/a/11770000
    context.fillStyle = '#00000099'; // the colour of our overlay

    // begin render
    context.beginPath();
    
    // loop all lights sources
    this.lightSources.forEach(source => this.renderLightSource(context, source))

    // render overlay
    context.rect(
      CanvasConstants.CANVAS_WIDTH,
      0,
      CanvasConstants.CANVAS_WIDTH * -1,
      CanvasConstants.CANVAS_HEIGHT
    );

    // complete render
    context.fill();
}

}
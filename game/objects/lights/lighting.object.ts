import { DAY_LENGTH_IN_SECONDS, SCENE_GAME } from "@game/scenes/game/scene";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { isLightSource, LightSource } from "@game/models/components/lightsource.model";
import { MathUtils } from "@core/utils/math.utils";

type LightType = 'v1' | 'v2';

const DEFAULT_DARKNESS_COLOUR_V1: string = '011121';
const DEFAULT_DARKNESS_COLOUR_V2: string = '000000';
const DEFAULT_LIGHT_TYPE: LightType = 'v1';
const DEFAULT_LIGHT_SOURCE_CACHE_ENABLED: boolean = false;

interface Config extends SceneObjectBaseConfig {
  type?: LightType;
  lightSourceCacheEnabled?: boolean;
  enabled?: boolean;
  timeBased?: boolean;
}

export class LightingObject extends SceneObject {

  // config
  type: LightType;
  timeBased: boolean = false;
  enabled: boolean = false;

  // sources
  lightSources: (SceneObject & LightSource)[] = [];
  lightSourceCacheEnabled: boolean;
  lightSourceCacheTimer: number = 0;
  lightSourceCacheTimerMax: number = 0;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.LAST_OBJECT_RENDER_LAYER;

    this.type = config.type ?? DEFAULT_LIGHT_TYPE;
    this.enabled = config.enabled ?? this.enabled;
    this.timeBased = config.timeBased ?? this.timeBased;
    this.lightSourceCacheEnabled = config.lightSourceCacheEnabled ?? DEFAULT_LIGHT_SOURCE_CACHE_ENABLED;
  }

  onUpdate(delta: number): void {
    this.cacheLightSources(delta);
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderLight(context);
  }

  get alpha(): string {
    // alpha must be between 0 and 255
    // it is being converted to a hex code and being appended to a hex colour string with min value of `00` and max value of `FF`

    const min: number = 0;
    const max: number = 200;

    if(!this.enabled){
      return MathUtils.numberToHexString(min);
    }

    if(!this.timeBased){
      return MathUtils.numberToHexString(max);
    }

    const percentage: number = Math.min(1, this.scene.globals.time / DAY_LENGTH_IN_SECONDS);
    const value = Math.floor(max * percentage);
    return MathUtils.numberToHexString(value);
  }

  /**
   * Store light sources
   * @param delta 
   * @returns 
   */
  private cacheLightSources(delta: number): void {
    this.lightSourceCacheTimer += delta;

    if(this.lightSourceCacheEnabled && this.lightSourceCacheTimer < this.lightSourceCacheTimerMax){
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

  /**
   * Light rendering v1
   * Works well but there isn't much control over opacity
   * @param context 
   * @param object 
   * @returns 
   */
  private renderLightSourceV1(context: CanvasRenderingContext2D, object: SceneObject & LightSource): void {
    if(!object.lightSource.enabled){
      return;
    }

    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();

    const x = object.centre.world.x;
    const y = object.centre.world.y;
    const radius = object.lightSource.radius;

    // moveTo resolves issue with random intersections
    // https://stackoverflow.com/a/31737509
    // move to new position
    // context.moveTo(
    //   (x + radius) * CanvasConstants.TILE_SIZE,
    //   y * CanvasConstants.TILE_SIZE
    // );

    context.arc(
      x * CanvasConstants.TILE_SIZE,
      y * CanvasConstants.TILE_SIZE,
      radius * CanvasConstants.TILE_SIZE,
      0,
      2 * Math.PI,
    );

    context.fill();
    context.restore();
  }

  private renderLightSourceV2(context: CanvasRenderingContext2D, object: SceneObject & LightSource): void {
    if(!object.lightSource.enabled){
      return;
    }

    const ambientLight = .1;
    const intensity = 2;
    const amb = 'rgba(0,0,0,' + (1-ambientLight) + ')';
    const radius = object.lightSource.radius * CanvasConstants.TILE_SIZE;
    const x = object.centre.world.x * CanvasConstants.TILE_SIZE;
    const y = object.centre.world.y * CanvasConstants.TILE_SIZE;

    addLight(
      context, intensity, amb, x, y, 0, x, y, radius
    );

    context.fillStyle = amb;
    context.globalCompositeOperation = 'xor';
  }

  private renderDarkness(context: CanvasRenderingContext2D): void {
    if(this.type === 'v1'){
      context.fillStyle = `#${DEFAULT_DARKNESS_COLOUR_V1}${this.alpha}`;
    } else if(this.type === 'v2') {
      context.fillStyle = `#${DEFAULT_DARKNESS_COLOUR_V2}${this.alpha}`;
    }

    console.log(context.fillStyle);

    context.beginPath();

    context.rect(
      0,
      0,
      this.scene.map.width * CanvasConstants.TILE_SIZE,
      this.scene.map.height * CanvasConstants.TILE_SIZE,
    );

    context.fill();
  }

  private renderLight(context: CanvasRenderingContext2D): void {
    // draw arc clockwise then draw rect counter clockwise to have rect with circle cut out of it
    // https://stackoverflow.com/a/11770000

    // set up
    // context.globalCompositeOperation = 'xor';
    
    // darkness
    this.renderDarkness(context);
    
    // loop all lights sources
    this.lightSources.forEach((source, index) => {
      if(this.type === 'v1'){
        this.renderLightSourceV1(context, source);
      }
      if(this.type === 'v2'){
        this.renderLightSourceV2(context, source);
      }
    })
  }

  debuggerRenderBackground(context: CanvasRenderingContext2D): void {
    // this covers the whole screen so we want to overwrite this with a no op
  }

}

// from https://stackoverflow.com/a/10401701
function addLight(ctx: CanvasRenderingContext2D, intsy: number, amb: string, xStart: number, yStart: number, rStart: number, xEnd: number, yEnd: number, rEnd: number, xOff?: number, yOff?: number) {
  xOff = xOff || 0;
  yOff = yOff || 0;

  var g = ctx.createRadialGradient(xStart, yStart, rStart, xEnd, yEnd, rEnd);
  g.addColorStop(1, 'rgba(0,0,0,' + (1 - intsy) + ')');
  g.addColorStop(0, amb);
  ctx.fillStyle = g;
  ctx.fillRect(xStart - rEnd + xOff, yStart - rEnd + yOff, xEnd + rEnd, yEnd + rEnd);
}
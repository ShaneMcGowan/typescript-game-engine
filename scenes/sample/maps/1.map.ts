import { BackgroundLayer } from "../../../model/background-layer";
import { Scene } from "../../../model/scene";
import { SceneMap } from "../../../model/scene-map";
import { SceneObject } from "../../../model/scene-object";
import { ChickenObject } from "../objects/chicken.object";
import { PlayerObject } from "../objects/player.object";
import { SAMPLE_SCENE_MAP_1_BACKGROUND_0 } from "./1/backgrounds/0.background";
import { SAMPLE_SCENE_MAP_1_BACKGROUND_1 } from "./1/backgrounds/1.background";

export class SAMPLE_SCENE_MAP_1 extends SceneMap {
  height = 10;
  width = 10;
  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_MAP_1_BACKGROUND_0,
    SAMPLE_SCENE_MAP_1_BACKGROUND_1
  ];
  objects: SceneObject[] = [];
  
  constructor(scene: Scene, context: CanvasRenderingContext2D, assets: Record<string, any>){
    super(scene, context, assets);

    this.objects.push(new PlayerObject(scene, context, assets, { positionX: 1, positionY: 4  }));

    // chickens
    this.objects.push(new ChickenObject(scene, context, assets, { positionX: 8, positionY: 4, canLayEggs: false }, this.objects[0] as PlayerObject));
    
  }

}
import { BackgroundLayer } from "../../../model/background-layer";
import { Scene } from "../../../model/scene";
import { SceneMap } from "../../../model/scene-map";
import { SceneObject } from "../../../model/scene-object";
import { SAMPLE_SCENE_0_MAP_0_BACKGROUND_0 } from "./0/backgrounds/0.background";
import { MenuControllerObject } from "./0/objects/menu-controller.object";

export class SAMPLE_SCENE_0_MAP_0 extends SceneMap {

  height = 15;
  width = 21;
  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_0_MAP_0_BACKGROUND_0
  ];
  objects: SceneObject[] = [];
  
  constructor(scene: Scene, context: CanvasRenderingContext2D, assets: Record<string, any>){
    super(scene, context, assets);

    this.objects.push(new MenuControllerObject(scene, context, assets, {}));
  }
}
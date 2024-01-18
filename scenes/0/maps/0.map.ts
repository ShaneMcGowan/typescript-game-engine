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
  
  constructor(protected scene: Scene){
    super(scene);

    // TODO(smg): some sort of utility for setting the cursor
    this.context.canvas.style.cursor = `url("/assets/sample/Mouse sprites/Triangle Mouse icon 1.png"), auto`;

    this.objects.push(new MenuControllerObject(scene, {}));
  }

}
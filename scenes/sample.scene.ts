import { BackgroundLayer } from "../model/background-layer";
import { Scene } from "../model/scene";
import { SceneObject } from "../model/scene-object";
import { SAMPLE_SCENE_BACKGROUND_0 } from "./sample/backgrounds/0.background";
import { SAMPLE_SCENE_BACKGROUND_1 } from "./sample/backgrounds/1.background";
import { SampleObject } from "./sample/objects/player.object";

export class SampleScene implements Scene {
  id = 'sample-scene';
  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_BACKGROUND_0,
    SAMPLE_SCENE_BACKGROUND_1
  ];
  width = 10;
  height = 10;
  // TODO(smg): how do we render multiple instances of an object
  // We define an object, then we have an additional concept of an object instance?
  _objects = [SampleObject];
  objects: SceneObject[] = [];
  
  constructor(context: CanvasRenderingContext2D, assets: Record<string, any>){
    // instanciate objects
    this._objects.forEach((ObjectClass) => this.objects.push(
      Reflect.construct(ObjectClass, [context, assets])
    ));
  }

}
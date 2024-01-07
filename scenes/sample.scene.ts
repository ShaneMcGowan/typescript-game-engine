import { BackgroundLayer } from "../model/background-layer";
import { Scene } from "../model/scene";
import { SceneObject } from "../model/scene-object";
import { SAMPLE_SCENE_BACKGROUND_0 } from "./sample/backgrounds/0.background";
import { SAMPLE_SCENE_BACKGROUND_1 } from "./sample/backgrounds/1.background";
import { ChickenObject } from "./sample/objects/chicken.object";
import { PlayerObject } from "./sample/objects/player.object";

export class SampleScene extends Scene {
  id = 'sample-scene';
  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_BACKGROUND_0,
    SAMPLE_SCENE_BACKGROUND_1
  ];
  width = 10;
  height = 10;

  objects: SceneObject[] = [];
  
  constructor(context: CanvasRenderingContext2D, assets: Record<string, any>){
    super(context, assets);

    // instanciate objects
    // this is quite verbose but it will do for now, we want control over individual objects and their constructors
    this.objects.push(new PlayerObject(context, assets));
    // TODO: some sort of way to get an object by id or name to avoid below way of referencing player via objects[0]
    this.objects.push(new ChickenObject(context, assets, {}, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(context, assets, { positionX: 10, positionY: 5 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(context, assets, { positionX: 3, positionY: 8 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(context, assets, { positionX: 10, positionY: 2 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(context, assets, { positionX: 5, positionY: 1 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(context, assets, { positionX: 6, positionY: 6 }, this.objects[0] as PlayerObject));
  }

}
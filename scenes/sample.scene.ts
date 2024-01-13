import { Scene } from "../model/scene";
import { SAMPLE_SCENE_MAP_0 } from "./sample/maps/0.map";
import { SAMPLE_SCENE_MAP_1 } from "./sample/maps/1.map";

export class SampleScene extends Scene {

  globals: Record<string, any> = {
    chickens_follow_player: false,
    chickens_drawn_to_hole: true,
    chicken_counter: 0,
  };
  maps = [
    SAMPLE_SCENE_MAP_0,
    SAMPLE_SCENE_MAP_1
  ];
  
  constructor(context: CanvasRenderingContext2D, assets: Record<string, any>){
    super(context, assets);
    this.loadNewMap(0); // should this be the default?
  }

}
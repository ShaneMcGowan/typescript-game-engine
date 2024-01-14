import { Scene } from "../model/scene";
import { SampleScene } from "../scenes/sample.scene";

/**
 * Add your scenes here, the first scene will be loaded on startup
 */

// TODO: having a union of all scenes sounds like an absolute nightmare so not sure what the best solution for this would be
type IScenes = typeof SampleScene; // | typeof OtherScene | typeof AnotherScene;

export const SCENES: IScenes[] = [
  SampleScene
];
import { SAMPLE_SCENE_0 } from '@scenes/0.scene';
import { SAMPLE_SCENE_1 } from '@scenes/1.scene';

/**
 * Add your scenes here, the first scene will be loaded on startup
*/

// TODO: having a union of all scenes sounds like an absolute nightmare so not sure what the best solution for this would be
type IScenes = typeof SAMPLE_SCENE_1; // | typeof OtherScene | typeof AnotherScene;

export const SCENES: any[] = [
  SAMPLE_SCENE_0,
  SAMPLE_SCENE_1
];

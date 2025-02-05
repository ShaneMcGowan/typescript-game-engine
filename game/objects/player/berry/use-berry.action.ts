import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type PlayerObject } from '@game/objects/player.object';
import { type SceneObject } from '@core/model/scene-object';
import { useBerryOnHole } from './use-berry-on-hole.action';
import { HoleObject } from '@game/objects/hole.object';

/**
 * Plant berry
 * @param scene
 * @param object
 */
export function useBerry(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  switch (true) {
    case target instanceof HoleObject:
      useBerryOnHole(scene, target);
  }
}

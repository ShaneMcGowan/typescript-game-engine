import { TransitionObject } from "@core/objects/transition.object";
import { PlayerObject } from "@game/objects/player.object";
import { SCENE_GAME } from "@game/scenes/game/scene";

export abstract class Warps {
  static World = {
    Hill: {
      Town: {
        Hill: {
          position: {
            x: 10,
            y: 38,
          }
        }
      },
      Farm: {
        Hill: {
          position: {
            x: 99,
            y: 12,
          }
        }
      }
    },
    Beach: {
      Town: {
        position: {
          x: 31,
          y: 39,
        }
      },
      Farm: {
        position: {
          x: 99,
          y: 19,
        }
      }
    }
  }

  static Farm = {
    Hill: {
      Town: {
        Hill: {
          position: {
            x: 0,
            y: 12,
          }
        },
        Beach: {
          position: {
            x: 0,
            y: 19,
          }
        }
      }
    }
  }

  static onMapEnter(scene: SCENE_GAME, player: PlayerObject): void {
    if(scene.globals.warp.position){
      player.transform.position.local.x = scene.globals.warp.position.x;
      player.transform.position.local.y = scene.globals.warp.position.y;
      scene.globals.warp.position = null;
    }

    if(scene.globals.warp.target){
      player.targetX = scene.globals.warp.target.x;
      player.targetY = scene.globals.warp.target.y;
      scene.globals.warp.target = null;
    }

    scene.addObject(new TransitionObject(scene, {
      animationType: 'circle',
      animationLength: 2,
      animationCenterX: player.transform.position.world.x + (player.width / 2),
      animationCenterY: player.transform.position.world.y + (player.height / 2),
    }));
  }
}
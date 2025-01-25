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
            x: 98,
            y: 12,
          }
        }
      }
    },
    Beach: {
      Town: {
        position: {
          x: 30,
          y: 38,
        }
      },
      Farm: {
        position: {
          x: 98,
          y: 19,
        }
      }
    },
  }

  static Farm = {
    Hill: {
      Town: {
        Hill: {
          position: {
            x: 1,
            y: 13,
          }
        },
      }
    },
    Beach: {
      Town:{
        Beach: {
          position: {
            x: 1,
            y: 19,
          }
        }
      }
    }
  }

  static Town = {
    Hill: {
      World: {
        Hill: {
          position: {
            x: 10,
            y: 1,
          }
        },
      }
    },
    Beach: {
      World: {
        Beach: {
          position: {
            x: 29,
            y: 1,
          }
        }
      }
    }
  }

  static FarmHouse = {
    Door: {
      World: {
        House: {
          position: {
            x: 23,
            y: 2
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
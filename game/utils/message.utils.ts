import { TextboxObject } from "@game/objects/textbox.object";
import { SCENE_GAME } from "@game/scenes/game/scene";

export class MessageUtils {

  static showMessage(scene: SCENE_GAME, text: string, onComplete?: () => void){
    // disable player
    scene.globals.player.enabled = false;

    const textbox = new TextboxObject(
      scene,
      {
        text: text,
        onComplete: () => {
          if(onComplete){
            onComplete();
          }
          // reenable player
          scene.globals.player.enabled = true
        }
      }
    );
    
    scene.addObject(textbox);
  }
}
import { type Scene } from '@core/model/scene';
import { TextboxObject } from '@game/objects/textbox.object';
import { ToastMessageObject } from '@game/objects/toast-message.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';

export class MessageUtils {
  static showMessage(scene: SCENE_GAME, text: string, onComplete?: () => void, enableOnComplete: boolean = true) {
    // disable player
    scene.globals.player.enabled = false;

    const textbox = new TextboxObject(
      scene,
      {
        text,
        onComplete: () => {
          if (onComplete) {
            onComplete();
          }
          // reenable player
          if (enableOnComplete) {
            scene.globals.player.enabled = true;
          }
        },
        showOverlay: false,
      }
    );

    scene.addObject(textbox);
  }

  static showToast(
    scene: Scene,
    text: string,
    options: {
      speedIn?: number,
      speedOut?: number,
      timerDelay?: number,
      timerPause?: number,
    } = {}
  ): ToastMessageObject {
    const toast = new ToastMessageObject(
      scene,
      {
        text,
        speedIn: options.speedIn,
        speedOut: options.speedOut,
        timerDelay: options.timerDelay,
        timerPause: options.timerPause,
      }
    );

    scene.addObject(toast);

    return toast;
  }
}

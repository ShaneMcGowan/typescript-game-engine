import { type SCENE_GAME } from '@game/scenes/game/scene';
import { NpcObject, NpcState, type NpcObjectConfig } from '@game/objects/npc.object';
import { Portrait, TextboxObject } from '@game/objects/textbox.object';
import { SpriteAnimation } from '@core/model/sprite-animation';

type Stage = 'idle' | 'intro' | 'outro';

const PORTRAIT: Portrait = {
  tileset: 'tileset_chicken',
  x: 0,
  y: 0,
  width: 1,
  height: 1,
}

export interface Config extends NpcObjectConfig {
}

export class UnknownNpcObject extends NpcObject {
  stage: Stage = 'idle';

  // stageOutro
  stageOutroTimer: number = 0;
  stageOutroDuration: number = 1;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);

    switch (this.stage) {
      case 'idle':
        break;
      case 'intro':
        break;
      case 'outro':
        this.updateStageOutro(delta);
        break;
    }
  }

  onDestroy(): void {
    this.scene.globals.player.enabled = true;
  }

  interact(): void {
    if (this.stage !== 'idle') {
      return;
    }

    this.scene.globals.player.enabled = false;

    this.startStageIntro();
  };

  private startStageIntro(): void {
    this.stage = 'intro';

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          text: this.dialogue,
          portrait: PORTRAIT, // TODO: new to implement proper portrait system
          name: this.name,
          onComplete: () => {
            this.startStageOutro();
          },
        }
      )
    );
  }

  private startStageOutro(): void {
    this.stage = 'outro';
  }

  private updateStageOutro(delta: number): void {
    this.stageOutroTimer += delta;

    this.renderer.opacity = 1 - (this.stageOutroTimer / this.stageOutroDuration);
    if (this.stageOutroTimer >= this.stageOutroDuration) {
      this.destroy();
    }
  }
}

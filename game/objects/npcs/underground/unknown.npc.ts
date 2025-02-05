import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type InteractionStage, NpcDetails, NpcDialogue, NpcObject, type NpcObjectConfig } from '@game/objects/npc.object';
import { type Portrait, TextboxObject } from '@game/objects/textbox.object';

type Stage = 'idle' | 'intro' | 'outro';

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
  }

  get name(): string {
    return '???';
  }

  get portrait(): Portrait {
    return {
      tileset: 'tileset_chicken',
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    };
  }

  get default(): InteractionStage {
    return {
      text: '',
      callback: () => { this.startStageIntro(); },
    };
  }

  private startStageIntro(): void {
    this.scene.globals.player.enabled = false;

    this.stage = 'intro';

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          name: this.name,
          portrait: this.portrait,
          text: 'TODO(shane):',
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

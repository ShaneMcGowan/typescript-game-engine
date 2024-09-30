import { type SAMPLE_SCENE_1 } from '@game/scenes/game/scene';
import { NpcObject, type NpcObjectConfig } from '@game/objects/npc.object';
import { TextboxObject } from '@game/objects/textbox.object';

type Stage = 'idle' | 'intro' | 'outro';

export interface Config extends NpcObjectConfig {
}

export class UnknownNpcObject extends NpcObject {
  stage: Stage = 'idle';

  // stageOutro
  stageOutroTimer: number = 0;
  stageOutroDuration: number = 1;

  constructor(
    protected scene: SAMPLE_SCENE_1,
    config: Config
  ) {
    super(scene, config);
  }

  update(delta: number): void {
    super.update(delta);

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

  interact(): void {
    console.log('[GregNpcObject#interact]');

    if (this.stage !== 'idle') {
      return;
    }

    this.startStageIntro();
  };

  private startStageIntro(): void {
    this.stage = 'intro';

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          text: this.dialogue,
          portrait: this.name, // TODO: new to implement proper portrait system
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

    this.renderOpacity = 1 - (this.stageOutroTimer / this.stageOutroDuration);
    if (this.stageOutroTimer >= this.stageOutroDuration) {
      this.scene.removeObjectById(this.id);
    }
  }
}

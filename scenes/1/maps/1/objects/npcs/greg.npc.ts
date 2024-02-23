import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { NpcObject, type NpcObjectConfig } from '@scenes/1/objects/npc.object';
import { TextboxObject } from '@scenes/1/objects/textbox.object';

export interface Config extends NpcObjectConfig {

}

export class GregNpcObject extends NpcObject {
  constructor(
    protected scene: SAMPLE_SCENE_1,
    config: Config
  ) {
    super(scene, config);
  }

  interact(): void {
    console.log('[GregNpcObject#interact]');
    if (this.dialogue === undefined) {
      return;
    }

    let textbox = new TextboxObject(
      this.scene,
      {
        text: this.dialogue,
        portrait: this.name, // TODO(smg): new to implement proper portrait system
        name: this.name,
        // TODO(smg): move this to it's own class
        onComplete: () => {
          // TODO(smg): I am rethinking the concept of removing the object from the scene during another object's update.
          // I think it would be better to have a flag that is checked during the scene's update loop to rmove the obejct before it's next update
          // perhaps using
          this.scene.removeObjectById(this.id);
        },
      }
    );
    this.scene.addObject(textbox);
  };
}

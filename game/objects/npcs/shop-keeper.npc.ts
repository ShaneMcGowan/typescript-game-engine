import { SCENE_GAME } from "@game/scenes/game/scene";
import { NpcObject, NpcObjectConfig, NpcState } from "../npc.object";
import { Portrait, TextboxObject } from "../textbox.object";
import { SpriteAnimation } from "@core/model/sprite-animation";
import { ShopObject } from "../shop.object";

const PORTRAIT: Portrait = {
  tileset: 'tileset_player',
  x: 1,
  y: 1
}

const ANIMATION: Record<NpcState, SpriteAnimation> = {
  idle: new SpriteAnimation('tileset_player', [
    { spriteX: 1, spriteY: 1, duration: 0.5, },
    { spriteX: 4, spriteY: 1, duration: 0.5, }
  ]),
  moving: new SpriteAnimation('tileset_player', [

  ]),
};

export interface Config extends NpcObjectConfig {
}


export class ShopKeeperObject extends NpcObject {

  firstConversation: boolean = true;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    config.animations = ANIMATION;
    super(scene, config);
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);
  }

  interact(): void {
    this.scene.globals.disable_player_inputs = true;

    // if (this.stage !== 'idle') {
    //   return;
    // }

    if (this.firstConversation) {
      this.startStageFirstConversation();
      return;
    }

    this.startStageGreeting();
  };

  private startStageFirstConversation(): void {
    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          text: `Hi, I don't think we've met. I'm the shop keeper. I have farming supplies for sale and will buy most things you grow.`,
          portrait: PORTRAIT, // TODO: new to implement proper portrait system
          name: '???',
          onComplete: () => {
            this.firstConversation = false;
            this.startStageGreeting();
          },
        }
      )
    );
  }

  private startStageGreeting(): void {
    this.scene.globals.disable_player_inputs = true;

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          text: `Welcome to my shop, how can I help?`,
          portrait: PORTRAIT, // TODO: new to implement proper portrait system
          name: 'Shopkeeper',
          onComplete: () => {
            this.scene.addObject(new ShopObject(this.scene, { positionX: 0, positionY: 0, onLeave: this.leaveShopCallback }))
          },
        }
      )
    );
  }

  private leaveShopCallback(): void {
    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          text: `Thanks, come again any time!`,
          portrait: PORTRAIT, // TODO: new to implement proper portrait system
          name: 'Shopkeeper',
          onComplete: () => {
            this.scene.globals.disable_player_inputs = false;
          }
        }
      )
    );
  }

}
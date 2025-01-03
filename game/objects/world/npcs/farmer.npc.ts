import { SCENE_GAME } from "@game/scenes/game/scene";
import { NpcObject, NpcObjectConfig, NpcState } from "../../npc.object";
import { TextboxObject } from "../../textbox.object";
import { SpriteAnimation } from "@core/model/sprite-animation";
import { ShopObject } from "../../shop.object";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";

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


export class FarmerObject extends NpcObject {

  firstConversation: boolean = true;

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    config.animations = ANIMATION;
    config.name = SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.details.name;
    config.portrait = SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.details.portrait;
    super(scene, config);
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);
  }

  get quests() {
    return this.scene.globals.quests;
  }

  interact(): void {

    // quest - collect_wheat
    if(!this.quests.collect_wheat.complete){
      if(this.quests.collect_wheat.intro === false){
        this.questCollectWheatIntro();
      } else {
        const check = this.questCollectWheatCheck();
        if(check){
          this.questCollectWheatSuccess();
        } else {
          this.questCollectWheatFailure();
        }
      }
      return;
    }

    // quest - break_rocks
    if(!this.quests.break_rocks.complete){
      if(this.quests.break_rocks.intro === false){
        this.questBreakRocksIntro();
      } else {
        const check = this.questBreakRocksCheck();
        if(check){
          this.questBreakRocksSuccess();
        } else {
          this.questBreakRocksFailure();
        }
      }
      return;
    }

    this.questDefault();
  };

  private questCollectWheatIntro(): void {
    this.say(
      SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.collect_wheat.intro,
      () => {
        this.quests.collect_wheat.intro = true;
      }
    )
  }

  private questCollectWheatFailure(): void {
    this.say(
      SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.collect_wheat.failure,
    )
  }

  private questCollectWheatSuccess(): void {
    this.say(
      SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.collect_wheat.success,
      () => {
        // give key
        this.scene.globals.inventory.addToInventory(ItemType.GateKey);
        // quest complete
        this.scene.globals.quests.collect_wheat.complete = true;
      }
    )
  }

  private questCollectWheatCheck(): boolean {
    if(this.scene.globals.inventory.hasItem(ItemType.Wheat, 9)){
      this.scene.globals.inventory.removeItems(ItemType.Wheat, 9);
      return true;
    }
    return false;
  }

  private questBreakRocksIntro(): void {
    this.say(
      SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.break_rocks.intro,
      () => {
        this.quests.break_rocks.intro = true;
        this.scene.globals.inventory.addToInventory(ItemType.Pickaxe);
      }
    )
  }

  private questBreakRocksSuccess(): void {
    this.say(
      SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.break_rocks.success,
      () => {
        this.quests.break_rocks.complete = true;
      }
    )
  }

  private questBreakRocksFailure(): void {
    this.say(
      SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.break_rocks.failure,
    )
  }

  private questBreakRocksCheck(): boolean {
    if(this.scene.globals.inventory.hasItem(ItemType.Rock, 8)){
      this.scene.globals.inventory.removeItems(ItemType.Rock, 8);
      return true;
    }
    return false;
  }


  private questDefault(): void {
    this.scene.globals.player.enabled = false;

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          name: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.details.name,
          portrait: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.details.portrait,
          text: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.no_more_quests,
          onComplete: () => {
            this.scene.globals.player.enabled = true;
          },
        }
      )
    );
  }

}
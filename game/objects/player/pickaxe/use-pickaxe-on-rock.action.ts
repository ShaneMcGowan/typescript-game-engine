import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "@game/objects/textbox.object";
import { RockObject } from "@game/objects/rock.object";
import { ItemObject } from "@game/objects/item.object";
import { ItemType } from "@game/models/inventory.model";

export function usePickaxeOnRock(scene: SCENE_GAME, object: RockObject): void {
  scene.globals.player.enabled = false;

  const textbox = new TextboxObject(
    scene,
    {
      text: `The rock shatters into pieces.`,
      onComplete: () => {
        
        scene.globals.player.enabled = true;
      },
    }
  );

  scene.addObject(textbox);
  
  object.destroy();

  scene.addObject(new ItemObject(
    scene, 
    {
      type: ItemType.Rock,
      positionX: object.transform.position.world.x,
      positionY: object.transform.position.world.y,
    }
  ))
}
import { Portrait } from "@game/objects/textbox.object";

interface NpcDetails {
    name: string,
    portrait: Portrait
}

const NPC_FARMER_DETAILS: NpcDetails = {
    name: `Farmer`,
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      height: 2,
      width: 2, 
    }
};

const NPC_FARMER = {
  details: { ...NPC_FARMER_DETAILS },
  text: {
    quests: {
      collect_wheat: {
        intro: `Hi, I don't think we've met. I'm the Farmer. If you're looking for something to do, go collect some Wheat for me. Collect 9 Wheat for me and I'll give you the key to the gate out front.`,
        failure: `Collect 9 Wheat for me and I'll give you the key to the gate out front, then I'll have more for you to do.`,
        success: `Thanks! I really wasn't feeling up to collecting Wheat today, good thing you showed up. Here is the key to the gate out front. Come back to me for more to do once you're done exploring.`,
      },
      collect_logs: { // TODO:
        intro: `get some logs`,
        failure: `get some logs`,
        success: `great work, talk to me when you're ready to continue`,
      },
      collect_rocks: { // TOOD:
        intro: `get me 3 rocks`,
        failure: `get me 3 rocks`,
        success: `great work, talk to me when you're ready to continue`,
      },
      break_rocks: { // TODO: update
        intro: `Now that you've proven yourself useful, I need someone to get rid of all those damn rocks in my field. You can't grow plants if there are rocks in the way. I used to break rocks all day long as part of a chain gang. Went down for 3 counts of not thanking the bus driver. I've since seen the error of my ways, but I refuse to ever break rocks myself again. Take this Pickaxe, it's not very strong but should be able to break through most of the rocks there. Bring me back 8 rocks.`,
        failure: `Come back to me once you've collected 8 rocks. Don't worry if some are too tough to break, we can deal with those later.`,
        success: `Great work, my field has never looked so rock free, and that's a compliment where I come from.`
      },
      plant_a_tree: { // TODO:
        intro: `destruction breeds creation, dig a hole and plant this berry, bring me 9 berries`,
        failure: `dig a hole and plant this berry, bring me 9 berries`,
        success: `you did it!`,
      },
    },
    no_more_quests: `The guy who made this game is lazy and hasn't added more quests for you to do yet, just go mess about I guess.`,
    goodbye: `Thanks, come again any time!`
  }
};

const NPC_FARMERS_SON_DETAILS: NpcDetails = {
  name: `Farmer's Son`,
  portrait: {
    tileset: 'tileset_emotes',
    x: 0,
    y: 0,
    width: 2,
    height: 2,
  }
};

const NPC_FARMERS_SON = {
  details: { ...NPC_FARMERS_SON_DETAILS },
  text: {
    intro: `Hi, you must be new around here. I'm the farmer's son. If you're looking for something to do, you should go speak with my father. He should be back at our house.`,
    shack_open: `Go find my Father, he's probably back at our house. He'll have something for you to do.`,
    other: `When I grow up I want to be a main character like you. My father says it's just fine to be an NPC like him but I have delusions of grandeur due to being hit on the head as a child.`
  }
};


const NPC_CHICKEN_DETAILS: NpcDetails = {
  name: `Chicken`,
  portrait: {
    tileset: 'tileset_chicken',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    scale: 2
  }
};

const NPC_CHICKEN = {
  details: { ...NPC_CHICKEN_DETAILS },
}

const OBJECT_GATE = {
  interact: {
    intro: 'The gate is locked.',
    key: 'I insert the Gate Key into the lock. The lock clicks open. The key gets stuck though, oopsie...',
    no_key: `Looks like I'll need to find a key. Or I could break it... but Mum didn't raise me that way.`,
  }
};

const OBJECT_SHACK = {
  door: {
    intro: `It looks like some sort of shack. The light inside appears to be on. I wonder if anyone is there...`,
    locked: `The door is locked, maybe I should come back later.`,
  }
};

export const SCENE_GAME_MAP_WORLD_TEXT =  {
  npcs: {
    farmer: { ...NPC_FARMER },
    farmers_son: { ...NPC_FARMERS_SON },
    chicken: { ...NPC_CHICKEN }
  },
  objects: {
    gate: { ...OBJECT_GATE },
    shack: { ...OBJECT_SHACK },
  }
};
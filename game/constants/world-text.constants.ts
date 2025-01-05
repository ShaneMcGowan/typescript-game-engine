import { QuestName, QuestText } from "@game/models/quest.model";
import { NpcDetails } from "@game/objects/npc.object";
import { Portrait } from "@game/objects/textbox.object";

interface Npc {
  details: NpcDetails,
  text: {
    quests: Partial<Record<QuestName, QuestText>>,
    dialogue: {
      intro: string,
      default: string,
    }
  }
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

const NPC_FARMER: Npc = {
  details: { ...NPC_FARMER_DETAILS },
  text: {
    quests: {
      collect_wheat: { // TODO: update
        intro: `Hi, I don't think we've met. I'm the Farmer. If you're looking for something to do, go collect some Wheat for me. Collect 9 Wheat for me and I'll give you the key to the gate out front.`,
        failure: `Collect 9 Wheat for me and I'll give you the key to the gate out front, then I'll have more for you to do.`,
        success: `Thanks! I really wasn't feeling up to collecting Wheat today, good thing you showed up. Here is the key to the gate out front. Come back to me for more to do once you're done exploring.`,
      },
      collect_logs: {
        intro: `If you want to get to work, we will need to get you some tools. I'm out of supplies at the minute so to start, bring me 4 logs. You should be able to find some washed up on the beach.`,
        failure: `Bring me 4 logs. You should be able to find some washed up on the beach`,
        success: `Great work, just a few more tasks and you'll be right on your way to being a farmer like me.`,
      },
      collect_rocks: {
        intro: `Next we need to find some rocks, then I can start making you some tools. There should be some rocks on the beach. Bring me back 4 rocks.`,
        failure: `Head down to the beach and bring me back 4 rocks, then I can make you some tools.`,
        success: `Fantastic! Now I can make you some tools.`,
      },
      break_rocks: { 
        intro: `Here is a Pickaxe, time to make yourself useful. I need someone to get rid of all those damn rocks in my field. You can't grow plants if there are rocks in the way. I used to break rocks all day long as part of a chain gang. Went down for 3 counts of not thanking the bus driver. I've since seen the error of my ways, but I refuse to ever break rocks myself again. Take this Pickaxe, it's not very strong but should be able to break through most of the rocks there. Bring me back 8 rocks.`,
        failure: `Come back to me once you've collected 8 rocks. Don't worry if some are too tough to break, we can deal with those later.`,
        success: `Great work, my field has never looked so rock free, and that's a compliment where I come from.`
      },
      collect_berries: {
        intro: `Next we need to find some berries. There should be some berries up on the hill beside us. Here is the key to the gate. Take it and bring me back 4 berries.`,
        failure: `Head up the the hill and bring me back 4 berries.`,
        success: `Did you lock the gate again after you left? I don't want people wandering around up there stealing my berries.`,
      },
      plant_tree: {
        intro: `Now for your next task. Take this shovel, head to the farm and plant some berry trees. Also take this berry, you'll need to plant it. As for the other 3 berries you gave me, I ate them. They were tasty. Yum. Come back to me once they have grown and you've collected 9 berries.`,
        failure: `Head to the farm and plant some berry trees, wait for them to grow and bring me back 9 berries.`,
        success: `You did it, now we can have all the berries we want! Unless you chop down all the trees and eat all the berries, but that would just be silly to do.`,
      },
    },
    dialogue: {
      intro: `Hi, I don't think we've met. I'm the Farmer. If you're looking for something to do I'm sure I can find something for you.`,
      default: `The guy who made this game is lazy and hasn't added more quests for you to do yet, just go mess about I guess.`,
    },
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

const NPC_FARMERS_SON: Npc = {
  details: { ...NPC_FARMERS_SON_DETAILS },
  text: {
    quests: {},
    dialogue: {
      intro: `Hi, you must be new around here. I'm the farmer's son. If you're looking for something to do, you should go speak with my father. He should be back at our house.`,
      // shack_open: `Go find my Father, he's probably back at our house. He'll have something for you to do.`,
      default: `When I grow up I want to be a main character like you. My father says it's just fine to be an NPC like him but I have delusions of grandeur due to being hit on the head as a child.`
    }
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
import { Inventory, ItemType } from "@game/models/inventory.model";
import { QuestName, QuestText } from "@game/models/quest.model";
import { NpcDetails } from "@game/objects/npc.object";

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
      [QuestName.collect_wheat]: { // TODO: update
        intro: `Hi, I don't think we've met. I'm the Farmer. If you're looking for something to do, go collect some Wheat for me. Collect 9 Wheat for me and I'll give you the key to the gate out front.`,
        failure: `Collect 9 Wheat for me and I'll give you the key to the gate out front, then I'll have more for you to do.`,
        success: `Thanks! I really wasn't feeling up to collecting Wheat today, good thing you showed up. Here is the key to the gate out front. Come back to me for more to do once you're done exploring.`,
      },
      [QuestName.collect_logs]: {
        intro: `If you want to get to work, we will need to get you some tools. I'm out of supplies at the minute so to start, bring me 4 ${Inventory.getItemName(ItemType.Log, true)}. You should be able to find some washed up on the beach.`,
        failure: `Bring me 4 ${Inventory.getItemName(ItemType.Log, true)}. You should be able to find some washed up on the beach.`,
        success: `Great work, just a few more tasks and you'll be right on your way to being a farmer like me.`,
      },
      [QuestName.collect_rocks]: {
        intro: `Next we need to find some ${Inventory.getItemName(ItemType.Rock, true)}, then I can start making you some tools. There should be some ${Inventory.getItemName(ItemType.Rock, true)} on the beach. Bring me back 4 ${Inventory.getItemName(ItemType.Rock, true)}.`,
        failure: `Head down to the beach and bring me back 4 ${Inventory.getItemName(ItemType.Rock, true)}, then I can make you some tools.`,
        success: `Fantastic! Now I can make you some tools.`,
      },
      [QuestName.break_rocks]: { 
        intro: `Here is a ${Inventory.getItemName(ItemType.Pickaxe)}, time to make yourself useful. it's not very strong but should be able to break through most of the ${Inventory.getItemName(ItemType.Rock, true)} there. I need someone to get rid of all those damn ${Inventory.getItemName(ItemType.Rock, true)} in my field. You can't grow plants if there are ${Inventory.getItemName(ItemType.Rock, true)} in the way. I used to break ${Inventory.getItemName(ItemType.Rock, true)} all day long as part of a chain gang. Went down for 3 counts of not thanking the bus driver. I've since seen the error of my ways, but I refuse to ever break ${Inventory.getItemName(ItemType.Rock, true)} myself again. Bring me back 8 ${Inventory.getItemName(ItemType.Rock, true)}.`,
        failure: `Come back to me once you've collected 8 ${Inventory.getItemName(ItemType.Rock, true)}. Don't worry if some are too tough to break, we can deal with those later.`,
        success: `Great work, my field has never looked so ${Inventory.getItemName(ItemType.Rock)} free, and that's a compliment where I come from.`
      },
      [QuestName.collect_berries]: {
        intro: `Next we need to find some ${Inventory.getItemName(ItemType.Berry, true)}. There should be some ${Inventory.getItemName(ItemType.Berry, true)} up on the hill beside us. The gate to the hill is locked so take this ${Inventory.getItemName(ItemType.GateKey)}. Bring me back 4 ${Inventory.getItemName(ItemType.Berry, true)}. I think I also left my ${Inventory.getItemName(ItemType.WateringCan)} somewhere around there. Try find that too.`,
        failure: `Head up the the hill and bring me back 4 ${Inventory.getItemName(ItemType.Berry, true)} and the ${Inventory.getItemName(ItemType.WateringCan)}.`,
        success: `Fantastic, I've been looking for that ${Inventory.getItemName(ItemType.WateringCan)} for ages. Did you lock the gate again after you left? I don't want people wandering around up there stealing my berries.`,
      },
      [QuestName.clear_path_to_farm]: {
        intro: `You're almost ready to do some actual farming, you just need one thing: a farm. The path to the farm has become overgrown. There are some trees blocking the path. Take this ${Inventory.getItemName(ItemType.Axe)} and clear a path.`,
        failure: `Take that ${Inventory.getItemName(ItemType.Axe)} I gave you and clear a path to the farm. I know you broke the ${Inventory.getItemName(ItemType.GateKey)} and left the gate open by the way so you should have no problem getting back up there. I can't believe you broke the ${Inventory.getItemName(ItemType.GateKey)}, I was going to give that to my son for his birthday.`,
        success: `Fantastic, now the farming can begin!`,
      },
      [QuestName.plant_tree]: {
        intro: `Now for your next task. Take this ${Inventory.getItemName(ItemType.Shovel)}, head to the farm and plant some ${Inventory.getItemName(ItemType.Berry)} trees. Also take this ${Inventory.getItemName(ItemType.Berry)}, you'll need to plant it. As for the other 3 ${Inventory.getItemName(ItemType.Berry, true)} you gave me, I ate them. They were tasty. Yum. Come back to me once they have grown and you've collected 9 ${Inventory.getItemName(ItemType.Berry, true)}.`,
        failure: `Head to the farm and plant some ${Inventory.getItemName(ItemType.Berry)} trees, wait for them to grow and bring me back 9 ${Inventory.getItemName(ItemType.Berry)}.`,
        success: `You did it, now we can have all the ${Inventory.getItemName(ItemType.Berry, true)} we want! Unless you chop down all the trees and eat all the ${Inventory.getItemName(ItemType.Berry, true)}, but that would just be silly to do.`,
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

const NPC_FURNITURE_SALESMAN: Npc = {
  details: { 
    name: `Furniture Salesman`,
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    }
   },
  text: {
    quests: {},
    dialogue: {
      intro: `Hi, I'm the Furniture Salesman. Great of you to reach out so that we could touch base. I sell all sorts of furniture that can help you hit the ground running in your new home. So you can check out my wares or we can just chat and circle back later. `,
      default: `What's it gonna take to get you into a new bed today?`
    }
  }
};

const NPC_FARMING_SALESMAN: Npc = {
  details: { 
    name: `Farming Salesman`,
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    }
   },
  text: {
    quests: {},
    dialogue: {
      intro: `Hi, I'm the Farming Salesman. I buy and sell all things fruit and veg.`,
      default: `What can I help you with today?`
    }
  }
};

const NPC_TOOL_SALESMAN: Npc = {
  details: { 
    name: `Tool Salesman`,
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    }
   },
  text: {
    quests: {},
    dialogue: {
      intro: `Hi, I'm the Tool Salesman. I have all sorts of tools for sales. Check out my wares.`,
      default: `I've got tools if you've got gold!`
    }
  }
};

const NPC_FOREMAN: Npc = {
  details: { 
    name: `George the Foreman`,
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    }
   },
  text: {
    quests: {},
    dialogue: {
      intro: `Hey, I'm the Foreman. George the Foreman. No relation. I can't let you go up ahead. Rockslide. It's not safe. We'll have it cleared out eventually but the union says we can only work 14 minutes per day.`,
      default: `Quit grillin' me kid, I'm on break. The rockslide will be cleared when it's cleared. Did I mention I'm paid hourly?`
    }
  }
};

const NPC_WORKER: Npc = {
  details: { 
    name: `Worker`,
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    }
   },
  text: {
    quests: {},
    dialogue: {
      intro: `I can't let you go up ahead. Rockslide. It's not safe. We'll have it cleared out eventually but the union says we can only work 14 minutes per day.`,
      default: `Beat it kid, I'm on break. The rockslide will be cleared when it's cleared. Did I mention I'm paid hourly?`
    }
  }
};

const OBJECT_GATE = {
  interact: {
    intro: 'The gate is locked.',
    key: (type: ItemType) => `I insert the ${Inventory.getItemName(type)} into the lock. The lock clicks open. The key gets stuck though, oopsie...`,
    no_key: `Looks like I'll need to find a key. Or I could break it... but Mum didn't raise me that way.`,
    wrong_key: (type: ItemType) => `The ${Inventory.getItemName(type)} doesn't fit. I'll need to find the correct key.`,
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
    chicken: { ...NPC_CHICKEN },
    furniture_salesman: { ...NPC_FURNITURE_SALESMAN },
    farming_salesman: {...NPC_FARMING_SALESMAN},
    tool_salesman: {...NPC_TOOL_SALESMAN},
    workman: {...NPC_FOREMAN},
  },
  objects: {
    gate: { ...OBJECT_GATE },
    shack: { ...OBJECT_SHACK },
  }
};
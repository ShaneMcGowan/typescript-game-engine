import { Inventory, ItemType } from '@game/models/inventory.model';
import { QuestName, type QuestText } from '@game/models/quest.model';
import { type NpcDetails } from '@game/objects/npc.object';
import { Portrait } from '@game/objects/textbox.object';

interface Npc {
  details: NpcDetails;
  text: {
    quests: Partial<Record<QuestName, QuestText>>;
    dialogue: {
      intro: string;
      default: string;
    };
  };
}

export const NPC_FARMER_NAME: string = 'Farmer';
export const NPC_FARMER_PORTRAIT: Portrait = {
  tileset: 'tileset_emotes',
  x: 0,
  y: 0,
  height: 2,
  width: 2,
};

const NPC_FARMERS_SON_DETAILS: NpcDetails = {
  name: 'Farmer\'s Son',
  portrait: {
    tileset: 'tileset_emotes',
    x: 0,
    y: 0,
    width: 2,
    height: 2,
  },
};

const NPC_FARMERS_SON: Npc = {
  details: { ...NPC_FARMERS_SON_DETAILS, },
  text: {
    quests: {},
    dialogue: {
      intro: 'Hi, you must be new around here. I\'m the farmer\'s son. If you\'re looking for something to do, you should go speak with my father. He should be back at our house.',
      // shack_open: `Go find my Father, he's probably back at our house. He'll have something for you to do.`,
      default: 'When I grow up I want to be a main character like you. My father says it\'s just fine to be an NPC like him but I have delusions of grandeur due to being hit on the head as a child.',
    },
  },
};

const NPC_CHICKEN_DETAILS: NpcDetails = {
  name: 'Chicken',
  portrait: {
    tileset: 'tileset_chicken',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    scale: 2,
  },
};

const NPC_CHICKEN = {
  details: { ...NPC_CHICKEN_DETAILS, },
};

const NPC_FURNITURE_SALESMAN: Npc = {
  details: {
    name: 'Furniture Salesman',
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    },
  },
  text: {
    quests: {},
    dialogue: {
      intro: 'Hi, I\'m the Furniture Salesman. Great of you to reach out so that we could touch base. I sell all sorts of furniture that can help you hit the ground running in your new home. So you can check out my wares or we can just chat and circle back later. ',
      default: 'What\'s it gonna take to get you into a new bed today?',
    },
  },
};

const NPC_FARMING_SALESMAN: Npc = {
  details: {
    name: 'Farming Salesman',
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    },
  },
  text: {
    quests: {},
    dialogue: {
      intro: 'Hi, I\'m the Farming Salesman. I buy and sell all things fruit and veg.',
      default: 'What can I help you with today?',
    },
  },
};

const NPC_TOOL_SALESMAN: Npc = {
  details: {
    name: 'Tool Salesman',
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    },
  },
  text: {
    quests: {},
    dialogue: {
      intro: 'Hi, I\'m the Tool Salesman. I have all sorts of tools for sales. Check out my wares.',
      default: 'I\'ve got tools if you\'ve got gold!',
    },
  },
};

const NPC_FOREMAN: Npc = {
  details: {
    name: 'George the Foreman',
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    },
  },
  text: {
    quests: {},
    dialogue: {
      intro: 'Hey, I\'m the Foreman. George the Foreman. No relation. I can\'t let you go up ahead. Rockslide. It\'s not safe. We\'ll have it cleared out eventually but the union says we can only work 14 minutes per day.',
      default: 'Quit grillin\' me kid, I\'m on break. The rockslide will be cleared when it\'s cleared. Did I mention I\'m paid hourly?',
    },
  },
};

const NPC_WORKER: Npc = {
  details: {
    name: 'Worker',
    portrait: {
      tileset: 'tileset_emotes',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    },
  },
  text: {
    quests: {},
    dialogue: {
      intro: 'I can\'t let you go up ahead. Rockslide. It\'s not safe. We\'ll have it cleared out eventually but the union says we can only work 14 minutes per day.',
      default: 'Beat it kid, I\'m on break. The rockslide will be cleared when it\'s cleared. Did I mention I\'m paid hourly?',
    },
  },
};

const OBJECT_GATE = {
  interact: {
    intro: 'The gate is locked.',
    key: (type: ItemType) => `I insert the ${Inventory.getItemName(type)} into the lock. The lock clicks open. The key gets stuck though, oopsie...`,
    no_key: 'Looks like I\'ll need to find a key. Or I could break it... but Mum didn\'t raise me that way.',
    wrong_key: (type: ItemType) => `The ${Inventory.getItemName(type)} doesn't fit. I'll need to find the correct key.`,
  },
};

const OBJECT_SHACK = {
  door: {
    intro: 'It looks like some sort of shack. The light inside appears to be on. I wonder if anyone is there...',
    locked: 'The door is locked, maybe I should come back later.',
  },
};

export const SCENE_GAME_MAP_WORLD_TEXT = {
  npcs: {
    farmers_son: { ...NPC_FARMERS_SON, },
    chicken: { ...NPC_CHICKEN, },
    furniture_salesman: { ...NPC_FURNITURE_SALESMAN, },
    farming_salesman: { ...NPC_FARMING_SALESMAN, },
    tool_salesman: { ...NPC_TOOL_SALESMAN, },
    workman: { ...NPC_FOREMAN, },
  },
  objects: {
    gate: { ...OBJECT_GATE, },
    shack: { ...OBJECT_SHACK, },
  },
};

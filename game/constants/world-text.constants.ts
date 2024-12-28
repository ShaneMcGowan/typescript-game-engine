interface NpcDetails {
    name: string,
    portrait: {
      tileset: string,
      x: number,
      y: number
    }
}

const NPC_FARMER_DETAILS: NpcDetails = {
    name: `Farmer`,
    portrait: {
      tileset: 'tileset_player',
      x: 1,
      y: 1
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
      }
    },
    no_more_quests: `The guy who made this game is lazy and hasn't added more quests for you to do yet, just go mess about I guess.`,
    goodbye: `Thanks, come again any time!`
  }
};

const NPC_FARMERS_SON_DETAILS: NpcDetails = {
  name: `Farmer's Son`,
  portrait: {
    tileset: 'tileset_player',
    x: 1,
    y: 1
  }
};

const NPC_FARMERS_SON = {
  details: { ...NPC_FARMERS_SON_DETAILS },
  text: {
    intro: `Hi, you must be new around here. I'm the farmer's son. If you're looking for something to do, you should go speak with my father. He should be back at our house.`,
    shack_open: `Go find my Father, he's probably back at our house. He'll have something for you to do.`
  }
};

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
  },
  objects: {
    gate: { ...OBJECT_GATE },
    shack: { ...OBJECT_SHACK },
  }
};
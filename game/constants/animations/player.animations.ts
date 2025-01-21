import { Direction } from "@game/models/direction.model";

export interface ObjectAnimation {
  tileset: string;
  length: number;
  frames: ObjectAnimationFrame[],
  width: number,
  height: number,
}

export interface ObjectAnimationFrame {
  x: number,
  y: number,
}

const UseHoeLength: number = 0.5;
const UseAxeLength: number = 0.5;


export type PlayerActionAnimation = Record<Direction, ObjectAnimation>;
export type PlayerActionAnimationCallback = () => void;

export class AnimationsPlayer {

  static readonly UseHoe: PlayerActionAnimation = {
    [Direction.Up]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 3,
        },
        {
          x: 3,
          y: 3,
        }
      ]
    },
    [Direction.Down]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 3,
          y: 0,
        }
      ]
    },
    [Direction.Left]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 6,
        },
        {
          x: 3,
          y: 6,
        }
      ]
    },
    [Direction.Right]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 9,
        },
        {
          x: 3,
          y: 9,
        }
      ]
    }
  }

  static readonly UseAxe: PlayerActionAnimation = {
    [Direction.Down]: {
      tileset: 'tileset_actions',
      length: UseAxeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 12,
        },
        {
          x: 3,
          y: 12,
        }
      ]
    },
    [Direction.Up]: {
      tileset: 'tileset_actions',
      length: UseAxeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 15,
        },
        {
          x: 3,
          y: 15,
        }
      ]
    },
    [Direction.Left]: {
      tileset: 'tileset_actions',
      length: UseAxeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 18,
        },
        {
          x: 3,
          y: 18,
        }
      ]
    },
    [Direction.Right]: {
      tileset: 'tileset_actions',
      length: UseAxeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 21,
        },
        {
          x: 3,
          y: 21,
        }
      ]
    }
  }

  static readonly UseWateringCan: PlayerActionAnimation = {
    [Direction.Down]: {
      tileset: 'tileset_actions',
      length: UseAxeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 24,
        },
        {
          x: 3,
          y: 24,
        }
      ]
    },
    [Direction.Up]: {
      tileset: 'tileset_actions',
      length: UseAxeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 27,
        },
        {
          x: 3,
          y: 27,
        }
      ]
    },
    [Direction.Left]: {
      tileset: 'tileset_actions',
      length: UseAxeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 30,
        },
        {
          x: 3,
          y: 30,
        }
      ]
    },
    [Direction.Right]: {
      tileset: 'tileset_actions',
      length: UseAxeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 33,
        },
        {
          x: 3,
          y: 33,
        }
      ]
    }
  }

  static readonly UseShovel: PlayerActionAnimation = {
    [Direction.Up]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 3,
        },
        {
          x: 3,
          y: 3,
        }
      ]
    },
    [Direction.Down]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 3,
          y: 0,
        }
      ]
    },
    [Direction.Left]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 6,
        },
        {
          x: 3,
          y: 6,
        }
      ]
    },
    [Direction.Right]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 9,
        },
        {
          x: 3,
          y: 9,
        }
      ]
    }
  }

  static readonly UsePickaxe: PlayerActionAnimation = {
    [Direction.Up]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 3,
        },
        {
          x: 3,
          y: 3,
        }
      ]
    },
    [Direction.Down]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 3,
          y: 0,
        }
      ]
    },
    [Direction.Left]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 6,
        },
        {
          x: 3,
          y: 6,
        }
      ]
    },
    [Direction.Right]: {
      tileset: 'tileset_actions',
      length: UseHoeLength,
      width: 3,
      height: 3,
      frames: [
        {
          x: 0,
          y: 9,
        },
        {
          x: 3,
          y: 9,
        }
      ]
    }
  }
};
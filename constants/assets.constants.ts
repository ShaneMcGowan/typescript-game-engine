interface Assets {
  images: Record<string, string>;
  audio: Record<string, string>;
}

export const ASSETS: Assets = {
  images: {
    tileset_grass: '/assets/sample/Tilesets/Grass.png',
    tileset_water: '/assets/sample/Tilesets/Water.png',
    tileset_player: '/assets/sample/Characters/Basic Charakter Spritesheet.png',
    tileset_chicken: '/assets/sample/Characters/Free Chicken Sprites.png',
    tileset_fence: '/assets/sample/Tilesets/Fences.png',
    tileset_egg: '/assets/sample/Characters/Egg_And_Nest.png',
    tileset_house: '/assets/sample/Tilesets/Wooden House.png',
    tileset_dirt: '/assets/sample/Tilesets/Tilled_Dirt.png',
    tileset_button: '/assets/sample/UI Big Play Button.png',
  },
  audio: {}
}

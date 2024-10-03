export const player = {
  name: "Enki",
  tag: "hero",
  level: 1,
  hp: 10,
  mp: 4,
  str: 2,
  def: 2,
  agi: 2,
  movePoints: 2,
  actionPoints: 1,
  img: 'assets/player_ryu1.png',
  vertical_img: 'assets/vertical_portrait_ryu_v2.png',
  posX: null,
  posY: null,
  turnDone: false,
  hasMoved: false,
  hasAttacked: false,
  weapons: [
    { name: "Sword", range: 1, damage: 4, crit: 0.1 },
    { name: "Punch", range: 1, damage: 2, crit: 0.5 },
    { name: "Bow", range: 4, damage: 2, crit: 0.2 }
  ],
  inventory: [
    { name: "Potion", quantity: 5 },
    { name: "Ether", quantity: 3 },
    { name: "Elixir", quantity: 1 }
  ],
}
export const enemy = {
  name: "Undead",
  tag: "enemy",
  level: 1,
  hp: 10,
  mp: 4,
  str: 2,
  def: 2,
  agi: 2,
  movePoints: 2,
  actionPoints: 1,
  img: 'assets/enemy.png',
  vertical_img: 'assets/vertical_portrait_skeleton_v3.png',
  posX: null,
  posY: null,
  turnDone: false,
  hasMoved: false,
  hasAttacked: false,
  weapons: [
    { name: "Sword", range: 1, damage: 4, crit: 0.1 },
    { name: "Bow", range: 4, damage: 2, crit: 0.2 }
  ],
  inventory: [
    { name: "Potion", quantity: 5 },
    { name: "Ether", quantity: 3 },
    { name: "Elixir", quantity: 1 }
  ],
}

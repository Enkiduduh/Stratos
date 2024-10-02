export const player = {
  name: "Enki",
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
  inventory: [
    { name: "Potion", quantity: 5 },
    { name: "Ether", quantity: 3 },
    { name: "Elixir", quantity: 1 }
  ],
}
export const enemy = {
  name: "Undead",
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
  inventory: [
    { name: "Potion", quantity: 5 },
    { name: "Ether", quantity: 3 },
    { name: "Elixir", quantity: 1 }
  ],
}

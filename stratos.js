const chessCases = document.querySelectorAll(".case");
const imgHero = document.querySelector(".img-hero");
const imgEnemy = document.querySelector(".img-enemy");
const heroDisplay = document.getElementById(`hero`);
const displayCmdHero = document.querySelector(`.hero-cmd`);
const displayCmdFoe = document.querySelector(`.foe-cmd`);
const foeDisplay = document.getElementById(`foe`);
const actionButtons = document.querySelectorAll(".actionBtn");
const movPoints = document.querySelector(".mov-points");
const endBtn = document.querySelector(".endBtn");
const yesBtn = document.querySelector(".yesBtn");
const noBtn = document.querySelector(".noBtn");
const inventoryBag = document.querySelector(".inventory-container");
const attackBag = document.querySelector(".attack-container");
let endTurn = false;
let isPlayerTurn = true; // Détermine si c'est le tour du joueur ou de l'ennemi
let selectedWeaponName = null;

const player = {
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
const enemy = {
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

const initialDefPlayer = player.def;
const initialDefEnemy = enemy.def;

function initalPos(char_obj, x, y) {
  char_obj.posX = x;
  char_obj.posY = y;
}

initalPos(player, 2, 2)
initalPos(enemy, 5, 6)


function actionButtonsHandler(char_obj, char_case) {
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("endBtn")) {
        actionEndTurn(char_obj);
      }
      if (btn.classList.contains("attackBtn")) {
        attackHandler(char_obj);
        console.log(selectedWeaponName)
        if (selectedWeaponName != null) {
          console.log('Enter atk phase')
          attackTarget(char_obj, selectedWeaponName)
          console.log('Out atk phase')
        }
      }
      if (btn.classList.contains("defendBtn")) {
        actionDefend(char_obj);
      }
      if (btn.classList.contains("moveBtn")) {
        targetMovement(char_obj, char_case);
      }
      if (btn.classList.contains("inventoryBtn")) {
        inventoryHandler(char_obj)
      }
      displayCharHeroInfo(char_obj, char_case);
    });
  });
}


function initPlayer() {
  const playerCase = document.querySelector(`.case[data-x="${player.posX}"][data-y="${player.posY}"]`);
  const portraitPlayer = document.querySelector(".display-player");
  portraitPlayer.innerHTML = `<img src=${player.vertical_img} alt=${player.name} /> `;
  playerCase.innerHTML = `
  <div class="char-obj-case">
    <img src=${player.img} alt=${player.name}>
    <div class="char-obj-case-life-container">
        <div class="char-obj-case-life"><div>
    </div>
  </div>`;
  displayCharHeroInfo(player, playerCase);

  const enemyCase = document.querySelector(`.case[data-x="${enemy.posX}"][data-y="${enemy.posY}"]`);
  const portraitEnemy = document.querySelector(".display-enemy");
  portraitEnemy.innerHTML = `<img src=${enemy.vertical_img} alt=${enemy.name} /> `;
  enemyCase.innerHTML = `
  <div class="char-obj-case">
    <img src=${enemy.img} alt=${enemy.name}>
    <div class="char-obj-case-life-container">
        <div class="char-obj-case-life"><div>
    </div>
  </div>`;
  displayCharFoeInfo(enemy);
  playerCase.addEventListener("click", () => {
    actionButtonsHandler(player, playerCase);

  })
}


function initEnemy() {
  const enemyCase = document.querySelector(`.case[data-x="${enemy.posX}"][data-y="${enemy.posY}"]`);
  enemyCase.innerHTML = `
  <div class="char-obj-case">
    <img src=${enemy.img} alt=${enemy.name}>
    <div class="char-obj-case-life-container">
        <div class="char-obj-case-life"><div>
    </div>
  </div>`;
  displayCharFoeInfo(enemy);
  enemyCase.addEventListener("click", () => {
    actionButtonsHandler(enemy, enemyCase);
  })

}


// Attente de la fin du tour
function waitForTurnEnd(char_obj) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (char_obj.turnDone === true) {
        clearInterval(interval); // Arrête la vérification
        char_obj.turnDone = false; // Réinitialiser le drapeau du tour
        char_obj.actionPoints = 1;
        resolve(); // La promesse est résolue quand le tour est fini
      }
    }, 100); // Vérifie toutes les 100ms
  });
}



chessCases.forEach((square) => {
  // Récupérer les attributs data-x et data-y
  const posX = square.dataset.x;
  const posY = square.dataset.y;

  square.addEventListener("click", () => {
    console.log(posX, posY)
  })
})


function turn() {
  // resetBoard(); // Réinitialiser les déplacements possibles et autres effets visuels

  if (isPlayerTurn) {
    console.log("Player's turn begins.");
    initPlayer(); // Initialisation du joueur
    waitForTurnEnd(player).then(() => {
      console.log("Player's turn is done.");
      isPlayerTurn = false; // Passer au tour de l'ennemi
      enemy.def = initialDefEnemy;
      turn(); // Recommence le cycle pour l'ennemi
    });
  } else {
    console.log("Enemy's turn begins.");
    initEnemy(); // Initialisation de l'ennemi
    waitForTurnEnd(enemy).then(() => {
      console.log("Enemy's turn is done.");
      isPlayerTurn = true; // Repasser au tour du joueur
      player.def = initialDefPlayer;
      turn(); // Recommence le cycle pour le joueur
    });
  }
}


function actionEndTurn(char_obj) {
  endBtn.classList.add("actionBtn:hover");
  yesBtn.style.display = "block";
  noBtn.style.display = "block";
  yesBtn.addEventListener("click", () => {
    char_obj.turnDone = true;
    console.log(`Turn of ${char_obj.name} has ended.`);
    yesBtn.style.display = "none";
    noBtn.style.display = "none";
  });
  noBtn.addEventListener("click", () => {
    yesBtn.style.display = "none";
    noBtn.style.display = "none";
  });
}

function inventoryHandler(char_obj) {
  const inventory = char_obj.inventory;
  if (inventoryBag.textContent === "" || inventoryBag.style.display === 'none') {
    inventoryBag.style.display = "block";
    inventory.forEach((item) => {
      inventoryBag.innerHTML += `
      <div class="inventory-line">
        <div>${item.name}: </div>
        <div>${item.quantity}</div>
      </div>`;
    });
  } else {
    // Reset inventory display
    inventoryBag.innerHTML = '';
    inventoryBag.style.display = "none";
    console.log("Close Inventory");
  }
}

function attackWeaponSelector(element) {
  // Vous pouvez maintenant accéder à l'élément cliqué et ses enfants
  const weaponName = element.querySelector('.attack-line-text').textContent;
  console.log(weaponName);
  selectedWeaponName = weaponName;
}

function attackHandler(char_obj) {
  console.log("Test attack");
  const weapons = char_obj.weapons;
  if (attackBag.textContent === "" || attackBag.style.display === 'none') {
    attackBag.style.display = "block";
    weapons.forEach((weapon) => {
      const attackLine = document.createElement('div');
      attackLine.className = 'attack-line';
      attackLine.innerHTML = `
        <div class="attack-line-text">${weapon.name}</div>
        <div class="attack-line-text">R: ${weapon.range}</div>
        <div class="attack-line-text">Dmg: ${weapon.damage}</div>
      `;
      attackLine.addEventListener('click', () => attackWeaponSelector(attackLine));
      attackBag.appendChild(attackLine);
    });
  } else {
    // Reset attack display
    attackBag.innerHTML = '';
    attackBag.style.display = "none";
    console.log("Attack already displayed");
  }
}

function actionDefend(char_obj) {
  if (char_obj.actionPoints < 1) {
    console.log("Not enough action points.");
    return;
  }
  char_obj.def *= 2;
  char_obj.actionPoints -= 1;
  console.log(`${char_obj.name} sets on defensive state. Def up to ${char_obj.def}.`);
}

console.log(movPoints)

function attackTarget(char_obj, weaponChoice) {
  const actualPos = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY}"]`);
  const target = document.querySelector(`.case[data-x="${enemy.posX}"][data-y="${enemy.posY}"]`);
  if (char_obj.actionPoints < 1) {
    console.log("Not enough action points.");
    return;
  }
  if (char_obj.hasAttacked) {
    console.log("Already attacked.");
    return;
  }
  if (char_obj.actionPoints > 0) {
    console.log(selectedWeaponName)
    let weaponRange = null;
    const weapons = char_obj.weapons;
    const weaponBow = weapons.filter((weapon) => weapon.name.includes("Bow"));
    const weaponSword = weapons.filter((weapon) => weapon.name.includes("Sword"));
    if (weaponChoice == weaponSword[0].name) {
      weaponRange = weaponSword[0].range;
    } else if (weaponChoice == weaponBow[0].name) {
      weaponRange = weaponBow[0].range;
    } else {
      console.log("Error in weapon name...")
    }

    for (let i = 0; i <= weaponRange; i++) {
      const posPlusMovX = document.querySelector(`.case[data-x="${char_obj.posX + i}"][data-y="${char_obj.posY}"]`);
      const posPlusMovY = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY + i}"]`);
      const posMinusMovX = document.querySelector(`.case[data-x="${char_obj.posX - i}"][data-y="${char_obj.posY}"]`);
      const posMinusMovY = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY - i}"]`);

      // Add the class "possibleMov"
      if (posPlusMovX) posPlusMovX.classList.add("possibleAtk");
      if (posPlusMovY) posPlusMovY.classList.add("possibleAtk");
      if (posMinusMovX) posMinusMovX.classList.add("possibleAtk");
      if (posMinusMovY) posMinusMovY.classList.add("possibleAtk");
      actualPos.classList.remove("possibleAtk");

      const attacks = [posPlusMovX, posPlusMovY, posMinusMovX, posMinusMovY];
      attacks.forEach((attack) => {
        if (attack) {
          attack.addEventListener("click", () => {
            console.log("Attack this case!")
          });
        }
      })



    }
  }
}
const weapons = player.weapons
const testWpn = "Bow";
let testRange = null;
const weaponBow = weapons.filter((weapon) => weapon.name.includes("Bow"));
console.log(weaponBow[0].name == "Bow")
if (testWpn == weaponBow[0].name) {
  testRange = weaponBow[0].range;
}
console.log(testRange)
console.log(testWpn)

function targetMovement(char_obj, char_case) {
  const actualPos = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY}"]`);
  actualPos.classList.add("initial-square");
  if (char_obj.movePoints > 0) {
    for (let i = 1; i <= char_obj.movePoints; i++) {
      const posPlusMovX = document.querySelector(`.case[data-x="${char_obj.posX + i}"][data-y="${char_obj.posY}"]`);
      const posPlusMovY = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY + i}"]`);
      const posMinusMovX = document.querySelector(`.case[data-x="${char_obj.posX - i}"][data-y="${char_obj.posY}"]`);
      const posMinusMovY = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY - i}"]`);

      // Add the class "possibleMov" to valid squares that are not occupied
      if (posPlusMovX && !posPlusMovX.dataset.occupied) posPlusMovX.classList.add("possibleMov");
      if (posPlusMovY && !posPlusMovY.dataset.occupied) posPlusMovY.classList.add("possibleMov");
      if (posMinusMovX && !posMinusMovX.dataset.occupied) posMinusMovX.classList.add("possibleMov");
      if (posMinusMovY && !posMinusMovY.dataset.occupied) posMinusMovY.classList.add("possibleMov");

      const moves = [posPlusMovX, posPlusMovY, posMinusMovX, posMinusMovY];
      if (!char_obj.turnDone) {
        moves.forEach(move => {
          if (move) {
            const mouseOverHandler = () => {
              if (char_obj.posX == actualPos.dataset.x && char_obj.posY == actualPos.dataset.y) {
                move.classList.add("selected-square");
              }
            };
            const mouseOutHandler = () => {
              move.classList.remove("selected-square");
            };
            const clickHandler = () => {
              actualPos.innerHTML = '';
              actualPos.classList.remove("initial-square");
              actualPos.removeAttribute('data-occupied');

              // Remove all "possibleMov" and "selected-square" classes after the move
              const allPossibleMoves = document.querySelectorAll(".possibleMov");
              const allSelectedMoves = document.querySelectorAll(".selected-square");
              allPossibleMoves.forEach(m => m.classList.remove("possibleMov"));
              allSelectedMoves.forEach(m => m.classList.remove("selected-square"));

              char_case = move;
              char_case.innerHTML = `
              <div class="char-obj-case">
                  <img src=${char_obj.img} alt=${char_obj.name}>
                  <div class="char-obj-case-life-container">
                      <div class="char-obj-case-life"><div>
                  </div>
              </div>`;

              char_case.setAttribute('data-occupied', 'true');

              // Update character movePoints to prevent further moves
              char_obj.movePoints = 0;

              // Update character coordinates
              char_obj.posX = parseInt(move.dataset.x);
              char_obj.posY = parseInt(move.dataset.y);

              console.log(`Moved to new position: (${char_obj.posX}, ${char_obj.posY})`);
              // char_obj.turnDone = true;
              // console.log(`Turn of ${char_obj.name} has ended.`);

              // Remove event listeners to prevent further moves
              moves.forEach(m => {
                if (m) {
                  m.replaceWith(m.cloneNode(true));
                }
              });
            };

            move.addEventListener("mouseover", mouseOverHandler);
            move.addEventListener("mouseout", mouseOutHandler);
            move.addEventListener("click", clickHandler, { once: true });

            // Store handlers to remove them later
            move._handlers = { mouseOverHandler, mouseOutHandler, clickHandler };
          }
        });
      } else {
        console.log("Player has already made his move");
      }
    }
  }
}

// Function to remove event listeners
function removeEventListeners(moves) {
  moves.forEach(move => {
    if (move && move._handlers) {
      move.removeEventListener("mouseover", move._handlers.mouseOverHandler);
      move.removeEventListener("mouseout", move._handlers.mouseOutHandler);
      move.removeEventListener("click", move._handlers.clickHandler);
      delete move._handlers;
    }
  });
}

function displayCharHeroInfo(char_obj) {
  if (char_obj == player) {
    const dataDisplay = document.querySelector(`.display-player-stats`);
    dataDisplay.innerHTML = `
        <div class="stats-column">
          <div class="display-player-stats-infos">${char_obj.name}</div>
          <div class="display-player-stats-infos">Level: ${char_obj.level}</div>
          <div class="display-player-stats-infos">AC: ${char_obj.actionPoints}</div>
        </div>
        <div class="stats-column">
          <div class="display-player-stats-infos">HP: ${char_obj.hp}</div>
          <div class="display-player-stats-infos">PC: ${char_obj.mp}</div>
          <div class="display-player-stats-infos">MOV: ${char_obj.movePoints}</div>
        </div>
        <div class="stats-column">
          <div class="display-player-stats-infos">STR: ${char_obj.str}</div>
          <div class="display-player-stats-infos">DEF: ${char_obj.def}</div>
          <div class="display-player-stats-infos">AGI: ${char_obj.agi}</div>
        </div>
    `;
  }
}



function displayCharFoeInfo(char_obj) {
  const dataDisplay = document.querySelector(`.display-enemy-stats`);
  dataDisplay.innerHTML = `
      <div class="stats-column">
        <div class="display-enemy-stats-infos">STR: ${char_obj.str}</div>
        <div class="display-enemy-stats-infos">DEF: ${char_obj.def}</div>
        <div class="display-enemy-stats-infos">AGI: ${char_obj.agi}</div>
      </div>
      <div class="stats-column">
        <div class="display-enemy-stats-infos">HP: ${char_obj.hp}</div>
        <div class="display-enemy-stats-infos">PC: ${char_obj.mp}</div>
        <div class="display-enemy-stats-infos">MOV: ${char_obj.movePoints}</div>
      </div>
      <div class="stats-column">
        <div class="display-enemy-stats-infos">${char_obj.name}</div>
        <div class="display-enemy-stats-infos">Level: ${char_obj.level}</div>
        <div class="display-enemy-stats-infos">AC: ${char_obj.actionPoints}</div>
      </div>
  `;
}

// Démarrage du cycle jeu
turn();

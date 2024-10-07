// import { attackWeaponSelector } from "./gameLogic"

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
const displayCombat = document.querySelector(".display-combat");
const battleScreen = document.querySelector(".battle-screen-modal");
displayCombat.style.display = "none";
let endTurn = false;
let isPlayerTurn = true; // Détermine si c'est le tour du joueur ou de l'ennemi
let selectedWeaponName = null;

// const actionPlayerInBattle = document.querySelector(".player-action");
// const attackNormal = document.getElementById("attackCommandNormal");
// const attackCritical = document.getElementById("attackCommandCritical");
// const attackBlock = document.getElementById("attackCommandBlock");
// const attackFlee = document.getElementById("attackCommandFlee");
// const actionEnemyInBattle = document.querySelector(".enemy-action");

const player = {
  name: "Enki",
  tag: "hero",
  level: 12,
  hp: 120,
  mp: 30,
  str: 25,
  def: 20,
  agi: 40,
  movePoints: 2,
  actionPoints: 1,
  alive: true,
  img: 'assets/player_ryu1.png',
  vertical_img: 'assets/vertical_portrait_ryu_v2.png',
  posX: null,
  posY: null,
  turnDone: false,
  hasMoved: false,
  hasAttacked: false,
  weapons: [
    { name: "Sword", range: 1, damage: 35, crit: 0.1, attackNb: 1 },
    { name: "Bow", range: 3, damage: 20, crit: 0.2, attackNb: 2 }
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
  level: 15,
  hp: 250,
  mp: 20,
  str: 50,
  def: 30,
  agi: 10,
  movePoints: 2,
  actionPoints: 1,
  alive: true,
  img: 'assets/enemy.png',
  vertical_img: 'assets/vertical_portrait_skeleton_v3.png',
  posX: null,
  posY: null,
  turnDone: false,
  hasMoved: false,
  hasAttacked: false,
  weapons: [
    { name: "Sword", range: 1, damage: 35, crit: 0.1, attackNb: 1 },
    { name: "Bow", range: 3, damage: 20, crit: 0.2, attackNb: 2 }
  ],
  inventory: [
    { name: "Potion", quantity: 5 },
    { name: "Ether", quantity: 3 },
    { name: "Elixir", quantity: 1 }
  ],
}

const EnemyTarget = {
  hp: enemy.hp
};
const immutableTargetMaxHp = Object.freeze({ ...EnemyTarget });

const initialDefPlayer = player.def;
const initialDefEnemy = enemy.def;

function initalPos(char_obj, x, y) {
  char_obj.posX = x;
  char_obj.posY = y;
}

initalPos(player, 4, 2)
initalPos(enemy, 4, 5)


function actionButtonsHandler(char_obj, char_case) {
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("endBtn")) {
        actionEndTurn(char_obj);
      }
      if (btn.classList.contains("attackBtn")) {
        attackHandler(char_obj);
        console.log(selectedWeaponName)
        // if (selectedWeaponName != null) {
        //   attackTarget(char_obj, selectedWeaponName)
        // }
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
  playerCase.classList.add("heroTag");
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
  enemyCase.classList.add("enemyTag");
  enemyCase.innerHTML = `
  <div class="char-obj-case">
    <img src=${enemy.img} alt=${enemy.name}>
    <div class="char-obj-case-life-container">
        <div class="char-obj-case-life"><div>
    </div>
  </div>`;
  displayCharFoeInfo(enemy, enemyCase);
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
  displayCombat.style.display = "none";
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

function attackWeaponSelector(element, char_obj) {
  // Vous pouvez maintenant accéder à l'élément cliqué et ses enfants
  const weaponName = element.querySelector('.attack-line-text').textContent;
  console.log(weaponName);
  selectedWeaponName = weaponName;
  if (selectedWeaponName != null) {
    attackTarget(char_obj, selectedWeaponName)
  }

}

function attackHandler(char_obj) {
  const weapons = char_obj.weapons;

  if (attackBag.textContent === "" || attackBag.style.display === 'none') {
    attackBag.style.display = "block";
    weapons.forEach((weapon) => {
      const attackLine = document.createElement('div');
      attackLine.className = 'attack-line';
      attackLine.innerHTML = `
        <div class="attack-line-text">${weapon.name}</div>
        <div class="attack-line-text">Dmg: ${weapon.damage}</div>
        <div class="attack-line-text small">R: ${weapon.range}</div>
        <div class="attack-line-text small">X ${weapon.attackNb}</div>
      `;
      attackLine.addEventListener('click', () => attackWeaponSelector(attackLine, char_obj));
      attackBag.appendChild(attackLine);
    });
  } else {
    // Reset attack display
    displayCombat.innerHTML = '';
    displayCombat.style.display = "none";
    attackBag.innerHTML = '';
    attackBag.style.display = "none";
    const allPossibleAttacks = document.querySelectorAll(".possibleAtk");
    allPossibleAttacks.forEach(m => m.classList.remove("possibleAtk"));
    console.log("Reset Attack display");
  }
}

function actionDefend(char_obj) {
  if (char_obj.actionPoints < 1) {
    console.log("Not enough action points.");
    return;
  }
  char_obj.def *= 2;
  char_obj.actionPoints -= 1;
  displayCombat.style.display = "none";
  console.log(`${char_obj.name} sets on defensive state. Def up to ${char_obj.def}.`);
}

console.log(movPoints)

function attackTarget(char_obj, weaponChoice) {
  const actualPos = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY}"]`);
  const target = document.querySelector(`.case[data-x="${enemy.posX}"][data-y="${enemy.posY}"]`);
  target.classList.add("enemyTag")
  if (char_obj.actionPoints < 1) {
    console.log("Not enough action points.");
    return;
  }
  if (char_obj.hasAttacked) {
    console.log("Already attacked.");
    return;
  }
  if (char_obj.actionPoints > 0) {
    let weaponRange = null;
    const allPossibleAttacks = document.querySelectorAll(".possibleAtk");
    allPossibleAttacks.forEach(m => m.classList.remove("possibleAtk"));
    const weapons = char_obj.weapons;
    const weaponBow = weapons.filter((weapon) => weapon.name.includes("Bow"));
    const weaponSword = weapons.filter((weapon) => weapon.name.includes("Sword"));
    if (weaponChoice == weaponSword[0].name) {
      weaponRange = weaponSword[0].range;
      for (let i = 1; i <= weaponRange; i++) {
        const posPlusMovX = document.querySelector(`.case[data-x="${char_obj.posX + i}"][data-y="${char_obj.posY}"]`);
        const posPlusMovY = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY + i}"]`);
        const posMinusMovX = document.querySelector(`.case[data-x="${char_obj.posX - i}"][data-y="${char_obj.posY}"]`);
        const posMinusMovY = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY - i}"]`);
        displayAttackArea(actualPos, char_obj, enemy, weaponSword[0], posPlusMovY, posPlusMovX, posMinusMovY, posMinusMovX)
      }
    } else if (weaponChoice == weaponBow[0].name) {
      weaponRange = weaponBow[0].range;
      for (let i = 1; i < weaponRange; i++) {
        const posPlusMovX = document.querySelector(`.case[data-x="${char_obj.posX + i + 1}"][data-y="${char_obj.posY}"]`);
        const posPlusMovY = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY + i + 1}"]`);
        const posMinusMovX = document.querySelector(`.case[data-x="${char_obj.posX - i - 1}"][data-y="${char_obj.posY}"]`);
        const posMinusMovY = document.querySelector(`.case[data-x="${char_obj.posX}"][data-y="${char_obj.posY - i - 1}"]`);
        const posDiagNE1 = document.querySelector(`.case[data-x="${char_obj.posX + 2}"][data-y="${char_obj.posY + 1}"]`);
        const posDiagNE2 = document.querySelector(`.case[data-x="${char_obj.posX + 1}"][data-y="${char_obj.posY + 2}"]`);
        const posDiagNW1 = document.querySelector(`.case[data-x="${char_obj.posX - 2}"][data-y="${char_obj.posY + 1}"]`);
        const posDiagNW2 = document.querySelector(`.case[data-x="${char_obj.posX - 1}"][data-y="${char_obj.posY + 2}"]`);
        const posDiagSE1 = document.querySelector(`.case[data-x="${char_obj.posX + 2}"][data-y="${char_obj.posY - 1}"]`);
        const posDiagSE2 = document.querySelector(`.case[data-x="${char_obj.posX + 1}"][data-y="${char_obj.posY - 2}"]`);
        const posDiagSW1 = document.querySelector(`.case[data-x="${char_obj.posX - 2}"][data-y="${char_obj.posY - 1}"]`);
        const posDiagSW2 = document.querySelector(`.case[data-x="${char_obj.posX - 1}"][data-y="${char_obj.posY - 2}"]`);
        displayAttackArea(actualPos, char_obj, enemy, weaponBow[0],
          posPlusMovY, posPlusMovX, posMinusMovY, posMinusMovX,
          posDiagNE1, posDiagNE2, posDiagNW1, posDiagNW2,
          posDiagSE1, posDiagSE2, posDiagSW1, posDiagSW2)
      }

    } else {
      console.log("Error in weapon name...")
    }
  }
}


function displayAttackArea(initialPosition, char_obj, char_target, weaponChoice, ...positions) {
  positions.forEach(pos => {
    if (pos) {
      pos.classList.add("possibleAtk");
    }
  })
  initialPosition.classList.remove("possibleAtk");
  const attacks = [...positions];
  attacks.forEach((attack) => {
    if (attack) {
      attack.addEventListener("click", () => {
        if (attack.classList.contains('enemyTag')) {
          console.log('Attack possible');
          console.log('Target contains an enemy');
          displayAttackBattleInfo(char_obj, char_target, weaponChoice)
        } else {
          console.log('Attack impossible');
          console.log('Target does not contain an enemy');
        }
      });
    }
  })
}

const rngCrit = Math.floor((Math.random() * 100) + 1);
console.log(rngCrit)

function displayAttackBattleInfo(char_obj, char_target, weaponChoice) {
  displayCombat.style.display = "flex";
  const startBattle = document.querySelector(".startBattle");
  const boxHero = document.getElementById("combat-box-hero");
  const boxFoe = document.getElementById("combat-box-foe");

  const hitRate = char_obj.agi * 2;
  const nbAttacks = weaponChoice.attackNb;
  let damage = weaponChoice.damage;
  const critAttack = weaponChoice.crit * 100;

  const def = char_target.def;
  const hpLost = char_target.hp - (weaponChoice.damage * weaponChoice.attackNb);
  const blockRate = (char_target.hp + char_target.str + char_target.def) / 20;
  const fleeRate = char_target.agi;

  boxHero.innerHTML = `
  <div class="display-combat-box-hit">
  <div class="display-combat-box-hit-name">HIT</div>
  <div class="display-combat-box-hit-value">${hitRate}%</div>
  </div>
  <div class="display-combat-box-stat">
      <div class="display-combat-box-stat-line-box hero">
        <div class="display-combat-box-stat-line">${nbAttacks}</div>
        <div class="display-combat-box-stat-line-stat">ATK</div>
      </div>
      <div class="display-combat-box-stat-line-box hero">
        <div class="display-combat-box-stat-line">${weaponChoice.damage}</div>
        <div class="display-combat-box-stat-line-stat">DMG</div>
      </div>
      <div class="display-combat-box-stat-line-box hero">
        <div class="display-combat-box-stat-line">${critAttack} </div>
        <div class="display-combat-box-stat-line-stat">CRI</div>
      </div>
    </div>
  `;
  boxFoe.innerHTML = `
  <div class="display-combat-box-stat">
    <div class="display-combat-box-stat-line-box foe">
      <div class="display-combat-box-stat-line-stat">DEF</div>
      <div class="display-combat-box-stat-line">${def}</div>
    </div>
    <div class="display-combat-box-stat-line-box foe">
      <div class="display-combat-box-stat-line-stat">HP</div>
      <div class="display-combat-box-stat-line">${hpLost}</div>
    </div>
    <div class="display-combat-box-stat-line-box foe">
      <div class="display-combat-box-stat-line-stat">BLC</div>
      <div class="display-combat-box-stat-line">${blockRate}%</div>
    </div>
  </div>
  <div class="display-combat-box-hit">
    <div class="display-combat-box-hit-name">FLEE</div>
    <div class="display-combat-box-hit-value">${fleeRate}%</div>
  </div>
</div>
  `;

  startBattle.addEventListener("click", () => {
    const actionPlayerInBattle = document.querySelector(".player-action");
    const actionEnemyInBattle = document.querySelector(".enemy-action");

    let actionCommand = "";
    console.log("Animation Battle Starts")
    const allPossibleAttacks = document.querySelectorAll(".possibleAtk");
    allPossibleAttacks.forEach(m => m.classList.remove("possibleAtk"));
    if (char_target.def > char_obj.str * 2) {
      damage = 0;
      console.log("Attack Successfully Blocked")
      actionCommand = "block";
    } else if (Math.floor((Math.random() * 100) + 1) <= fleeRate) {
      damage = 0;
      console.log("Flee Successed")
      actionCommand = "flee";
    } else {
      if (Math.floor((Math.random() * 100) + 1) <= critAttack) {
        damage = (weaponChoice.damage * 1.5) * nbAttacks;
        console.log("Critical Hit")
        actionCommand = "critical";
      } else {
        damage = weaponChoice.damage * nbAttacks;
        actionCommand = "normal";

      }
      const updateHpLost = damage;
      const hpLost = updateHpLost - (updateHpLost * (blockRate / 100));
      const maxTargetHp = immutableTargetMaxHp.hp;
      console.log(maxTargetHp)
      char_target.hp -= Math.round(hpLost);
      const targetHpLeft = char_target.hp
      console.log(targetHpLeft)
      console.log("Flee Failed");
      animationBattleScreen(actionPlayerInBattle, actionEnemyInBattle, actionCommand, maxTargetHp, targetHpLeft)
    }
    char_obj.actionPoints -= 1;
    displayCharFoeInfo(enemy);
  });
}

async function displayModalBattleScreen() {
  await delay(100);

}
///////////////////////
//TEST SCREEN BATTLE //

//   playerAction = actionPlayerInBattle
//   enemyAction = actionEnemyInBattle

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function animationBattleScreen(playerAction, enemyAction, actionCmd, char_hp, hpLeft) {

  const enemyHitbox = document.querySelector(".battle-animation-display-scene-action-hitbox");
  const enemyLife = document.querySelector(".enemy-life");
  enemyLife.classList.add("hit");
  const hit = document.querySelector(".hit");

  await delay(20);
  battleScreen.style.display = "flex";
  setTimeout(() => {
    battleScreen.style.display = "none";
  }, 3000);

  await delay(400);
  //NORMAL ATTACK - TEST SCREEN BATTLE //
  if (actionCmd == "normal") {
    playerAction.classList.add("actionSlash")
    setTimeout(() => {
      enemyHitbox.classList.add("hitbox-normal");
      enemyAction.classList.add("shaked");
    }, 500);
    setTimeout(() => {
      if (parseInt(hit.style.width) <= 50) {
        enemyLife.style.background = "orange";
      } else if (parseInt(hit.style.width) <= 20) {
        enemyLife.style.background = "red";
      }
      hit.style.width = `${Math.round(((hpLeft) * 100) / char_hp)}%`;
    }, 600);
    setTimeout(() => {
      enemyHitbox.classList.remove("hitbox-normal");
    }, 1000);
    setTimeout(() => {
      playerAction.classList.remove("actionSlash");
      enemyAction.classList.remove("shaked");
    }, 800);
    actionCmd = "";
  }

  // //CRITICAL ATTACK - TEST SCREEN BATTLE //
  if (actionCmd == "critical") {
    const messageCritical = document.querySelector(".battle-animation-display-scene-action-critical")
    playerAction.classList.add("actionSlash")
    setTimeout(() => {
      enemyHitbox.classList.add("hitbox-critical");
      enemyAction.classList.add("shaked");
      messageCritical.style.display = "flex";
    }, 300);
    setTimeout(() => {
      if (parseInt(hit.style.width) <= 50) {
        enemyLife.style.background = "orange";
      } else if (parseInt(hit.style.width) <= 20) {
        enemyLife.style.background = "red";
      }
      hit.style.width = `${Math.round(((hpLeft) * 100) / char_hp)}%`;
    }, 400);
    setTimeout(() => {
      enemyHitbox.classList.remove("hitbox-critical")
      messageCritical.style.display = "none";

    }, 800);
    setTimeout(() => {
      playerAction.classList.remove("actionSlash");
      enemyAction.classList.remove("shaked");
    }, 600);
    actionCmd = "";
  }

  // //BLOCK ATTACK - TEST SCREEN BATTLE //
  if (actionCmd == "block") {
    const messageBlock = document.querySelector(".battle-animation-display-scene-action-block")
    playerAction.classList.add("actionSlash")
    setTimeout(() => {
      enemyHitbox.classList.add("hitbox-block");
      enemyAction.classList.add("blocked");
      messageBlock.style.display = "flex";
    }, 300);
    setTimeout(() => {
      enemyHitbox.classList.remove("hitbox-block");
      messageBlock.style.display = "none";
    }, 800);
    setTimeout(() => {
      playerAction.classList.remove("actionSlash");
      enemyAction.classList.remove("blocked");
    }, 600);
    actionCmd = "";
  }

  // //FLEE ATTACK - TEST SCREEN BATTLE //
  if (actionCmd == "flee") {
    const messageFlee = document.querySelector(".battle-animation-display-scene-action-flee")
    playerAction.classList.add("actionSlash")
    setTimeout(() => {
      enemyHitbox.classList.add("hitbox-flee");
      enemyAction.classList.add("flee");
      messageFlee.style.display = "flex";
    }, 300);
    setTimeout(() => {
      enemyHitbox.classList.remove("hitbox-flee");
      messageFlee.style.display = "none";
    }, 800);
    setTimeout(() => {
      playerAction.classList.remove("actionSlash");
      enemyAction.classList.remove("flee");
    }, 600);
    actionCmd = "";
  }
}
//TEST SCREEN BATTLE //
///////////////////////

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

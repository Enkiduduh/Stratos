// import { player, enemy } from "./characters"
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

let endTurn = false;
let isPlayerTurn = true; // Détermine si c'est le tour du joueur ou de l'ennemi

const player = {
    name: "Enki",
    level: 1,
    hp: 10,
    mp: 4,
    str: 2,
    def: 2,
    agi: 2,
    movePoints: 2,
    actionPoints: 1,
    img: 'assets/hero.png',
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
const enemy = {
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

function initalPos(char_obj, x, y) {
    char_obj.posX = x;
    char_obj.posY = y;
    console.log(char_obj)
}

initalPos(player, 2, 2)
initalPos(enemy, 5, 6)


function actionButtonsHandler(char_obj, char_case) {
    actionButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (btn.classList.contains("endBtn")) {
                actionEndTurn(char_obj);
            }
            if (btn.classList.contains("defendBtn")) {
                actionDefend(char_obj);

            }
            if (btn.classList.contains("moveBtn")) {
                targetMovement(char_obj, char_case);
            }
            displayCharHeroInfo(char_obj, char_case);
        });
    });
}

function initPlayer() {
    const playerCase = document.querySelector(`.case[data-x="${player.posX}"][data-y="${player.posY}"]`);
    playerCase.innerHTML = `<img src=${player.img} alt=${player.name}>`
    displayCharHeroInfo(player, playerCase);

    const enemyCase = document.querySelector(`.case[data-x="${enemy.posX}"][data-y="${enemy.posY}"]`);
    enemyCase.innerHTML = `<img src=${enemy.img} alt=${enemy.name}>`
    displayCharFoeInfo(enemy);

    playerCase.addEventListener("click", () => {
        actionButtonsHandler(player, playerCase);

    })
}


function initEnemy() {
    const enemyCase = document.querySelector(`.case[data-x="${enemy.posX}"][data-y="${enemy.posY}"]`);
    enemyCase.innerHTML = `<img src=${enemy.img} alt=${enemy.name}>`
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
            turn(); // Recommence le cycle pour l'ennemi
        });
    } else {
        console.log("Enemy's turn begins.");
        initEnemy(); // Initialisation de l'ennemi
        waitForTurnEnd(enemy).then(() => {
            console.log("Enemy's turn is done.");
            isPlayerTurn = true; // Repasser au tour du joueur
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
                            char_case.innerHTML = `<img src=${char_obj.img} alt=${char_obj.name}>`;
                            char_case.setAttribute('data-occupied', 'true');

                            // Update character movePoints to prevent further moves
                            char_obj.movePoints = 0;
                            movPoints.textContent = `MOV: ${char_obj.movePoints}`;
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
        const dataDisplay = document.getElementById(`hero`);
        dataDisplay.innerHTML = `
    <div class="display-character">
            <div class="display-line">
                <div>${char_obj.name}</div>
                <div>Level: ${char_obj.level}</div>
            </div>
            <div class="display-life">
                <div class="life"></div>
            </div>
            <div class="display-line">
                <div>HP: ${char_obj.hp}</div>
                <div>MP: ${char_obj.mp}</div>
            </div>
            <div class="display-line">
                <div>STR: ${char_obj.str}</div>
                <div>DEF: ${char_obj.def}</div>
            </div>
            <div class="display-line">
                <div>AGI: ${char_obj.agi}</div>
                <div class="mov-points">MOV: ${char_obj.movePoints}</div>
            </div>
             <div class="display-line">
                <div>AP: ${char_obj.actionPoints}</div>
            </div>
        </div>
    `;
    }
}



function displayCharFoeInfo(char_obj) {
    const dataDisplay = document.getElementById(`foe`);
    dataDisplay.innerHTML = `
    <div class="display-character">
            <div class="display-line">
                <div>${char_obj.name}</div>
                <div>Level: ${char_obj.level}</div>
            </div>
            <div class="display-life">
                <div class="life"></div>
            </div>
            <div class="display-line">
                <div>HP: ${char_obj.hp}</div>
                <div>MP: ${char_obj.mp}</div>
            </div>
            <div class="display-line">
                <div>STR: ${char_obj.str}</div>
                <div>DEF: ${char_obj.def}</div>
            </div>
            <div class="display-line">
                <div>AGI: ${char_obj.agi}</div>
                <div class="mov-points">MOV: ${char_obj.movePoints}</div>
            </div>
            <div class="display-line">
                <div>AP: ${char_obj.actionPoints}</div>
            </div>
        </div>
    `;
}

// Démarrage du cycle jeu
turn();
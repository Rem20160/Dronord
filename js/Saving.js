
let intervalId = null; 

function startTrackingTime() {
    if (intervalId !== null) clearInterval(intervalId);

    if (gameData.startTime === 0) {
        gameData.startTime = Date.now();
    }

    intervalId = setInterval(() => {
        const currentTime = Date.now();
        gameData.timePlayed = (currentTime - gameData.startTime) / 1000; 
        updateTimePlayedDisplay();
    }, 16); 
}

function loadTimePlayed() {
    const currentTime = Date.now();
    const offlineTime = gameData.lastUpdateTime ? (currentTime - gameData.lastUpdateTime) / 1000 : 0;
    gameData.timePlayed += offlineTime;
    gameData.lastUpdateTime = currentTime;
    updateTimePlayedDisplay();
}

function updateTimePlayedDisplay() {
    const totalSeconds = Math.floor(gameData.timePlayed); 

    const days = Math.floor(totalSeconds / 86400); 
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = 
            `${days.toString().padStart(2, '0')}d : ${hours.toString().padStart(2, '0')}h : ` +
            `${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
    }
}










function saveGame() {
    const gameState = {
        ore: gameData.ore.toString(),
        orePerSecond: gameData.orePerSecond.toString(),
        orePerClick: gameData.orePerClick.toString(),
        baseOrePerSecond: gameData.baseOrePerSecond.toString(),
        baseOrePerClick: gameData.baseOrePerClick.toString(),
        oneTimeMultiplier: gameData.oneTimeMultiplier.toString(),
        holdDuration: gameData.holdDuration.toString(),
        baseHoldDuration: gameData.baseHoldDuration.toString(),
        purchasedUpgrades: Array.from(gameData.purchasedUpgrades),
        repeatableUpgradeCosts: gameData.repeatableUpgrades.map(upgrade => upgrade.cost.toString()),
        repeatableUpgradeCostMultipliers: gameData.repeatableUpgrades.map(upgrade => upgrade.costMultiplier.toString()),
        repeatableUpgradeCounts: gameData.repeatableUpgrades.map(upgrade => upgrade.purchaseCount || 0),
        repeatableUpgradeVisible: gameData.repeatableUpgrades.map(upgrade => upgrade.upgradeVisible),
        repeatableUpgradeMultiplier: gameData.repeatableUpgrades.map(upgrade => upgrade.multiplier.toString() || 1),
        repeatableUpgradeEffectIncrement: gameData.repeatableUpgrades.map(upgrade => upgrade.effectIncrement.toString()),
        oneTimeUpgradeVisible: gameData.oneTimeUpgrades.map(upgrade => upgrade.upgradeVisible),
        oreInfoVisible: gameData.oreInfoVisible,
        tabsVisible: gameData.tabsVisible,
        dronesVisible: gameData.dronesVisible,
        oTUVisible: gameData.oTUVisible,
        researchVisible: gameData.researchVisible,
        timePlayed: gameData.timePlayed,
        startTime: gameData.startTime,
        droneCosts: gameData.drones.map(drone => drone.cost.toString()),
        droneProductionRate: gameData.drones.map(drone => drone.productionRate.toString()),
        droneCount: gameData.drones.map(drone => drone.droneCount.toString()),
        droneUpgradeVisible: gameData.drones.map(drone => drone.upgradeVisible),
        droneBuildTime: gameData.drones.map(drone => drone.buildTime.toString()),
        


        research: gameData.research.toString(),
        researchPerSecond: gameData.researchPerSecond.toString(),
        baseResearchPerSecond: gameData.baseResearchPerSecond.toString(),
        researchLimit: gameData.researchLimit.toString(),
        researchDataCurrentPurchases: gameData.researchData.map(research => research.currentPurchases.toString()),
        researchDataEffectIncrement: gameData.researchData.map(research => research.effectIncrement.toString()),
        researchDataCost: gameData.researchData.map(research => research.cost.toString()),
        researchDataE: gameData.researchData.map(research => research.e.toString()),
        researchDataMaxPurchases: gameData.researchData.map(research => research.maxPurchases.toString()),
        researchDataCostScaling: gameData.researchData.map(research => research.costScaling.toString()),
        researchIsUnlocked: gameData.researchData.map(research => research.isUnlocked),

        systemRepairCosts: Object.keys(systems).flatMap(category => 
            systems[category].map(system => system.repairCost.toString())
        ),
        systemStatus: Object.keys(systems).flatMap(category => 
            systems[category].map(system => system.status.toString())
        ),
        systemVisibility: Object.keys(systems).flatMap(category => 
            systems[category].map(system => system.systemVisible)
        ),
        currentProgressIndex: currentProgressIndex,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}


function loadGame() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        gameData.ore = OmegaNum(gameState.ore);
        gameData.orePerSecond = OmegaNum(gameState.orePerSecond);
        gameData.orePerClick = OmegaNum(gameState.orePerClick);
        gameData.baseOrePerSecond = OmegaNum(gameState.baseOrePerSecond);
        gameData.baseOrePerClick = OmegaNum(gameState.baseOrePerClick);
        gameData.oneTimeMultiplier = OmegaNum(gameState.oneTimeMultiplier);
        gameData.holdDuration = OmegaNum(gameState.holdDuration);
        gameData.baseHoldDuration = OmegaNum(gameState.baseHoldDuration);
        gameData.purchasedUpgrades = new Set(gameState.purchasedUpgrades);
        gameData.repeatableUpgrades.forEach((upgrade, index) => {
            upgrade.cost = OmegaNum(gameState.repeatableUpgradeCosts[index] || upgrade.initialUpgradeCost);
            upgrade.costMultiplier = OmegaNum(gameState.repeatableUpgradeCostMultipliers[index] || upgrade.initialCostMultiplier);
            upgrade.purchaseCount = gameState.repeatableUpgradeCounts[index];
            upgrade.upgradeVisible = gameState.repeatableUpgradeVisible[index];
            upgrade.multiplier = OmegaNum(gameState.repeatableUpgradeMultiplier[index] || 1);
            upgrade.effectIncrement = OmegaNum(gameState.repeatableUpgradeEffectIncrement[index]);
        });
        gameData.oneTimeUpgrades.forEach((upgrade, index) => {
            upgrade.upgradeVisible = gameState.oneTimeUpgradeVisible[index];
        });
        gameData.drones.forEach((drone, index) => {
                drone.cost = OmegaNum(gameState.droneCosts[index]);
                drone.productionRate = OmegaNum(gameState.droneProductionRate[index]);
                drone.droneCount = OmegaNum(gameState.droneCount[index]);
                drone.upgradeVisible = gameState.droneUpgradeVisible[index];
                drone.buildTime = OmegaNum(gameState.droneBuildTime[index]); 
            }
        );



        gameData.research = OmegaNum(gameState.research);
        gameData.researchPerSecond = OmegaNum(gameState.researchPerSecond);
        gameData.baseResearchPerSecond = OmegaNum(gameState.baseResearchPerSecond);
        gameData.researchLimit = OmegaNum(gameState.researchLimit);
        gameData.researchData.forEach((research, index) => {
            research.currentPurchases = OmegaNum(gameState.researchDataCurrentPurchases[index] || 0);
            research.effectIncrement = OmegaNum(gameState.researchDataEffectIncrement[index] || research.iEI);
            research.cost = OmegaNum(gameState.researchDataCost[index] || research.iCost);
            research.e = OmegaNum(gameState.researchDataE[index] || 1);
            research.maxPurchases = gameState.researchDataMaxPurchases[index] 
                ? OmegaNum(gameState.researchDataMaxPurchases[index]) 
                : research.maxPurchases;
            research.isUnlocked = gameState.researchIsUnlocked[index];
            research.costScaling = OmegaNum(gameState.researchDataCostScaling[index]);
        });

        let repairCostIndex = 0;
        let statusIndex = 0;
        let visibilityIndex = 0;
        Object.keys(systems).forEach(category => {
            systems[category].forEach(system => {
                system.repairCost = new OmegaNum(gameState.systemRepairCosts[repairCostIndex]);
                system.status = gameState.systemStatus[statusIndex];
                system.systemVisible = gameState.systemVisibility[visibilityIndex];

                repairCostIndex += 1;
                statusIndex += 1;
                visibilityIndex += 1;
            });
        });

        currentProgressIndex = gameState.currentProgressIndex || 0;

        gameData.tabsVisible = gameState.tabsVisible;
        gameData.oreInfoVisible = gameState.oreInfoVisible;
        gameData.dronesVisible = gameState.dronesVisible;
        gameData.oTUVisible = gameState.oTUVisible;
        gameData.researchVisible = gameState.researchVisible;
        gameData.timePlayed = gameState.timePlayed || 0;
        gameData.startTime = gameState.startTime || 0;
        updateUI();
        console.log("Game loaded!");
        if (localStorage.getItem('gameStarted') === 'true'){
            loadTimePlayed();
            startTrackingTime();
            loadMessages();
        };
        loadTypingSound();
        updateVisibility();
    }
}


document.getElementById("save-btn").addEventListener("click", saveGame);
document.getElementById("import-btn").addEventListener("click", importGame);
document.getElementById("export-btn").addEventListener("click", exportGame);

function toBase64(obj) {
    return btoa(JSON.stringify(obj)); 
}

function fromBase64(encodedStr) {
    return JSON.parse(atob(encodedStr));
}

function exportGame() {
    const gameState = {
        ore: gameData.ore.toString(),
        orePerSecond: gameData.orePerSecond.toString(),
        orePerClick: gameData.orePerClick.toString(),
        baseOrePerSecond: gameData.baseOrePerSecond.toString(),
        baseOrePerClick: gameData.baseOrePerClick.toString(),
        oneTimeMultiplier: gameData.oneTimeMultiplier.toString(),
        holdDuration: gameData.holdDuration.toString(),
        baseHoldDuration: gameData.baseHoldDuration.toString(),
        purchasedUpgrades: Array.from(gameData.purchasedUpgrades),
        repeatableUpgradeCosts: gameData.repeatableUpgrades.map(upgrade => upgrade.cost.toString()),
        repeatableUpgradeCostMultipliers: gameData.repeatableUpgrades.map(upgrade => upgrade.costMultiplier.toString()),
        repeatableUpgradeCounts: gameData.repeatableUpgrades.map(upgrade => upgrade.purchaseCount),
        repeatableUpgradeVisible: gameData.repeatableUpgrades.map(upgrade => upgrade.upgradeVisible),
        repeatableUpgradeMultiplier: gameData.repeatableUpgrades.map(upgrade => upgrade.multiplier.toString() || 1),
        repeatableUpgradeEffectIncrement: gameData.repeatableUpgrades.map(upgrade => upgrade.effectIncrement.toString()),
        oneTimeUpgradeVisible: gameData.oneTimeUpgrades.map(upgrade => upgrade.upgradeVisible),
        oreInfoVisible: gameData.oreInfoVisible,
        tabsVisible: gameData.tabsVisible,
        dronesVisible: gameData.dronesVisible,
        oTUVisible: gameData.oTUVisible,
        researchVisible: gameData.researchVisible,
        gameStarted: localStorage.getItem('gameStarted') === 'true',


        consoleMessages: JSON.parse(localStorage.getItem('consoleMessages')) || [],
        
        startTime: gameData.startTime,
        timePlayed: gameData.timePlayed,
        droneCosts: gameData.drones.map(drone => drone.cost.toString()),
        droneProductionRate: gameData.drones.map(drone => drone.productionRate.toString()),
        droneCount: gameData.drones.map(drone => drone.droneCount.toString()),
        droneUpgradeVisible: gameData.drones.map(drone => drone.upgradeVisible),
        droneBuildTime: gameData.drones.map(drone => drone.buildTime.toString()),



        research: gameData.research.toString(),
        researchPerSecond: gameData.researchPerSecond.toString(),
        baseResearchPerSecond: gameData.baseResearchPerSecond.toString(),
        researchLimit: gameData.researchLimit.toString(),
        researchDataCurrentPurchases: gameData.researchData.map(research => research.currentPurchases.toString()),
        researchDataEffectIncrement: gameData.researchData.map(research => research.effectIncrement.toString()),
        researchDataCost: gameData.researchData.map(research => research.cost.toString()),
        researchDataE: gameData.researchData.map(research => research.e.toString()),
        researchDataMaxPurchases: gameData.researchData.map(research => research.maxPurchases.toString()),
        researchIsUnlocked: gameData.researchData.map(research => research.isUnlocked),
        researchDataCostScaling: gameData.researchData.map(research => research.costScaling.toString()),

        systemRepairCosts: Object.keys(systems).flatMap(category => 
            systems[category].map(system => system.repairCost.toString())
        ),
        systemStatus: Object.keys(systems).flatMap(category => 
            systems[category].map(system => system.status.toString())
        ),
        systemVisibility: Object.keys(systems).flatMap(category => 
            systems[category].map(system => system.systemVisible)
        ),

        currentProgressIndex: currentProgressIndex,
    };
    const encodedState = toBase64(gameState);
    navigator.clipboard.writeText(encodedState)
        .then(() => alert("Your save has been copied to the clipboard!"))
        .catch(err => console.error("Failed to copy text: ", err));
}

function importGame() {
    const input = prompt("Paste your save state here:");
    if (input) {
        try {
            const gameState = fromBase64(input);

            gameData.ore = OmegaNum(gameState.ore);
            gameData.orePerSecond = OmegaNum(gameState.orePerSecond);
            gameData.orePerClick = OmegaNum(gameState.orePerClick);
            gameData.baseOrePerSecond = OmegaNum(gameState.baseOrePerSecond);
            gameData.baseOrePerClick = OmegaNum(gameState.baseOrePerClick);
            gameData.oneTimeMultiplier = OmegaNum(gameState.oneTimeMultiplier);
            gameData.holdDuration = OmegaNum(gameState.holdDuration);
            gameData.baseHoldDuration = OmegaNum(gameState.baseHoldDuration);
            gameData.purchasedUpgrades = new Set(gameState.purchasedUpgrades);
            gameData.repeatableUpgrades.forEach((upgrade, index) => {
                upgrade.cost = OmegaNum(gameState.repeatableUpgradeCosts[index] || upgrade.initialUpgradeCost);
                upgrade.costMultiplier = OmegaNum(gameState.repeatableUpgradeCostMultipliers[index] || upgrade.initialCostMultiplier);
                upgrade.purchaseCount = gameState.repeatableUpgradeCounts[index] || 0;
                upgrade.upgradeVisible = gameState.repeatableUpgradeVisible[index];
                upgrade.multiplier = OmegaNum(gameState.repeatableUpgradeMultiplier[index] || 1);
                upgrade.effectIncrement = OmegaNum(gameState.repeatableUpgradeEffectIncrement[index]);
            });
            gameData.oneTimeUpgrades.forEach((upgrade, index) => {
                upgrade.upgradeVisible = gameState.oneTimeUpgradeVisible[index];
            });
            
            gameData.drones.forEach((drone, index) => {
                drone.cost = OmegaNum(gameState.droneCosts[index]);
                drone.productionRate = OmegaNum(gameState.droneProductionRate[index]);
                drone.droneCount = OmegaNum(gameState.droneCount[index]);
                drone.upgradeVisible = gameState.droneUpgradeVisible[index];
                drone.buildTime = OmegaNum(gameState.droneBuildTime[index]); 
            });
            gameData.research = OmegaNum(gameState.research);
            gameData.researchPerSecond = OmegaNum(gameState.researchPerSecond);
            gameData.baseResearchPerSecond = OmegaNum(gameState.baseResearchPerSecond);
            gameData.researchLimit = OmegaNum(gameState.researchLimit);
            gameData.researchData.forEach((research, index) => {
                research.currentPurchases = OmegaNum(gameState.researchDataCurrentPurchases[index] || 0);
                research.effectIncrement = OmegaNum(gameState.researchDataEffectIncrement[index] || research.iEI);
                research.cost = OmegaNum(gameState.researchDataCost[index] || research.iCost);
                research.e = OmegaNum(gameState.researchDataE[index] || 1);
                research.maxPurchases = OmegaNum(gameState.researchDataMaxPurchases[index]);
                research.isUnlocked = gameState.researchIsUnlocked[index];
                research.costScaling = OmegaNum(gameState.researchDataCostScaling[index]);
            });

            let repairCostIndex = 0;
            let statusIndex = 0;
            let visibilityIndex = 0;
            Object.keys(systems).forEach(category => {
                systems[category].forEach(system => {
                    system.repairCost = new OmegaNum(gameState.systemRepairCosts[repairCostIndex]);
                    system.status = gameState.systemStatus[statusIndex];
                    system.systemVisible = gameState.systemVisibility[visibilityIndex];
    
                    repairCostIndex += 1;
                    statusIndex += 1;
                    visibilityIndex += 1;
                });
            });

            currentProgressIndex = gameState.currentProgressIndex || 0;

            gameData.tabsVisible = gameState.tabsVisible;
            gameData.oreInfoVisible = gameState.oreInfoVisible;
            gameData.dronesVisible = gameState.dronesVisible;
            gameData.oTUVisible = gameState.oTUVisible;
            gameData.researchVisible = gameState.researchVisible;
            gameData.timePlayed = gameState.timePlayed || 0;
            gameData.startTime = gameState.startTime || 0;

            if (gameState.gameStarted) {
                localStorage.setItem('gameStarted', 'true');
            } else {
                localStorage.removeItem('gameStarted'); 
            }

            localStorage.setItem('consoleMessages', JSON.stringify(gameState.consoleMessages || []));

            updateUI(); 
            location.reload();
            saveGame();
            console.log("Game imported!");
        } catch (e) {
            alert("Invalid save state!");
            console.error("Import error:", e);
        }
    }
}

function showResetConfirmation() {
    document.getElementById("confirmation-modal").style.display = "block";
}

function closeModal() {
    document.getElementById("confirmation-modal").style.display = "none";
}

function hardReset() {
    localStorage.removeItem('gameState');
    gameData.ore = new OmegaNum(0);
    gameData.orePerSecond = new OmegaNum(0);
    gameData.orePerClick = new OmegaNum (0.001);
    gameData.baseOrePerSecond = new OmegaNum(0);
    gameData.baseOrePerClick = new OmegaNum(0.001);
    gameData.oneTimeMultiplier = new OmegaNum(1);
    gameData.holdDuration = gameData.baseHoldDuration;
    gameData.purchasedUpgrades.clear();
    gameData.repeatableUpgrades.forEach(upgrade => {
        upgrade.cost = upgrade.initialUpgradeCost;
        upgrade.costMultiplier = upgrade.initialCostMultiplier;
        upgrade.purchaseCount = upgrade.initialPurchaseCount;
        upgrade.upgradeVisible = false;
        upgrade.multiplier = new OmegaNum(1);
        upgrade.effectIncrement = upgrade.initialEffectIncrement;
    });
    gameData.oneTimeUpgrades.forEach(upgrade => {
        upgrade.upgradeVisible = false;
    });

    gameData.drones.forEach(drone => {
        drone.droneCount = new OmegaNum(0);
        drone.productionRate = drone.initialProductionRate
        drone.cost = drone.initialCost; 
        drone.buildTime = drone.initialBuildTime;
        drone.upgradeVisible = false;
    });

    gameData.researchData.forEach(research => {
        research.effectIncrement = research.iEI;
        research.cost = research.iCost;
        research.maxPurchases = new OmegaNum(research.iMP);
        research.currentPurchases = new OmegaNum(0);
        research.isUnlocked = false;
        research.e = new OmegaNum(1);
    });
    gameData.researchData[0].isUnlocked = true;
    gameData.research = new OmegaNum(0);
    gameData.researchPerSecond = new OmegaNum(0);
    gameData.baseResearchPerSecond = new OmegaNum(0);
    gameData.researchLimit = new OmegaNum(80);
    updateAllResearchEffects();
    systems.core.forEach(system => {
        system.status = "corrupted";
        system.systemVisible = false;
        system.repairCost = OmegaNum(system.iCost);
    });
    systems.core[0].status = "Operational";
    systems.core[0].systemVisible = true;

    systems.operational.forEach(system => {
        system.status = "corrupted";
        system.systemVisible = false;
        system.repairCost = OmegaNum(system.iCost);
    });
    systems.operational[0].status = "Operational";
    systems.operational[0].systemVisible = true;

    systems.utility.forEach(system => {
        system.status = "corrupted";
        system.systemVisible = false;
        system.repairCost = OmegaNum(system.iCost);
    });
    systems.utility[0].status = "Operational";
    systems.utility[0].systemVisible = true;

    currentProgressIndex = 1;

    gameData.tabsVisible = false;
    gameData.oreInfoVisible = false;
    gameData.dronesVisible = false;
    gameData.oTUVisible = false;
    gameData.researchVisible = false;
    gameData.timePlayed = 0;
    gameData.startTime = 0;
    clearInterval(intervalId); 
    updateUI();
    localStorage.removeItem('gameStarted');
    localStorage.removeItem('consoleMessages');
    document.getElementById('console').style.width = '100%';
    const startButton = document.getElementById('start-btn');
    startButton.style.display = 'block';
    saveGame();
    location.reload();
    console.log("Game reset!");
}

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none'; 
        }, 1000); 
    }, 1000);
});

window.onbeforeunload = () => {
    gameData.lastUpdateTime = Date.now(); 
    clearInterval(intervalId); 
};
setInterval(saveGame, 5000);

function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - gameData.lastUpdateTime) / 1000; 
    gameData.lastUpdateTime = now;
    gameData.ore = gameData.ore.add(gameData.orePerSecond.mul(deltaTime));
    updateUI();
    updateProgressBar();
    gameData.research = OmegaNum.min(gameData.research.add(gameData.researchPerSecond.mul(deltaTime)), gameData.researchLimit);
    requestAnimationFrame(gameLoop);
    if (systems.utility[2].status === "Operational") {
        gameData.dronesVisible = true;
        gameData.drones.find(d => d.id === "d1").upgradeVisible = true;
        gameData.repeatableUpgrades.find(upg => upg.id === "r3").upgradeVisible = true;
    }
    if (systems.core[1].status === "Operational") {
        gameData.researchVisible = true;
        gameData.drones.find(d => d.id === "d2").upgradeVisible = true;
        gameData.oneTimeUpgrades.find(upg => upg.id === "o2").upgradeVisible = true;
    }

    if (gameData.ore.gte(0.001)) { 
       gameData.oreInfoVisible = true;
    }
    if (gameData.ore.gte(0.005)) { 
       gameData.tabsVisible = true;
       gameData.repeatableUpgrades.find(upg => upg.id === "r1").upgradeVisible = true;
       gameData.repeatableUpgrades.find(upg => upg.id === "r2").upgradeVisible = true;
       logMessage("You have enough ore to improve yourself. Fix the Self-Repair System.")
       systems.operational.find(s => s.name === "Self-Repair System").systemVisible = true;
    }

    if (currentProgressIndex === 2) {
        logMessage("You can fix the Command Interface and start making drones that will mine for you")
        systems.utility[2].systemVisible = true;
    }
    if (gameData.ore.lte(1)) {
        oreIcon.src = "images/ore1.png";
    }
    if (gameData.ore.gte(1)) {
        logMessage("You can start making drastic improvements.")
        oreIcon.src = "images/ore2.png";
        gameData.oTUVisible = true;
        gameData.oneTimeUpgrades.find(upg => upg.id === "o1").upgradeVisible = true;
    }
    if (currentProgressIndex === 3) {
        logMessage("You can fix the Memory Array and start storing research")
        systems.core[1].systemVisible = true;
    }
    if (gameData.ore.gte(1000)) {
        oreIcon.src = "images/ore3.png";
    }
    if (gameData.ore.gte(1e6)) {
        oreIcon.src = "images/ore4.png";
    }
    if (gameData.ore.gte(1e9)) {
        oreIcon.src = "images/ore5.png";
    }
    if (gameData.ore.gte(1e12)) {
        oreIcon.src = "images/ore6.png";
    }
    if (gameData.ore.gte(1e15)) {
        oreIcon.src = "images/ore7.png";
    }
    updateVisibility();
    updateOrePerSecond();
    updateBuildTimes();
    updateOrePerClick();
    updateHoldDuration();
    updateResearchStyles();
    updateBaseOrePerSecond();
    updateResearchPerSecond();
    updateResearchMaxPurchases();
    updateResearchLimit();
}

window.onload = loadGame; 

requestAnimationFrame(gameLoop);

window.addEventListener('resize', renderResearchItems);


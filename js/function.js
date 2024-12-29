function updateUI() {
    oreCountDisplay.textContent = formatAndConvertNumber(gameData.ore);         
    const netOreRate = gameData.orePerSecond.minus(isBoostEnabled ? oreUsage : 0).minus(gameData.factory.producing ? (oreDroneConsumption / (productionTime / 1000)) : 0);
    oreRateDisplay.textContent = formatAndConvertNumber(netOreRate);
    const totalDroneCount = gameData.drones[0].droneCount;
    droneCountDisplay.textContent = formatNumber(totalDroneCount);
    droneRateDisplay.textContent = (gameData.factory.producing ? formatNumber(1000 / productionTime) : 0);
    researchCountDisplay.textContent = formatResearch(gameData.research);
    researchRateDisplay.textContent = formatResearch(gameData.researchPerSecond);
    researchLimitDisplay.textContent = formatResearch(gameData.researchLimit);
    dronesProducedCount.textContent = formatNumber(dronesProduced);
    oreConsumption.textContent = formatAndConvertNumber(oreDroneConsumption);
    dronesProductionTime.textContent = `${(productionTime / 1000)}s`;
    animateCorruption(10, 50);
}

function buyOneTimeUpgrade(upgradeId) {
    const upgrade = gameData.oneTimeUpgrades.find(upg => upg.id === upgradeId);
    if (upgrade && !gameData.purchasedUpgrades.has(upgradeId) && gameData.ore.gte(upgrade.cost)) {
        gameData.ore = gameData.ore.sub(upgrade.cost); 
        upgrade.effect(); 
        gameData.purchasedUpgrades.add(upgradeId); 
        renderOneTimeUpgrades();
        updateUI();
        return true; 
    } else {
        return false; 
    }
}


function buyRepeatableUpgrade(upgradeId) {
    const upgrade = gameData.repeatableUpgrades.find(upg => upg.id === upgradeId);
    if (upgrade && gameData.ore.gte(upgrade.cost)) {
        gameData.ore = gameData.ore.sub(upgrade.cost); 
        upgrade.effect(); 
        upgrade.cost = upgrade.initialUpgradeCost.mul(upgrade.costMultiplier.pow(upgrade.purchaseCount)); 
        renderRepeatableUpgrades();
        updateUI(); 
        return true;
    } else {
        return false; 
    }
}

function renderRepeatableUpgrades() {
    const container = document.getElementById("repeatable-upgrades-container");
    container.innerHTML = ""; 

    gameData.repeatableUpgrades.forEach(upgrade => {
        if (upgrade.upgradeVisible) { 
            const upgradeElement = document.createElement("div");
            upgradeElement.classList.add("upgrade-item");
            upgradeElement.style.cursor = "pointer";
            upgradeElement.innerHTML = `
                <p>${upgrade.getDescription()}</p>
                <p>${upgrade.getDesc()}</p>
                <p>Cost: ${formatAndConvertNumber(upgrade.cost)} ore</p>
                <p>Upgraded ${upgrade.purchaseCount} ${upgrade.desc}</p>
            `;
            
            upgradeElement.addEventListener("click", () => {
                buyRepeatableUpgrade(upgrade.id);
            });

            container.appendChild(upgradeElement);
        }
    });
}

let showPurchasedUpgrades = false;

function togglePurchasedUpgrades() {
    showPurchasedUpgrades = !showPurchasedUpgrades; 
    const toggleBtn = document.getElementById("toggle-upgrades-btn");
    if (showPurchasedUpgrades) {
        toggleBtn.textContent = "Hide Purchased Upgrades"; 
    } else {
        toggleBtn.textContent = "Show Purchased Upgrades"; 
    }

    renderOneTimeUpgrades(); 
}

document.getElementById("toggle-upgrades-btn").addEventListener("click", togglePurchasedUpgrades);

function renderOneTimeUpgrades() {
    const container = document.getElementById("one-time-upgrades-container");
    container.innerHTML = ""; 

    gameData.oneTimeUpgrades.forEach(upgrade => {
        const upgradeElement = document.createElement("div");
        upgradeElement.classList.add("upgrade-item");
        upgradeElement.style.cursor = "pointer"; 
        const isPurchased = gameData.purchasedUpgrades.has(upgrade.id);
        if (upgrade.upgradeVisible && !isPurchased) {
            upgradeElement.innerHTML = `
                <p>${upgrade.description}</p>
                <p>Cost: ${formatAndConvertNumber(upgrade.cost)} ore</p>
                <p>${upgrade.desc}</p>
            `;
            upgradeElement.addEventListener("click", () => {
                if (buyOneTimeUpgrade(upgrade.id)) { 
                    upgradeElement.style.display = 'none'; 
                }
            });
        } else if (isPurchased && showPurchasedUpgrades) {
            upgradeElement.innerHTML = `
                <p>${upgrade.description}</p>
                <p>${upgrade.desc}</p>
            `;
        } else {
            upgradeElement.style.display = 'none'; 
        }

        container.appendChild(upgradeElement);
    });
}

function startBuildingDrone(droneId) {
    const drone = gameData.drones.find(d => d.id === droneId);
    if (gameData.ore.gte(drone.cost) && !drone.building) {
        gameData.ore = gameData.ore.sub(drone.cost); 
        drone.building = true; 
        drone.startTime = Date.now(); 
        updateProgress(drone);
    }
}

function updateProgress(drone) {
    if (!drone.building) return;
    const elapsedTime = Date.now() - drone.startTime; 
    const progress = Math.min((elapsedTime / drone.buildTime.toNumber()) * 100, 100); 

    const droneElement = document.querySelector(`[data-drone-id="${drone.id}"]`);
    if (droneElement) {
        const progressFill = droneElement.querySelector(".progress-fill");
        progressFill.style.width = `${progress}%`; 
    }
    if (progress < 100) {
        requestAnimationFrame(() => updateProgress(drone)); 
    } else {
        drone.droneCount = drone.droneCount.add(gameData.maxDronesAtOnce);
        updateBaseOrePerSecond();
        updateOrePerSecond();
        renderDrones();
        resetBuilding(drone); 
    }
}

function resetBuilding(drone) {
    drone.building = false; 
    drone.startTime = null; 
    const droneElement = document.querySelector(`[data-drone-id="${drone.id}"]`);
    if (droneElement) {
        const progressFill = droneElement.querySelector(".progress-fill");
        progressFill.style.width = "0%";  
    }
}

function renderDrones() {
    const container = document.getElementById("drones-container");
    container.innerHTML = ""; 
    gameData.drones.forEach(drone => {
        if (drone.upgradeVisible) { 
            const droneElement = document.createElement("div");
            droneElement.classList.add("drone-item");
            droneElement.style.cursor = "pointer"; 
            const displayTime = drone.buildTime || drone.initialBuildTime; 
            const timeDisplay = `Building time: ${formatNumber(displayTime.div(1000))}s`;
            droneElement.setAttribute("data-drone-id", drone.id);
            const elapsedTime = Date.now() - drone.startTime; 
            const progress = Math.min((elapsedTime / drone.buildTime.toNumber()) * 100, 100); 
            droneElement.innerHTML = `
                <p>${drone.description}</p>
                <p>Cost: ${formatAndConvertNumber(drone.cost)} ore</p>
                <p>+${formatAndConvertNumber(drone.productionRate)} ore/s</p>
                <p>${formatNumber(drone.droneCount)} Drones</p>
                <p>${timeDisplay}</p>
                <div class="progress-bar" style="width: 100%; background-color: lightgray;">
                    <div class="progress-fill" style="width: ${drone.building ? `${progress}%` : '0%'}; height: 20px; background-color: rgb(11, 255, 222);"></div>
                </div>
            `;
            droneElement.addEventListener("click", () => {
                startBuildingDrone(drone.id);
            });
            container.appendChild(droneElement);
        }
    });
}














    const researchContainer = document.getElementById("research-container");
    const researchContainerWrapper = document.getElementById("research-container-wrapper");

    const createdLines = new Set();

    function renderResearchItems() {
        researchContainer.innerHTML = ""; 
        createdLines.clear(); 
        gameData.researchData.forEach(item => {
            if (!item.isUnlocked && item.prerequisites.length > 0) {
                const prerequisitesMet = item.prerequisites.every(prereqId => {
                    const prereqItem = gameData.researchData.find(r => r.id === prereqId);
                    return prereqItem && prereqItem.currentPurchases >= 1;
                });
                if (prerequisitesMet) {
                    item.isUnlocked = true;
                }
            }
        });

        gameData.researchData.forEach(item => {
            if (item.isUnlocked) {
                const rootPosition = item.id === "research1" 
                    ? { x: researchContainer.offsetWidth / 2 - 24, y: researchContainer.offsetHeight / 2 - 150} 
                    : null;
                createResearchNode(item, rootPosition);
                item.prerequisites.forEach(prereqId => {
                    const prereqItem = gameData.researchData.find(r => r.id === prereqId);
                    if (prereqItem && prereqItem.isUnlocked) {
                        const prereqElement = document.getElementById(prereqId);
                        const itemElement = document.getElementById(item.id);
                        if (prereqElement && itemElement) {
                            createUniqueLineBetweenNodes(prereqElement, itemElement);
                        }
                    }
                });
                item.unlockedItems.forEach(childData => {
                    const childId = typeof childData === "object" ? childData.id : childData;
                    const childItem = gameData.researchData.find(r => r.id === childId);
                    if (childItem && childItem.isUnlocked) {
                        const itemElement = document.getElementById(item.id);
                        const childElement = document.getElementById(childId);
                        if (itemElement && childElement) {
                            createUniqueLineBetweenNodes(itemElement, childElement);
                        }
                    }
                });
                if (rootPosition) {
                    let oreBoostContainer = document.getElementById("ore-boost-container");
                    if (!oreBoostContainer) {
                        oreBoostContainer = document.createElement("div");
                        oreBoostContainer.id = "ore-boost-container";
                        oreBoostContainer.innerHTML = `
                            <h3>Research Boost</h3>
                            <input id="ore-input" type="number" placeholder="Ore/s usage" value="" min="0" step="0.001">
                            <div id="boost-preview">Boost: 1x</div>
                            <button id="toggle-boost-button">Enable Boost</button>
                            <p id="boost-status">Boost Disabled</p>
                        `;
                        researchContainer.appendChild(oreBoostContainer);
                    }
                    const containerWidth = oreBoostContainer.offsetWidth;
                    const containerHeight = oreBoostContainer.offsetHeight;
                    oreBoostContainer.style.position = "absolute";
                    oreBoostContainer.style.left = `${rootPosition.x + 24 - containerWidth / 2}px`;
                    oreBoostContainer.style.top = `${rootPosition.y - containerHeight - 48}px`;
                    setupBoostUI();
                }
            }
        });
    const resetBtn = document.getElementById("reset-position-btn");
    resetBtn.textContent = "Reset View";
    resetBtn.className = "reset-position-btn";
    document.getElementById("research-container-wrapper").appendChild(resetBtn);
    resetBtn.style.left = `${(researchContainerWrapper.offsetWidth / 2 - 60)}px`;
    }
    
    function createResearchNode(item, position) {
        if (!item.isUnlocked || !position) return;
    
        const researchItem = document.createElement("div");
        researchItem.classList.add("research-item");
        researchItem.id = item.id;
        researchItem.style.backgroundImage = `url(${item.icon})`;
        researchItem.setAttribute("data-id", item.id);
        researchItem.style.left = `${position.x}px`;
        researchItem.style.top = `${position.y}px`;
    
        researchItem.addEventListener("mouseenter", (event) => showTooltip(item, event));
        researchItem.addEventListener("mouseleave", hideTooltip);
        researchItem.addEventListener("click", () => purchaseResearch(item));
    
        researchContainer.appendChild(researchItem);

        if (item.unlockedItems && item.unlockedItems.length > 0) {
            const numChildren = item.unlockedItems.length;
            const childPositionY = position.y + 96;
    
            let childPositions = [];
            if (numChildren === 1) {
                childPositions = [{ x: position.x, y: childPositionY }];
            } else if (numChildren === 2) {
                childPositions = [
                    { x: position.x - 96, y: childPositionY },
                    { x: position.x + 96, y: childPositionY },
                ];
            } else if (numChildren === 3) {
                childPositions = [
                    { x: position.x - 96, y: childPositionY },
                    { x: position.x, y: childPositionY },
                    { x: position.x + 96, y: childPositionY },
                ];
            }
    
            item.unlockedItems.forEach((childData, index) => {
                const childId = typeof childData === "object" ? childData.id : childData;
                const direction = typeof childData === "object" ? childData.direction : null;
                const childItem = gameData.researchData.find(r => r.id === childId);
    
                if (childItem && childItem.isUnlocked) {
                    const childPosition = direction 
                        ? calculateCustomPosition(position, direction) 
                        : childPositions[index];
                    createResearchNode(childItem, childPosition); 
                }
            });
        }
    }

    function calculateCustomPosition(position, direction) {
        const offset = 96;
        let childPosition;
    
        switch (direction) {
            case "down":
                childPosition = { x: position.x, y: position.y + offset };
                break;
            case "down-r":
                childPosition = { x: position.x + offset, y: position.y + offset };
                break;
            case "down-l":
                childPosition = { x: position.x - offset, y: position.y + offset };
                break;
            case "right":
                childPosition = { x: position.x + offset, y: position.y };
                break;
            case "left":
                childPosition = { x: position.x - offset, y: position.y };
                break;
            case "up":
                childPosition = { x: position.x, y: position.y - offset };
                break;
            case "up-r":
                childPosition = { x: position.x + offset, y: position.y - offset };
                break;
            case "up-l":
                childPosition = { x: position.x - offset, y: position.y - offset };
                break;
            default:
                childPosition = { x: position.x, y: position.y + offset }; 
                break;
        }
        return childPosition;
    }

    function showTooltip(item, event) {
        let tooltip = document.getElementById("tooltip");
        if (!tooltip) {
            tooltip = document.createElement("div");
            tooltip.id = "tooltip";
            tooltip.className = "tooltip"; 
            tooltip.style.display = "none"; 
    
            const name = document.createElement("strong");
            name.id = "research-name";
            tooltip.appendChild(name);
    
            const description = document.createElement("p");
            description.id = "research-description";
            tooltip.appendChild(description);
    
            const cost = document.createElement("p");
            const costSpan = document.createElement("span");
            cost.id = "research-cost";
            cost.appendChild(costSpan);
            tooltip.appendChild(cost);
    
            const increment = document.createElement("p");
            const incrementSpan = document.createElement("span");
            incrementSpan.id = "research-increment";
            increment.appendChild(incrementSpan);
            tooltip.appendChild(increment);
    
            const purchasesLeft = document.createElement("p");
            const purchasesLeftSpan = document.createElement("span");
            purchasesLeftSpan.id = "research-purchases-left";
            purchasesLeft.appendChild(purchasesLeftSpan);
            tooltip.appendChild(purchasesLeft);
    
            document.getElementById("research-container-wrapper").appendChild(tooltip);
        };
        tooltip.style.display = "inline-block";
        tooltip.style.bottom = `${(researchContainerWrapper.offsetHeight - 150)}px`;
        tooltip.style.left = `${(researchContainerWrapper.offsetWidth / 2 - 200)}px`;

        document.getElementById("research-name").innerHTML = item.name;
        document.getElementById("research-description").innerHTML = item.getDescription();
        document.getElementById("research-increment").innerHTML = item.getDesc();
        document.getElementById("research-cost").innerHTML = `
        Cost: <strong style="color: rgb(75, 75, 255)">${formatResearch(item.cost)}</strong>
        ${item.oreCost ? ` + <strong style="color: rgb(128, 64, 0)">${formatAndConvertNumber(item.oreCost)} Ore</strong>` : ''}
        `;
        document.getElementById("research-purchases-left").innerHTML = `${formatNumber(item.currentPurchases)} / ${formatNumber(item.maxPurchases)}`;
    }
    function hideTooltip(event) {
        const tooltip = document.getElementById("tooltip");
        if (tooltip) {
            tooltip.remove(); 
        }
    }

    function purchaseResearch(item) {
        if (gameData.research.gte(item.cost) &&
        (!item.oreCost || gameData.ore.gte(item.oreCost)) && item.currentPurchases.lt(item.maxPurchases)) {
            gameData.research = gameData.research.sub(item.cost);
            if (item.oreCost) {
                gameData.ore = gameData.ore.sub(item.oreCost);
            }
            item.currentPurchases = item.currentPurchases.add(new OmegaNum(1));
            item.effect();
    
            item.unlockedItems.forEach(unlockedData => {
                const unlockedId = typeof unlockedData === "object" ? unlockedData.id : unlockedData;
                const unlockedItem = gameData.researchData.find(r => r.id === unlockedId);
                if (unlockedItem) {
                    if (!unlockedItem.completedPrerequisites.includes(item.id)) {
                        unlockedItem.completedPrerequisites.push(item.id);
                    }
    
                    const allPrereqsMet = unlockedItem.prerequisites.every(prereqId =>
                        unlockedItem.completedPrerequisites.includes(prereqId)
                    );
    
                    if (allPrereqsMet) {
                        unlockedItem.isUnlocked = true;
                    }
                }
            });
    
            renderResearchItems();
            updateResearchStyles();
        }
    }


    function createLineBetweenNodes(startNode, endX, endY) {
        const line = document.createElement("div");
        line.classList.add("line");
        const startX = startNode.offsetLeft + startNode.offsetWidth / 2;
        const startY = startNode.offsetTop + startNode.offsetHeight / 2;
        const adjustedEndX = endX + 24; 
        const adjustedEndY = endY + 24; 
        const deltaX = adjustedEndX - startX;
        const deltaY = adjustedEndY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        line.style.width = `${distance}px`;
        line.style.height = "4px"; 
        line.style.position = "absolute";
        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = "0 0"; 
        researchContainer.appendChild(line);
    }

    function createUniqueLineBetweenNodes(startNode, endNode) {
        const lineKey = `${startNode.id}-${endNode.id}`;
        if (createdLines.has(lineKey)) return;
    
        createLineBetweenNodes(startNode, endNode.offsetLeft, endNode.offsetTop);
        createdLines.add(lineKey);
    }

    function updateResearchStyles() {
        gameData.researchData.forEach(research => {
            const element = document.getElementById(research.id);
            if (!element) return; 
            element.classList.remove('affordable', 'maxed');
            if (research.currentPurchases.gte(research.maxPurchases)) {
                element.classList.add('maxed');
            } 
            else if (gameData.research.gte(research.cost)) {
                element.classList.add('affordable');
            }
        });
    }

    function R(number) {
        return gameData.researchData.find(research => research.id === `research${number}`);
    }







    let isPanning = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0;
    const margin = 0;
    
    researchContainer.addEventListener("mousedown", (event) => {
        if (event.target.closest("input, button, textarea")) {
            return; 
        }
        isPanning = true;
        startX = event.clientX - offsetX;
        startY = event.clientY - offsetY;
        researchContainer.style.cursor = "grabbing";
    });
    
    document.addEventListener("mousemove", (event) => {
        if (!isPanning) return;
        let newOffsetX = event.clientX - startX;
        let newOffsetY = event.clientY - startY;
        const wrapperRect = researchContainerWrapper.getBoundingClientRect();
        const containerRect = researchContainer.getBoundingClientRect();
        const maxXOffset = (containerRect.width - wrapperRect.width) / 2 + margin;
        const minXOffset = -maxXOffset;
        offsetX = Math.min(Math.max(newOffsetX, minXOffset), maxXOffset);
        const maxYOffset = (containerRect.height - wrapperRect.height) / 2 + margin;
        const minYOffset = -maxYOffset;
        offsetY = Math.min(Math.max(newOffsetY, minYOffset), maxYOffset);
        researchContainer.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;
    });
    
    document.addEventListener("mouseup", () => {
        isPanning = false;
        researchContainer.style.cursor = "grab";
    });
    
    const resetBtn = document.getElementById("reset-position-btn");
    resetBtn.addEventListener("click", () => {
        offsetX = 0;
        offsetY = 0;
        researchContainer.style.transform = "translate(-50%, -50%)";
    });

    function updateSoundSettingsUI() {
        const soundToggleButton = document.getElementById("sound-toggle");
        if (soundEnabled) {
            soundToggleButton.textContent = "On";
            soundToggleButton.style.backgroundColor = "green";
        } else {
            soundToggleButton.textContent = "Off";
            soundToggleButton.style.backgroundColor = "red";
        }
        const typingVolumeSlider = document.getElementById("typing-sound-slider");
        const popVolumeSlider = document.getElementById("pop-sound-slider");
        typingVolumeSlider.value = typingSoundVolume; 
        popVolumeSlider.value = popSoundVolume;
    }

    document.getElementById("typing-sound-slider").addEventListener("input", (e) => {
        typingSoundVolume = e.target.value / 100; 
        if (typingSound) typingSound.volume = soundEnabled ? typingSoundVolume : 0;
        saveGame();
    });
    document.getElementById("pop-sound-slider").addEventListener("input", (e) => {
        popSoundVolume = e.target.value / 100; 
        if (popSound) popSound.volume = soundEnabled ? popSoundVolume : 0;
        saveGame();
    });

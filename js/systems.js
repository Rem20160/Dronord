const systems = {
    core: [
        { name: "Main Processing Unit", status: "Operational", description: "Central processing unit of the drone.", systemVisible: true, repairCost: new OmegaNum(0), iCost: new OmegaNum(0), brokenState: "System malfunction detected.", workingState: "System is operational." },
        { name: "Memory Array", status: "corrupted", description: "Stores operational data and research.", systemVisible: false, repairCost: new OmegaNum(2), iCost: new OmegaNum(2), brokenState: "Data corruption detected.", workingState: "Data storage operational." },
        { name: "Communications Array", status: "corrupted", description: "Enables communication with other drones.", systemVisible: false, repairCost: new OmegaNum(0), iCost: new OmegaNum(0), brokenState: "Signal interference detected.", workingState: "Communications restored." },
    ],
    operational: [
        { name: "Laser Drill System", status: "Operational", description: "Laser system for mining ore.", systemVisible: true, repairCost: new OmegaNum(0), iCost: new OmegaNum(0), brokenState: "Laser system malfunction.", workingState: "Laser system operational." },
        { name: "Self-Repair System", status: "corrupted", description: "Automated repair system.", systemVisible: false, repairCost: new OmegaNum(0.005), iCost: new OmegaNum(0.005), brokenState: "Repair system offline.", workingState: "Repair system operational." },
    ],
    utility: [
        { name: "Diagnostic Array", status: "Operational", description: "Monitors system health and performance.", systemVisible: true, repairCost: new OmegaNum(0), iCost: new OmegaNum(0), brokenState: "Diagnostics unavailable.", workingState: "Diagnostics online." },
        { name: "Optimization Algorithm", status: "corrupted", description: "Allocates and enhances research.", systemVisible: false, repairCost: new OmegaNum(0), iCost: new OmegaNum(0), brokenState: "Optimization malfunction.", workingState: "Optimization fully functional." },
        { name: "Command Interface", status: "corrupted", description: "Manual control interface for drones.", systemVisible: false, repairCost: new OmegaNum(0.1), iCost: new OmegaNum(0.1), brokenState: "Interface offline.", workingState: "Interface online." }
    ]
};

function createSystemElement(system) {
    const systemDiv = document.createElement("div");
    systemDiv.className = "system";
    systemDiv.style.width = '600px';
    systemDiv.style.height = '150px';

    let statusDisplay, descriptionDisplay, messageDisplay;
    let buttonDisplay = null;

    if (system.systemVisible) {
        statusDisplay = `<p><span class="system-status">${system.status === 'corrupted' ? "Corrupted" : system.status === 'broken' ? "Broken" : "Operational"}</span></p>`;
        descriptionDisplay = `<p>${system.description}</p>`;
        
        if (system.status === "Operational") {
            messageDisplay = `<p class="working-message">${system.workingState}</p>`;
        } else {
            messageDisplay = `<p class="broken-message">${system.brokenState}</p>`;
            buttonDisplay = document.createElement("button");
            buttonDisplay.className = "repair-button";
            buttonDisplay.textContent = `Repair for ${formatAndConvertNumber(system.repairCost)}`;
            buttonDisplay.addEventListener("click", () => repairSystem(system.name, system.repairCost));
        }
    } else {
        systemDiv.style.backgroundImage = 'url("images/broken-image.png")';
        systemDiv.style.backgroundSize = 'cover'; 
        systemDiv.style.backgroundPosition = 'center'; 

        descriptionDisplay = `${corrupt(6)}`;
        messageDisplay = "";
        statusDisplay = "";
    }

    systemDiv.innerHTML = `
        <h3>${system.systemVisible ? system.name : `${corrupt(15)}`}</h3>
        ${statusDisplay}
        ${descriptionDisplay}
        ${messageDisplay}
    `;

    if (buttonDisplay) {
        systemDiv.appendChild(buttonDisplay);
    }
    
    return systemDiv;
}

function repairSystem(systemName, repairCost) {
    repairCost = typeof repairCost === "number" ? new OmegaNum(repairCost) : new OmegaNum(repairCost);
    if (gameData.ore.gte(repairCost)) {
        Object.values(systems).forEach(category => {
            const system = category.find(s => s.name === systemName);
            if (system && (system.status === "broken" || system.status === "corrupted") && system.systemVisible) {
                system.status = "Operational"; 
                gameData.ore = gameData.ore.sub(repairCost);

                document.querySelectorAll(".system").forEach(el => {
                    if (el.querySelector("h3").innerText === system.name) {
                        el.querySelector(".system-status").innerText = "Operational"; 
                        el.querySelector(".broken-message").innerText = system.workingState; 
                        el.querySelector(".repair-button").remove(); 
                    }
                });
            }
        });
    }
}

function revealSystem(systemName) {
    Object.values(systems).forEach(category => {
        const system = category.find(s => s.name === systemName);
        if (system && !system.systemVisible) {
            system.systemVisible = true;
            renderSystems();
        }
    });
}

function renderCoreSystems() {
    const coreContainer = document.getElementById("core-systems-content");
    coreContainer.innerHTML = ""; 

    systems.core.forEach(system => {
        coreContainer.appendChild(createSystemElement(system));
    });
}

function renderOperationalSystems() {
    const operationalContainer = document.getElementById("operational-systems-content");
    operationalContainer.innerHTML = ""; 

    systems.operational.forEach(system => {
        operationalContainer.appendChild(createSystemElement(system));
    });
}

function renderUtilitySystems() {
    const utilityContainer = document.getElementById("utility-systems-content");
    utilityContainer.innerHTML = ""; 

    systems.utility.forEach(system => {
        utilityContainer.appendChild(createSystemElement(system));
    });
}

function renderSystems() {
    renderCoreSystems();
    renderOperationalSystems();
    renderUtilitySystems();
}
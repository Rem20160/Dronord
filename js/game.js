const gameData = {
    ore: new OmegaNum(0),
    orePerSecond: new OmegaNum(0),
    baseOrePerSecond: new OmegaNum(0),
    baseOrePerClick: new OmegaNum(0.001),
    oneTimeMultiplier: new OmegaNum(1),
    purchasedUpgrades: new Set(),
    lastUpdateTime: Date.now(),
    startTime: 0,
    timePlayed: 0,
    tabsVisible: false,
    oreInfoVisible: false,
    dronesVisible: false,
    oTUVisible: false,
    researchVisible: false,
    orePerClick: new OmegaNum(0.001),
    holdDuration: new OmegaNum(1000),
    baseHoldDuration: new OmegaNum(1000),
    research: new OmegaNum(0),
    researchLimit: new OmegaNum(80),
    researchPerSecond: new OmegaNum(0),
    baseResearchPerSecond: new OmegaNum(0),
    repeatableUpgrades: [
        { id: "r1", desc: "Times", initialUpgradeCost: new OmegaNum(0.002), cost: new OmegaNum(0.002), costMultiplier: new OmegaNum(1.1), initialCostMultiplier: new OmegaNum(1.1), initialPurchaseCount: 0, purchaseCount: 0, upgradeVisible: false, multiplier: new OmegaNum(1), effectIncrement: new OmegaNum(0.2), initialEffectIncrement: new OmegaNum(0.2),
            getDescription() { 
                return `Improve yourself, ${formatNumber(this.calculateEffect())}x more ore`; 
            },
            getDesc() {
                return `Effect: +${formatNumber(this.effectIncrement)}x`
            },
            effect() { 
                if (this.purchaseCount >= 19) {this.costMultiplier = new OmegaNum(1.25)} else {this.costMultiplier = this.initialCostMultiplier};
                this.multiplier = this.multiplier.add(this.effectIncrement);
                this.purchaseCount++;
                updateOrePerClick(); 
            },
            calculateEffect() {
                return this.multiplier;
            }
        },
        { id: "r2", desc: "Times", initialUpgradeCost: new OmegaNum(0.002), cost: new OmegaNum(0.002), costMultiplier: new OmegaNum(1.1), initialCostMultiplier: new OmegaNum(1.1), initialPurchaseCount: 0, purchaseCount: 0, upgradeVisible: false, multiplier: new OmegaNum(1), effectIncrement: new OmegaNum(0.2), initialEffectIncrement: new OmegaNum(0.2),
            getDescription() { 
                return `Improve yourself, ${formatNumber(this.calculateEffect())}x faster mining`; 
            },
            getDesc() {
                return `Effect: +${formatNumber(this.effectIncrement)}x`
            },
            effect() { 
                if (this.purchaseCount >= 19) {this.costMultiplier = new OmegaNum(1.25)} else {this.costMultiplier = this.initialCostMultiplier};
                this.multiplier = this.multiplier.add(this.effectIncrement); 
                this.purchaseCount++;
                updateHoldDuration();
            },
            calculateEffect() {
                return this.multiplier;
            }
        },
        {
            id: "r3",
            desc: " Times",
            initialUpgradeCost: new OmegaNum(0.1),
            cost: new OmegaNum(0.1),
            costMultiplier: new OmegaNum(1.25),
            initialCostMultiplier: new OmegaNum(1.25),
            initialPurchaseCount: 0,
            purchaseCount: 0,
            upgradeVisible: false,
            effectIncrement: new OmegaNum(0.1),
            initialEffectIncrement: new OmegaNum(0.1),
            multiplier: new OmegaNum(1),

            getDescription() {
                return `Decrease basic mining drone build time by /${formatNumber(this.calculateEffect())}`;
            },
            getDesc() {
                return `Effect: +/${formatNumber(this.effectIncrement)}`
            },
            effect() {
                this.multiplier = this.multiplier.add(this.effectIncrement); 
                this.purchaseCount++;
                updateBuildTimes(); 
            },

            calculateEffect() {
                return this.multiplier;
            }
        },
    ],
    oneTimeUpgrades: [
        { id: "o1", description: "Better mining", cost: new OmegaNum(3), upgradeVisible: false, desc: "effect: 2x", effect() { 
            gameData.oneTimeMultiplier = gameData.oneTimeMultiplier.mul(2); 
            updateOrePerSecond(); 
            updateOrePerClick();
        }},
        { id: "o2", description: "Denser Ore", cost: new OmegaNum(20), upgradeVisible: false, desc: "effect: 1.5x", effect() { 
            gameData.oneTimeMultiplier = gameData.oneTimeMultiplier.mul(1.5); 
            updateOrePerSecond(); 
            updateOrePerClick();
        }}
    ],
    drones: [
        {
            id: "d1",
            description: "Basic Mining Drone",
            cost: new OmegaNum(0.1),
            buildTime: new OmegaNum(30000), 
            initialBuildTime: new OmegaNum(30000), 
            productionRate: new OmegaNum(0.001),
            baseProductionRate: new OmegaNum(0.001), 
            initialProductionRate: new OmegaNum(0.001),
            droneCount: new OmegaNum(0),
            building: false, 
            upgradeVisible: false,
            startTime: null,
            initialCost: new OmegaNum(0.1),
        },
        {
            id: "d2",
            description: "Advanced Mining Drone",
            cost: new OmegaNum(5),
            buildTime: new OmegaNum(60000),
            initialBuildTime: new OmegaNum(60000), 
            productionRate: new OmegaNum(0.01),
            baseProductionRate: new OmegaNum(0.01),
            initialProductionRate: new OmegaNum(0.01),
            droneCount: new OmegaNum(0),
            building: false,
            upgradeVisible: false,
            startTime: null,
            initialCost: new OmegaNum(5),
        }
    ],

    researchData: [
        {
            id: "research1",
            name: "Basic Research",
            getDescription() {
                return `Start researching`;
            },
            getDesc() {
                return `Effect: +1 bit/s`
            },
            effectIncrement: new OmegaNum(0.1),
            iEI: new OmegaNum(0.1),
            cost: new OmegaNum(0),
            iCost: new OmegaNum(0),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
                gameData.baseResearchPerSecond = new OmegaNum(0).add(1).mul(this.currentPurchases);
                updateResearchPerSecond();
            },
            calculateEffect() {
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: ["research2", "research3", "research4"],
            icon: "../images/research/R1.png",
            isUnlocked: true,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research2",
            name: "Research Optimization",
            getDescription() {
                return `Increase research gain by ${formatNumber(this.calculateEffect())}x`
            },
            getDesc() {
                return `Effect: +${formatNumber(this.effectIncrement)}x`
            },
            effectIncrement: new OmegaNum(0.2),
            iEI: new OmegaNum(0.2), 
            cost: new OmegaNum(24),
            iCost: new OmegaNum(24),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
                this.e = new OmegaNum(1).add(this.currentPurchases.mul(this.effectIncrement));
                updateResearchPerSecond();
            },
            calculateEffect() {
                return new OmegaNum(1).add(this.currentPurchases.mul(this.effectIncrement));
            },
            maxPurchases: new OmegaNum(35),
            iMP: new OmegaNum(35),
            currentPurchases: new OmegaNum(0),
            unlockedItems: ["research7"],
            icon: "../images/research/R2.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research3",
            name: "Drone Efficiency",
            getDescription() {
                return `Increase drone efficiency by ${formatNumber(this.calculateEffect())}x`
            },
            getDesc() {
                return `Effect: +${formatNumber(this.effectIncrement)}x`
            },
            effectIncrement: new OmegaNum(0.05), 
            iEI: new OmegaNum(0.05),
            cost: new OmegaNum(24),
            iCost: new OmegaNum(24),
            costScaling: new OmegaNum(1.05),
            e: new OmegaNum(1),
            effect() {
                this.cost = this.iCost.mul(this.costScaling.pow(this.currentPurchases));
                this.e = new OmegaNum(1).add(this.currentPurchases.mul(this.effectIncrement));
                updateDroneEff(); 
                updateBaseOrePerSecond();
            },
            calculateEffect() {
                return this.e;
            },
            maxPurchases: new OmegaNum(40),
            iMP: new OmegaNum(40),
            currentPurchases: new OmegaNum(0),
            unlockedItems: ["research8"],
            icon: "../images/research/R3.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research4",
            name: "Manual Mining Efficiency",
            getDescription() {
                return `Increase manual ore gain by ${formatNumber(this.calculateEffect())}x`
            },
            getDesc() {
                return `Effect: +${formatNumber(this.effectIncrement)}x`
            },
            effectIncrement: new OmegaNum(0.1),
            iEI: new OmegaNum(0.1), 
            cost: new OmegaNum(24),
            iCost: new OmegaNum(24),
            costScaling: new OmegaNum(1.05),
            e: new OmegaNum(1),
            effect() {
                this.cost = this.iCost.mul(this.costScaling.pow(this.currentPurchases));
                this.e = new OmegaNum(1).add(this.currentPurchases.mul(this.effectIncrement));
                updateOrePerClick();
            },
            calculateEffect() {
                return this.e;
            },
            maxPurchases: new OmegaNum(90),
            iMP: new OmegaNum(90),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [
            { id: "research5", direction: "right" },
            { id: "research9", direction: "down" },
            ],
            icon: "../images/research/R4.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
            affectsOrePerClick: true,
        },
        {
            id: "research5",
            name: "Research Capacity Expansion",
            getDescription() {
                return `Increase research capacity by ${formatNumber(this.calculateEffect())}x`
            },
            getDesc() {
                return `Effect: +${formatNumber(this.effectIncrement)}x`
            },
            effectIncrement: new OmegaNum(0.5), 
            iEI: new OmegaNum(0.5), 
            cost: new OmegaNum(80),
            iCost: new OmegaNum(80),
            costScaling: new OmegaNum(20),
            e: new OmegaNum(1),
            effect() {
                this.cost = this.iCost.add(this.costScaling.mul(this.currentPurchases));
                this.e = new OmegaNum(1).add(this.currentPurchases.mul(this.effectIncrement));
                updateResearchLimit();
            },
            calculateEffect() {
                return this.e;
            },
            icon: "../images/research/R5.png",
            prerequisites: [],
            unlockedItems: ["research6"],
            isUnlocked: false,
            currentPurchases: new OmegaNum(0),
            maxPurchases: new OmegaNum(18),
            iMP:  new OmegaNum(18),
            completedPrerequisites: [] 
        },
        {
            id: "research6",
            name: "Advanced Research Capacity",
            getDescription() {
                return `Increase research capacity by ${formatNumber(this.calculateEffect())}x`
            },
            getDesc() {
                return `Effect: ${formatNumber(this.effectIncrement)}x`
            },
            effectIncrement: new OmegaNum(2), 
            iEI: new OmegaNum(2), 
            cost: new OmegaNum(800),
            iCost: new OmegaNum(800),
            costScaling: new OmegaNum(4),
            e: new OmegaNum(1),
            effect() {
                this.cost = this.iCost.mul(this.costScaling.pow(0.5).pow(this.currentPurchases)); 
                this.e = new OmegaNum(1).mul(this.effectIncrement.pow(this.currentPurchases));
                if (this.currentPurchases.gte(10)) {
                    if (!this.unlockedItems.includes("research17")) {
                        this.unlockedItems.push("research17");
                    }
                } else {
                    this.unlockedItems = this.unlockedItems.filter(item => item !== "research17");
                }
            },
            calculateEffect() {
                return this.e;
            },
            maxPurchases: new OmegaNum(10),
            iMP: new OmegaNum(10),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [],
            icon: "../images/research/R6.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research7",
            name: "Research Boost",
            getDescription() {
                return `Increase research gain by time played ${formatNumber(this.calculateEffect())}x`
            },
            getDesc() {
                const logTimePlayed = OmegaNum(Math.log10(gameData.timePlayed + 1));
                return `Effect: ${formatNumber(logTimePlayed)}x`
            },
            effectIncrement: new OmegaNum(0.25), 
            iEI: new OmegaNum(0.25), 
            cost: new OmegaNum(400),
            iCost: new OmegaNum(400),
            costScaling: new OmegaNum(1024),
            e: new OmegaNum(1),
            effect() {
                const logTimePlayed = OmegaNum(Math.log10(gameData.timePlayed + 1));
                this.e = logTimePlayed.pow(this.currentPurchases);
                this.cost = this.iCost.mul(this.costScaling.pow(this.currentPurchases));
                updateResearchPerSecond();
            },
            calculateEffect() {
                const logTimePlayed = OmegaNum(Math.log10(gameData.timePlayed + 1));
                return logTimePlayed.pow(this.currentPurchases);
            },
            maxPurchases: new OmegaNum(3),
            iMP: new OmegaNum(3),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [
                { id: "research16", direction: "down-l" },
                { id: "research10", direction: "down" },
                ],
            icon: "../images/research/R7.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research8",
            name: "Drone Building",
            getDescription() {
                return `Decrease drone build time by /${formatNumber(this.calculateEffect())}`
            },
            getDesc() {
                return `Effect: +/${formatNumber(this.effectIncrement)}`
            },
            effectIncrement: new OmegaNum(0.05), 
            iEI: new OmegaNum(0.05), 
            cost: new OmegaNum(200),
            iCost: new OmegaNum(200),
            costScaling: new OmegaNum(1.15),
            e: new OmegaNum(1),
            effect() {
                this.cost = this.iCost.mul(this.costScaling.pow(this.currentPurchases));
                this.e = new OmegaNum(1).add(this.currentPurchases.mul(this.effectIncrement));
                updateBuildTimes();
            },
            calculateEffect() {
                return this.e;
            },
            maxPurchases: new OmegaNum(60),
            iMP: new OmegaNum(60),
            currentPurchases: new OmegaNum(0),
            unlockedItems: ["research11"],
            icon: "../images/research/R8.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research9",
            name: "Mining Speed Enhancement",
            getDescription() {
                return `Mine faster by ${formatNumber(this.calculateEffect())}x`
            },
            getDesc() {
                return `Effect: +${formatNumber(this.effectIncrement)}x`
            },
            effectIncrement: new OmegaNum(0.25), 
            iEI: new OmegaNum(0.25), 
            cost: new OmegaNum(200),
            iCost: new OmegaNum(200),
            costScaling: new OmegaNum(1.15),
            e: new OmegaNum(1),
            effect() {
                this.cost = this.iCost.mul(this.costScaling.pow(this.currentPurchases));
                this.e = new OmegaNum(1).add(this.currentPurchases.mul(this.effectIncrement));
                updateHoldDuration();
            },
            calculateEffect() {
                return this.e;
            },
            maxPurchases: new OmegaNum(36),
            iMP: new OmegaNum(36),
            currentPurchases: new OmegaNum(0),
            unlockedItems: ["research12"],
            icon: "../images/research/R9.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research10",
            name: "Research Expansion",
            getDescription() {
                return `Increase the base research gain by +${formatNumber(this.calculateEffect())}`
            },
            getDesc() {
                return `Effect: +${formatNumber(this.effectIncrement)}`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(8192),
            iCost: new OmegaNum(8192),
            costScaling: new OmegaNum(1.25),
            e: new OmegaNum(0),
            effect() {
                this.cost = this.iCost.mul(this.costScaling.pow(this.currentPurchases));
                this.e = new OmegaNum(0).add(this.effectIncrement).mul(this.currentPurchases);
                updateResearchPerSecond();
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(7),
            iMP: new OmegaNum(7),
            currentPurchases: new OmegaNum(0),
            unlockedItems: ["research13"],
            icon: "../images/research/R10.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research11",
            name: "Research 11",
            getDescription() {
                return `PlaceHolder`
            },
            getDesc() {
                return `PlaceHolder`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(1),
            iCost: new OmegaNum(25),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: ["research14"],
            icon: "../images/research/R11.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research12",
            name: "Research 12",
            getDescription() {
                return `PlaceHolder`
            },
            getDesc() {
                return `PlaceHolder`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(1),
            iCost: new OmegaNum(25),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: ["research15"],
            icon: "../images/research/R12.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research13",
            name: "Advanced Research Optimization",
            getDescription() {
                return `Increase research gain by ${formatNumber(this.calculateEffect())}x`
            },
            getDesc() {
                return `Effect: ${formatNumber(this.effectIncrement)}x`
            },
            effectIncrement: new OmegaNum(2),
            iEI: new OmegaNum(2),
            cost: new OmegaNum(81920),
            iCost: new OmegaNum(81920),
            costScaling: new OmegaNum(3),
            e: new OmegaNum(1),
            effect() {
                this.cost = this.iCost.mul(this.costScaling.pow(this.currentPurchases));
                this.e = new OmegaNum(1).mul(this.effectIncrement).pow(this.currentPurchases);
                updateResearchPerSecond();
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(10),
            iMP: new OmegaNum(10),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [],
            icon: "../images/research/R13.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research14",
            name: "Research 14",
            getDescription() {
                return `PlaceHolder`
            },
            getDesc() {
                return `PlaceHolder`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(1),
            iCost: new OmegaNum(25),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [],
            icon: "../images/research/R14.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research15",
            name: "Research 15",
            getDescription() {
                return `PlaceHolder`
            },
            getDesc() {
                return `PlaceHolder`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(1),
            iCost: new OmegaNum(25),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [],
            icon: "../images/research/R15.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research16",
            name: "Research Boost V2",
            getDescription() {
                return `Increase research gain by itself ${formatNumber(this.calculateEffect())}x`
            },
            getDesc() {
                const x = OmegaNum(gameData.research.pow(0.75).logBase(2).div(2).add(1));
                return `Effect: ${formatNumber(x)}x`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(4000),
            iCost: new OmegaNum(4000),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
                this.e = OmegaNum(gameData.research.pow(0.75).logBase(2).div(2).add(1));
                updateResearchPerSecond();
            },
            calculateEffect() {
                return OmegaNum(gameData.research.pow(0.75).logBase(2).div(2).add(1)).pow(this.currentPurchases);
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [],
            icon: "../images/research/Placeholder.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research17",
            name: "Research 17",
            getDescription() {
                return `PlaceHolder`
            },
            getDesc() {
                return `PlaceHolder`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(1),
            iCost: new OmegaNum(25),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [],
            icon: "../images/research/Placeholder.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research18",
            name: "Research 18",
            getDescription() {
                return `PlaceHolder`
            },
            getDesc() {
                return `PlaceHolder`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(1),
            iCost: new OmegaNum(25),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [],
            icon: "../images/research/Placeholder.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research19",
            name: "Research 19",
            getDescription() {
                return `PlaceHolder`
            },
            getDesc() {
                return `PlaceHolder`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(1),
            iCost: new OmegaNum(25),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [],
            icon: "../images/research/Placeholder.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
        {
            id: "research20",
            name: "Research 20",
            getDescription() {
                return `PlaceHolder`
            },
            getDesc() {
                return `PlaceHolder`
            },
            effectIncrement: new OmegaNum(1),
            iEI: new OmegaNum(1),
            cost: new OmegaNum(1),
            iCost: new OmegaNum(25),
            costScaling: new OmegaNum(0),
            e: new OmegaNum(1),
            effect() {
            },
            calculateEffect() {
                return this.e
            },
            maxPurchases: new OmegaNum(1),
            iMP: new OmegaNum(1),
            currentPurchases: new OmegaNum(0),
            unlockedItems: [],
            icon: "../images/research/Placeholder.png",
            isUnlocked: false,
            prerequisites: [],
            completedPrerequisites: [],
        },
    ],
};

function updateOrePerClick() {
    const r1 = gameData.repeatableUpgrades.find(upgrade => upgrade.id === "r1");
    const r1Multiplier = r1 ? r1.calculateEffect() : new OmegaNum(1);
    let finalMultiplier = r1Multiplier.mul(gameData.oneTimeMultiplier);
    gameData.researchData.forEach(research => {
        if (research.affectsOrePerClick) {
            finalMultiplier = finalMultiplier.mul(research.calculateEffect());
        }
    });
    gameData.orePerClick = gameData.baseOrePerClick.mul(finalMultiplier);
}

function updateHoldDuration() {
    const r2 = gameData.repeatableUpgrades.find(upgrade => upgrade.id === "r2");
    const finalMultiplier = r2 ? r2.calculateEffect() : new OmegaNum(1); 
    gameData.holdDuration = gameData.baseHoldDuration.div(finalMultiplier)
    .div(R(9).calculateEffect())
}

function updateDroneEff() {
    const r3 = gameData.researchData.find(r => r.id === "research3");
    const finalMultiplier = r3 ? r3.calculateEffect() : new OmegaNum(1);

    gameData.drones.forEach(drone => {
        drone.productionRate = drone.baseProductionRate.mul(finalMultiplier);
    });
}

function updateOrePerSecond() {
    gameData.orePerSecond = gameData.baseOrePerSecond.mul(gameData.oneTimeMultiplier);
}

function updateBaseOrePerSecond() {
    gameData.baseOrePerSecond = gameData.drones.reduce((total, drone) => {
        return total.add(drone.droneCount.mul(drone.productionRate));
    }, new OmegaNum(0));
}

function updateBuildTimes() {
    const r3 = gameData.repeatableUpgrades.find(upgrade => upgrade.id === "r3");
    const d1 = gameData.drones.find(drone => drone.id === "d1")
    const d2 = gameData.drones[1];
    const finalMultiplier = r3 ? r3.calculateEffect() : new OmegaNum(1); 
    d1.buildTime = d1.initialBuildTime.div(finalMultiplier).div(R(8).calculateEffect());
    d2.buildTime = d2.initialBuildTime.div(R(8).calculateEffect());
}

function updateResearchPerSecond() {
    const R2Mult = R(2) ? R(2).calculateEffect() : new OmegaNum(1);
    const R7Mult = R(7) ? R(7).calculateEffect() : new OmegaNum(1);
    const R10Add = R(10) ? R(10).calculateEffect() : new OmegaNum(0);
    const R16Mult = R(16) ? R(16).calculateEffect() : new OmegaNum(1);
    
    gameData.researchPerSecond = gameData.baseResearchPerSecond
        .add(R10Add)
        .mul(R2Mult)     
        .mul(R7Mult)
        .mul(R(13).calculateEffect())
        .mul(R16Mult);
}

function updateResearchMaxPurchases() {
    gameData.researchData.forEach((research, index) => {
    research.maxPurchases = research.iMP;

    if (index === 1) {
        research.maxPurchases = research.iMP;
    }

})}

function updateResearchLimit() {
    const baseLimit = new OmegaNum(80);
    gameData.researchLimit = baseLimit
    .mul(R(5).calculateEffect())
    .mul(R(6).calculateEffect())
}

function updateAllResearchEffects() {
    for (let research of Object.values(gameData.researchData)) { 
        if (research.effect) {
            research.effect();
        }
    }
}

// Elements
const oreCountDisplay = document.getElementById("ore-count");
const oreRateDisplay = document.getElementById("ore-rate");
const droneCountDisplay = document.getElementById("drone-count");
const researchCountDisplay = document.getElementById("research-count");
const researchRateDisplay = document.getElementById("research-rate");
const researchLimitDisplay = document.getElementById("researchLimit-count");
const oreIcon = document.getElementById("ore-icon");
const collectOreBtn = document.getElementById("collect-ore-btn");
const saveButton = document.getElementById("save-btn"); 
const resetButton = document.getElementById("reset-btn"); 
const tabs = document.getElementById("tabs");
const messageBox = document.getElementById("console-content");
const startButton = document.getElementById("start-btn");
const dots = document.getElementById("dots");

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "Enter" || event.code === "Shift" || event.code === "KeyO") {
        event.preventDefault(); 
        if (document.activeElement.tagName === "BUTTON") {
            document.activeElement.blur(); 
        }
    }
});

const progressCircle = document.querySelector(".progress-ring__circle");
const progressRing = document.querySelector(".progress-ring");
const completeRing = document.querySelector(".complete-ring");
const holdDurationDisplay = document.getElementById("hold-duration-display"); 
const droneIcon = document.getElementById("drone-icon");
let holdStartTime = null;
let holdTimeout;
let currentProgress = 0; 
let isHolding = false; 
let popSoundInterval;
let fastMiningInterval;

const circumference = 2 * Math.PI * 150; 
progressCircle.style.strokeDasharray = circumference; 
progressCircle.style.strokeDashoffset = circumference; 

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset; 
}

collectOreBtn.addEventListener("mousedown", () => {
    holdStartTime = Date.now();
    currentProgress = 0;
    isHolding = true; 
    droneIcon.src = "images/drone-peaceful-mining-image.png";

    if (gameData.holdDuration <= 500) {
        popSound.play();
        popSoundInterval = setInterval(() => {
            popSound.currentTime = 0;
            popSound.play();
        }, 1000)}

    if (gameData.holdDuration < 16.67) {
        completeRing.classList.add("visible", "pulse"); 
        let pulseDuration;
        const loopsPerSecond = (1000 / gameData.holdDuration);
        const oreIncrement = gameData.orePerClick.mul(loopsPerSecond).div(144);

        fastMiningInterval = setInterval(() => {
            if (isHolding) {
                gameData.ore = gameData.ore.add(oreIncrement); 
                updateUI();
            }
        }, 1000 / 144);
        if (gameData.holdDuration <= 0.001) {
            pulseDuration = 0.01;
        } else if (gameData.holdDuration <= 0.01) {
            pulseDuration = 0.05;
        } else if (gameData.holdDuration <= 0.03125) {
            pulseDuration = 0.1;
        } else if (gameData.holdDuration <= 0.0625) {
            pulseDuration = 0.2;
        } else if (gameData.holdDuration <= 0.125) {
            pulseDuration = 0.4;
        } else if (gameData.holdDuration <= 0.25) {
            pulseDuration = 0.6;
        } else if (gameData.holdDuration <= 0.5) {
            pulseDuration = 0.8;
        } else if (gameData.holdDuration <= 1) {
            pulseDuration = 1;
        } else {
            pulseDuration = 2; 
        }
    
        completeRing.style.setProperty("--pulse-duration", `${pulseDuration}s`);
        collectOreBtn.innerHTML = `<p>+${formatAndConvertNumber(gameData.orePerClick.mul(loopsPerSecond))}/s</p> <p>${formatNumber(loopsPerSecond)} Times/s </p>`;
    } else {
        progressRing.classList.add("visible"); 
        collectOreBtn.innerHTML = `Mine <p>+${formatAndConvertNumber(gameData.orePerClick)}</p> <p>${formatNumber(1000/gameData.holdDuration)} Times/s </p>`
    }
    const animate = () => {
        const elapsedTime = Date.now() - holdStartTime;
        const holdPercent = Math.min((elapsedTime / gameData.holdDuration) * 100, 100); 

        setProgress(holdPercent);

        if (holdPercent < 100) {
            requestAnimationFrame(animate);
        } else {
            if (isHolding && gameData.holdDuration >= 16.67) {
                gameData.ore = gameData.ore.add(gameData.orePerClick || 0.001);
                if (gameData.holdDuration >= 500) {popSound.play()};
                updateUI();
            }
            holdStartTime = Date.now(); 
            currentProgress = 0;
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
});

["mouseup", "mouseleave"].forEach(event => {
    collectOreBtn.addEventListener(event, () => {
        isHolding = false; 
        holdStartTime = null;
        droneIcon.src = "images/drone-peaceful-image.png";
        clearInterval(popSoundInterval);
        clearInterval(fastMiningInterval);
        popSound.pause();                
        popSound.currentTime = 0;       
        progressRing.classList.remove("visible");
        completeRing.classList.remove("visible", "pulse");
        collectOreBtn.innerHTML = `Mine`;
        setProgress(0); 
    });
});

function startGame() {
    const consoleElement = document.getElementById('console');
    consoleElement.style.width = '20%'; 
    const gameContainer = document.querySelector('.game-container');
    gameContainer.classList.add('show'); 
    const startButton = document.getElementById('start-btn');
    startButton.style.display = 'none';
    document.getElementById("dots").innerHTML = "C:/>";
    document.getElementById("flicker-line").style.display = "none";
    localStorage.setItem('gameStarted', 'true');
    document.getElementById("game-container").style.display = "inline-flex"; 
    logMessage("You can start by mining. Click and hold the Mine button for 5s to collect ore.");
    startTrackingTime();
}

function checkGameStatus() {
    if (localStorage.getItem('gameStarted') === 'true') {
        const consoleElement = document.getElementById('console');
        consoleElement.style.width = '20%'; 
        const gameContainer = document.querySelector('.game-container');
        gameContainer.classList.add('show'); 
        const startButton = document.getElementById('start-btn');
        startButton.style.display = 'none';
        document.getElementById("dots").innerHTML = "C:/>";
        document.getElementById("flicker-line").style.display = "none";
        document.getElementById("game-container").style.display = "inline-flex";
        document.getElementById("overlay").remove();
    }
}

document.addEventListener('DOMContentLoaded', checkGameStatus);
document.getElementById('start-btn').addEventListener('click', startGame);










function logMessage(message) {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    const fullMessage = `[${timestamp}] ${message}`;
    let messages = JSON.parse(localStorage.getItem('consoleMessages')) || [];
    const existingMessage = messages.find(msg => msg.text === message);
    if (!existingMessage) {
        messages.push({ text: message, timestamp });
        localStorage.setItem('consoleMessages', JSON.stringify(messages)); 
        displayMessage(fullMessage, true);
    }
}

let typingSound;
let typingInterval;

function loadTypingSound() {
    typingSound = new Audio('../sounds/keyboard-typing.mp3');
    typingSound.loop = true;
    popSound = new Audio('../sounds/pop-click.mp3');
    popSound.volume = 0.5;
}

function displayMessage(fullMessage, useTypingEffect = true) {
    const dots = document.getElementById('dots');
    if (useTypingEffect) {
        let index = 0;
        if (typingSound) {
            typingSound.play().catch(error => {
                console.error("Error playing typing sound:", error);
            });
        } else {
            console.error("Typing sound is not loaded.");
        }
        typingInterval = setInterval(() => {
            if (index < fullMessage.length) {
                dots.innerHTML += fullMessage.charAt(index);
                index++;
                dots.scrollTop = dots.scrollHeight;
            } else {
                clearInterval(typingInterval);
                if (typingSound) {
                    typingSound.pause(); 
                    typingSound.currentTime = 0;
                }
                dots.innerHTML += "<br>"; 
            }
        }, 50); // Typing speed
    } else {
        dots.innerHTML += fullMessage + "<br>";
    }
}

function loadMessages() {
    const savedMessages = JSON.parse(localStorage.getItem('consoleMessages')) || [];
    const dots = document.getElementById('dots');
    dots.innerHTML = "C:/>"; 
    savedMessages.forEach(msg => {
        const messageToDisplay = `[${msg.timestamp}] ${msg.text}`;
        dots.innerHTML += messageToDisplay + "<br>"; 
    });
}

function generateRapidGlitchText(length) {
    const N = `αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ`;
    let glitchText = "";

    for (let i = 0; i < length; i++) {
        glitchText += N[Math.floor(Math.random() * N.length)];
    }

    return glitchText;
}

function animateCorruption(length, intervalTime) {
    const corruptedTextElements = document.querySelectorAll(".corrupted-text");

    corruptedTextElements.forEach((element) => {
        if (element.dataset.animating === "true") return;
        element.dataset.animating = "true"; 
        setInterval(() => {
            const glitchText = generateRapidGlitchText(length);
            element.textContent = glitchText;
        }, intervalTime);
    });
}

function corrupt(length) {
    const glitchText = generateRapidGlitchText(length);
    const corruptedTextElement = document.createElement("span");
    corruptedTextElement.className = "corrupted-text";
    corruptedTextElement.setAttribute("data-text", glitchText); 
    corruptedTextElement.textContent = glitchText; 
    return corruptedTextElement.outerHTML;
}

window.onload = function() {
    loadMessages(); 
    loadTypingSound();
};

const initialMessage = "You seem to have gained consciousness. You have crash landed on Earth 66 Million years ago. Most of your memory is corrupted, aswell as most of the Core Systems are damaged. You are a drone. Your task is to mine.";

function displayInitialMessage() {
    displayMessage(`${initialMessage}`, true);
    setTimeout(() => {
    const startButton = document.getElementById('start-btn');
    startButton.style.display = 'block'}, 10000); 
    const overlay = document.getElementById("overlay");
    overlay.remove(); 
}

document.getElementById("overlay").addEventListener("click", function handleClick() {
    displayInitialMessage(); 
});















function updateVisibility() {
    const tabs = document.getElementById('tabs');
    const info = document.getElementById('ore-info');
    const drones = document.getElementById('drones-btn');
    const droneInfo = document.getElementById('drone-image');
    const upgradesBtn = document.getElementById("upgrades-btn");
    const upgrades = document.getElementById("one-time-upgrades-btn");
    const research = document.getElementById("research-btn");

    tabs.style.display = gameData.tabsVisible ? 'inline-flex' : 'none';
    info.style.display = gameData.oreInfoVisible ? 'inline-flex' : 'none';
    droneInfo.style.display = gameData.dronesVisible ? 'inline-flex' : 'none';
    drones.style.display = gameData.dronesVisible ? 'block' : 'none';
    upgrades.style.display = gameData.oTUVisible  ? 'block' : 'none';
    research.style.display = gameData.researchVisible ? 'block' : 'none';
    const selfRepairSystem = systems.operational.find(system => system.name === "Self-Repair System");
    upgradesBtn.style.display = selfRepairSystem && selfRepairSystem.status === "Operational" ? 'block' : 'none';
    const gameProgressBar = document.getElementById("game-progress-bar-container");
    gameProgressBar.style.display = gameData.tabsVisible ? 'block' : 'none';
}
const gameProgress = [0, 1, 2, 3, 4, 5];
const gameProgressThresholds = [new OmegaNum(0), new OmegaNum(0.1), new OmegaNum(2), new OmegaNum(1000), new OmegaNum(10000), new OmegaNum(Infinity)];
const gameProgressText = ["", "Unlock Drones", "Unlock Research", "Unlock The Factory", "Unlock The Swarm [10000 Drones]", ""];
let currentProgressIndex = 1;

function updateProgressBar() {
    let progressValue, currentThreshold, nextThreshold;

    if (currentProgressIndex <= 3) {
        progressValue = OmegaNum(gameData.ore);
        currentThreshold = gameProgressThresholds[currentProgressIndex];
        nextThreshold = (currentProgressIndex + 1 < gameProgressThresholds.length) ? gameProgressThresholds[currentProgressIndex + 1] : null;
    }
    if (currentProgressIndex === 4) {
        progressValue = OmegaNum(gameData.drones[0].droneCount);
        currentThreshold = gameProgressThresholds[currentProgressIndex];
        nextThreshold = (currentProgressIndex + 1 < gameProgressThresholds.length) ? gameProgressThresholds[currentProgressIndex + 1] : null;
    }
    if (progressValue.gte(currentThreshold)) {
        currentProgressIndex = Math.min(
            currentProgressIndex + 1,
            gameProgressThresholds.length
        );
        currentThreshold = gameProgressThresholds[currentProgressIndex];
        nextThreshold = (currentProgressIndex + 1 < gameProgressThresholds.length) 
            ? gameProgressThresholds[currentProgressIndex + 1] 
            : null;
    }
    let progressPercentage;
    if (nextThreshold === null || currentThreshold.eq(OmegaNum(Infinity))) {
        progressPercentage = 100; 
    } else if (progressValue.gte(10000)) {
        let progressLogDifference = progressValue.log10().div(currentThreshold.log10());
        progressPercentage = Math.min(100, progressLogDifference.mul(100).toNumber());
    } else {
        progressPercentage = progressValue.div(currentThreshold).mul(100).toNumber();
        progressPercentage = Math.min(progressPercentage, 100);
    }
    const progressBar = document.getElementById("gameProgressBar");
    const progressText = document.getElementById("gameProgressText");

    progressBar.style.width = `${progressPercentage}%`;
    if (nextThreshold === null || currentThreshold.eq(OmegaNum(Infinity))) {
        progressText.textContent = `End game for now`;
    } else {
        progressText.textContent = `${gameProgressText[currentProgressIndex]} - ${progressPercentage.toFixed(1)}%`;
    }
    
}
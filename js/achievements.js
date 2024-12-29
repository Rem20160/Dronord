const achievements = [
    {
        title: "The start",
        description: "Get 0.005 pg Ore",
        completed: false
    },
    {
        title: "Not that much...",
        description: "Get 0.1 pg Ore",
        completed: false
    },
    {
        title: "Replicator",
        description: "Make 1 drone",
        completed: false
    },
    {
        title: "Getting there",
        description: "Get 2 pg Ore",
        completed: false
    },
    {
        title: "Researcher?",
        description: "Get 1 Byte of Research",
        completed: false
    },
    {
        title: "Researcher?!?!",
        description: "Get 100 Bytes of Research",
        completed: false
    },
    {
        title: "A tiny drone army",
        description: "Make 50 drones",
        completed: false
    },
    {
        title: "This got us to the moon",
        description: "Get 5 KB of Research",
        completed: false
    },
    {
        title: "ORE.",
        description: "Get 100 pg Ore",
        completed: false
    },
    {
        title: "We must expand",
        description: "Unlock The Factory",
        completed: false
    },
    {
        title: "Barely any research",
        description: "Get 1 MB of Research",
        completed: false
    },
    {
        title: "A small drone army",
        description: "Make 250 drones",
        completed: false
    },
    {
        title: "Placeholder",
        description: "Placeholder",
        completed: false
    },
    {
        title: "Placeholder",
        description: "Placeholder",
        completed: false
    },
    {
        title: "Placeholder",
        description: "Placeholder",
        completed: false
    },
    {
        title: "Placeholder",
        description: "Placeholder",
        completed: false
    },
    {
        title: "Placeholder",
        description: "Placeholder",
        completed: false
    },
    {
        title: "Placeholder",
        description: "Placeholder",
        completed: false
    },
    {
        title: "Placeholder",
        description: "Placeholder",
        completed: false
    },
    {
        title: "Placeholder",
        description: "Placeholder",
        completed: false
    },
];

function displayAchievements() {
    const achievementsContainer = document.getElementById('achievements-container');
    achievementsContainer.innerHTML = ''; 
    achievements.forEach((achievement, index) => {
        const achievementDiv = document.createElement('div');
        achievementDiv.classList.add('achievement');
        if (achievement.completed) {
            achievementDiv.classList.add('completed');
        }
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.innerHTML = `<strong>${achievement.title}</strong><br><br>${achievement.description}`;
        achievementDiv.appendChild(tooltip);
        const achievementNumber = document.createElement('span');
        achievementNumber.innerText = index + 1; 
        achievementDiv.appendChild(achievementNumber);
        achievementsContainer.appendChild(achievementDiv);
    });
}

function UnlockAchievements() {
    if (gameData.ore >= 0.005 && !achievements[0].completed) {
        unlockAchievement(0);
    }
    if (gameData.ore >= 0.1 && !achievements[1].completed) {
        unlockAchievement(1);
    }
    const totalDroneCount = gameData.drones[0].droneCount;
    if (totalDroneCount.gte(1) && !achievements[2].completed) {
        unlockAchievement(2); 
    }
    if (gameData.ore >= 2 && !achievements[3].completed) {
        unlockAchievement(3); 
    }
    if (gameData.research >= 8 && !achievements[4].completed) {
        unlockAchievement(4); 
    }
    if (gameData.research >= 800 && !achievements[5].completed) {
        unlockAchievement(5);
    }
    if (totalDroneCount.gte(50) && !achievements[6].completed) {
        unlockAchievement(6); 
    }
    if (gameData.research >= 40960 && !achievements[7].completed) {
        unlockAchievement(7);
    }
    if (gameData.ore.gte(100) && !achievements[8].completed) {
        unlockAchievement(8); 
    }
    if (gameData.ore >= 1000 && !achievements[9].completed) {
        unlockAchievement(9); 
    }
    if (gameData.research >= 8388608 && !achievements[10].completed) {
        unlockAchievement(10);
    }
    if (totalDroneCount.gte(250) && !achievements[11].completed) {
        unlockAchievement(1); 
    }
}

function unlockAchievement(index) {
    const achievement = achievements[index];
    if (!achievement.completed) {
        achievement.completed = true;
        displayAchievements(); 
        const message = `Unlocked achievement <span class="title">${achievement.title}</span>`;
        showPopup(message); 
    }
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    const messageContent = document.createElement('span');
    messageContent.innerHTML = message;
    popup.appendChild(messageContent);
    const popupContainer = document.getElementById('popup-container');
    popupContainer.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 5000);
}
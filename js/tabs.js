document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    const subtabsContainers = document.querySelectorAll(".subtabs");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const tabId = button.getAttribute("data-tab");

            tabContents.forEach(content => content.style.display = "none");
            document.getElementById(tabId).style.display = "block";

            subtabsContainers.forEach(subtab => subtab.style.display = "none");

            const subtabContainer = document.getElementById(`${tabId}-subtabs`);
            if (subtabContainer) subtabContainer.style.display = "flex";
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            if (tabId === "research") {
                updateAllResearchEffects();
                renderResearchItems();
            }
            if (tabId === "core-systems") {
                renderSystems();
            }
            if (tabId === "achievements") {
                displayAchievements();
            }
            setupSubtabsForTab(tabId);
        });
    });

    function setupSubtabsForTab(tabId) {
        const subtabButtons = document.querySelectorAll(`#${tabId}-subtabs .subtab-button`);
        const subtabContents = document.querySelectorAll(`#${tabId} .subtab-content`);

        if (subtabButtons.length === 0) return; 

        subtabContents.forEach(content => content.style.display = "none");

        subtabButtons.forEach(button => {
            button.addEventListener("click", () => {
                const subtabId = button.getAttribute("data-subtab");
                subtabContents.forEach(content => content.style.display = "none");
                subtabButtons.forEach(btn => btn.classList.remove("active"));
                document.getElementById(subtabId).style.display = "block";
                button.classList.add("active");

                if (subtabId === "repeatable-upgrades-content") {
                    renderRepeatableUpgrades(); 
                }
                if (subtabId === "one-time-upgrades-content") {
                    renderOneTimeUpgrades();
                }
                if (subtabId === "core-systems-content") renderCoreSystems();
                if (subtabId === "operational-systems-content") renderOperationalSystems();
                if (subtabId === "utility-systems-content") renderUtilitySystems();
                if (subtabId === "drones-content") renderDrones();
            });
        });

        subtabButtons[0].click();
    }

    tabButtons[0].click();
});
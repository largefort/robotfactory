// Game data persistence functionality
export function saveGame(gameState) {
    localStorage.setItem('robotFactory', JSON.stringify({
        scraps: gameState.scraps,
        robots: gameState.robots,
        totalScraps: gameState.totalScraps,
        totalRobots: gameState.totalRobots,
        scrapsPerClick: gameState.scrapsPerClick,
        scrapsPerSecond: gameState.scrapsPerSecond,
        robotsPerSecond: gameState.robotsPerSecond,
        
        clickLevel: gameState.clickLevel,
        clickCost: gameState.clickCost,
        collectorLevel: gameState.collectorLevel,
        collectorCost: gameState.collectorCost,
        builderLevel: gameState.builderLevel,
        builderCost: gameState.builderCost
    }));
}

export function loadGame() {
    const savedGame = localStorage.getItem('robotFactory');
    if (!savedGame) return null;
    
    try {
        return JSON.parse(savedGame);
    } catch (e) {
        console.error('Failed to load saved game:', e);
        return null;
    }
}

export function clearSavedGame() {
    localStorage.removeItem('robotFactory');
}
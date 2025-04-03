// Game loop functionality
import { animateRobotBuilding, showAutoCollectorEffect } from './animations.js';

export function initGameLoop(gameState, collectScraps, buildRobots, updateUI, saveGame) {
    setInterval(() => {
        // Auto collector produces scraps
        if (gameState.collectorLevel > 0) {
            collectScraps(gameState.scrapsPerSecond / 10);
            
            // Occasionally show auto collector text
            if (Math.random() < 0.2) { 
                showAutoCollectorEffect();
            }
        }
        
        // Robot builder produces robots
        if (gameState.builderLevel > 0) {
            const robotsProduced = gameState.robotsPerMinute / 600; 
            if (robotsProduced > 0) {
                buildRobots(robotsProduced);
                
                // Removed condition that was preventing robot production
                gameState.scraps -= 50 * robotsProduced;
                
                // Occasionally animate robot building
                if (Math.random() < 0.05) {
                    animateRobotBuilding();
                }
            }
        }
        
        updateUI();
    }, 100);
    
    // Autosave every 30 seconds
    setInterval(() => {
        saveGame(gameState);
        console.log('Game autosaved');
    }, 30000);
}
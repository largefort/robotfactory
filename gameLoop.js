// Game loop functionality
import { animateRobotBuilding, showAutoCollectorEffect } from './animations.js';

export function initGameLoop(gameState, collectScraps, buildRobots, updateUI, saveGame) {
    setInterval(() => {
        // Auto collector produces scraps
        if (gameState.collectorLevel > 0) {
            collectScraps(gameState.scrapsPerSecond);
            
            // Occasionally show auto collector text
            if (Math.random() < 0.2) { 
                showAutoCollectorEffect();
            }
        }
        
        // Robot builder produces robots
        if (gameState.builderLevel > 0 && gameState.scraps >= 5) {
            const robotsProduced = gameState.robotsPerSecond; 
            if (robotsProduced > 0) {
                // Only build robots if we have enough scraps
                buildRobots(robotsProduced);
                
                // Robot production cost
                gameState.scraps -= 5 * robotsProduced;
                
                // Occasionally animate robot building
                if (Math.random() < 0.05) {
                    animateRobotBuilding();
                }
            }
        }
        
        updateUI();
        
        // Save game periodically (every 10 loops)
        if (Math.random() < 0.1) {
            saveGame(gameState);
        }
    }, 1000); // Changed to 1 second interval (1000ms)
}
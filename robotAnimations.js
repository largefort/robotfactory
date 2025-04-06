// Robot animation scheduler and synchronization
import { animateRobotBuilding } from './animations.js';

// Initialize robot animation scheduler that syncs with the game loop
export function initRobotAnimationScheduler() {
    // Create a scheduled animation for robots that's synchronized with the game loop
    setInterval(() => {
        // Get game state from global context
        const gameState = window.gameState || {};
        
        // Only animate if we have robot builders and enough scraps
        if (gameState.builderLevel > 0 && gameState.scraps >= 5) {
            // Show robot animation with a probability based on production rate
            // Higher production rates will show more frequent animations
            if (Math.random() < gameState.robotsPerSecond) {
                animateRobotBuilding();
            }
        }
    }, 1000);
}
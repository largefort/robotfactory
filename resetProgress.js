// Reset progress functionality
export function initResetProgress(gameState, updateUI) {
    // Initialize reset progress option
    const setupResetOption = () => {
        // Create reset button in stats panel
        const statsPanel = document.querySelector('.stats-panel');
        
        // Add reset progress section
        const resetSection = document.createElement('div');
        resetSection.className = 'reset-section';
        resetSection.innerHTML = `
            <h2>Reset Progress</h2>
            <p>Warning: This will completely erase all your progress!</p>
            <button id="reset-button" class="reset-button">Reset All Progress</button>
        `;
        
        // Insert after stats panel
        statsPanel.parentNode.insertBefore(resetSection, statsPanel.nextSibling);
        
        // Add reset button styles
        const style = document.createElement('style');
        style.textContent = `
            .reset-section {
                background: linear-gradient(180deg, rgba(114, 33, 33, 0.8) 0%, rgba(95, 24, 24, 0.9) 100%);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
                margin-top: 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 127, 127, 0.2);
                border: 1px solid rgba(255, 127, 127, 0.2);
                backdrop-filter: blur(5px);
            }
            
            .reset-section h2 {
                margin-bottom: 20px;
                text-align: center;
                border-bottom: 2px solid rgba(255, 127, 127, 0.4);
                padding-bottom: 15px;
                color: #ff7f7f;
                font-size: 1.8em;
                text-shadow: 0 0 10px rgba(255, 127, 127, 0.5);
            }
            
            .reset-section p {
                margin: 15px 0;
                font-size: 1.1em;
                text-align: center;
                color: #ffcccc;
            }
            
            .reset-button {
                background: linear-gradient(90deg, #c62828, #e53935);
                color: white;
                border: none;
                padding: 12px 15px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 15px;
                font-weight: bold;
                box-shadow: 0 4px 10px rgba(255, 85, 85, 0.4);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                width: 100%;
                font-size: 1.1em;
            }
            
            .reset-button:hover {
                background: linear-gradient(90deg, #e53935, #c62828);
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(255, 85, 85, 0.5);
            }
            
            .reset-button:active {
                transform: translateY(1px);
                box-shadow: 0 2px 5px rgba(255, 85, 85, 0.4);
            }
        `;
        document.head.appendChild(style);
        
        // Create reset confirmation modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'reset-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" id="reset-modal-close">&times;</button>
                <h2>⚠️ Reset All Progress? ⚠️</h2>
                <p>Are you absolutely sure you want to reset ALL progress?</p>
                <p style="color: #ff5555; font-weight: bold;">This action cannot be undone!</p>
                <p>You will lose everything:</p>
                <ul style="text-align: left; margin: 15px 0; padding-left: 20px;">
                    <li>All scraps and robots</li>
                    <li>All upgrades and levels</li>
                    <li>All prestige points and bonuses</li>
                    <li>All statistics and achievements</li>
                </ul>
                <div class="modal-buttons">
                    <button id="confirm-reset" class="modal-button" style="background: linear-gradient(90deg, #c62828, #e53935);">Yes, Reset Everything</button>
                    <button id="cancel-reset" class="modal-button cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Attach event listeners
        document.getElementById('reset-button').addEventListener('click', () => {
            const modal = document.getElementById('reset-modal');
            modal.classList.add('show');
        });
        
        document.getElementById('confirm-reset').addEventListener('click', () => {
            resetAllProgress();
            document.getElementById('reset-modal').classList.remove('show');
            
            // Show confirmation message
            showResetConfirmation();
        });
        
        document.getElementById('cancel-reset').addEventListener('click', () => {
            document.getElementById('reset-modal').classList.remove('show');
        });
        
        document.getElementById('reset-modal-close').addEventListener('click', () => {
            document.getElementById('reset-modal').classList.remove('show');
        });
    };
    
    // Reset all progress completely
    const resetAllProgress = () => {
        // Reset game state to initial values
        gameState.scraps = 0;
        gameState.robots = 0;
        gameState.totalScraps = 0;
        gameState.totalRobots = 0;
        gameState.scrapsPerClick = 1;
        gameState.scrapsPerSecond = 0;
        gameState.robotsPerSecond = 0;
        
        gameState.clickLevel = 1;
        gameState.clickCost = 10;
        gameState.collectorLevel = 0;
        gameState.collectorCost = 50;
        gameState.builderLevel = 0;
        gameState.builderCost = 200;
        
        // Reset prestige data
        gameState.prestigePoints = 0;
        gameState.lifetimePrestigePoints = 0;
        gameState.prestigeCount = 0;
        gameState.lifetimeScraps = 0;
        gameState.lifetimeRobots = 0;
        
        // Clear localStorage
        localStorage.removeItem('robotFactory');
        localStorage.removeItem('lastOnline');
        
        // Update UI
        updateUI();
    };
    
    // Show reset confirmation message
    const showResetConfirmation = () => {
        const notification = document.createElement('div');
        notification.className = 'modal show';
        notification.innerHTML = `
            <div class="modal-content">
                <h2>Progress Reset Complete</h2>
                <p>All your progress has been erased.</p>
                <p>Your factory is now back to its initial state.</p>
                <div class="modal-buttons">
                    <button id="reset-notification-close" class="modal-button">Start Fresh</button>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        document.getElementById('reset-notification-close').addEventListener('click', () => {
            document.body.removeChild(notification);
            
            // Reload the page to ensure a clean start
            window.location.reload();
        });
    };
    
    return {
        setupResetOption
    };
}
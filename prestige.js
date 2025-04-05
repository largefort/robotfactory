// Prestige system functionality
export function initPrestige(gameState, updateUI) {
    // Calculate prestige points based on total robots
    const calculatePrestigePoints = () => {
        return Math.floor(Math.sqrt(gameState.totalRobots) / 2);
    };
    
    // Apply prestige bonuses
    const applyPrestigeBonuses = () => {
        // Each prestige point gives +10% scraps per click
        gameState.scrapsPerClick = Math.floor(Math.pow(1.5, gameState.clickLevel - 1) * (1 + gameState.prestigePoints * 0.1));
        
        // Each prestige point gives +5% scraps per second
        gameState.scrapsPerSecond = 0.5 * gameState.collectorLevel * (1 + gameState.prestigePoints * 0.05);
        
        // Each prestige point gives +5% robots per second
        gameState.robotsPerSecond = 0.05 * gameState.builderLevel * (1 + gameState.prestigePoints * 0.05);
    };
    
    // Reset game but keep prestige points
    const prestigeReset = () => {
        const newPrestigePoints = calculatePrestigePoints();
        
        if (newPrestigePoints < 1) {
            showPrestigeError();
            return false;
        }
        
        // Store the new total prestige points
        gameState.prestigePoints = (gameState.prestigePoints || 0) + newPrestigePoints;
        gameState.lifetimePrestigePoints = (gameState.lifetimePrestigePoints || 0) + newPrestigePoints;
        gameState.prestigeCount = (gameState.prestigeCount || 0) + 1;
        
        // Save important lifetime stats
        const lifetimeScraps = gameState.totalScraps;
        const lifetimeRobots = gameState.totalRobots;
        
        // Reset game state to default values
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
        
        // Store lifetime stats
        gameState.lifetimeScraps = lifetimeScraps;
        gameState.lifetimeRobots = lifetimeRobots;
        
        // Apply prestige bonuses
        applyPrestigeBonuses();
        
        // Update UI
        updateUI();
        
        // Show prestige notification
        showPrestigeNotification(newPrestigePoints);
        
        return true;
    };
    
    // Add prestige UI elements
    const createPrestigeUI = () => {
        // Create prestige button in stats panel
        const statsPanel = document.querySelector('.stats-panel');
        
        // Add prestige stats
        const prestigeStats = document.createElement('div');
        prestigeStats.className = 'prestige-stats';
        prestigeStats.innerHTML = `
            <h2>Prestige</h2>
            <p>Prestige Points: <span id="prestige-points">0</span></p>
            <p>Prestige Bonus: <span id="prestige-bonus">+0%</span></p>
            <p>Next Prestige: <span id="next-prestige">0</span> points</p>
            <button id="prestige-button" class="prestige-button">Reset & Claim Prestige Points</button>
        `;
        
        // Insert after stats panel
        statsPanel.parentNode.insertBefore(prestigeStats, statsPanel.nextSibling);
        
        // Add prestige button styles
        const style = document.createElement('style');
        style.textContent = `
            .prestige-stats {
                background: linear-gradient(180deg, rgba(60, 33, 114, 0.8) 0%, rgba(41, 24, 95, 0.9) 100%);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(173, 127, 255, 0.2);
                border: 1px solid rgba(173, 127, 255, 0.2);
                backdrop-filter: blur(5px);
            }
            
            .prestige-stats h2 {
                margin-bottom: 20px;
                text-align: center;
                border-bottom: 2px solid rgba(173, 127, 255, 0.4);
                padding-bottom: 15px;
                color: #ad7fff;
                font-size: 1.8em;
                text-shadow: 0 0 10px rgba(173, 127, 255, 0.5);
            }
            
            .prestige-stats p {
                margin: 8px 0;
                font-size: 1.1em;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid rgba(173, 127, 255, 0.1);
                padding-bottom: 8px;
            }
            
            .prestige-stats p span {
                color: #ad7fff;
                font-weight: bold;
                text-shadow: 0 0 5px rgba(173, 127, 255, 0.3);
            }
            
            .prestige-button {
                background: linear-gradient(90deg, #8855ff, #ad7fff);
                color: white;
                border: none;
                padding: 12px 15px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 15px;
                font-weight: bold;
                box-shadow: 0 4px 10px rgba(136, 85, 255, 0.4);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                width: 100%;
                font-size: 1.1em;
            }
            
            .prestige-button:hover {
                background: linear-gradient(90deg, #ad7fff, #8855ff);
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(136, 85, 255, 0.5);
            }
            
            .prestige-button:active {
                transform: translateY(1px);
                box-shadow: 0 2px 5px rgba(136, 85, 255, 0.4);
            }
            
            .prestige-button:disabled {
                background: linear-gradient(90deg, #555, #777);
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
            }
            
            .modal.show {
                opacity: 1;
                pointer-events: auto;
            }
            
            .modal-content {
                background: linear-gradient(135deg, rgba(24, 33, 60, 0.95) 0%, rgba(16, 24, 45, 0.98) 100%);
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(79, 195, 247, 0.2);
                border: 1px solid rgba(79, 195, 247, 0.15);
                text-align: center;
                position: relative;
                transform: translateY(-20px);
                transition: transform 0.3s;
            }
            
            .modal.show .modal-content {
                transform: translateY(0);
            }
            
            .modal h2 {
                color: #ad7fff;
                margin-bottom: 15px;
                font-size: 1.8em;
                text-shadow: 0 0 10px rgba(173, 127, 255, 0.5);
            }
            
            .modal p {
                margin-bottom: 15px;
                font-size: 1.1em;
                line-height: 1.6;
            }
            
            .modal-buttons {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
            }
            
            .modal-button {
                background: linear-gradient(90deg, #8855ff, #ad7fff);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: bold;
                box-shadow: 0 4px 10px rgba(136, 85, 255, 0.4);
            }
            
            .modal-button:hover {
                background: linear-gradient(90deg, #ad7fff, #8855ff);
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(136, 85, 255, 0.5);
            }
            
            .modal-button.cancel {
                background: linear-gradient(90deg, #555, #777);
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 1.5em;
                color: #ccc;
                cursor: pointer;
                transition: color 0.3s;
            }
            
            .modal-close:hover {
                color: #fff;
            }
            
            .prestige-error {
                color: #ff5555;
                font-size: 0.9em;
                margin-top: 10px;
                display: none;
            }
            
            .prestige-error.show {
                display: block;
                animation: shake 0.5s;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            .prestige-highlight {
                animation: glow 2s infinite alternate;
            }
            
            @keyframes glow {
                from { text-shadow: 0 0 5px rgba(173, 127, 255, 0.5); }
                to { text-shadow: 0 0 15px rgba(173, 127, 255, 0.8), 0 0 20px rgba(173, 127, 255, 0.5); }
            }
        `;
        document.head.appendChild(style);
        
        // Add prestige error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'prestige-error';
        errorMessage.id = 'prestige-error';
        errorMessage.textContent = 'You need at least 1 prestige point to reset!';
        document.getElementById('prestige-button').after(errorMessage);
        
        // Create modal for prestige confirmation
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'prestige-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" id="modal-close">&times;</button>
                <h2>Reset Your Factory?</h2>
                <p>You will lose all your progress but gain <span id="modal-prestige-points" class="prestige-highlight">0</span> prestige points!</p>
                <p>Prestige points give permanent bonuses to production.</p>
                <div class="modal-buttons">
                    <button id="confirm-prestige" class="modal-button">Reset & Claim Points</button>
                    <button id="cancel-prestige" class="modal-button cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Attach event listeners
        document.getElementById('prestige-button').addEventListener('click', () => {
            const points = calculatePrestigePoints();
            document.getElementById('modal-prestige-points').textContent = points;
            
            if (points < 1) {
                showPrestigeError();
                return;
            }
            
            const modal = document.getElementById('prestige-modal');
            modal.classList.add('show');
        });
        
        document.getElementById('confirm-prestige').addEventListener('click', () => {
            prestigeReset();
            document.getElementById('prestige-modal').classList.remove('show');
        });
        
        document.getElementById('cancel-prestige').addEventListener('click', () => {
            document.getElementById('prestige-modal').classList.remove('show');
        });
        
        document.getElementById('modal-close').addEventListener('click', () => {
            document.getElementById('prestige-modal').classList.remove('show');
        });
    };
    
    // Show prestige error message
    const showPrestigeError = () => {
        const errorElement = document.getElementById('prestige-error');
        errorElement.classList.add('show');
        
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 3000);
    };
    
    // Show prestige notification
    const showPrestigeNotification = (points) => {
        const notification = document.createElement('div');
        notification.className = 'modal show';
        notification.innerHTML = `
            <div class="modal-content">
                <h2>Factory Reset Complete!</h2>
                <p>You have gained <span class="prestige-highlight">${points}</span> prestige points!</p>
                <p>Your production rates now have permanent bonuses.</p>
                <div class="modal-buttons">
                    <button id="notification-close" class="modal-button">Continue</button>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        document.getElementById('notification-close').addEventListener('click', () => {
            document.body.removeChild(notification);
        });
    };
    
    // Update prestige UI
    const updatePrestigeUI = () => {
        const prestigePoints = gameState.prestigePoints || 0;
        const nextPrestige = calculatePrestigePoints();
        const prestigeBonus = Math.floor(prestigePoints * 10);
        
        document.getElementById('prestige-points').textContent = prestigePoints;
        document.getElementById('prestige-bonus').textContent = `+${prestigeBonus}%`;
        document.getElementById('next-prestige').textContent = nextPrestige;
        
        // Disable prestige button if not enough points
        document.getElementById('prestige-button').disabled = nextPrestige < 1;
    };
    
    // Initialize prestige system
    const init = () => {
        // Initialize prestige properties in game state if they don't exist
        if (gameState.prestigePoints === undefined) {
            gameState.prestigePoints = 0;
            gameState.lifetimePrestigePoints = 0;
            gameState.prestigeCount = 0;
        }
        
        createPrestigeUI();
        applyPrestigeBonuses();
        updatePrestigeUI();
        
        // Add periodic update of prestige UI
        setInterval(updatePrestigeUI, 1000);
    };
    
    return {
        init,
        applyPrestigeBonuses
    };
}
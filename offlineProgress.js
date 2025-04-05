// Offline progress tracking and notification
export function initOfflineProgress(gameState, collectScraps, buildRobots) {
    // Store last online timestamp
    const saveTimestamp = () => {
        localStorage.setItem('lastOnline', Date.now().toString());
    };
    
    // Calculate progress while offline
    const calculateOfflineProgress = () => {
        const lastOnlineStr = localStorage.getItem('lastOnline');
        if (!lastOnlineStr) return null;
        
        const lastOnline = parseInt(lastOnlineStr, 10);
        const currentTime = Date.now();
        const timeDiffSeconds = Math.floor((currentTime - lastOnline) / 1000);
        
        // If less than 30 seconds passed, don't show offline progress
        if (timeDiffSeconds < 30) return null;
        
        // Calculate scraps collected while offline (cap at 8 hours max)
        const cappedTimeDiffSeconds = Math.min(timeDiffSeconds, 8 * 60 * 60);
        const scrapsCollected = gameState.scrapsPerSecond * cappedTimeDiffSeconds;
        
        // Calculate robots built while offline
        let robotsBuilt = 0;
        let remainingScraps = scrapsCollected;
        
        if (gameState.builderLevel > 0 && gameState.robotsPerSecond > 0) {
            // How many seconds worth of robot production we can afford
            const maxRobotSeconds = Math.min(
                cappedTimeDiffSeconds,
                remainingScraps / (5 * gameState.robotsPerSecond)
            );
            
            robotsBuilt = gameState.robotsPerSecond * maxRobotSeconds;
            remainingScraps -= 5 * robotsBuilt;
        }
        
        return {
            timeDiffSeconds,
            cappedTimeDiffSeconds,
            scrapsCollected,
            robotsBuilt,
            remainingScraps
        };
    };
    
    // Apply offline progress and show notification
    const processOfflineProgress = () => {
        const progress = calculateOfflineProgress();
        if (!progress) return;
        
        // Format time offline
        const formatTime = (seconds) => {
            if (seconds < 60) return `${seconds} seconds`;
            if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours} hours, ${minutes} minutes`;
        };
        
        // Create the modal
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Welcome Back!</h2>
                <p>You were away for ${formatTime(progress.timeDiffSeconds)}.</p>
                <p>While offline, your factory produced:</p>
                <ul style="text-align: left; margin: 15px 0; padding-left: 20px;">
                    <li><span style="color: #4fc3f7; font-weight: bold;">${Math.floor(progress.scrapsCollected)}</span> scraps collected</li>
                    <li><span style="color: #4fc3f7; font-weight: bold;">${Math.floor(progress.robotsBuilt)}</span> robots built</li>
                </ul>
                <div class="modal-buttons">
                    <button id="claim-offline" class="modal-button">Claim Resources</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Apply progress when claimed
        document.getElementById('claim-offline').addEventListener('click', () => {
            // Add scraps and robots
            collectScraps(progress.remainingScraps);
            buildRobots(progress.robotsBuilt);
            
            // Remove modal
            document.body.removeChild(modal);
        });
    };
    
    // Set up event listeners for when user leaves/returns
    const setupEvents = () => {
        // Save timestamp when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                saveTimestamp();
            } else if (document.visibilityState === 'visible') {
                processOfflineProgress();
                saveTimestamp();
            }
        });
        
        // Save timestamp on page unload
        window.addEventListener('beforeunload', saveTimestamp);
        
        // Process offline progress on startup
        processOfflineProgress();
        saveTimestamp();
    };
    
    return {
        setupEvents
    };
}
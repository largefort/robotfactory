// Game progress import/export functionality
export function initImportExport(gameState, updateUI, prestigeSystem) {
    // Format the game state into a readable string
    const formatGameStateForExport = () => {
        const date = new Date().toLocaleString();
        let output = `Robot Factory Save - ${date}\n`;
        output += `==================================\n\n`;
        
        // Resources
        output += `Resources:\n`;
        output += `- Scraps: ${Math.floor(gameState.scraps)}\n`;
        output += `- Robots: ${Math.floor(gameState.robots)}\n`;
        output += `- Total scraps collected: ${Math.floor(gameState.totalScraps)}\n`;
        output += `- Total robots built: ${Math.floor(gameState.totalRobots)}\n\n`;
        
        // Production rates
        output += `Production:\n`;
        output += `- Scraps per click: ${gameState.scrapsPerClick}\n`;
        output += `- Scraps per second: ${gameState.scrapsPerSecond.toFixed(1)}\n`;
        output += `- Robots per second: ${gameState.robotsPerSecond.toFixed(2)}\n\n`;
        
        // Upgrades
        output += `Upgrades:\n`;
        output += `- Click Level: ${gameState.clickLevel} (Cost: ${gameState.clickCost})\n`;
        output += `- Collector Level: ${gameState.collectorLevel} (Cost: ${gameState.collectorCost})\n`;
        output += `- Builder Level: ${gameState.builderLevel} (Cost: ${gameState.builderCost})\n\n`;
        
        // Prestige
        output += `Prestige:\n`;
        output += `- Prestige Points: ${gameState.prestigePoints || 0}\n`;
        output += `- Lifetime Prestige Points: ${gameState.lifetimePrestigePoints || 0}\n`;
        output += `- Prestige Count: ${gameState.prestigeCount || 0}\n`;
        output += `- Lifetime Scraps: ${gameState.lifetimeScraps || gameState.totalScraps}\n`;
        output += `- Lifetime Robots: ${gameState.lifetimeRobots || gameState.totalRobots}\n\n`;
        
        // Technical data for import
        output += `--- TECHNICAL DATA (DO NOT MODIFY) ---\n`;
        output += btoa(JSON.stringify(gameState)) + '\n';
        output += `--------------------------------------\n`;
        
        return output;
    };
    
    // Export game state to a text file
    const exportProgress = () => {
        const output = formatGameStateForExport();
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const date = new Date().toISOString().slice(0, 10);
        const filename = `robot-factory-save-${date}.txt`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        // Show notification
        showNotification('Game progress exported successfully!');
    };
    
    // Import game state from file
    const importProgress = (fileContent) => {
        try {
            // Extract the base64 encoded part
            const encodedDataMatch = fileContent.match(/--- TECHNICAL DATA \(DO NOT MODIFY\) ---\n([A-Za-z0-9+/=]+)\n/);
            
            if (!encodedDataMatch || !encodedDataMatch[1]) {
                throw new Error("Save file format is invalid");
            }
            
            const encodedData = encodedDataMatch[1];
            const jsonData = atob(encodedData);
            const importedState = JSON.parse(jsonData);
            
            // Validate the imported state has required properties
            const requiredProperties = ['scraps', 'robots', 'totalScraps', 'totalRobots', 'clickLevel'];
            for (const prop of requiredProperties) {
                if (typeof importedState[prop] === 'undefined') {
                    throw new Error(`Save file is missing required property: ${prop}`);
                }
            }
            
            // Apply the imported state
            Object.assign(gameState, importedState);
            
            // Update UI
            updateUI();
            
            // Apply prestige bonuses if available
            if (prestigeSystem && prestigeSystem.applyPrestigeBonuses) {
                prestigeSystem.applyPrestigeBonuses();
            }
            
            // Show success notification
            showNotification('Game progress imported successfully!');
            
        } catch (error) {
            // Show error notification
            showNotification(`Import failed: ${error.message}`, true);
            console.error('Import error:', error);
        }
    };
    
    // Show notification
    const showNotification = (message, isError = false) => {
        const notification = document.createElement('div');
        notification.className = `import-export-notification ${isError ? 'error' : 'success'}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    };
    
    // Add UI elements
    const createUI = () => {
        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .import-export-panel {
                background: linear-gradient(180deg, rgba(29, 53, 87, 0.8) 0%, rgba(20, 39, 78, 0.9) 100%);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(72, 202, 228, 0.15);
                border: 1px solid rgba(72, 202, 228, 0.2);
                backdrop-filter: blur(5px);
            }
            
            .import-export-panel h2 {
                margin-bottom: 20px;
                text-align: center;
                border-bottom: 2px solid rgba(72, 202, 228, 0.4);
                padding-bottom: 15px;
                color: #48cae4;
                font-size: 1.8em;
                text-shadow: 0 0 10px rgba(72, 202, 228, 0.5);
            }
            
            .import-export-panel p {
                margin: 12px 0;
                font-size: 1.05em;
            }
            
            .import-export-buttons {
                display: flex;
                gap: 15px;
                margin-top: 20px;
            }
            
            .import-export-button {
                flex: 1;
                background: linear-gradient(90deg, #0077b6, #0096c7);
                color: white;
                border: none;
                padding: 12px 15px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: bold;
                box-shadow: 0 4px 10px rgba(0, 119, 182, 0.4);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                position: relative;
                overflow: hidden;
            }
            
            .import-export-button:before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.7s;
            }
            
            .import-export-button:hover {
                background: linear-gradient(90deg, #0096c7, #0077b6);
                transform: translateY(-3px);
                box-shadow: 0 6px 15px rgba(0, 119, 182, 0.5);
            }
            
            .import-export-button:hover:before {
                left: 100%;
            }
            
            .import-export-button:active {
                transform: translateY(1px);
                box-shadow: 0 2px 5px rgba(0, 119, 182, 0.4);
            }
            
            .import-export-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                padding: 15px 25px;
                border-radius: 10px;
                color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 1000;
                text-align: center;
                font-weight: bold;
            }
            
            .import-export-notification.success {
                background: linear-gradient(90deg, #2ecc71, #27ae60);
                border: 1px solid rgba(46, 204, 113, 0.3);
            }
            
            .import-export-notification.error {
                background: linear-gradient(90deg, #e74c3c, #c0392b);
                border: 1px solid rgba(231, 76, 60, 0.3);
            }
            
            .import-export-notification.show {
                transform: translateX(-50%) translateY(0);
            }
            
            #file-import {
                display: none;
            }
            
            .import-icon, .export-icon {
                width: 18px;
                height: 18px;
                display: inline-block;
                margin-right: 5px;
            }
            
            .import-icon {
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'/%3E%3C/svg%3E") no-repeat center center;
                background-size: contain;
            }
            
            .export-icon {
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z'/%3E%3C/svg%3E") no-repeat center center;
                background-size: contain;
            }
        `;
        document.head.appendChild(style);
        
        // Create the import/export panel
        const panel = document.createElement('div');
        panel.className = 'import-export-panel';
        panel.innerHTML = `
            <h2>Save & Load Game</h2>
            <p>Export your game progress to a file that you can save as a backup or share with others.</p>
            <p>Import a previously exported game save file to restore your progress.</p>
            <div class="import-export-buttons">
                <button id="export-button" class="import-export-button">
                    <span class="export-icon"></span>Export Progress
                </button>
                <button id="import-button" class="import-export-button">
                    <span class="import-icon"></span>Import Progress
                </button>
            </div>
            <input type="file" id="file-import" accept=".txt">
        `;
        
        // Add the panel to the page
        const statsPanel = document.querySelector('.stats-panel');
        const resetSection = document.querySelector('.reset-section');
        
        if (resetSection) {
            resetSection.parentNode.insertBefore(panel, resetSection.nextSibling);
        } else {
            statsPanel.parentNode.insertBefore(panel, statsPanel.nextSibling);
        }
        
        // Add event listeners
        document.getElementById('export-button').addEventListener('click', exportProgress);
        
        document.getElementById('import-button').addEventListener('click', () => {
            document.getElementById('file-import').click();
        });
        
        document.getElementById('file-import').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                importProgress(content);
                // Reset the input
                event.target.value = '';
            };
            reader.readAsText(file);
        });
    };
    
    // Initialize
    createUI();
}
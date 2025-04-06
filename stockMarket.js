// Stock market system for the game
import gsap from 'gsap';
import { saveGame } from './storage.js';

export function initStockMarket(gameState, updateUI) {
    // Initialize stocks if they don't exist
    if (!gameState.stocks) {
        gameState.stocks = {
            owned: {},
            cash: 0,
            lastUpdated: Date.now(),
            stockList: [
                {
                    id: 'RBTS',
                    name: 'RoboTech Solutions',
                    price: 10,
                    volatility: 0.15,
                    trend: 0.02,
                    description: 'Leading manufacturer of robot components'
                },
                {
                    id: 'SCRP',
                    name: 'Scrap Innovations',
                    price: 5,
                    volatility: 0.2,
                    trend: 0.01,
                    description: 'Recycling and scrap processing technology'
                },
                {
                    id: 'AITC',
                    name: 'Advanced Intelligence Corp',
                    price: 25,
                    volatility: 0.3,
                    trend: 0.03,
                    description: 'Cutting-edge AI research for robotics'
                },
                {
                    id: 'MNRL',
                    name: 'Mineral Extraction Ltd',
                    price: 8,
                    volatility: 0.18,
                    trend: -0.01,
                    description: 'Mining operations for robot materials'
                },
                {
                    id: 'PWRS',
                    name: 'Power Systems Inc',
                    price: 15,
                    volatility: 0.12,
                    trend: 0.015,
                    description: 'Energy solutions for automated factories'
                }
            ],
            history: {}
        };
        
        // Initialize history for each stock
        gameState.stocks.stockList.forEach(stock => {
            gameState.stocks.history[stock.id] = [{
                timestamp: Date.now(),
                price: stock.price
            }];
        });
    }
    
    // Update stock prices based on time passed
    const updateStockPrices = () => {
        const now = Date.now();
        const hoursPassed = (now - gameState.stocks.lastUpdated) / (1000 * 60 * 60);
        
        // Only update if some time has passed
        if (hoursPassed > 0) {
            gameState.stocks.stockList.forEach(stock => {
                // Apply random walk with drift for price movement
                const randomFactor = (Math.random() * 2 - 1) * stock.volatility;
                const trendFactor = stock.trend * hoursPassed;
                const priceChange = stock.price * (randomFactor + trendFactor);
                
                // Update price (ensure it doesn't go below 1)
                stock.price = Math.max(1, stock.price + priceChange);
                
                // Record in history if significant time has passed (1 hour or more)
                if (hoursPassed >= 1) {
                    gameState.stocks.history[stock.id].push({
                        timestamp: now,
                        price: stock.price
                    });
                    
                    // Limit history length to prevent excessive memory usage
                    if (gameState.stocks.history[stock.id].length > 168) { // Keep ~1 week of hourly data
                        gameState.stocks.history[stock.id].shift();
                    }
                }
            });
            
            // Update last updated timestamp
            gameState.stocks.lastUpdated = now;
            
            // Save game after stock update
            saveGame(gameState);
        }
    };
    
    // Get current player portfolio value
    const getPortfolioValue = () => {
        let value = gameState.stocks.cash;
        
        Object.keys(gameState.stocks.owned).forEach(stockId => {
            const stock = gameState.stocks.stockList.find(s => s.id === stockId);
            if (stock) {
                value += stock.price * gameState.stocks.owned[stockId];
            }
        });
        
        return value;
    };
    
    // Buy stocks
    const buyStock = (stockId, quantity) => {
        const stock = gameState.stocks.stockList.find(s => s.id === stockId);
        if (!stock) return false;
        
        const cost = stock.price * quantity;
        
        // Check if player has enough scraps
        if (gameState.scraps < cost) return false;
        
        // Deduct scraps
        gameState.scraps -= cost;
        
        // Add to owned stocks
        if (!gameState.stocks.owned[stockId]) {
            gameState.stocks.owned[stockId] = 0;
        }
        gameState.stocks.owned[stockId] += quantity;
        
        // Add to cash invested
        gameState.stocks.cash += cost;
        
        // Save game
        saveGame(gameState);
        
        return true;
    };
    
    // Sell stocks
    const sellStock = (stockId, quantity) => {
        const stock = gameState.stocks.stockList.find(s => s.id === stockId);
        if (!stock) return false;
        
        // Check if player owns enough shares
        if (!gameState.stocks.owned[stockId] || gameState.stocks.owned[stockId] < quantity) {
            return false;
        }
        
        // Calculate return value
        const value = stock.price * quantity;
        
        // Add scraps
        gameState.scraps += value;
        
        // Remove from owned stocks
        gameState.stocks.owned[stockId] -= quantity;
        
        // Remove from cash invested (proportionally)
        const stockPortion = quantity / (gameState.stocks.owned[stockId] + quantity);
        const investedCash = gameState.stocks.cash * stockPortion;
        gameState.stocks.cash -= investedCash;
        
        // Save game
        saveGame(gameState);
        
        return true;
    };
    
    // Create stock market UI
    const createStockMarketUI = () => {
        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .stock-market-panel {
                background: linear-gradient(180deg, rgba(29, 53, 87, 0.8) 0%, rgba(20, 39, 78, 0.9) 100%);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(72, 202, 228, 0.15);
                border: 1px solid rgba(72, 202, 228, 0.2);
                backdrop-filter: blur(5px);
            }
            
            .stock-market-panel h2 {
                margin-bottom: 20px;
                text-align: center;
                border-bottom: 2px solid rgba(72, 202, 228, 0.4);
                padding-bottom: 15px;
                color: #48cae4;
                font-size: 1.8em;
                text-shadow: 0 0 10px rgba(72, 202, 228, 0.5);
            }
            
            .portfolio-summary {
                background: rgba(15, 52, 96, 0.6);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .portfolio-summary .value {
                font-size: 1.4em;
                font-weight: bold;
                color: #4fc3f7;
                text-shadow: 0 0 10px rgba(79, 195, 247, 0.5);
            }
            
            .stock-list {
                display: grid;
                gap: 15px;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            }
            
            .stock-card {
                background: linear-gradient(135deg, rgba(23, 107, 135, 0.7) 0%, rgba(26, 117, 159, 0.5) 100%);
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s, box-shadow 0.3s;
                border: 1px solid rgba(72, 202, 228, 0.15);
                position: relative;
                overflow: hidden;
            }
            
            .stock-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            }
            
            .stock-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                align-items: center;
            }
            
            .stock-id {
                background: rgba(15, 52, 96, 0.8);
                padding: 5px 10px;
                border-radius: 5px;
                font-weight: bold;
                font-size: 0.9em;
                color: #4fc3f7;
            }
            
            .stock-name {
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 1.2em;
            }
            
            .stock-price {
                font-size: 1.3em;
                font-weight: bold;
                margin: 10px 0;
                color: #4fc3f7;
                text-shadow: 0 0 5px rgba(79, 195, 247, 0.3);
            }
            
            .price-change {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 5px;
                font-size: 0.9em;
                margin-left: 10px;
            }
            
            .price-change.positive {
                background: rgba(76, 175, 80, 0.2);
                color: #81c784;
            }
            
            .price-change.negative {
                background: rgba(244, 67, 54, 0.2);
                color: #e57373;
            }
            
            .stock-description {
                margin: 10px 0;
                font-size: 0.9em;
                color: #ccc;
                height: 40px;
            }
            
            .stock-actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            
            .stock-button {
                flex: 1;
                background: linear-gradient(90deg, #0077b6, #0096c7);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s;
                font-weight: bold;
                font-size: 0.9em;
            }
            
            .stock-button:hover {
                background: linear-gradient(90deg, #0096c7, #00b4d8);
                transform: translateY(-2px);
            }
            
            .stock-button.sell {
                background: linear-gradient(90deg, #d00000, #e85d04);
            }
            
            .stock-button.sell:hover {
                background: linear-gradient(90deg, #e85d04, #f48c06);
            }
            
            .stock-input {
                width: 100%;
                padding: 8px 12px;
                border-radius: 5px;
                border: 1px solid rgba(72, 202, 228, 0.3);
                background: rgba(15, 52, 96, 0.6);
                color: white;
                margin-top: 10px;
                font-size: 0.9em;
            }
            
            .stock-input:focus {
                border-color: #4fc3f7;
                outline: none;
                box-shadow: 0 0 10px rgba(79, 195, 247, 0.3);
            }
            
            .owned-shares {
                background: rgba(15, 52, 96, 0.6);
                padding: 5px 10px;
                border-radius: 5px;
                margin-top: 10px;
                font-size: 0.9em;
                display: inline-block;
            }
            
            .stock-chart {
                width: 100%;
                height: 60px;
                margin-top: 15px;
                position: relative;
                background: rgba(15, 52, 96, 0.3);
                border-radius: 5px;
                overflow: hidden;
            }
            
            .stock-chart canvas {
                width: 100%;
                height: 100%;
            }
            
            @keyframes stockGlow {
                0% { box-shadow: 0 0 5px rgba(79, 195, 247, 0.3); }
                50% { box-shadow: 0 0 15px rgba(79, 195, 247, 0.5); }
                100% { box-shadow: 0 0 5px rgba(79, 195, 247, 0.3); }
            }
            
            .stock-update-animation {
                animation: stockGlow 1.5s;
            }
            
            .stock-market-tabs {
                display: flex;
                margin-bottom: 20px;
                border-bottom: 1px solid rgba(72, 202, 228, 0.3);
            }
            
            .stock-market-tab {
                padding: 10px 20px;
                cursor: pointer;
                background: transparent;
                border: none;
                color: #ccc;
                font-size: 1.1em;
                border-bottom: 2px solid transparent;
                transition: all 0.3s;
            }
            
            .stock-market-tab.active {
                color: #4fc3f7;
                border-bottom: 2px solid #4fc3f7;
            }
            
            .stock-market-tab:hover {
                color: #4fc3f7;
            }
            
            .stock-market-content {
                display: none;
            }
            
            .stock-market-content.active {
                display: block;
            }
            
            .portfolio-item {
                display: flex;
                justify-content: space-between;
                padding: 15px;
                background: rgba(15, 52, 96, 0.6);
                border-radius: 10px;
                margin-bottom: 10px;
                align-items: center;
                transition: transform 0.3s;
            }
            
            .portfolio-item:hover {
                transform: translateX(5px);
            }
            
            .portfolio-item-details {
                flex: 1;
            }
            
            .portfolio-item-actions {
                display: flex;
                gap: 10px;
            }
            
            .portfolio-stocks {
                margin-top: 20px;
            }
            
            .no-stocks-message {
                text-align: center;
                padding: 20px;
                color: #ccc;
                font-style: italic;
            }
        `;
        document.head.appendChild(style);
        
        // Create the stock market panel
        const panel = document.createElement('div');
        panel.className = 'stock-market-panel';
        panel.innerHTML = `
            <h2>Stock Market</h2>
            
            <div class="portfolio-summary">
                <div>
                    <div>Portfolio Value:</div>
                    <div class="value" id="portfolio-value">0 scraps</div>
                </div>
                <div>
                    <div>Cash Available:</div>
                    <div class="value" id="available-cash">${Math.floor(gameState.scraps)} scraps</div>
                </div>
            </div>
            
            <div class="stock-market-tabs">
                <button class="stock-market-tab active" data-tab="market">Market</button>
                <button class="stock-market-tab" data-tab="portfolio">Portfolio</button>
            </div>
            
            <div class="stock-market-content active" id="market-tab">
                <div class="stock-list" id="stock-list">
                    <!-- Stock cards will be inserted here -->
                </div>
            </div>
            
            <div class="stock-market-content" id="portfolio-tab">
                <div class="portfolio-stocks" id="portfolio-stocks">
                    <!-- Portfolio items will be inserted here -->
                </div>
            </div>
        `;
        
        // Add the panel to the page
        const importExportPanel = document.querySelector('.import-export-panel');
        if (importExportPanel) {
            importExportPanel.parentNode.insertBefore(panel, importExportPanel);
        } else {
            const statsPanel = document.querySelector('.stats-panel');
            if (statsPanel) {
                statsPanel.parentNode.insertBefore(panel, statsPanel.nextSibling);
            }
        }
        
        // Add tab switching functionality
        const tabs = document.querySelectorAll('.stock-market-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show active content
                document.querySelectorAll('.stock-market-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabName}-tab`).classList.add('active');
                
                // Refresh content
                if (tabName === 'market') {
                    updateStockList();
                } else if (tabName === 'portfolio') {
                    updatePortfolio();
                }
            });
        });
    };
    
    // Update stock list in UI
    const updateStockList = () => {
        const stockListElement = document.getElementById('stock-list');
        if (!stockListElement) return;
        
        stockListElement.innerHTML = '';
        
        gameState.stocks.stockList.forEach(stock => {
            // Get price change
            let priceChange = 0;
            let priceChangePercent = 0;
            const history = gameState.stocks.history[stock.id];
            
            if (history && history.length > 1) {
                const previousPrice = history[history.length - 2].price;
                priceChange = stock.price - previousPrice;
                priceChangePercent = (priceChange / previousPrice) * 100;
            }
            
            // Create stock card
            const stockCard = document.createElement('div');
            stockCard.className = 'stock-card';
            stockCard.innerHTML = `
                <div class="stock-header">
                    <span class="stock-id">${stock.id}</span>
                    <span class="price-change ${priceChange >= 0 ? 'positive' : 'negative'}">
                        ${priceChange >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%
                    </span>
                </div>
                <div class="stock-name">${stock.name}</div>
                <div class="stock-price">${stock.price.toFixed(2)} scraps</div>
                <div class="stock-description">${stock.description}</div>
                <div class="stock-chart" id="chart-${stock.id}">
                    <!-- Chart will be drawn here -->
                </div>
                <div class="owned-shares" style="display: ${gameState.stocks.owned[stock.id] ? 'block' : 'none'}">
                    Owned: <span id="owned-${stock.id}">${gameState.stocks.owned[stock.id] || 0}</span> shares
                </div>
                <input type="number" class="stock-input" id="quantity-${stock.id}" placeholder="Quantity" min="1" value="1">
                <div class="stock-actions">
                    <button class="stock-button buy" data-stock="${stock.id}">Buy</button>
                    <button class="stock-button sell" data-stock="${stock.id}" ${!gameState.stocks.owned[stock.id] ? 'disabled' : ''}>Sell</button>
                </div>
            `;
            
            stockListElement.appendChild(stockCard);
            
            // Draw simple chart
            drawStockChart(stock.id);
        });
        
        // Add event listeners to buy/sell buttons
        document.querySelectorAll('.stock-button.buy').forEach(button => {
            button.addEventListener('click', () => {
                const stockId = button.getAttribute('data-stock');
                const quantityInput = document.getElementById(`quantity-${stockId}`);
                const quantity = parseInt(quantityInput.value, 10);
                
                if (quantity > 0) {
                    if (buyStock(stockId, quantity)) {
                        updateUI();
                        updateStockList();
                        updatePortfolioValue();
                        
                        // Show success notification
                        showStockNotification(`Successfully bought ${quantity} shares of ${stockId}`, false);
                    } else {
                        // Show error notification
                        showStockNotification('Not enough scraps to complete purchase', true);
                    }
                }
            });
        });
        
        document.querySelectorAll('.stock-button.sell').forEach(button => {
            button.addEventListener('click', () => {
                const stockId = button.getAttribute('data-stock');
                const quantityInput = document.getElementById(`quantity-${stockId}`);
                const quantity = parseInt(quantityInput.value, 10);
                
                if (quantity > 0) {
                    if (sellStock(stockId, quantity)) {
                        updateUI();
                        updateStockList();
                        updatePortfolioValue();
                        
                        // Show success notification
                        showStockNotification(`Successfully sold ${quantity} shares of ${stockId}`, false);
                    } else {
                        // Show error notification
                        showStockNotification('Not enough shares to complete sale', true);
                    }
                }
            });
        });
    };
    
    // Draw a simple line chart for stock
    const drawStockChart = (stockId) => {
        const chartElement = document.getElementById(`chart-${stockId}`);
        if (!chartElement) return;
        
        const history = gameState.stocks.history[stockId];
        if (!history || history.length < 2) return;
        
        // Create canvas element
        const canvas = document.createElement('canvas');
        chartElement.innerHTML = '';
        chartElement.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const width = chartElement.clientWidth;
        const height = chartElement.clientHeight;
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Find min/max price for scaling
        const prices = history.map(h => h.price);
        const minPrice = Math.min(...prices) * 0.9;
        const maxPrice = Math.max(...prices) * 1.1;
        
        // Draw chart
        ctx.strokeStyle = '#4fc3f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Start at the first point
        let x = 0;
        let y = height - ((history[0].price - minPrice) / (maxPrice - minPrice)) * height;
        ctx.moveTo(x, y);
        
        // Draw line to each point
        for (let i = 1; i < history.length; i++) {
            x = (i / (history.length - 1)) * width;
            y = height - ((history[i].price - minPrice) / (maxPrice - minPrice)) * height;
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        
        // Add gradient under the line
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(79, 195, 247, 0.3)');
        gradient.addColorStop(1, 'rgba(79, 195, 247, 0)');
        
        ctx.fillStyle = gradient;
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
    };
    
    // Update portfolio tab
    const updatePortfolio = () => {
        const portfolioElement = document.getElementById('portfolio-stocks');
        if (!portfolioElement) return;
        
        // Check if user owns any stocks
        const hasStocks = Object.keys(gameState.stocks.owned).some(stockId => gameState.stocks.owned[stockId] > 0);
        
        if (!hasStocks) {
            portfolioElement.innerHTML = `
                <div class="no-stocks-message">
                    You don't own any stocks yet. Buy some in the Market tab!
                </div>
            `;
            return;
        }
        
        portfolioElement.innerHTML = '';
        
        // Display owned stocks
        Object.keys(gameState.stocks.owned).forEach(stockId => {
            const shares = gameState.stocks.owned[stockId];
            if (shares <= 0) return;
            
            const stock = gameState.stocks.stockList.find(s => s.id === stockId);
            if (!stock) return;
            
            const totalValue = stock.price * shares;
            
            // Create portfolio item
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.innerHTML = `
                <div class="portfolio-item-details">
                    <div class="stock-name">${stock.name} (${stock.id})</div>
                    <div>Shares: ${shares}</div>
                    <div>Value: ${totalValue.toFixed(2)} scraps (${stock.price.toFixed(2)} per share)</div>
                </div>
                <div class="portfolio-item-actions">
                    <input type="number" class="stock-input" id="portfolio-quantity-${stockId}" placeholder="Quantity" min="1" max="${shares}" value="1" style="width: 80px;">
                    <button class="stock-button sell" data-stock="${stockId}">Sell</button>
                </div>
            `;
            
            portfolioElement.appendChild(portfolioItem);
        });
        
        // Add event listeners to sell buttons
        document.querySelectorAll('#portfolio-tab .stock-button.sell').forEach(button => {
            button.addEventListener('click', () => {
                const stockId = button.getAttribute('data-stock');
                const quantityInput = document.getElementById(`portfolio-quantity-${stockId}`);
                const quantity = parseInt(quantityInput.value, 10);
                
                if (quantity > 0) {
                    if (sellStock(stockId, quantity)) {
                        updateUI();
                        updatePortfolio();
                        updatePortfolioValue();
                        
                        // Show success notification
                        showStockNotification(`Successfully sold ${quantity} shares of ${stockId}`, false);
                    } else {
                        // Show error notification
                        showStockNotification('Failed to sell shares', true);
                    }
                }
            });
        });
    };
    
    // Update portfolio value
    const updatePortfolioValue = () => {
        const portfolioValueElement = document.getElementById('portfolio-value');
        const availableCashElement = document.getElementById('available-cash');
        
        if (portfolioValueElement) {
            portfolioValueElement.textContent = `${Math.floor(getPortfolioValue())} scraps`;
        }
        
        if (availableCashElement) {
            availableCashElement.textContent = `${Math.floor(gameState.scraps)} scraps`;
        }
    };
    
    // Show notification
    const showStockNotification = (message, isError = false) => {
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
    
    // Initialize stock market
    const init = () => {
        createStockMarketUI();
        updateStockList();
        updatePortfolioValue();
        
        // Update stocks every minute
        setInterval(() => {
            updateStockPrices();
            updateStockList();
            updatePortfolioValue();
            
            // Add glow animation to stock cards
            document.querySelectorAll('.stock-card').forEach(card => {
                card.classList.add('stock-update-animation');
                setTimeout(() => {
                    card.classList.remove('stock-update-animation');
                }, 1500);
            });
        }, 60000); // Check every minute
    };
    
    return {
        init,
        updateStockPrices,
        getPortfolioValue,
        buyStock,
        sellStock
    };
}
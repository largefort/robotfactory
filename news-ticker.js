// News ticker functionality
export function initNewsTicker(gameState) {
    // Get DOM element
    const newsTextElement = document.getElementById('news-text');
    
    // News ticker rotation
    function startNewsTickerRotation() {
        let currentMessageIndex = 0;
        
        setInterval(() => {
            currentMessageIndex = (currentMessageIndex + 1) % gameState.newsMessages.length;
            newsTextElement.textContent = gameState.newsMessages[currentMessageIndex];
        }, 10000);
    }
    
    // Initialize
    startNewsTickerRotation();
}
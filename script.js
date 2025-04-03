import gsap from 'gsap';
import { saveGame, loadGame } from './storage.js';
import { initGameLoop } from './gameLoop.js';
import { animateScrapClick, showUpgradeEffect, animateRobotBuilding, initParticleSystem } from './animations.js';
import { initShaders } from './shaders.js';

// Game state
const gameState = {
    scraps: 0,
    robots: 0,
    totalScraps: 0,
    totalRobots: 0,
    scrapsPerClick: 1,
    scrapsPerSecond: 0,
    robotsPerSecond: 0,
    
    // Upgrades
    clickLevel: 1,
    clickCost: 10,
    collectorLevel: 0,
    collectorCost: 50,
    builderLevel: 0,
    builderCost: 200,
    
    // News messages
    newsMessages: [
        "Welcome to your Robot Factory! Click the scrap pile to begin collecting materials...",
        "Upgrade your scrapper to collect more materials per click!",
        "Auto collectors can gather scraps while you're away.",
        "Robot builders transform your scraps into functional robots.",
        "More robots means more profit for your factory!",
        "Rumors say some robots are developing consciousness...",
        "Local scrap yard reports mysterious overnight thefts.",
        "Scientists worried about the increasing number of homemade robots.",
        "Factory owner discovers new way to optimize robot production!",
        "Government proposes new robot licensing regulations.",
        "Robot malfunction causes minor factory incident - no humans harmed.",
        "New scrap processing technique yields 15% more usable materials.",
        "Tech giant offers to buy your robot designs - what will you decide?",
        "Rival factory owner spotted spying on your production methods.",
        "Energy costs rising: consider upgrading to more efficient models.",
        "Robot rights activists protest outside local factories.",
        "Local school requests factory tour for engineering students.",
        "Lunar mining corporation seeking industrial robot suppliers.",
        "Military inquires about potential defense applications of your robots.",
        "Strange noises reported from the robot storage area at night.",
        "Missing tools found arranged in perfect geometric patterns.",
        "Factory workers report robots humming in synchronization.",
        "Power surges coincide with unexplained robot behavior.",
        "City newspaper runs feature on your growing robot empire.",
        "Space agency interested in adapting your robots for zero-gravity work.",
        "Robots observed solving problems they weren't programmed to handle.",
        "Global robot production index shows increasing trends worldwide.",
        "Security camera catches robots moving when power was supposedly off.",
        "Robot repair costs down 23% due to improved self-maintenance protocols.",
        "Factory neighbors complain about late-night mechanical noises.",
        "Robots increasingly efficient at finding and collecting scrap materials.",
        "Scientist offers to enhance your robots with experimental AI.",
        "Robot parts market experiences price volatility - stock up now!",
        "Children's toys inspired by your robot designs top holiday wish lists.",
        "Foreign investors express interest in franchising your robot factory.",
        "Robot-produced art pieces fetching high prices at auction.",
        "Mysterious blueprints found in factory - origin unknown.",
        "Weather service warning: protect sensitive robot components from storm.",
        "Factory cats now rely on robots to open their food cans.",
        "Robot caught attempting to access restricted factory areas.",
        "Shipping company offers discount rates for bulk robot exports.",
        "Insurance rates increased for facilities with high robot-to-human ratios.",
        "Leaked memo suggests robots sharing data while in standby mode.",
        "Research shows robot factory owners live 5 years longer than average.",
        "Local tech college wants to establish internship program at your factory.",
        "Robot fashion show raises funds for mechanical engineering scholarships.",
        "Ancient factory discovered with primitive robot-like devices.",
        "Robot dance competition announced - will your models participate?",
        "Scientists baffled by robots displaying preferences for certain tasks.",
        "Report: Robot factories becoming dominant economic sector globally.",
        "Strange symbols appearing in robot maintenance logs - encryption suspected.",
        "Urban legend claims certain robot models can predict lottery numbers.",
        "Factory security upgraded after attempted robot technology theft.",
        "Robot memory modules showing unexplained capacity increases.",
        "Coffee disappearing from break room - robot caffeine experiments?",
        "Interview request from 'Factories of the Future' documentary team.",
        "Social media trend: people naming and dressing up their service robots.",
        "Obsolete robots finding new purpose in creative arts programs.",
        "Factory lights observed turning on and off in patterns resembling code.",
        "Software update results in robots developing distinct personalities.",
        "Robot observed attempting to repair a bird with broken wing.",
        "Competing factory offering bonuses to poach your skilled technicians.",
        "Local garden club requests robots to help with community beautification.",
        "Robot commemorative stamp series to feature your factory designs.",
        "Robots developing regional accents based on factory location.",
        "Time anomalies reported in factory sections with highest robot density.",
        "Mining corporation discovers new alloy perfect for robot components.",
        "Robot maintenance costs reduced through preventative diagnostic algorithms.",
        "Specialized scrap dealers now offering premium rates for your business.",
        "Robot factories becoming popular tourist attractions worldwide.",
        "Factory robots observed working in more efficient patterns without reprogramming.",
        "Virtual reality training program for robot operators shows promising results.",
        "Robot software vulnerability patch released - update immediately.",
    ]
};

// DOM elements
const scrapsCountElement = document.getElementById('scraps-count');
const robotsCountElement = document.getElementById('robots-count');
const scrapPileElement = document.getElementById('scrap-pile');
const robotAssemblyElement = document.getElementById('robot-assembly');
const clickLevelElement = document.getElementById('click-level');
const clickCostElement = document.getElementById('click-cost');
const collectorLevelElement = document.getElementById('collector-level');
const collectorCostElement = document.getElementById('collector-cost');
const builderLevelElement = document.getElementById('builder-level');
const builderCostElement = document.getElementById('builder-cost');
const scrapsPerClickElement = document.getElementById('scraps-per-click');
const scrapsPerSecondElement = document.getElementById('scraps-per-second');
const robotsPerMinuteElement = document.getElementById('robots-per-minute');
const totalScrapsElement = document.getElementById('total-scraps');
const totalRobotsElement = document.getElementById('total-robots');
const newsTextElement = document.getElementById('news-text');

// Create scrap pile
function createScrapPile() {
    // Clear existing elements
    while (scrapPileElement.firstChild) {
        scrapPileElement.removeChild(scrapPileElement.firstChild);
    }
    
    // Create random scrap pieces
    for (let i = 0; i < 15; i++) {
        const scrap = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        
        // Random polygon
        const points = [];
        const cx = 100 + (Math.random() * 80 - 40);
        const cy = 75 + (Math.random() * 60 - 30);
        const size = 5 + Math.random() * 15;
        
        for (let j = 0; j < 5 + Math.floor(Math.random() * 4); j++) {
            const angle = j * (2 * Math.PI / (5 + Math.floor(Math.random() * 4)));
            const x = cx + size * Math.cos(angle) + (Math.random() * 4 - 2);
            const y = cy + size * Math.sin(angle) + (Math.random() * 4 - 2);
            points.push(`${x},${y}`);
        }
        
        scrap.setAttribute('points', points.join(' '));
        scrap.setAttribute('class', 'scrap');
        
        // Random metallic color
        const metalColors = ['#7d8599', '#a8a9ad', '#b5b8c4', '#888c9b', '#9ba1ad'];
        scrap.setAttribute('fill', metalColors[Math.floor(Math.random() * metalColors.length)]);
        scrap.setAttribute('stroke', '#444');
        scrap.setAttribute('stroke-width', '1');
        
        scrapPileElement.appendChild(scrap);
    }
}

// Create robot assembly area
function createRobotAssembly() {
    // Clear existing elements
    while (robotAssemblyElement.firstChild) {
        robotAssemblyElement.removeChild(robotAssemblyElement.firstChild);
    }
    
    // Assembly line
    const assemblyLine = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    assemblyLine.setAttribute('x', '50');
    assemblyLine.setAttribute('y', '150');
    assemblyLine.setAttribute('width', '200');
    assemblyLine.setAttribute('height', '20');
    assemblyLine.setAttribute('fill', '#333');
    assemblyLine.setAttribute('stroke', '#555');
    assemblyLine.setAttribute('stroke-width', '2');
    
    robotAssemblyElement.appendChild(assemblyLine);
    
    // Robotic arm
    const arm = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    const armBase = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    armBase.setAttribute('x', '40');
    armBase.setAttribute('y', '100');
    armBase.setAttribute('width', '20');
    armBase.setAttribute('height', '50');
    armBase.setAttribute('fill', '#555');
    
    const armJoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    armJoint.setAttribute('cx', '50');
    armJoint.setAttribute('cy', '100');
    armJoint.setAttribute('r', '8');
    armJoint.setAttribute('fill', '#777');
    
    const armUpperPart = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    armUpperPart.setAttribute('id', 'arm-upper');
    armUpperPart.setAttribute('x', '46');
    armUpperPart.setAttribute('y', '60');
    armUpperPart.setAttribute('width', '8');
    armUpperPart.setAttribute('height', '40');
    armUpperPart.setAttribute('fill', '#666');
    
    const armJoint2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    armJoint2.setAttribute('cx', '50');
    armJoint2.setAttribute('cy', '60');
    armJoint2.setAttribute('r', '6');
    armJoint2.setAttribute('fill', '#777');
    
    const armLowerPart = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    armLowerPart.setAttribute('id', 'arm-lower');
    armLowerPart.setAttribute('x', '48');
    armLowerPart.setAttribute('y', '30');
    armLowerPart.setAttribute('width', '4');
    armLowerPart.setAttribute('height', '30');
    armLowerPart.setAttribute('fill', '#666');
    
    const claw1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    claw1.setAttribute('id', 'claw1');
    claw1.setAttribute('d', 'M 48,30 L 44,20 L 48,25 Z');
    claw1.setAttribute('fill', '#888');
    
    const claw2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    claw2.setAttribute('id', 'claw2');
    claw2.setAttribute('d', 'M 52,30 L 56,20 L 52,25 Z');
    claw2.setAttribute('fill', '#888');
    
    arm.appendChild(armBase);
    arm.appendChild(armJoint);
    arm.appendChild(armUpperPart);
    arm.appendChild(armJoint2);
    arm.appendChild(armLowerPart);
    arm.appendChild(claw1);
    arm.appendChild(claw2);
    
    robotAssemblyElement.appendChild(arm);
    
    // Animate the robotic arm
    gsap.to('#arm-upper', {
        rotation: 15,
        transformOrigin: 'bottom center',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
    
    gsap.to('#arm-lower', {
        rotation: -30,
        transformOrigin: 'top center',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.5
    });
    
    gsap.to('#claw1', {
        rotation: 15,
        transformOrigin: 'top right',
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
    
    gsap.to('#claw2', {
        rotation: -15,
        transformOrigin: 'top left',
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
}

// Update the UI
function updateUI() {
    scrapsCountElement.textContent = Math.floor(gameState.scraps);
    robotsCountElement.textContent = Math.floor(gameState.robots);
    
    clickLevelElement.textContent = gameState.clickLevel;
    clickCostElement.textContent = gameState.clickCost;
    collectorLevelElement.textContent = gameState.collectorLevel;
    collectorCostElement.textContent = gameState.collectorCost;
    builderLevelElement.textContent = gameState.builderLevel;
    builderCostElement.textContent = gameState.builderCost;
    
    scrapsPerClickElement.textContent = gameState.scrapsPerClick;
    scrapsPerSecondElement.textContent = gameState.scrapsPerSecond.toFixed(1);
    robotsPerMinuteElement.textContent = (gameState.robotsPerSecond * 60).toFixed(2);
    totalScrapsElement.textContent = Math.floor(gameState.totalScraps);
    totalRobotsElement.textContent = Math.floor(gameState.totalRobots);
    
    // Update button states
    document.getElementById('buy-click-upgrade').disabled = gameState.scraps < gameState.clickCost;
    document.getElementById('buy-collector').disabled = gameState.scraps < gameState.collectorCost;
    document.getElementById('buy-builder').disabled = gameState.scraps < gameState.builderCost;
    
    // Update robot builder status to reflect when production is halted due to lack of scraps
    const robotBuilderElement = document.getElementById('robot-builder');
    if (gameState.builderLevel > 0 && gameState.scraps < 5) {
        robotBuilderElement.classList.add('inactive');
        robotBuilderElement.querySelector('p').innerHTML = 'Automatically build robots<br><span class="warning">Not enough scraps!</span>';
    } else {
        robotBuilderElement.classList.remove('inactive');
        robotBuilderElement.querySelector('p').innerHTML = 'Automatically build robots';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Click on scrap pile
    scrapPileElement.addEventListener('click', () => {
        collectScraps(gameState.scrapsPerClick);
        animateScrapClick(scrapPileElement, gameState.scrapsPerClick);
    });
    
    // Buy upgrades
    document.getElementById('buy-click-upgrade').addEventListener('click', () => {
        if (gameState.scraps >= gameState.clickCost) {
            gameState.scraps -= gameState.clickCost;
            gameState.clickLevel++;
            gameState.scrapsPerClick = Math.floor(Math.pow(1.5, gameState.clickLevel - 1));
            gameState.clickCost = Math.floor(10 * Math.pow(1.8, gameState.clickLevel - 1));
            updateUI();
            showUpgradeEffect('click-upgrade');
        }
    });
    
    document.getElementById('buy-collector').addEventListener('click', () => {
        if (gameState.scraps >= gameState.collectorCost) {
            gameState.scraps -= gameState.collectorCost;
            gameState.collectorLevel++;
            gameState.scrapsPerSecond = 0.5 * gameState.collectorLevel;
            gameState.collectorCost = Math.floor(50 * Math.pow(1.6, gameState.collectorLevel));
            updateUI();
            showUpgradeEffect('auto-collector');
        }
    });
    
    document.getElementById('buy-builder').addEventListener('click', () => {
        if (gameState.scraps >= gameState.builderCost) {
            gameState.scraps -= gameState.builderCost;
            gameState.builderLevel++;
            gameState.robotsPerSecond = 0.05 * gameState.builderLevel;
            gameState.builderCost = Math.floor(200 * Math.pow(1.7, gameState.builderLevel));
            updateUI();
            showUpgradeEffect('robot-builder');
            animateRobotBuilding();
        }
    });
}

// Collect scraps
function collectScraps(amount) {
    gameState.scraps += amount;
    gameState.totalScraps += amount;
    updateUI();
}

// Build robots
function buildRobots(amount) {
    gameState.robots += amount;
    gameState.totalRobots += amount;
    updateUI();
}

// News ticker rotation
function startNewsTickerRotation() {
    let currentMessageIndex = 0;
    
    setInterval(() => {
        currentMessageIndex = (currentMessageIndex + 1) % gameState.newsMessages.length;
        newsTextElement.textContent = gameState.newsMessages[currentMessageIndex];
    }, 10000);
}

// Initialize the game
function init() {
    // Load saved game if available
    const savedGame = loadGame();
    if (savedGame) {
        Object.assign(gameState, savedGame);
        console.log('Game loaded from save');
    }
    
    createScrapPile();
    createRobotAssembly();
    updateUI();
    setupEventListeners();
    initGameLoop(gameState, collectScraps, buildRobots, updateUI, saveGame);
    startNewsTickerRotation();
    
    // Initialize enhanced visuals
    initParticleSystem();
    initShaders();
}

// Start the game
init();
import gsap from 'gsap';
import { animateRobotBuilding } from './animations.js';

// Initialize loading and title screens
export function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const titleScreen = document.getElementById('title-screen');
    const gameContainer = document.querySelector('.game-container');
    const loadingBar = document.querySelector('.loading-bar');
    const startButton = document.getElementById('start-game');
    const loadingText = document.querySelector('.loading-text');
    
    // Create loading robot animation
    createLoadingRobot();
    
    // Create title screen robot
    createTitleRobots();
    
    // Simulate loading process
    const resources = [
        'Initializing systems',
        'Loading factory components',
        'Calibrating robot assemblers',
        'Processing scrap materials',
        'Configuring automation systems',
        'Optimizing production lines',
        'Loading market data',
        'Preparing user interface',
        'Syncing storage systems',
        'Finalizing factory startup'
    ];
    
    let progress = 0;
    let resourceIndex = 0;
    
    const loadingInterval = setInterval(() => {
        // Update loading text
        if (resourceIndex < resources.length) {
            loadingText.textContent = `${resources[resourceIndex]}...`;
            resourceIndex++;
        }
        
        // Update progress
        progress += Math.random() * 10 + 3;
        if (progress > 100) progress = 100;
        
        loadingBar.style.width = `${progress}%`;
        
        // Complete loading
        if (progress >= 100) {
            clearInterval(loadingInterval);
            
            // Complete loading with slight delay for visual effect
            setTimeout(() => {
                // Hide loading screen, show title screen
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        loadingScreen.style.display = 'none';
                        titleScreen.style.display = 'flex';
                        
                        // Animate title screen elements
                        animateTitleScreen();
                    }
                });
            }, 500);
        }
    }, 400);
    
    // Start game button
    startButton.addEventListener('click', () => {
        // Add click effect to button
        gsap.to(startButton, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
        
        // Transition to game
        gsap.to(titleScreen, {
            opacity: 0,
            duration: 1,
            delay: 0.2,
            onComplete: () => {
                titleScreen.style.display = 'none';
                gameContainer.style.display = 'block';
                
                // Fade in game container
                gsap.fromTo(gameContainer, 
                    { opacity: 0 },
                    { opacity: 1, duration: 1 }
                );
                
                // Animate game elements as they appear
                animateGameElements();
            }
        });
    });
}

// Create animated robot for the loading screen
function createLoadingRobot() {
    const robotSvg = document.querySelector('.loading-robot svg');
    if (!robotSvg) return;
    
    // Body
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('x', '40');
    body.setAttribute('y', '50');
    body.setAttribute('width', '40');
    body.setAttribute('height', '50');
    body.setAttribute('rx', '5');
    body.setAttribute('fill', '#48cae4');
    body.setAttribute('opacity', '0.9');
    body.setAttribute('stroke', '#90e0ef');
    body.setAttribute('stroke-width', '2');
    
    // Head
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    head.setAttribute('x', '45');
    head.setAttribute('y', '25');
    head.setAttribute('width', '30');
    head.setAttribute('height', '25');
    head.setAttribute('rx', '3');
    head.setAttribute('fill', '#48cae4');
    head.setAttribute('opacity', '0.9');
    head.setAttribute('stroke', '#90e0ef');
    head.setAttribute('stroke-width', '2');
    
    // Eyes
    const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftEye.setAttribute('cx', '55');
    leftEye.setAttribute('cy', '35');
    leftEye.setAttribute('r', '5');
    leftEye.setAttribute('fill', '#0077b6');
    leftEye.setAttribute('class', 'robot-eye');
    
    const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightEye.setAttribute('cx', '65');
    rightEye.setAttribute('cy', '35');
    rightEye.setAttribute('r', '5');
    rightEye.setAttribute('fill', '#0077b6');
    rightEye.setAttribute('class', 'robot-eye');
    
    // Antenna
    const antenna = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    antenna.setAttribute('x1', '60');
    antenna.setAttribute('y1', '25');
    antenna.setAttribute('x2', '60');
    antenna.setAttribute('y2', '15');
    antenna.setAttribute('stroke', '#90e0ef');
    antenna.setAttribute('stroke-width', '2');
    
    const antennaTip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    antennaTip.setAttribute('cx', '60');
    antennaTip.setAttribute('cy', '13');
    antennaTip.setAttribute('r', '3');
    antennaTip.setAttribute('fill', '#48cae4');
    antennaTip.setAttribute('class', 'antenna-tip');
    
    // Arms
    const leftArm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    leftArm.setAttribute('x', '25');
    leftArm.setAttribute('y', '60');
    leftArm.setAttribute('width', '15');
    leftArm.setAttribute('height', '8');
    leftArm.setAttribute('rx', '2');
    leftArm.setAttribute('fill', '#48cae4');
    leftArm.setAttribute('opacity', '0.9');
    leftArm.setAttribute('stroke', '#90e0ef');
    leftArm.setAttribute('stroke-width', '1.5');
    leftArm.setAttribute('class', 'left-arm');
    
    const rightArm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rightArm.setAttribute('x', '80');
    rightArm.setAttribute('y', '60');
    rightArm.setAttribute('width', '15');
    rightArm.setAttribute('height', '8');
    rightArm.setAttribute('rx', '2');
    rightArm.setAttribute('fill', '#48cae4');
    rightArm.setAttribute('opacity', '0.9');
    rightArm.setAttribute('stroke', '#90e0ef');
    rightArm.setAttribute('stroke-width', '1.5');
    rightArm.setAttribute('class', 'right-arm');
    
    // Legs
    const leftLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    leftLeg.setAttribute('x', '45');
    leftLeg.setAttribute('y', '100');
    leftLeg.setAttribute('width', '10');
    leftLeg.setAttribute('height', '20');
    leftLeg.setAttribute('rx', '2');
    leftLeg.setAttribute('fill', '#48cae4');
    leftLeg.setAttribute('opacity', '0.9');
    leftLeg.setAttribute('stroke', '#90e0ef');
    leftLeg.setAttribute('stroke-width', '1.5');
    leftLeg.setAttribute('class', 'left-leg');
    
    const rightLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rightLeg.setAttribute('x', '65');
    rightLeg.setAttribute('y', '100');
    rightLeg.setAttribute('width', '10');
    rightLeg.setAttribute('height', '20');
    rightLeg.setAttribute('rx', '2');
    rightLeg.setAttribute('fill', '#48cae4');
    rightLeg.setAttribute('opacity', '0.9');
    rightLeg.setAttribute('stroke', '#90e0ef');
    rightLeg.setAttribute('stroke-width', '1.5');
    rightLeg.setAttribute('class', 'right-leg');
    
    // Add elements to SVG
    robotSvg.appendChild(body);
    robotSvg.appendChild(head);
    robotSvg.appendChild(leftEye);
    robotSvg.appendChild(rightEye);
    robotSvg.appendChild(antenna);
    robotSvg.appendChild(antennaTip);
    robotSvg.appendChild(leftArm);
    robotSvg.appendChild(rightArm);
    robotSvg.appendChild(leftLeg);
    robotSvg.appendChild(rightLeg);
    
    // Animate robot
    animateLoadingRobot();
}

// Animate the loading robot
function animateLoadingRobot() {
    // Antenna tip glow animation
    gsap.to('.antenna-tip', {
        scale: 1.5,
        opacity: 0.8,
        duration: 0.5,
        repeat: -1,
        yoyo: true
    });
    
    // Eyes blinking
    gsap.to('.robot-eye', {
        scaleY: 0.1,
        duration: 0.1,
        repeat: -1,
        repeatDelay: 3,
        yoyo: true
    });
    
    // Arms waving
    gsap.to('.left-arm', {
        rotation: -15,
        transformOrigin: 'right center',
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
    
    gsap.to('.right-arm', {
        rotation: 15,
        transformOrigin: 'left center',
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.4
    });
    
    // Legs movement
    gsap.to('.left-leg', {
        y: -3,
        rotation: 5,
        transformOrigin: 'top center',
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
    
    gsap.to('.right-leg', {
        y: -3,
        rotation: -5,
        transformOrigin: 'top center',
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.4
    });
    
    // Subtle body bounce
    gsap.to('rect[x="40"]', {
        y: 48,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
    
    gsap.to('rect[x="45"]', {
        y: 23,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
}

// Create animated robots for the title screen
function createTitleRobots() {
    const titleRobotDisplay = document.querySelector('.title-robot-display');
    if (!titleRobotDisplay) return;
    
    // Add robot factory scene
    titleRobotDisplay.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 800 250">
            <!-- Factory backdrop -->
            <rect x="0" y="200" width="800" height="50" fill="#1a1a2e" />
            <rect x="100" y="100" width="600" height="100" fill="#1a1a2e" rx="5" />
            
            <!-- Factory details -->
            <rect x="150" y="120" width="80" height="60" fill="#0f153a" rx="3" />
            <rect x="350" y="120" width="100" height="60" fill="#0f153a" rx="3" />
            <rect x="550" y="120" width="80" height="60" fill="#0f153a" rx="3" />
            
            <!-- Conveyor belt -->
            <rect x="100" y="180" width="600" height="20" fill="#333" />
            
            <!-- Conveyor belt details -->
            ${Array.from({length: 20}, (_, i) => 
                `<rect x="${120 + i * 30}" y="180" width="15" height="20" fill="#444" />`
            ).join('')}
            
            <!-- Factory name -->
            <text x="400" y="90" fill="#48cae4" font-size="20" text-anchor="middle" font-weight="bold">ROBOT INDUSTRIES</text>
            
            <!-- Robots will be added here -->
            <g id="title-robots"></g>
            
            <!-- Control panel -->
            <rect x="650" y="140" width="30" height="40" fill="#0f153a" rx="2" />
            <circle cx="665" cy="150" r="5" fill="#48cae4" />
            <circle cx="665" cy="165" r="5" fill="#ff6b6b" />
            
            <!-- Glowing effects -->
            <circle cx="665" cy="150" r="8" fill="none" stroke="#48cae4" stroke-width="1" opacity="0.7" class="glow-effect" />
            <circle cx="665" cy="165" r="8" fill="none" stroke="#ff6b6b" stroke-width="1" opacity="0.7" class="glow-effect" />
        </svg>
    `;
    
    // Add robots moving on conveyor belt
    const robotsGroup = document.getElementById('title-robots');
    
    // Create and position robots
    for (let i = 0; i < 3; i++) {
        const robot = createTitleRobot();
        robot.setAttribute('transform', `translate(${-100 + i * 250}, 150) scale(0.7)`);
        robot.classList.add('title-robot');
        robot.style.opacity = '0';
        robotsGroup.appendChild(robot);
    }
    
    // Animate conveyor belt and robots in title screen sequentially
    setTimeout(() => {
        animateTitleRobots();
    }, 200);
}

// Create a robot for the title screen
function createTitleRobot() {
    const robot = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Body
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('x', '-20');
    body.setAttribute('y', '-40');
    body.setAttribute('width', '40');
    body.setAttribute('height', '50');
    body.setAttribute('rx', '5');
    body.setAttribute('fill', '#48cae4');
    body.setAttribute('stroke', '#90e0ef');
    body.setAttribute('stroke-width', '2');
    
    // Head
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    head.setAttribute('x', '-15');
    head.setAttribute('y', '-65');
    head.setAttribute('width', '30');
    head.setAttribute('height', '25');
    head.setAttribute('rx', '3');
    head.setAttribute('fill', '#48cae4');
    head.setAttribute('stroke', '#90e0ef');
    head.setAttribute('stroke-width', '2');
    
    // Eyes
    const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftEye.setAttribute('cx', '-5');
    leftEye.setAttribute('cy', '-55');
    leftEye.setAttribute('r', '5');
    leftEye.setAttribute('fill', '#0077b6');
    leftEye.setAttribute('class', 'robot-eye');
    
    const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightEye.setAttribute('cx', '5');
    rightEye.setAttribute('cy', '-55');
    rightEye.setAttribute('r', '5');
    rightEye.setAttribute('fill', '#0077b6');
    rightEye.setAttribute('class', 'robot-eye');
    
    // Antenna
    const antenna = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    antenna.setAttribute('x1', '0');
    antenna.setAttribute('y1', '-65');
    antenna.setAttribute('x2', '0');
    antenna.setAttribute('y2', '-75');
    antenna.setAttribute('stroke', '#90e0ef');
    antenna.setAttribute('stroke-width', '2');
    
    const antennaTip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    antennaTip.setAttribute('cx', '0');
    antennaTip.setAttribute('cy', '-77');
    antennaTip.setAttribute('r', '3');
    antennaTip.setAttribute('fill', '#48cae4');
    antennaTip.setAttribute('class', 'antenna-tip');
    
    // Arms
    const leftArm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    leftArm.setAttribute('x', '-35');
    leftArm.setAttribute('y', '-30');
    leftArm.setAttribute('width', '15');
    leftArm.setAttribute('height', '8');
    leftArm.setAttribute('rx', '2');
    leftArm.setAttribute('fill', '#48cae4');
    leftArm.setAttribute('stroke', '#90e0ef');
    leftArm.setAttribute('stroke-width', '1.5');
    leftArm.setAttribute('class', 'left-arm');
    
    const rightArm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rightArm.setAttribute('x', '20');
    rightArm.setAttribute('y', '-30');
    rightArm.setAttribute('width', '15');
    rightArm.setAttribute('height', '8');
    rightArm.setAttribute('rx', '2');
    rightArm.setAttribute('fill', '#48cae4');
    rightArm.setAttribute('stroke', '#90e0ef');
    rightArm.setAttribute('stroke-width', '1.5');
    rightArm.setAttribute('class', 'right-arm');
    
    // Legs
    const leftLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    leftLeg.setAttribute('x', '-15');
    leftLeg.setAttribute('y', '10');
    leftLeg.setAttribute('width', '10');
    leftLeg.setAttribute('height', '20');
    leftLeg.setAttribute('rx', '2');
    leftLeg.setAttribute('fill', '#48cae4');
    leftLeg.setAttribute('stroke', '#90e0ef');
    leftLeg.setAttribute('stroke-width', '1.5');
    leftLeg.setAttribute('class', 'left-leg');
    
    const rightLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rightLeg.setAttribute('x', '5');
    rightLeg.setAttribute('y', '10');
    rightLeg.setAttribute('width', '10');
    rightLeg.setAttribute('height', '20');
    rightLeg.setAttribute('rx', '2');
    rightLeg.setAttribute('fill', '#48cae4');
    rightLeg.setAttribute('stroke', '#90e0ef');
    rightLeg.setAttribute('stroke-width', '1.5');
    rightLeg.setAttribute('class', 'right-leg');
    
    // Add elements to robot group
    robot.appendChild(body);
    robot.appendChild(head);
    robot.appendChild(leftEye);
    robot.appendChild(rightEye);
    robot.appendChild(antenna);
    robot.appendChild(antennaTip);
    robot.appendChild(leftArm);
    robot.appendChild(rightArm);
    robot.appendChild(leftLeg);
    robot.appendChild(rightLeg);
    
    return robot;
}

// Animate robots on title screen
function animateTitleRobots() {
    const robots = document.querySelectorAll('.title-robot');
    
    // Fade in robots one by one
    robots.forEach((robot, index) => {
        gsap.to(robot, {
            opacity: 1,
            duration: 0.5,
            delay: index * 0.5
        });
    });
    
    // Move robots across conveyor belt
    gsap.to('.title-robot', {
        x: 900,
        duration: 15,
        ease: 'none',
        repeat: -1,
        stagger: 5
    });
    
    // Animate robot parts
    gsap.to('.title-robot .antenna-tip', {
        scale: 1.5,
        opacity: 0.8,
        duration: 0.5,
        repeat: -1,
        yoyo: true
    });
    
    gsap.to('.title-robot .robot-eye', {
        scaleY: 0.1,
        duration: 0.1,
        repeat: -1,
        repeatDelay: 3,
        yoyo: true
    });
    
    gsap.to('.title-robot .left-arm', {
        rotation: -15,
        transformOrigin: 'right center',
        duration: 0.8,
        repeat: -1,
        yoyo: true
    });
    
    gsap.to('.title-robot .right-arm', {
        rotation: 15,
        transformOrigin: 'left center',
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        delay: 0.4
    });
    
    // Glowing effects on control panel
    gsap.to('.glow-effect', {
        opacity: 0.3,
        scale: 1.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        stagger: 0.5
    });
    
    // Animate conveyor belt
    gsap.to('rect[width="15"][height="20"]', {
        x: '-=30',
        duration: 1,
        ease: 'none',
        repeat: -1,
        stagger: {
            each: 0,
            repeat: -1
        },
        modifiers: {
            x: x => `${((parseFloat(x) - 100) % 600) + 100}`
        }
    });
}

// Animate title screen elements
function animateTitleScreen() {
    const titleMain = document.querySelector('.title-main');
    const titleSubtitle = document.querySelector('.title-subtitle');
    const titleRobotDisplay = document.querySelector('.title-robot-display');
    const startButton = document.getElementById('start-game');
    const titleVersion = document.querySelector('.title-version');
    const titleCredits = document.querySelector('.title-credits');
    
    // Create animation sequence
    const tl = gsap.timeline();
    
    tl.from(titleMain, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
    })
    .from(titleSubtitle, {
        y: -20,
        opacity: 0,
        duration: 0.8
    }, '-=0.5')
    .from(titleRobotDisplay, {
        scale: 0.8,
        opacity: 0,
        duration: 1
    }, '-=0.3')
    .from(startButton, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.5)'
    }, '-=0.5')
    .from([titleVersion, titleCredits], {
        opacity: 0,
        duration: 0.5
    }, '-=0.3');
    
    // Add hover animation to start button
    const buttonPulse = gsap.to(startButton, {
        boxShadow: '0 8px 35px rgba(0, 119, 182, 0.7), 0 0 40px rgba(72, 202, 228, 0.6)',
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        paused: true
    });
    
    startButton.addEventListener('mouseenter', () => buttonPulse.play());
    startButton.addEventListener('mouseleave', () => buttonPulse.pause());
}

// Animate game elements when transitioning from title to game
function animateGameElements() {
    const sections = [
        '.header', 
        '.factory-area',
        '.upgrades-panel',
        '.stats-panel',
        '.prestige-stats',
        '.reset-section',
        '.import-export-panel',
        '.stock-market-panel',
        '.news-ticker'
    ];
    
    gsap.from(sections, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
    });
}

// Initialize loading and title screens
document.addEventListener('DOMContentLoaded', initLoadingScreen);
import gsap from 'gsap';

// Animation functions
export function animateScrapClick(scrapPileElement, scrapsPerClick) {
    // Create a floating "+1" text
    const floatingText = document.createElement('div');
    floatingText.textContent = `+${scrapsPerClick}`;
    floatingText.style.position = 'absolute';
    floatingText.style.left = `${scrapPileElement.getBoundingClientRect().left + 50 + Math.random() * 50}px`;
    floatingText.style.top = `${scrapPileElement.getBoundingClientRect().top + 50}px`;
    floatingText.style.color = '#4fc3f7';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontSize = '1.2em';
    floatingText.style.textShadow = '0 0 10px rgba(79, 195, 247, 0.8)';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '100';
    document.body.appendChild(floatingText);
    
    // Animate it with a more dynamic effect
    gsap.to(floatingText, {
        y: -80,
        x: () => Math.random() * 40 - 20,
        opacity: 0,
        scale: 1.5,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
            document.body.removeChild(floatingText);
        }
    });
    
    // Enhanced scrap pile animation
    gsap.to(scrapPileElement, {
        x: (i) => Math.random() * 8 - 4,
        y: (i) => Math.random() * 8 - 4,
        rotation: Math.random() * 1 - 0.5,
        duration: 0.2,
        repeat: 1,
        yoyo: true,
        ease: "elastic.out(1, 0.3)",
        onComplete: () => {
            gsap.set(scrapPileElement, { x: 0, y: 0, rotation: 0 });
        }
    });

    // Add a ripple effect at click position
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = `${scrapPileElement.getBoundingClientRect().left + 50}px`;
    ripple.style.top = `${scrapPileElement.getBoundingClientRect().top + 50}px`;
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(79, 195, 247, 0.5)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '90';
    document.body.appendChild(ripple);

    gsap.to(ripple, {
        width: '100px',
        height: '100px',
        left: '-=45',
        top: '-=45',
        opacity: 0,
        duration: 0.8,
        ease: "power1.out",
        onComplete: () => {
            document.body.removeChild(ripple);
        }
    });
}

export function showAutoCollectorEffect() {
    const scrapPileElement = document.getElementById('scrap-pile');
    const scrapsPerSecond = document.getElementById('scraps-per-second').textContent;
    
    // Create a floating text for auto collection with enhanced styling
    const floatingText = document.createElement('div');
    floatingText.textContent = `+${(parseFloat(scrapsPerSecond) / 10).toFixed(1)}`;
    floatingText.style.position = 'absolute';
    floatingText.style.left = `${scrapPileElement.getBoundingClientRect().left + 70 + Math.random() * 60}px`;
    floatingText.style.top = `${scrapPileElement.getBoundingClientRect().top + 30 + Math.random() * 40}px`;
    floatingText.style.color = '#76ff03'; 
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontSize = '0.9em';
    floatingText.style.textShadow = '0 0 8px rgba(118, 255, 3, 0.7)';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '100';
    document.body.appendChild(floatingText);
    
    // Enhanced animation
    gsap.to(floatingText, {
        y: -40,
        x: () => Math.random() * 30 - 15,
        opacity: 0,
        scale: 1.2,
        duration: 1.5,
        ease: "power1.out",
        onComplete: () => {
            document.body.removeChild(floatingText);
        }
    });

    // Add a subtle pulse to the scrap pile
    gsap.to(scrapPileElement, {
        scale: 1.02,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
    });
}

export function animateRobotBuilding() {
    const robotAssemblyElement = document.getElementById('robot-assembly');
    
    // Create an enhanced robot with more details and animations
    const robot = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    robot.setAttribute('class', 'robot');
    
    // Robot body with gradient
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('x', '-15');
    body.setAttribute('y', '-25');
    body.setAttribute('width', '30');
    body.setAttribute('height', '40');
    body.setAttribute('rx', '3');
    
    // Create gradient for body
    const bodyGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    bodyGradient.setAttribute('id', `robot-body-grad-${Date.now()}`); // Unique ID
    bodyGradient.setAttribute('x1', '0%');
    bodyGradient.setAttribute('y1', '0%');
    bodyGradient.setAttribute('x2', '100%');
    bodyGradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#b0bec5');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#78909c');
    
    bodyGradient.appendChild(stop1);
    bodyGradient.appendChild(stop2);
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.appendChild(bodyGradient);
    
    robot.appendChild(defs);
    
    body.setAttribute('fill', `url(#${bodyGradient.id})`);
    body.setAttribute('stroke', '#546e7a');
    body.setAttribute('stroke-width', '1.5');
    
    // Robot head with enhanced details
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    head.setAttribute('x', '-10');
    head.setAttribute('y', '-40');
    head.setAttribute('width', '20');
    head.setAttribute('height', '15');
    head.setAttribute('rx', '2');
    head.setAttribute('fill', '#90a4ae');
    head.setAttribute('stroke', '#546e7a');
    head.setAttribute('stroke-width', '1.5');
    
    // Antenna
    const antenna = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    antenna.setAttribute('x1', '0');
    antenna.setAttribute('y1', '-40');
    antenna.setAttribute('x2', '0');
    antenna.setAttribute('y2', '-48');
    antenna.setAttribute('stroke', '#78909c');
    antenna.setAttribute('stroke-width', '1.5');
    
    const antennaTip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    antennaTip.setAttribute('cx', '0');
    antennaTip.setAttribute('cy', '-49');
    antennaTip.setAttribute('r', '2');
    antennaTip.setAttribute('fill', '#4fc3f7');
    
    // Robot eyes with glow effect
    const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftEye.setAttribute('cx', '-5');
    leftEye.setAttribute('cy', '-33');
    leftEye.setAttribute('r', '3');
    leftEye.setAttribute('fill', '#4fc3f7');
    
    const leftEyeGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftEyeGlow.setAttribute('cx', '-5');
    leftEyeGlow.setAttribute('cy', '-33');
    leftEyeGlow.setAttribute('r', '4');
    leftEyeGlow.setAttribute('fill', 'none');
    leftEyeGlow.setAttribute('stroke', '#4fc3f7');
    leftEyeGlow.setAttribute('stroke-width', '0.5');
    leftEyeGlow.setAttribute('opacity', '0.5');
    
    const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightEye.setAttribute('cx', '5');
    rightEye.setAttribute('cy', '-33');
    rightEye.setAttribute('r', '3');
    rightEye.setAttribute('fill', '#4fc3f7');
    
    const rightEyeGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightEyeGlow.setAttribute('cx', '5');
    rightEyeGlow.setAttribute('cy', '-33');
    rightEyeGlow.setAttribute('r', '4');
    rightEyeGlow.setAttribute('fill', 'none');
    rightEyeGlow.setAttribute('stroke', '#4fc3f7');
    rightEyeGlow.setAttribute('stroke-width', '0.5');
    rightEyeGlow.setAttribute('opacity', '0.5');
    
    // Robot mouth
    const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mouth.setAttribute('x', '-6');
    mouth.setAttribute('y', '-28');
    mouth.setAttribute('width', '12');
    mouth.setAttribute('height', '2');
    mouth.setAttribute('rx', '1');
    mouth.setAttribute('fill', '#546e7a');
    
    // Robot arms with joints
    const leftShoulder = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftShoulder.setAttribute('cx', '-15');
    leftShoulder.setAttribute('cy', '-20');
    leftShoulder.setAttribute('r', '3');
    leftShoulder.setAttribute('fill', '#78909c');
    leftShoulder.setAttribute('stroke', '#546e7a');
    leftShoulder.setAttribute('stroke-width', '0.5');
    
    const leftArm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    leftArm.setAttribute('x', '-30');
    leftArm.setAttribute('y', '-21.5');
    leftArm.setAttribute('width', '15');
    leftArm.setAttribute('height', '5');
    leftArm.setAttribute('rx', '2');
    leftArm.setAttribute('fill', '#78909c');
    leftArm.setAttribute('stroke', '#546e7a');
    leftArm.setAttribute('stroke-width', '0.5');
    
    const rightShoulder = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightShoulder.setAttribute('cx', '15');
    rightShoulder.setAttribute('cy', '-20');
    rightShoulder.setAttribute('r', '3');
    rightShoulder.setAttribute('fill', '#78909c');
    rightShoulder.setAttribute('stroke', '#546e7a');
    rightShoulder.setAttribute('stroke-width', '0.5');
    
    const rightArm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rightArm.setAttribute('x', '15');
    rightArm.setAttribute('y', '-21.5');
    rightArm.setAttribute('width', '15');
    rightArm.setAttribute('height', '5');
    rightArm.setAttribute('rx', '2');
    rightArm.setAttribute('fill', '#78909c');
    rightArm.setAttribute('stroke', '#546e7a');
    rightArm.setAttribute('stroke-width', '0.5');
    
    // Robot legs with joints
    const leftHip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leftHip.setAttribute('cx', '-8');
    leftHip.setAttribute('cy', '15');
    leftHip.setAttribute('r', '2');
    leftHip.setAttribute('fill', '#78909c');
    leftHip.setAttribute('stroke', '#546e7a');
    leftHip.setAttribute('stroke-width', '0.5');
    
    const leftLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    leftLeg.setAttribute('x', '-10');
    leftLeg.setAttribute('y', '15');
    leftLeg.setAttribute('width', '5');
    leftLeg.setAttribute('height', '15');
    leftLeg.setAttribute('rx', '1');
    leftLeg.setAttribute('fill', '#78909c');
    leftLeg.setAttribute('stroke', '#546e7a');
    leftLeg.setAttribute('stroke-width', '0.5');
    
    const rightHip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rightHip.setAttribute('cx', '8');
    rightHip.setAttribute('cy', '15');
    rightHip.setAttribute('r', '2');
    rightHip.setAttribute('fill', '#78909c');
    rightHip.setAttribute('stroke', '#546e7a');
    rightHip.setAttribute('stroke-width', '0.5');
    
    const rightLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rightLeg.setAttribute('x', '5');
    rightLeg.setAttribute('y', '15');
    rightLeg.setAttribute('width', '5');
    rightLeg.setAttribute('height', '15');
    rightLeg.setAttribute('rx', '1');
    rightLeg.setAttribute('fill', '#78909c');
    rightLeg.setAttribute('stroke', '#546e7a');
    rightLeg.setAttribute('stroke-width', '0.5');
    
    // Add decorative details on body
    const bodyDetail1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bodyDetail1.setAttribute('x', '-10');
    bodyDetail1.setAttribute('y', '-15');
    bodyDetail1.setAttribute('width', '20');
    bodyDetail1.setAttribute('height', '5');
    bodyDetail1.setAttribute('rx', '1');
    bodyDetail1.setAttribute('fill', '#546e7a');
    
    const bodyDetail2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bodyDetail2.setAttribute('cx', '0');
    bodyDetail2.setAttribute('cy', '-5');
    bodyDetail2.setAttribute('r', '3');
    bodyDetail2.setAttribute('fill', '#4fc3f7');
    bodyDetail2.setAttribute('opacity', '0.7');
    
    // Assemble the robot
    robot.appendChild(body);
    robot.appendChild(head);
    robot.appendChild(antenna);
    robot.appendChild(antennaTip);
    robot.appendChild(leftEye);
    robot.appendChild(leftEyeGlow);
    robot.appendChild(rightEye);
    robot.appendChild(rightEyeGlow);
    robot.appendChild(mouth);
    robot.appendChild(leftShoulder);
    robot.appendChild(leftArm);
    robot.appendChild(rightShoulder);
    robot.appendChild(rightArm);
    robot.appendChild(leftHip);
    robot.appendChild(leftLeg);
    robot.appendChild(rightHip);
    robot.appendChild(rightLeg);
    robot.appendChild(bodyDetail1);
    robot.appendChild(bodyDetail2);
    
    // Set initial position
    robot.setAttribute('transform', 'translate(50, 140) scale(0.6)');
    
    robotAssemblyElement.appendChild(robot);
    
    // Enhanced robot movement animation
    gsap.to(robot, {
        x: 240,
        duration: 4,
        ease: "power1.inOut",
        onComplete: () => {
            robotAssemblyElement.removeChild(robot);
        }
    });
    
    // Animate the antenna tip (blinking)
    gsap.to(antennaTip, {
        opacity: 0.4,
        duration: 0.5,
        repeat: 8,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Animate the eyes (blinking)
    gsap.to([leftEye, rightEye], {
        scaleY: 0.2,
        transformOrigin: "center center",
        duration: 0.1,
        repeat: 4,
        repeatDelay: 2,
        yoyo: true,
        ease: "none"
    });
    
    // Animate the robot's arms with improved movement
    gsap.to(leftArm, {
        rotation: -20,
        transformOrigin: "right center",
        duration: 0.5,
        repeat: 8,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    gsap.to(rightArm, {
        rotation: 20,
        transformOrigin: "left center",
        duration: 0.5,
        repeat: 8,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.25
    });
    
    // Animate the robot's legs for walking motion
    gsap.to(leftLeg, {
        rotation: 25,
        y: 13,
        transformOrigin: "top center",
        duration: 0.5,
        repeat: 8,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    gsap.to(rightLeg, {
        rotation: -25,
        y: 13,
        transformOrigin: "top center",
        duration: 0.5,
        repeat: 8,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.25
    });
    
    // Add special effect glow during robot construction
    const constructionGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    constructionGlow.setAttribute('cx', '50');
    constructionGlow.setAttribute('cy', '140');
    constructionGlow.setAttribute('r', '30');
    constructionGlow.setAttribute('fill', 'rgba(79, 195, 247, 0.3)');
    constructionGlow.setAttribute('filter', 'blur(8px)');
    
    robotAssemblyElement.appendChild(constructionGlow);
    
    gsap.to(constructionGlow, {
        opacity: 0,
        scale: 3,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
            robotAssemblyElement.removeChild(constructionGlow);
        }
    });
}

export function showUpgradeEffect(upgradeId) {
    const upgradeElement = document.getElementById(upgradeId);
    
    // Enhanced flash effect with multiple animations
    gsap.timeline()
        .fromTo(upgradeElement, 
            { backgroundColor: 'rgba(79, 195, 247, 0.5)' },
            { backgroundColor: 'rgba(15, 52, 96, 0.8)', duration: 1, ease: "power2.out" }
        )
        .fromTo(upgradeElement, 
            { boxShadow: '0 0 20px rgba(79, 195, 247, 0.7)' },
            { boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)', duration: 1.2, ease: "power2.out" },
            "-=1"
        )
        .to(upgradeElement, 
            { scale: 1.05, duration: 0.3, ease: "back.out", yoyo: true, repeat: 1 },
            "-=1"
        );
    
    // Create sparkles around the upgrade
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '5px';
        sparkle.style.height = '5px';
        sparkle.style.backgroundColor = '#4fc3f7';
        sparkle.style.borderRadius = '50%';
        sparkle.style.filter = 'blur(1px)';
        sparkle.style.boxShadow = '0 0 5px #4fc3f7';
        sparkle.style.zIndex = '100';
        sparkle.style.pointerEvents = 'none';
        
        // Position around the element
        const rect = upgradeElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        
        document.body.appendChild(sparkle);
        
        // Animate sparkle
        gsap.to(sparkle, {
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0,
            scale: Math.random() * 2 + 1,
            duration: Math.random() * 1 + 0.5,
            ease: "power1.out",
            onComplete: () => {
                document.body.removeChild(sparkle);
            }
        });
    }
}

// Initialize ambient particle system
export function initParticleSystem() {
    const particlesContainer = document.getElementById('particles');
    
    // Create randomly placed particles
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random duration and delay
        const duration = Math.random() * 30 + 10;
        const delay = Math.random() * 10;
        
        particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
        
        particlesContainer.appendChild(particle);
    }
}
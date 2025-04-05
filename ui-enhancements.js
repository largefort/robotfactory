// UI enhancements and animations to support improved interface
import gsap from 'gsap';

// Initialize UI enhancements
export function initUIEnhancements() {
    addHoverEffects();
    addComponentAnimations();
    enhanceScrollExperience();
    addTooltips();
}

// Add hover effects to various elements
function addHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            
            const x = e.clientX - rect.left - size/2;
            const y = e.clientY - rect.top - size/2;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add glow effect to resources
    const resources = document.querySelectorAll('.resource');
    resources.forEach(resource => {
        resource.addEventListener('mouseover', function() {
            this.style.boxShadow = 'inset 0 0 15px rgba(0, 0, 0, 0.3), 0 12px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(72, 202, 228, 0.4)';
        });
        
        resource.addEventListener('mouseout', function() {
            this.style.boxShadow = 'inset 0 0 15px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.3)';
        });
    });
}

// Add animations to UI components
function addComponentAnimations() {
    // Animate sections on page load
    const sections = [
        '.header', 
        '.factory-area',
        '.upgrades-panel',
        '.stats-panel',
        '.prestige-stats',
        '.reset-section',
        '.news-ticker'
    ];
    
    gsap.from(sections, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });
    
    // Animate counter changes
    const counters = [
        '#scraps-count',
        '#robots-count',
        '#scraps-per-click',
        '#scraps-per-second',
        '#robots-per-minute',
        '#total-scraps',
        '#total-robots',
        '#prestige-points',
        '#prestige-bonus',
        '#next-prestige'
    ];
    
    counters.forEach(counter => {
        const element = document.querySelector(counter);
        if (element) {
            // Check if element exists before trying to access properties
            const originalUpdate = element._textSetter || 
                (Object.getPrototypeOf(element) && 
                 Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'textContent') && 
                 Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'textContent').set);
            
            // Only proceed if we have a valid setter
            if (originalUpdate) {
                element._textSetter = originalUpdate;
                
                Object.defineProperty(element, 'textContent', {
                    set: function(value) {
                        const oldValue = this.textContent;
                        if (oldValue !== value && !isNaN(parseInt(value)) && !isNaN(parseInt(oldValue))) {
                            originalUpdate.call(this, value);
                            gsap.from(this, {
                                scale: 1.2,
                                color: '#ffffff',
                                textShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                                duration: 0.3,
                                ease: 'power2.out'
                            });
                        } else {
                            originalUpdate.call(this, value);
                        }
                    },
                    get: function() {
                        return this.textContent;
                    }
                });
            }
        }
    });
}

// Enhance scrolling experience with smooth scrolling
function enhanceScrollExperience() {
    // Add smooth scrolling to page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add parallax effect to background elements
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            const speed = 0.05 + (index % 5) * 0.01;
            particle.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}

// Add tooltips to UI elements
function addTooltips() {
    // Add tooltip styles
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tooltip {
            position: absolute;
            background: rgba(20, 39, 78, 0.95);
            color: #48cae4;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.9em;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1000;
            border: 1px solid rgba(72, 202, 228, 0.2);
            max-width: 200px;
            text-align: center;
        }
        
        .tooltip.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .tooltip:after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: rgba(20, 39, 78, 0.95) transparent transparent transparent;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(tooltipStyle);
    
    // Add tooltips to elements
    const tooltipData = [
        { selector: '#scrap-pile', text: 'Click to collect scraps!' },
        { selector: '#buy-click-upgrade', text: 'Increases the number of scraps you get per click' },
        { selector: '#buy-collector', text: 'Automatically collects scraps over time' },
        { selector: '#buy-builder', text: 'Automatically builds robots using your scraps' },
        { selector: '#prestige-button', text: 'Reset your progress to earn permanent bonuses' },
        { selector: '#reset-button', text: 'WARNING: This will completely erase ALL progress' }
    ];
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
    
    // Add tooltips to elements
    tooltipData.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.addEventListener('mouseenter', e => {
                tooltip.textContent = item.text;
                tooltip.classList.add('show');
                
                const rect = element.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        }
    });
}
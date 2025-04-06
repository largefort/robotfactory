// Enhanced animations and styling for scraps per click
import gsap from 'gsap';

export function enhanceScrapClickStyles() {
    // Enhance the scraps-per-click element styling
    const scrapsPerClickElement = document.getElementById('scraps-per-click');
    if (scrapsPerClickElement) {
        // Add special styling
        scrapsPerClickElement.style.color = '#4fc3f7';
        scrapsPerClickElement.style.fontWeight = 'bold';
        scrapsPerClickElement.style.textShadow = '0 0 10px rgba(79, 195, 247, 0.5)';
        scrapsPerClickElement.style.fontSize = '1.1em';
        scrapsPerClickElement.style.transition = 'all 0.3s ease';
        
        // Create highlight effect wrapper
        const wrapper = document.createElement('span');
        wrapper.className = 'highlight-wrapper';
        scrapsPerClickElement.parentNode.insertBefore(wrapper, scrapsPerClickElement);
        wrapper.appendChild(scrapsPerClickElement);
        
        // Add pulsing glow animation
        const animation = gsap.to(scrapsPerClickElement, {
            textShadow: '0 0 15px rgba(79, 195, 247, 0.8), 0 0 25px rgba(79, 195, 247, 0.5)',
            scale: 1.05,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Add interactive effects
        scrapsPerClickElement.addEventListener('mouseenter', () => {
            animation.pause();
            gsap.to(scrapsPerClickElement, {
                scale: 1.15,
                color: '#76daff',
                textShadow: '0 0 20px rgba(79, 195, 247, 0.9), 0 0 30px rgba(79, 195, 247, 0.7)',
                duration: 0.3
            });
        });
        
        scrapsPerClickElement.addEventListener('mouseleave', () => {
            gsap.to(scrapsPerClickElement, {
                scale: 1, 
                color: '#4fc3f7',
                textShadow: '0 0 10px rgba(79, 195, 247, 0.5)',
                duration: 0.3,
                onComplete: () => animation.play()
            });
        });
    }
    
    // Add style for the highlight wrapper
    const style = document.createElement('style');
    style.textContent = `
        .highlight-wrapper {
            position: relative;
            display: inline-block;
            padding: 0 5px;
        }
        
        .highlight-wrapper:after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #4fc3f7, transparent);
            opacity: 0.7;
        }
        
        #scraps-per-click {
            cursor: pointer;
            position: relative;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
}
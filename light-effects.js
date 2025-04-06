// Light flickering effects for UI elements
import gsap from 'gsap';

// Add flickering light effect to the title like a malfunctioning light bulb
export function addTitleFlickeringEffect() {
    const title = document.querySelector('.header h1');
    if (!title) return;
    
    // Add special CSS class for the flickering effect
    title.classList.add('flickering-light');
    
    // Apply initial text shadow for the glow effect
    gsap.set(title, {
        textShadow: '0 0 15px rgba(72, 202, 228, 0.7), 0 0 25px rgba(72, 202, 228, 0.5)'
    });
    
    // Create random flickering pattern like a malfunctioning light bulb
    const createFlickerTimeline = () => {
        const timeline = gsap.timeline();
        
        // Add several random flickers
        for (let i = 0; i < 3 + Math.floor(Math.random() * 5); i++) {
            // Random flicker intensity
            const intensity = Math.random() < 0.7 ? 
                '0 0 2px rgba(72, 202, 228, 0.3), 0 0 5px rgba(72, 202, 228, 0.2)' : 
                '0 0 15px rgba(72, 202, 228, 0.7), 0 0 25px rgba(72, 202, 228, 0.5)';
            
            // Random duration for this flicker state
            const duration = 0.05 + Math.random() * 0.15;
            
            // Add to timeline
            timeline.to(title, {
                textShadow: intensity,
                color: intensity === '0 0 2px rgba(72, 202, 228, 0.3), 0 0 5px rgba(72, 202, 228, 0.2)' ? 
                    '#a8d8e0' : '#48cae4',
                duration: duration,
                ease: "none"
            });
        }
        
        // Return to normal state with a slight flicker
        timeline.to(title, {
            textShadow: '0 0 15px rgba(72, 202, 228, 0.7), 0 0 25px rgba(72, 202, 228, 0.5)',
            color: '#48cae4',
            duration: 0.2,
            ease: "power1.out"
        });
        
        return timeline;
    };
    
    // Function to start a new flicker sequence
    const startFlickerSequence = () => {
        // Create flicker timeline
        const flickerTimeline = createFlickerTimeline();
        
        // Random delay until next flicker sequence
        const nextDelay = 2 + Math.random() * 10;
        
        // Schedule next sequence
        setTimeout(startFlickerSequence, nextDelay * 1000);
    };
    
    // Add CSS for the flickering effect
    const style = document.createElement('style');
    style.textContent = `
        .flickering-light {
            position: relative;
        }
        
        .flickering-light::before {
            content: '';
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 6px;
            height: 6px;
            background: #48cae4;
            border-radius: 50%;
            box-shadow: 0 0 10px 5px rgba(72, 202, 228, 0.7);
            opacity: 0.7;
            z-index: -1;
            filter: blur(2px);
        }
        
        .flickering-light::after {
            content: '';
            position: absolute;
            top: -2px;
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(72, 202, 228, 0.4);
            box-shadow: 0 0 8px 2px rgba(72, 202, 228, 0.5);
            z-index: -1;
        }
    `;
    document.head.appendChild(style);
    
    // Start the periodic flicker effect
    startFlickerSequence();
    
    // Add occasional electrical short circuit effect
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every 30 seconds
            // Create more violent flicker for short circuit
            const shortCircuit = gsap.timeline();
            
            // Rapid flickers
            for (let i = 0; i < 10; i++) {
                shortCircuit.to(title, {
                    textShadow: i % 2 === 0 ? 
                        '0 0 20px rgba(72, 202, 228, 0.9), 0 0 30px rgba(72, 202, 228, 0.7)' : 
                        '0 0 1px rgba(72, 202, 228, 0.2)',
                    color: i % 2 === 0 ? '#90e0ef' : '#a5a5a5',
                    duration: 0.03,
                    ease: "none"
                });
            }
            
            // Brief power out
            shortCircuit.to(title, {
                textShadow: 'none',
                color: '#555',
                duration: 0.5,
                ease: "power1.out"
            });
            
            // Power returns gradually
            shortCircuit.to(title, {
                textShadow: '0 0 15px rgba(72, 202, 228, 0.7), 0 0 25px rgba(72, 202, 228, 0.5)',
                color: '#48cae4',
                duration: 0.8,
                ease: "elastic.out(1, 0.5)"
            });
        }
    }, 30000); // Check for short circuit every 30 seconds
}
import * as PIXI from 'pixi.js';

// Initialize the shader effects for the game
export function initShaders() {
    try {
        if (!PIXI || typeof PIXI.Application !== 'function') {
            throw new Error('PIXI.js not properly loaded');
        }
        
        // Create PIXI application for shader effects
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            antialias: true,
        });
        
        // Add canvas to the background (behind game elements but in front of particles)
        app.view.style.position = 'fixed';
        app.view.style.top = '0';
        app.view.style.left = '0';
        app.view.style.pointerEvents = 'none';
        app.view.style.zIndex = '0';
        document.body.insertBefore(app.view, document.body.firstChild);
        
        // Create light effect that follows mouse
        const lightEffect = new PIXI.Graphics();
        app.stage.addChild(lightEffect);
        
        // Cinematic scanlines
        const scanlines = new PIXI.Graphics();
        app.stage.addChild(scanlines);
        
        // Add vignette effect
        const vignette = new PIXI.Graphics();
        app.stage.addChild(vignette);
        
        // Track mouse position
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Animation loop
        app.ticker.add(() => {
            // Draw light effect that follows mouse
            lightEffect.clear();
            lightEffect.beginFill(0x4fc3f7, 0.1);
            lightEffect.drawCircle(mouseX, mouseY, 150);
            lightEffect.endFill();
            
            // Draw scanlines
            scanlines.clear();
            for (let i = 0; i < window.innerHeight; i += 4) {
                scanlines.lineStyle(1, 0x000000, 0.03);
                scanlines.moveTo(0, i);
                scanlines.lineTo(window.innerWidth, i);
            }
            
            // Draw vignette
            vignette.clear();
            const gradientTexture = createGradientTexture();
            vignette.beginTextureFill({ texture: gradientTexture });
            vignette.drawRect(0, 0, window.innerWidth, window.innerHeight);
            vignette.endFill();
        });
        
        // Create radial gradient texture for vignette effect
        function createGradientTexture() {
            const quality = 256;
            const canvas = document.createElement('canvas');
            canvas.width = quality;
            canvas.height = quality;
            
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createRadialGradient(
                quality / 2,
                quality / 2,
                0,
                quality / 2,
                quality / 2,
                quality / 2
            );
            
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, quality, quality);
            
            return PIXI.Texture.from(canvas);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
        });
        
        console.log("PIXI shaders initialized successfully");
    } catch (error) {
        console.error("Could not initialize PIXI shaders:", error);
        // Fallback to add simple CSS-based effects
        addFallbackEffects();
    }
}

// Add CSS-based visual effects when PIXI is not available
function addFallbackEffects() {
    const style = document.createElement('style');
    style.textContent = `
        body:after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.3) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px);
            pointer-events: none;
            z-index: 999;
        }
        
        .light-effect {
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(79,195,247,0.1) 0%, rgba(79,195,247,0) 70%);
            pointer-events: none;
            z-index: 998;
            transition: all 0.1s ease;
        }
        
        .scrap-collector:hover {
            filter: drop-shadow(0 0 10px rgba(79, 195, 247, 0.7));
        }
        
        button:hover, .upgrade:hover {
            box-shadow: 0 0 15px rgba(79, 195, 247, 0.5);
        }
    `;
    document.head.appendChild(style);
    
    // Create a div to follow mouse cursor with radial gradient
    const lightEffect = document.createElement('div');
    lightEffect.className = 'light-effect';
    document.body.appendChild(lightEffect);
    
    // Move light effect with mouse
    document.addEventListener('mousemove', (e) => {
        lightEffect.style.left = (e.clientX - 150) + 'px';
        lightEffect.style.top = (e.clientY - 150) + 'px';
    });
    
    // Add pulsing glow effects to interactive elements
    addGlowEffects();
}

// Add pulsing glow effects to interactive elements
function addGlowEffects() {
    // Elements that should have a glow effect
    const interactiveElements = [
        document.getElementById('scrap-pile'),
        ...document.querySelectorAll('button'),
        ...document.querySelectorAll('.upgrade')
    ];
    
    interactiveElements.forEach(element => {
        if (element) {
            // Create pulsing animation using standard DOM methods
            element.style.transition = 'box-shadow 2s ease-in-out';
            setInterval(() => {
                if (element.style.boxShadow === '0 0 15px rgba(79, 195, 247, 0.5)') {
                    element.style.boxShadow = '0 0 5px rgba(79, 195, 247, 0.2)';
                } else {
                    element.style.boxShadow = '0 0 15px rgba(79, 195, 247, 0.5)';
                }
            }, 2000);
        }
    });
}
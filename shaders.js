import * as PIXI from 'pixi.js';

// Initialize the shader effects for the game
export function initShaders() {
    try {
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
    } catch (error) {
        console.error("Could not initialize PIXI shaders:", error);
        // Fallback to add simple CSS-based glow effects
        addSimpleGlowEffects();
    }
    
    // Always add glow effects (either with PIXI or simple CSS)
    addGlowEffects();
}

// Add simple CSS-based glow effects as fallback
function addSimpleGlowEffects() {
    const style = document.createElement('style');
    style.textContent = `
        .scrap-collector:hover {
            filter: drop-shadow(0 0 10px rgba(79, 195, 247, 0.7));
        }
        
        button:hover, .upgrade:hover {
            box-shadow: 0 0 15px rgba(79, 195, 247, 0.5);
        }
    `;
    document.head.appendChild(style);
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
            // Create pulsing animation using standard DOM methods instead of gsap to avoid dependencies
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
// Particles.js - Sistema di particelle ed effetti
export class ParticleSystem {
    constructor(gameContainer, gameWidth, gameHeight) {
        this.gameContainer = gameContainer;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.particles = [];
    }
    
    createParticle(worldX, worldY, color, duration, type, player) {
        // Convert world coordinates to screen coordinates
        const dx = worldX - player.x;
        const dy = worldY - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) - player.angle;
        
        let normalizedAngle = angle;
        while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
        while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;
        
        if (Math.abs(normalizedAngle) < Math.PI / 3 && distance < 20) {
            const screenX = (normalizedAngle / (Math.PI / 3)) * (this.gameWidth / 2) + (this.gameWidth / 2);
            const screenY = this.gameHeight / 2 - (20 / distance);
            
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = screenX + 'px';
            particle.style.top = screenY + 'px';
            particle.style.background = color;
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10';
            
            if (type === 'blood') {
                particle.classList.add('blood-particle');
                particle.style.background = '#ff0000';
            } else if (type === 'wall') {
                particle.classList.add('wall-particle');
                particle.style.background = '#888';
            } else if (type === 'explosion') {
                particle.style.width = '8px';
                particle.style.height = '8px';
                particle.style.background = '#ff6600';
            } else if (type === 'bullet') {
                particle.style.background = '#ffff00';
                particle.style.width = '2px';
                particle.style.height = '2px';
            }
            
            this.gameContainer.appendChild(particle);
            
            // Animate particle
            const moveX = (Math.random() - 0.5) * 100;
            const moveY = (Math.random() - 0.5) * 100;
            
            particle.style.transition = `all ${duration}ms ease-out`;
            
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
                particle.style.opacity = '0';
            });
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration);
        }
    }
    
    createBulletTrail(startX, startY, endX, endY, player) {
        const steps = 10;
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            
            setTimeout(() => {
                this.createParticle(x, y, '#ffff00', 200, 'bullet', player);
            }, i * 20);
        }
    }
    
    createBloodParticles(x, y, player) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createParticle(
                    x + (Math.random() - 0.5) * 0.5,
                    y + (Math.random() - 0.5) * 0.5,
                    '#ff0000',
                    1000,
                    'blood',
                    player
                );
            }, i * 50);
        }
    }
    
    createWallParticles(x, y, player) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createParticle(
                    x + (Math.random() - 0.5) * 0.3,
                    y + (Math.random() - 0.5) * 0.3,
                    '#888',
                    800,
                    'wall',
                    player
                );
            }, i * 30);
        }
    }
    
    createExplosion(x, y, radius, player) {
        // Visual explosion effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle(
                    x + (Math.random() - 0.5) * radius,
                    y + (Math.random() - 0.5) * radius,
                    '#ff6600',
                    500,
                    'explosion',
                    player
                );
            }, i * 20);
        }
    }
    
    showMuzzleFlash() {
        const muzzleFlash = document.getElementById('muzzleFlash');
        if (muzzleFlash) {
            muzzleFlash.style.opacity = '0.8';
            setTimeout(() => {
                muzzleFlash.style.opacity = '0';
            }, 100);
        }
    }
    
    showDamageOverlay() {
        const overlay = document.getElementById('damageOverlay');
        if (overlay) {
            overlay.style.opacity = '1';
            setTimeout(() => {
                overlay.style.opacity = '0';
            }, 300);
        }
    }
    
    showReloadMessage(message) {
        const messageBox = document.createElement('div');
        messageBox.textContent = message;
        messageBox.style.position = 'absolute';
        messageBox.style.top = '50px';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translateX(-50%)';
        messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageBox.style.color = '#fff';
        messageBox.style.padding = '10px';
        messageBox.style.borderRadius = '5px';
        messageBox.style.zIndex = '1000';
        messageBox.style.fontFamily = 'monospace';
        messageBox.style.fontSize = '14px';
        
        this.gameContainer.appendChild(messageBox);
        
        // Remove message after 2 seconds
        setTimeout(() => {
            if (messageBox.parentNode) {
                messageBox.remove();
            }
        }, 2000);
    }
    
    clearAllParticles() {
        // Remove all particles from DOM
        const particles = this.gameContainer.querySelectorAll('.particle');
        particles.forEach(particle => particle.remove());
        
        // Clear particles array
        this.particles = [];
    }
}
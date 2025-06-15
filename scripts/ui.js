// UI.js - Gestione interfaccia utente e HUD
export class UI {
    constructor() {
        this.powerupActive = false;
        this.powerupEndTime = 0;
    }
    
    updateHUD(player, weapon, kills, totalEnemies) {
        // Update health
        const healthElement = document.getElementById('health');
        if (healthElement) {
            healthElement.textContent = Math.max(0, Math.floor(player.health));
        }
        
        // Update armor
        const armorElement = document.getElementById('armor');
        if (armorElement) {
            armorElement.textContent = Math.max(0, Math.floor(player.armor));
        }
        
        // Update ammo
        const ammoElement = document.getElementById('ammo');
        if (ammoElement) {
            const ammo = player.ammo[weapon.ammoType];
            ammoElement.textContent = ammo === Infinity ? '∞' : ammo;
        }
        
        // Update ammo bar
        const ammoFill = document.getElementById('ammoFill');
        if (ammoFill) {
            const ammo = player.ammo[weapon.ammoType];
            if (ammo === Infinity) {
                ammoFill.style.width = '100%';
            } else {
                const maxAmmo = player.maxAmmo[weapon.ammoType];
                const percentage = (ammo / maxAmmo) * 100;
                ammoFill.style.width = percentage + '%';
            }
        }
        
        // Update weapon display
        this.updateWeaponDisplay(weapon, player.weapon);
        
        // Update inventory
        this.updateInventory(player.hasKey);
        
        // Update kill counter
        this.updateKillCounter(kills, totalEnemies);
    }
    
    updateWeaponDisplay(weapon, currentWeapon) {
        const weaponIcon = document.getElementById('weaponIcon');
        if (weaponIcon) {
            weaponIcon.textContent = weapon.name.substring(0, 8);
        }
        
        const weaponName = document.getElementById('weaponName');
        if (weaponName) {
            weaponName.textContent = weapon.name;
        }
        
        // Update weapon slots
        document.querySelectorAll('.weapon-slot').forEach((slot, index) => {
            if (index + 1 === currentWeapon) {
                slot.classList.add('active');
            } else {
                slot.classList.remove('active');
            }
        });
    }
    
    updateInventory(hasKey) {
        const keyStatus = document.getElementById('keyStatus');
        if (keyStatus) {
            if (hasKey) {
                keyStatus.innerHTML = '🗝️ Chiave: <span style="color: #00ff00">SÌ</span>';
            } else {
                keyStatus.innerHTML = '🗝️ Chiave: <span style="color: #ff0000">NO</span>';
            }
        }
    }
    
    updateKillCounter(kills, totalEnemies) {
        const killsElement = document.getElementById('kills');
        if (killsElement) {
            killsElement.textContent = kills;
        }
        
        const totalEnemiesElement = document.getElementById('totalEnemies');
        if (totalEnemiesElement) {
            totalEnemiesElement.textContent = totalEnemies;
        }
    }
    
    showMenu() {
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'flex';
        }
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }
    }
    
    hideMenu() {
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'none';
        }
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.display = 'block';
        }
    }
    
    showGameOver() {
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (gameOverScreen) {
            gameOverScreen.style.display = 'flex';
        }
    }
    
    hideGameOver() {
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
    }
    
    showVictory() {
        const victoryScreen = document.getElementById('victoryScreen');
        if (victoryScreen) {
            victoryScreen.style.display = 'flex';
        }
    }
    
    hideVictory() {
        const victoryScreen = document.getElementById('victoryScreen');
        if (victoryScreen) {
            victoryScreen.style.display = 'none';
        }
    }
    
    activatePowerup(duration) {
        this.powerupActive = true;
        this.powerupEndTime = Date.now() + duration;
        
        const powerupIndicator = document.getElementById('powerupIndicator');
        if (powerupIndicator) {
            powerupIndicator.style.display = 'block';
        }
    }
    
    updatePowerup() {
        if (this.powerupActive && Date.now() > this.powerupEndTime) {
            this.powerupActive = false;
            
            const powerupIndicator = document.getElementById('powerupIndicator');
            if (powerupIndicator) {
                powerupIndicator.style.display = 'none';
            }
        }
        
        return this.powerupActive;
    }
    
    updateCrosshairPosition(gameWidth, gameHeight) {
        const crosshair = document.getElementById('crosshair');
        const muzzleFlash = document.getElementById('muzzleFlash');
        
        if (crosshair) {
            const centerX = gameWidth / 2;
            const centerY = gameHeight / 2;
            
            crosshair.style.left = (centerX - 12) + 'px';
            crosshair.style.top = (centerY - 12) + 'px';
        }
        
        if (muzzleFlash) {
            const centerX = gameWidth / 2;
            const centerY = gameHeight / 2;
            
            muzzleFlash.style.left = (centerX - 50) + 'px';
            muzzleFlash.style.top = (centerY - 50) + 'px';
        }
    }
    
    showMessage(message, duration = 2000, type = 'info') {
        const messageBox = document.createElement('div');
        messageBox.textContent = message;
        messageBox.style.position = 'absolute';
        messageBox.style.top = '50px';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translateX(-50%)';
        messageBox.style.padding = '10px 20px';
        messageBox.style.borderRadius = '5px';
        messageBox.style.zIndex = '1000';
        messageBox.style.fontFamily = 'monospace';
        messageBox.style.fontSize = '14px';
        messageBox.style.fontWeight = 'bold';
        messageBox.style.textAlign = 'center';
        messageBox.style.minWidth = '200px';
        
        // Style based on message type
        switch (type) {
            case 'error':
                messageBox.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                messageBox.style.color = '#fff';
                messageBox.style.border = '2px solid #ff0000';
                break;
            case 'success':
                messageBox.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
                messageBox.style.color = '#000';
                messageBox.style.border = '2px solid #00ff00';
                break;
            case 'warning':
                messageBox.style.backgroundColor = 'rgba(255, 255, 0, 0.8)';
                messageBox.style.color = '#000';
                messageBox.style.border = '2px solid #ffff00';
                break;
            default: // info
                messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                messageBox.style.color = '#fff';
                messageBox.style.border = '2px solid #fff';
                break;
        }
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(messageBox);
            
            // Add fade-in animation
            messageBox.style.opacity = '0';
            messageBox.style.transition = 'opacity 0.3s ease-in-out';
            
            setTimeout(() => {
                messageBox.style.opacity = '1';
            }, 10);
            
            // Remove message after duration
            setTimeout(() => {
                messageBox.style.opacity = '0';
                setTimeout(() => {
                    if (messageBox.parentNode) {
                        messageBox.remove();
                    }
                }, 300);
            }, duration);
        }
    }
    
    isPowerupActive() {
        return this.powerupActive;
    }
    
    reset() {
        this.powerupActive = false;
        this.powerupEndTime = 0;
        
        const powerupIndicator = document.getElementById('powerupIndicator');
        if (powerupIndicator) {
            powerupIndicator.style.display = 'none';
        }
        
        this.hideGameOver();
        this.hideVictory();
    }
}
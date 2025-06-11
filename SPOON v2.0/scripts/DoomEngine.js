// DoomEngine.js - Motore principale riorganizzato
import { Player } from './Player.js';
import { WeaponSystem } from './weapons.js';
import { Renderer } from './Renderer.js';
import { EnemyManager } from './enemy.js';
import { ParticleSystem } from './Particles.js';
import { Controls } from './Controls.js';
import { GameMap } from './GameMap.js';
import { UI } from './ui.js';

export class DoomEngine {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.gameContainer = document.getElementById('gameContainer');
        
        // Canvas size for game area (excluding HUD)
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight - 140; // 140px for HUD
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        
        // Game state
        this.gameState = 'menu';
        this.gameStarted = false;
        this.kills = 0;
        
        // Initialize all systems
        this.initSystems();
        this.initCallbacks();
        
        // Setup resize handler
        this.ui.updateCrosshairPosition(this.gameWidth, this.gameHeight);
        window.addEventListener('resize', () => this.handleResize());
    }
    
    initSystems() {
        // Initialize all game systems
        this.player = new Player();
        this.weaponSystem = new WeaponSystem();
        this.renderer = new Renderer(this.canvas, this.gameWidth, this.gameHeight);
        this.enemyManager = new EnemyManager();
        this.particleSystem = new ParticleSystem(this.gameContainer, this.gameWidth, this.gameHeight);
        this.controls = new Controls(this.canvas, this.gameContainer);
        this.gameMap = new GameMap();
        this.ui = new UI();
        
        // Initialize enemies
        this.enemyManager.initEnemies();
    }
    
    initCallbacks() {
        // Setup control callbacks
        this.controls.setShootCallback(() => this.shoot());
        this.controls.setWeaponSwitchCallback((weapon) => this.switchWeapon(weapon));
        this.controls.setReloadCallback(() => this.reload());
        this.controls.setUseActionCallback(() => this.useAction());
        this.controls.setMouseMoveCallback((dx, dy) => this.handleMouseMove(dx, dy));
        this.controls.setStartGameCallback(() => this.startGame());
        this.controls.setRestartGameCallback(() => this.restartGame());
    }
    
    handleResize() {
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight - 140;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        this.ui.updateCrosshairPosition(this.gameWidth, this.gameHeight);
    }
    
    handleMouseMove(movementX, movementY) {
        if (this.gameState === 'playing') {
            this.player.rotate(movementX * 0.003);
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.ui.hideMenu();
        
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.updateHUD();
            this.gameLoop();
        }
    }
    
    restartGame() {
        this.gameState = 'playing';
        this.ui.hideGameOver();
        this.ui.hideVictory();
        
        // Reset all systems
        this.player = new Player();
        this.enemyManager.reset();
        this.gameMap.reset();
        this.particleSystem.clearAllParticles();
        this.ui.reset();
        this.kills = 0;
        
        this.updateHUD();
        
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.gameLoop();
        }
    }
    
    showGameOver() {
        this.gameState = 'gameOver';
        this.ui.showGameOver();
    }
    
    showVictory() {
        this.gameState = 'victory';
        this.ui.showVictory();
    }
    
    switchWeapon(weaponNum) {
        if (this.gameState !== 'playing') return;
        
        if (this.player.switchWeapon(weaponNum)) {
            this.updateHUD();
        }
    }
    
    reload() {
        if (this.gameState !== 'playing') return;
        
        const weapon = this.weaponSystem.getWeapon(this.player.weapon);
        const reloaded = this.player.reload(weapon);
        
        if (reloaded) {
            this.updateHUD();
        } else {
            if (weapon.ammoType !== 1 && weapon.ammoType !== 2) {
                this.ui.showMessage(`${weapon.name} già carico!`, 2000, 'warning');
            }
        }
    }
    
    useAction() {
        if (this.gameState !== 'playing') return;
        
        const door = this.gameMap.checkDoorInteraction(this.player.x, this.player.y, this.player.hasKey);
        if (door) {
            this.gameMap.openDoor(door);
            this.ui.showMessage('Porta aperta!', 1500, 'success');
        }
    }
    
    shoot() {
        if (this.gameState !== 'playing') return;
        
        const weapon = this.weaponSystem.getWeapon(this.player.weapon);
        
        if (!this.weaponSystem.canFire(this.player.weapon)) return;
        
        if (!this.player.canShoot(weapon)) {
            this.ui.showMessage('Munizioni finite!', 1500, 'error');
            return;
        }
        
        if (!this.weaponSystem.fire(this.player.weapon)) return;
        
        this.player.consumeAmmo(weapon);
        this.particleSystem.showMuzzleFlash();
        
        this.performShot(weapon);
        this.updateHUD();
    }
    
    performShot(weapon) {
        const centerAngle = this.player.angle;
        const shots = weapon.spread ? weapon.spread : 1;
        const spreadAngle = weapon.spread ? 0.2 : 0;
        
        for (let i = 0; i < shots; i++) {
            let shotAngle = centerAngle;
            if (weapon.spread) {
                shotAngle += (Math.random() - 0.5) * spreadAngle;
            }
            
            const result = this.weaponSystem.castShot(
                this.player.x, 
                this.player.y, 
                shotAngle, 
                weapon.range, 
                this.gameMap.map, 
                this.enemyManager.enemies
            );
            
            if (result.hit) {
                let damage = weapon.damage;
                if (this.ui.isPowerupActive()) {
                    damage *= 2; // Double damage with powerup
                }
                
                if (result.type === 'enemy') {
                    const killed = this.enemyManager.damageEnemy(result.enemy, damage);
                    this.particleSystem.createBloodParticles(result.x, result.y, this.player);
                    
                    if (killed) {
                        this.kills++;
                        this.updateHUD();
                        
                        // Check for victory
                        if (this.enemyManager.allEnemiesKilled()) {
                            setTimeout(() => this.showVictory(), 1000);
                        }
                    }
                } else if (result.type === 'wall') {
                    this.particleSystem.createWallParticles(result.x, result.y, this.player);
                }
                
                // Create bullet trail
                this.particleSystem.createBulletTrail(this.player.x, this.player.y, result.x, result.y, this.player);
            }
        }
        
        // Rocket splash damage
        if (weapon.splash && weapon.ammoType === 5) {
            const shotResult = this.weaponSystem.castShot(
                this.player.x, 
                this.player.y, 
                centerAngle, 
                weapon.range, 
                this.gameMap.map, 
                this.enemyManager.enemies
            );
            if (shotResult.hit) {
                this.createExplosion(shotResult.x, shotResult.y, weapon.splash);
            }
        }
    }
    
    createExplosion(x, y, radius) {
        this.particleSystem.createExplosion(x, y, radius, this.player);
        
        const damagedEnemies = this.weaponSystem.calculateSplashDamage(
            x, y, radius, this.enemyManager.enemies, 50
        );
        
        damagedEnemies.forEach(({enemy, damage}) => {
            const killed = this.enemyManager.damageEnemy(enemy, damage);
            if (killed) {
                this.kills++;
            }
        });
        
        this.updateHUD();
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Update powerup status
        this.ui.updatePowerup();
        
        // Handle player movement
        this.updatePlayerMovement();
        
        // Check for item collection
        this.checkItemCollection();
        
        // Update enemies
        this.updateEnemies();
        
        this.updateHUD();
    }
    
    updatePlayerMovement() {
        const movement = this.controls.getMovementVector();
        const moveSpeed = this.ui.isPowerupActive() ? 0.08 : 0.05;
        
        let newX = this.player.x;
        let newY = this.player.y;
        
        if (movement.forward !== 0) {
            newX += Math.cos(this.player.angle) * moveSpeed * movement.forward;
            newY += Math.sin(this.player.angle) * moveSpeed * movement.forward;
        }
        
        if (movement.strafe !== 0) {
            newX += -Math.sin(this.player.angle) * moveSpeed * movement.strafe;
            newY += Math.cos(this.player.angle) * moveSpeed * movement.strafe;
        }
        
        // Check collision with walls and closed doors
        if (this.gameMap.isWalkable(newX, newY)) {
            this.player.move(newX, newY);
        }
    }
    
    checkItemCollection() {
        const collectedItems = this.gameMap.checkItemCollection(this.player.x, this.player.y);
        
        collectedItems.forEach(item => {
            this.collectItem(item);
        });
    }
    
    collectItem(item) {
        switch(item.type) {
            case 'health':
                this.player.heal(item.value);
                this.ui.showMessage(`+${item.value} Salute`, 1500, 'success');
                break;
            case 'armor':
                this.player.addArmor(item.value);
                this.ui.showMessage(`+${item.value} Armatura`, 1500, 'success');
                break;
            case 'ammo':
                this.player.addAmmo(3, item.value);
                this.player.addAmmo(4, item.value);
                this.ui.showMessage(`+${item.value} Munizioni`, 1500, 'success');
                break;
            case 'rocket':
                this.player.addAmmo(5, item.value);
                this.ui.showMessage(`+${item.value} Razzi`, 1500, 'success');
                break;
            case 'key':
                this.player.hasKey = true;
                this.ui.showMessage('Chiave ottenuta!', 2000, 'success');
                break;
            case 'powerup':
                this.ui.activatePowerup(item.value);
                this.ui.showMessage('POTENZIAMENTO ATTIVO!', 2000, 'success');
                break;
        }
    }
    
    updateEnemies() {
        const result = this.enemyManager.updateEnemies(
            this.player, 
            this.gameMap.map, 
            (x, y) => this.gameMap.isDoorOpen(x, y),
            (x1, y1, x2, y2) => this.gameMap.hasLineOfSight(x1, y1, x2, y2)
        );
        
        if (result.enemyAttack) {
            const isDead = this.player.takeDamage(result.damage);
            this.particleSystem.showDamageOverlay();
            
            if (isDead) {
                this.showGameOver();
            }
        }
    }
    
    render() {
        this.renderer.render(
            this.player,
            this.enemyManager.enemies,
            this.gameMap.items,
            this.gameMap.doors,
            this.gameMap.map,
            (x, y) => this.gameMap.isDoorOpen(x, y)
        );
    }
    
    updateHUD() {
        const weapon = this.weaponSystem.getWeapon(this.player.weapon);
        this.ui.updateHUD(this.player, weapon, this.kills, this.enemyManager.totalEnemies);
    }
    
    gameLoop() {
        this.update();
        this.render();
        
        if (this.gameState === 'playing') {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new DoomEngine();
});

if (document.readyState !== 'loading') {
    window.game = new DoomEngine();
}
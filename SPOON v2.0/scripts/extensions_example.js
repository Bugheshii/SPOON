// Extensions.js - Esempi di come estendere il motore

import { GameConfig } from './config.js';
import { Utils } from './Utils.js';

// Esempio 1: Sistema Audio
export class AudioSystem {
    constructor() {
        this.sounds = new Map();
        this.masterVolume = 1.0;
        this.sfxVolume = 0.8;
        this.musicVolume = 0.6;
        this.audioContext = null;
        
        this.initAudioContext();
    }
    
    async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio not supported');
        }
    }
    
    async loadSound(name, url) {
        try {
            const audio = new Audio(url);
            audio.preload = 'auto';
            this.sounds.set(name, audio);
        } catch (e) {
            console.warn(`Failed to load sound: ${name}`);
        }
    }
    
    playSound(name, volume = 1.0, loop = false) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.volume = volume * this.sfxVolume * this.masterVolume;
            sound.loop = loop;
            sound.currentTime = 0;
            sound.play().catch(e => console.warn('Failed to play sound:', e));
        }
    }
    
    stopSound(name) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Utils.clamp(volume, 0, 1);
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Utils.clamp(volume, 0, 1);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Utils.clamp(volume, 0, 1);
    }
}

// Esempio 2: Sistema di Salvataggio
export class SaveSystem {
    constructor() {
        this.saveKey = 'doomengine_save';
    }
    
    saveGame(gameState) {
        const saveData = {
            timestamp: Date.now(),
            player: {
                x: gameState.player.x,
                y: gameState.player.y,
                angle: gameState.player.angle,
                health: gameState.player.health,
                armor: gameState.player.armor,
                weapon: gameState.player.weapon,
                ammo: { ...gameState.player.ammo },
                hasKey: gameState.player.hasKey
            },
            enemies: gameState.enemies.map(enemy => ({
                x: enemy.x,
                y: enemy.y,
                type: enemy.type,
                health: enemy.health,
                alive: enemy.alive
            })),
            items: gameState.items.map(item => ({
                x: item.x,
                y: item.y,
                type: item.type,
                value: item.value,
                collected: item.collected
            })),
            doors: gameState.doors.map(door => ({
                x: door.x,
                y: door.y,
                open: door.open
            })),
            kills: gameState.kills,
            level: gameState.currentLevel || 1
        };
        
        return Utils.saveToStorage(this.saveKey, saveData);
    }
    
    loadGame() {
        return Utils.loadFromStorage(this.saveKey);
    }
    
    hasSavedGame() {
        return this.loadGame() !== null;
    }
    
    deleteSave() {
        return Utils.removeFromStorage(this.saveKey);
    }
}

// Esempio 3: Sistema di Minimap
export class MinimapRenderer {
    constructor(canvas, mapData) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.mapData = mapData;
        this.scale = 8; // Pixel per tile della mappa
        this.playerSize = 3;
        this.enemySize = 2;
    }
    
    render(player, enemies, items) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sfondo
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mappa
        this.renderMap();
        
        // Oggetti
        this.renderItems(items);
        
        // Nemici
        this.renderEnemies(enemies);
        
        // Giocatore
        this.renderPlayer(player);
    }
    
    renderMap() {
        this.ctx.fillStyle = '#666';
        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                if (this.mapData[y][x] === 1) {
                    this.ctx.fillRect(
                        x * this.scale,
                        y * this.scale,
                        this.scale,
                        this.scale
                    );
                } else if (this.mapData[y][x] === 2) {
                    this.ctx.fillStyle = '#8B4513';
                    this.ctx.fillRect(
                        x * this.scale,
                        y * this.scale,
                        this.scale,
                        this.scale
                    );
                    this.ctx.fillStyle = '#666';
                }
            }
        }
    }
    
    renderPlayer(player) {
        const x = player.x * this.scale;
        const y = player.y * this.scale;
        
        // Corpo del giocatore
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.playerSize, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Direzione del giocatore
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x + Math.cos(player.angle) * this.playerSize * 2,
            y + Math.sin(player.angle) * this.playerSize * 2
        );
        this.ctx.stroke();
    }
    
    renderEnemies(enemies) {
        this.ctx.fillStyle = '#ff0000';
        enemies.forEach(enemy => {
            if (enemy.alive) {
                this.ctx.beginPath();
                this.ctx.arc(
                    enemy.x * this.scale,
                    enemy.y * this.scale,
                    this.enemySize,
                    0,
                    2 * Math.PI
                );
                this.ctx.fill();
            }
        });
    }
    
    renderItems(items) {
        items.forEach(item => {
            if (!item.collected) {
                const colors = {
                    health: '#ff69b4',
                    armor: '#4169E1',
                    ammo: '#ffaa00',
                    rocket: '#ff6600',
                    key: '#ffd700',
                    powerup: '#00ff00'
                };
                
                this.ctx.fillStyle = colors[item.type] || '#fff';
                this.ctx.fillRect(
                    item.x * this.scale - 1,
                    item.y * this.scale - 1,
                    2,
                    2
                );
            }
        });
    }
}

// Esempio 4: Sistema di Achievements
export class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.onAchievementUnlocked = null;
        
        this.initAchievements();
        this.loadProgress();
    }
    
    initAchievements() {
        this.achievements.set('first_kill', {
            name: 'Primo Sangue',
            description: 'Uccidi il tuo primo nemico',
            condition: (stats) => stats.kills >= 1
        });
        
        this.achievements.set('exterminator', {
            name: 'Sterminatore',
            description: 'Uccidi tutti i nemici',
            condition: (stats) => stats.allEnemiesKilled
        });
        
        this.achievements.set('pacifist', {
            name: 'Pacifista',
            description: 'Completa il livello senza uccidere nemici',
            condition: (stats) => stats.levelComplete && stats.kills === 0
        });
        
        this.achievements.set('collector', {
            name: 'Collezionista',
            description: 'Raccogli tutti gli oggetti',
            condition: (stats) => stats.allItemsCollected
        });
        
        this.achievements.set('speed_runner', {
            name: 'Velocista',
            description: 'Completa il livello in meno di 2 minuti',
            condition: (stats) => stats.levelComplete && stats.timeElapsed < 120000
        });
    }
    
    checkAchievements(gameStats) {
        for (let [id, achievement] of this.achievements) {
            if (!this.unlockedAchievements.has(id) && achievement.condition(gameStats)) {
                this.unlockAchievement(id);
            }
        }
    }
    
    unlockAchievement(id) {
        if (!this.unlockedAchievements.has(id)) {
            this.unlockedAchievements.add(id);
            this.saveProgress();
            
            const achievement = this.achievements.get(id);
            if (this.onAchievementUnlocked) {
                this.onAchievementUnlocked(achievement);
            }
        }
    }
    
    saveProgress() {
        Utils.saveToStorage('achievements', Array.from(this.unlockedAchievements));
    }
    
    loadProgress() {
        const saved = Utils.loadFromStorage('achievements', []);
        this.unlockedAchievements = new Set(saved);
    }
    
    getProgress() {
        return {
            total: this.achievements.size,
            unlocked: this.unlockedAchievements.size,
            percentage: (this.unlockedAchievements.size / this.achievements.size) * 100
        };
    }
}

// Esempio 5: Estensione Renderer per effetti avanzati
export class AdvancedRenderer {
    constructor(baseRenderer) {
        this.baseRenderer = baseRenderer;
        this.postProcessing = true;
        this.bloom = false;
        this.scanlines = false;
        this.pixelationFactor = 1;
    }
    
    render(player, enemies, items, doors, map, isDoorOpen) {
        // Render base
        this.baseRenderer.render(player, enemies, items, doors, map, isDoorOpen);
        
        if (this.postProcessing) {
            this.applyPostProcessing();
        }
    }
    
    applyPostProcessing() {
        const canvas = this.baseRenderer.canvas;
        const ctx = this.baseRenderer.ctx;
        
        if (this.pixelationFactor > 1) {
            this.applyPixelation(ctx, canvas.width, canvas.height);
        }
        
        if (this.scanlines) {
            this.applyScanlines(ctx, canvas.width, canvas.height);
        }
        
        if (this.bloom) {
            this.applyBloom(ctx, canvas.width, canvas.height);
        }
    }
    
    applyPixelation(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixelatedCanvas = Utils.createCanvas(
            width / this.pixelationFactor,
            height / this.pixelationFactor
        );
        const pixelatedCtx = pixelatedCanvas.getContext('2d');
        
        pixelatedCtx.putImageData(imageData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(pixelatedCanvas, 0, 0, width, height);
    }
    
    applyScanlines(ctx, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let y = 0; y < height; y += 2) {
            ctx.fillRect(0, y, width, 1);
        }
    }
    
    applyBloom(ctx, width, height) {
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(2px)';
        ctx.drawImage(ctx.canvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'none';
    }
    
    togglePostProcessing() {
        this.postProcessing = !this.postProcessing;
    }
    
    setPixelation(factor) {
        this.pixelationFactor = Math.max(1, factor);
    }
    
    toggleScanlines() {
        this.scanlines = !this.scanlines;
    }
    
    toggleBloom() {
        this.bloom = !this.bloom;
    }
}

// Esempio d'uso delle estensioni
export class ExtendedGameEngine {
    constructor(baseEngine) {
        this.baseEngine = baseEngine;
        this.audioSystem = new AudioSystem();
        this.saveSystem = new SaveSystem();
        this.achievementSystem = new AchievementSystem();
        
        this.initExtensions();
    }
    
    async initExtensions() {
        // Carica suoni
        await this.audioSystem.loadSound('shoot', 'sounds/shoot.mp3');
        await this.audioSystem.loadSound('reload', 'sounds/reload.mp3');
        await this.audioSystem.loadSound('pickup', 'sounds/pickup.mp3');
        
        // Setup achievement callbacks
        this.achievementSystem.onAchievementUnlocked = (achievement) => {
            this.showAchievementNotification(achievement);
            this.audioSystem.playSound('achievement');
        };
        
        // Setup minimap se presente
        const minimapCanvas = document.getElementById('minimap');
        if (minimapCanvas) {
            this.minimap = new MinimapRenderer(minimapCanvas, this.baseEngine.gameMap.map);
        }
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <h3>🏆 Achievement Unlocked!</h3>
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    update() {
        // Update base engine
        this.baseEngine.update();
        
        // Update extensions
        if (this.minimap) {
            this.minimap.render(
                this.baseEngine.player,
                this.baseEngine.enemyManager.enemies,
                this.baseEngine.gameMap.items
            );
        }
        
        // Check achievements
        const gameStats = {
            kills: this.baseEngine.kills,
            allEnemiesKilled: this.baseEngine.enemyManager.allEnemiesKilled(),
            levelComplete: this.baseEngine.gameState === 'victory',
            allItemsCollected: this.baseEngine.gameMap.items.every(item => item.collected),
            timeElapsed: Date.now() - this.baseEngine.startTime
        };
        
        this.achievementSystem.checkAchievements(gameStats);
    }
}
class DoomEngine {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Canvas size for game area (excluding HUD)
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight - 140; // 140px for HUD
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        
        this.gameState = 'menu';
        this.gameStarted = false;
        this.particles = [];
        this.kills = 0;
        this.totalEnemies = 6;
        this.powerupActive = false;
        this.powerupEndTime = 0;
        
        this.initPlayer();
        this.initGame();
        this.initControls();
        this.loadEnemySprites();
        this.loadItemSprites();
        
        this.updateCrosshairPosition();
        window.addEventListener('resize', () => this.updateCrosshairPosition());
    }
    
    updateCrosshairPosition() {
        const crosshair = document.getElementById('crosshair');
        const muzzleFlash = document.getElementById('muzzleFlash');
        
        // Position in center of game area (not including HUD)
        const centerX = this.gameWidth / 2;
        const centerY = this.gameHeight / 2;
        
        crosshair.style.left = (centerX - 12) + 'px';
        crosshair.style.top = (centerY - 12) + 'px';
        
        muzzleFlash.style.left = (centerX - 50) + 'px';
        muzzleFlash.style.top = (centerY - 50) + 'px';
    }
    
    async loadEnemySprites() {
        // Create enemy sprites using Canvas API
        this.enemySprites = {
            imp: this.createImpSprite(),
            demon: this.createDemonSprite(),
            guard: this.createGuardSprite()
        };
    }
    
    async loadItemSprites() {
        // Create detailed item sprites
        this.itemSprites = {
            health: this.createHealthSprite(),
            armor: this.createArmorSprite(),
            ammo: this.createAmmoSprite(),
            rocket: this.createRocketSprite(),
            key: this.createKeySprite(),
            powerup: this.createPowerupSprite()
        };
    }
    
    createHealthSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Medical cross background (white circle)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, 2 * Math.PI);
        ctx.fill();
        
        // Red cross
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(12, 6, 8, 20); // Vertical bar
        ctx.fillRect(6, 12, 20, 8); // Horizontal bar
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, 2 * Math.PI);
        ctx.stroke();
        
        return canvas;
    }
    
    createArmorSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Shield shape
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.moveTo(16, 2);
        ctx.lineTo(28, 8);
        ctx.lineTo(28, 20);
        ctx.lineTo(16, 30);
        ctx.lineTo(4, 20);
        ctx.lineTo(4, 8);
        ctx.closePath();
        ctx.fill();
        
        // Metallic sheen
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.moveTo(16, 2);
        ctx.lineTo(24, 6);
        ctx.lineTo(24, 16);
        ctx.lineTo(16, 26);
        ctx.lineTo(12, 18);
        ctx.lineTo(12, 8);
        ctx.closePath();
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#000080';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(16, 2);
        ctx.lineTo(28, 8);
        ctx.lineTo(28, 20);
        ctx.lineTo(16, 30);
        ctx.lineTo(4, 20);
        ctx.lineTo(4, 8);
        ctx.closePath();
        ctx.stroke();
        
        return canvas;
    }
    
    createAmmoSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Ammo box
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(4, 8, 24, 16);
        
        // Top
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(4, 8, 24, 4);
        
        // Labels
        ctx.fillStyle = '#ffaa00';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AMMO', 16, 18);
        
        // Border
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(4, 8, 24, 16);
        
        return canvas;
    }
    
    createRocketSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Rocket body
        ctx.fillStyle = '#696969';
        ctx.fillRect(8, 6, 16, 20);
        
        // Rocket tip
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(16, 2);
        ctx.lineTo(24, 6);
        ctx.lineTo(8, 6);
        ctx.closePath();
        ctx.fill();
        
        // Fins
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(4, 22, 6, 6);
        ctx.fillRect(22, 22, 6, 6);
        
        // Warning stripes
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(10, 10, 12, 2);
        ctx.fillRect(10, 15, 12, 2);
        ctx.fillRect(10, 20, 12, 2);
        
        return canvas;
    }
    
    createKeySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Key head (circular)
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(12, 12, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Key hole
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(12, 12, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Key shaft
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(20, 10, 8, 4);
        
        // Key teeth
        ctx.fillRect(26, 8, 4, 2);
        ctx.fillRect(26, 14, 4, 2);
        
        // Shine effect
        ctx.fillStyle = '#ffff99';
        ctx.beginPath();
        ctx.arc(10, 10, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(12, 12, 8, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeRect(20, 10, 8, 4);
        
        return canvas;
    }
    
    createPowerupSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Star shape for powerup
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        const cx = 16, cy = 16, spikes = 5, outerRadius = 14, innerRadius = 7;
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
        
        // Glow effect
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Center dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(16, 16, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        return canvas;
    }
    
    createImpSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Draw imp body (red demon)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(20, 40, 24, 20);
        
        // Head
        ctx.fillStyle = '#B22222';
        ctx.fillRect(24, 20, 16, 20);
        
        // Horns
        ctx.fillStyle = '#654321';
        ctx.fillRect(20, 16, 4, 8);
        ctx.fillRect(40, 16, 4, 8);
        
        // Eyes (glowing)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(26, 24, 4, 4);
        ctx.fillRect(34, 24, 4, 4);
        
        // Eye glow
        ctx.fillStyle = '#FFAAAA';
        ctx.fillRect(27, 25, 2, 2);
        ctx.fillRect(35, 25, 2, 2);
        
        // Arms
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(12, 32, 8, 16);
        ctx.fillRect(44, 32, 8, 16);
        
        // Claws
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(10, 44, 6, 4);
        ctx.fillRect(48, 44, 6, 4);
        
        return canvas;
    }
    
    createDemonSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Pink demon body
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(16, 36, 32, 24);
        
        // Head
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(20, 16, 24, 24);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(24, 22, 4, 6);
        ctx.fillRect(36, 22, 4, 6);
        
        // Mouth
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(26, 30, 12, 6);
        
        // Teeth
        ctx.fillStyle = '#FFF';
        ctx.fillRect(28, 30, 2, 4);
        ctx.fillRect(32, 30, 2, 4);
        ctx.fillRect(36, 30, 2, 4);
        
        // Muscle definition
        ctx.strokeStyle = '#C71585';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(16, 40);
        ctx.lineTo(48, 40);
        ctx.stroke();
        
        return canvas;
    }
    
    createGuardSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Guard uniform (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(20, 32, 24, 28);
        
        // Head
        ctx.fillStyle = '#FDBCB4';
        ctx.fillRect(24, 12, 16, 20);
        
        // Helmet
        ctx.fillStyle = '#2F4F2F';
        ctx.fillRect(22, 8, 20, 12);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(26, 18, 3, 3);
        ctx.fillRect(35, 18, 3, 3);
        
        // Weapon
        ctx.fillStyle = '#654321';
        ctx.fillRect(44, 20, 4, 20);
        
        // Weapon barrel
        ctx.fillStyle = '#333';
        ctx.fillRect(45, 15, 2, 5);
        
        // Boots
        ctx.fillStyle = '#000';
        ctx.fillRect(20, 56, 8, 8);
        ctx.fillRect(36, 56, 8, 8);
        
        return canvas;
    }
    
    initPlayer() {
        this.player = {
            x: 2.5,
            y: 2.5,
            angle: 0,
            health: 100,
            maxHealth: 100,
            armor: 0,
            maxArmor: 200,
            weapon: 1,
            ammo: {1: Infinity, 2: Infinity, 3: 50, 4: 200, 5: 10},
            maxAmmo: {1: Infinity, 2: Infinity, 3: 50, 4: 200, 5: 50},
            hasKey: false
        };
    }
    
    initGame() {
        this.weapons = {
            1: {name: 'PUGNI', damage: 20, range: 1.5, fireRate: 300, ammoType: 1}, // Aumentato il danno
            2: {name: 'PISTOLA', damage: 15, range: 15, fireRate: 400, ammoType: 2}, // Media gittata
            3: {name: 'FUCILE', damage: 70, range: 5, fireRate: 800, ammoType: 3, spread: 5, maxAmmo: 2}, // Gittata ridotta e 2 colpi
            4: {name: 'MINIGUN', damage: 20, range: 20, fireRate: 100, ammoType: 4},
            5: {name: 'LANCIARAZZI', damage: 100, range: 30, fireRate: 1000, ammoType: 5, splash: 3, maxAmmo: 1} // Gittata aumentata e danno alto
        };
        
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseLocked = false;
        this.lastShot = 0;
        this.muzzleFlashTime = 0;
        this.kills = 0;
        
        // Complete map with doors (2) and key area
        this.map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0,1], // Door at position 12,6
            [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,1,1,2,1,1,1,0,0,0,0,0,0,1], // Door at position 9,11
            [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        // Reset enemies with different types
        this.enemies = [
            {x: 4.5, y: 4.5, health: 30, maxHealth: 30, alive: true, lastShot: 0, moveTime: 0, targetX: 4.5, targetY: 4.5, angle: 0, type: 'imp'},
            {x: 15.5, y: 4.5, health: 50, maxHealth: 50, alive: true, lastShot: 0, moveTime: 0, targetX: 15.5, targetY: 15.5, angle: 0, type: 'demon'},
            {x: 4.5, y: 15.5, health: 40, maxHealth: 40, alive: true, lastShot: 0, moveTime: 0, targetX: 4.5, targetY: 15.5, angle: 0, type: 'guard'},
            {x: 15.5, y: 15.5, health: 30, maxHealth: 30, alive: true, lastShot: 0, moveTime: 0, targetX: 15.5, targetY: 15.5, angle: 0, type: 'imp'},
            {x: 9.5, y: 7.5, health: 60, maxHealth: 60, alive: true, lastShot: 0, moveTime: 0, targetX: 9.5, targetY: 7.5, angle: 0, type: 'demon'}, // Behind first door
            {x: 9.5, y: 13.5, health: 40, maxHealth: 40, alive: true, lastShot: 0, moveTime: 0, targetX: 9.5, targetY: 13.5, angle: 0, type: 'guard'} // Behind second door
        ];
        
        // Reset items including key and powerup
        this.items = [
            {x: 3.5, y: 3.5, type: 'health', value: 25, collected: false},
            {x: 16.5, y: 3.5, type: 'armor', value: 50, collected: false},
            {x: 3.5, y: 16.5, type: 'ammo', value: 20, collected: false},
            {x: 16.5, y: 16.5, type: 'health', value: 25, collected: false},
            {x: 10.5, y: 10.5, type: 'ammo', value: 30, collected: false},
            {x: 17.5, y: 17.5, type: 'rocket', value: 5, collected: false},
            {x: 18.5, y: 1.5, type: 'key', value: 1, collected: false}, // Key in corner
            {x: 1.5, y: 18.5, type: 'powerup', value: 10000, collected: false} // Powerup in opposite corner
        ];
        
        this.doors = [
            {x: 12, y: 6, open: false, opening: false, openAmount: 0},
            {x: 9, y: 11, open: false, opening: false, openAmount: 0}
        ];
        
        this.wallTextures = this.generateWallTextures();
        this.floorTexture = this.generateFloorTexture();
        this.ceilingTexture = this.generateCeilingTexture();
        this.particles = [];
    }
    
    generateWallTextures() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Base brick color
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, 64, 64);
        
        // Brick pattern with mortar
        ctx.fillStyle = '#654321';
        
        // Draw bricks
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const x = col * 16 + (row % 2 === 0 ? 0 : 8);
                const y = row * 16;
                
                // Brick
                ctx.fillRect(x, y, 15, 15);
                
                // Brick texture
                ctx.fillStyle = '#A0522D';
                ctx.fillRect(x + 1, y + 1, 13, 13);
                
                // Darker edges for depth
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(x + 12, y + 2, 2, 11);
                ctx.fillRect(x + 2, y + 12, 10, 2);
                
                // Reset color
                ctx.fillStyle = '#654321';
            }
        }
        
        // Mortar lines
        ctx.fillStyle = '#999';
        // Horizontal mortar
        for (let i = 0; i <= 4; i++) {
            ctx.fillRect(0, i * 16 - 1, 64, 2);
        }
        // Vertical mortar
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col <= 4; col++) {
                const x = col * 16 + (row % 2 === 0 ? 0 : 8) - 1;
                const y = row * 16;
                ctx.fillRect(x, y, 2, 16);
            }
        }
        
        return canvas;
    }
    
    generateFloorTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Base floor color (dark stone)
        ctx.fillStyle = '#2F4F2F';
        ctx.fillRect(0, 0, 64, 64);
        
        // Add texture
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            const size = Math.random() * 3 + 1;
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
            ctx.fillRect(x, y, size, size);
        }
        
        // Grid lines
        ctx.strokeStyle = '#1C1C1C';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 16, 0);
            ctx.lineTo(i * 16, 64);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * 16);
            ctx.lineTo(64, i * 16);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    generateCeilingTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Base ceiling color (stone)
        ctx.fillStyle = '#696969';
        ctx.fillRect(0, 0, 64, 64);
        
        // Stone pattern
        ctx.fillStyle = '#808080';
        
        // Create irregular stone blocks
        const stones = [
            {x: 0, y: 0, w: 20, h: 15},
            {x: 20, y: 0, w: 24, h: 18},
            {x: 44, y: 0, w: 20, h: 12},
            {x: 0, y: 15, w: 18, h: 20},
            {x: 18, y: 18, w: 22, h: 16},
            {x: 40, y: 12, w: 24, h: 22},
            {x: 0, y: 35, w: 25, h: 15},
            {x: 25, y: 34, w: 18, h: 18},
            {x: 43, y: 34, w: 21, h: 16},
            {x: 0, y: 50, w: 22, h: 14},
            {x: 22, y: 52, w: 20, h: 12},
            {x: 42, y: 50, w: 22, h: 14}
        ];
        
        stones.forEach(stone => {
            // Main stone block
            ctx.fillStyle = '#778899';
            ctx.fillRect(stone.x, stone.y, stone.w, stone.h);
            
            // Stone highlights
            ctx.fillStyle = '#B0C4DE';
            ctx.fillRect(stone.x + 1, stone.y + 1, stone.w - 4, stone.h - 4);
            
            // Stone shadows
            ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(stone.x + stone.w - 3, stone.y + 2, 2, stone.h - 2);
            ctx.fillRect(stone.x + 2, stone.y + stone.h - 3, stone.w - 4, 2);
        });
        
        // Mortar between stones
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 1;
        ctx.beginPath();
        stones.forEach(stone => {
            ctx.rect(stone.x, stone.y, stone.w, stone.h);
        });
        ctx.stroke();
        
        return canvas;
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.updateHUD();
            this.gameLoop();
        }
    }
    
    restartGame() {
        this.gameState = 'playing';
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('victoryScreen').style.display = 'none';
        
        // Reset everything completely
        this.initPlayer();
        this.initGame();
        this.updateHUD();
        
        // Restart the game loop if needed
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.gameLoop();
        }
    }
    
    showGameOver() {
        this.gameState = 'gameOver';
        document.getElementById('gameOverScreen').style.display = 'flex';
    }
    
    showVictory() {
        this.gameState = 'victory';
        document.getElementById('victoryScreen').style.display = 'flex';
    }
    
    initControls() {
        const startButton = document.getElementById('startButton');
        const restartButton = document.getElementById('restartButton');
        const victoryRestartButton = document.getElementById('victoryRestartButton');
        
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.startGame();
            });
        }
        
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.restartGame();
            });
        }
        
        if (victoryRestartButton) {
            victoryRestartButton.addEventListener('click', () => {
                this.restartGame();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;
            
            this.keys[e.code.toLowerCase()] = true;
            
            if (e.code === 'Digit1') this.switchWeapon(1);
            if (e.code === 'Digit2') this.switchWeapon(2);
            if (e.code === 'Digit3') this.switchWeapon(3);
            if (e.code === 'Digit4') this.switchWeapon(4);
            if (e.code === 'Digit5') this.switchWeapon(5);
            if (e.code === 'KeyR') this.reload();
            if (e.code === 'KeyE') this.useAction();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code.toLowerCase()] = false;
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState !== 'playing') return;
            
            if (!document.pointerLockElement) {
                this.canvas.requestPointerLock();
            } else {
                this.shoot();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            this.mouseLocked = document.pointerLockElement === this.canvas;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.mouseLocked && this.gameState === 'playing') {
                this.player.angle += e.movementX * 0.003;
            }
        });
        
        document.querySelectorAll('.weapon-slot').forEach(slot => {
            slot.addEventListener('click', (e) => {
                if (this.gameState !== 'playing') return;
                const weapon = parseInt(e.currentTarget.dataset.weapon);
                this.switchWeapon(weapon);
            });
        });
    }
    
    useAction() {
        // Check for doors nearby
        const playerX = Math.floor(this.player.x);
        const playerY = Math.floor(this.player.y);
        
        this.doors.forEach(door => {
            const dx = Math.abs(door.x - playerX);
            const dy = Math.abs(door.y - playerY);
            
            if (dx <= 1 && dy <= 1 && this.player.hasKey && !door.open) {
                this.openDoor(door);
            }
        });
    }
    
    openDoor(door) {
        if (door.opening) return;
        
        door.opening = true;
        const openInterval = setInterval(() => {
            door.openAmount += 0.1;
            if (door.openAmount >= 1) {
                door.openAmount = 1;
                door.open = true;
                door.opening = false;
                this.map[door.y][door.x] = 0; // Make walkable
                clearInterval(openInterval);
            }
        }, 50);
    }
    
    switchWeapon(weaponNum) {
        if (weaponNum >= 1 && weaponNum <= 5) {
            this.player.weapon = weaponNum;
            this.updateWeaponDisplay();
        }
    }
    
    reload() {
const weapon = this.weapons[this.player.weapon];

// Non ricaricare se l'arma non ha munizioni o è una delle armi senza munizioni (pugni e pistola)
if (weapon.ammoType === 1 || weapon.ammoType === 2) return;

// Ricarica per il fucile (shotgun)
if (weapon.ammoType === 3) {
if (this.player.ammo[weapon.ammoType] < weapon.maxAmmo) {
    this.player.ammo[weapon.ammoType] = Math.min(this.player.maxAmmo[weapon.ammoType], this.player.ammo[weapon.ammoType] + 2); // Ricarica 2 colpi
    this.updateHUD();
} else {
    this.showReloadMessage("Fucile già carico!"); // Messaggio di avviso
}
}

// Ricarica per il lanciarazzi
if (weapon.ammoType === 5) {
if (this.player.ammo[weapon.ammoType] < weapon.maxAmmo) {
    this.player.ammo[weapon.ammoType] = 1; // Ricarica 1 colpo
    this.updateHUD();
} else {
    this.showReloadMessage("Lanciarazzi già carico!"); // Messaggio di avviso
}
}
}

// Funzione per mostrare messaggi di avviso
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

document.getElementById('gameContainer').appendChild(messageBox);

// Rimuovi il messaggio dopo 2 secondi
setTimeout(() => {
messageBox.remove();
}, 2000);
}
    
    shoot() {
        const now = Date.now();
        const weapon = this.weapons[this.player.weapon];
        
        if (now - this.lastShot < weapon.fireRate) return;
        
        if (this.player.ammo[weapon.ammoType] <= 0 && weapon.ammoType !== 1 && weapon.ammoType !== 2) {
            return;
        }
        
        this.lastShot = now;
        this.muzzleFlashTime = now + 100;
        
        if (weapon.ammoType !== 1 && weapon.ammoType !== 2) {
            this.player.ammo[weapon.ammoType]--;
        }
        
        const muzzleFlash = document.getElementById('muzzleFlash');
        muzzleFlash.style.opacity = '0.8';
        setTimeout(() => {
            muzzleFlash.style.opacity = '0';
        }, 100);
        
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
            
            const result = this.castShot(shotAngle, weapon.range);
            
            if (result.hit) {
                let damage = weapon.damage;
                if (this.powerupActive) {
                    damage *= 2; // Double damage with powerup
                }
                
                if (result.type === 'enemy') {
                    result.enemy.health -= damage;
                    this.createBloodParticles(result.x, result.y);
                    
                    if (result.enemy.health <= 0 && result.enemy.alive) {
                        result.enemy.alive = false;
                        this.kills++;
                        this.updateKillCounter();
                        
                        // Check for victory
                        if (this.kills >= this.totalEnemies) {
                            setTimeout(() => this.showVictory(), 1000);
                        }
                    }
                } else if (result.type === 'wall') {
                    this.createWallParticles(result.x, result.y);
                }
                
                // Create bullet trail
                this.createBulletTrail(this.player.x, this.player.y, result.x, result.y);
            }
        }
        
        // Rocket splash damage
        if (weapon.splash && weapon.ammoType === 5) {
            const shotResult = this.castShot(centerAngle, weapon.range);
            if (shotResult.hit) {
                this.createExplosion(shotResult.x, shotResult.y, weapon.splash);
            }
        }
    }
    
    createExplosion(x, y, radius) {
        // Visual explosion effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle(
                    x + (Math.random() - 0.5) * radius,
                    y + (Math.random() - 0.5) * radius,
                    '#ff6600',
                    500,
                    'explosion'
                );
            }, i * 20);
        }
        
        // Damage enemies in radius
        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;
            
            const dx = enemy.x - x;
            const dy = enemy.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < radius) {
                const damage = Math.floor((1 - distance / radius) * 50);
                enemy.health -= damage;
                
                if (enemy.health <= 0 && enemy.alive) {
                    enemy.alive = false;
                    this.kills++;
                    this.updateKillCounter();
                }
            }
        });
    }
    
    castShot(angle, maxRange) {
        const rayDirX = Math.cos(angle);
        const rayDirY = Math.sin(angle);
        
        let rayX = this.player.x;
        let rayY = this.player.y;
        
        // Check enemies first
        for (let distance = 0; distance < maxRange; distance += 0.1) {
            rayX += rayDirX * 0.1;
            rayY += rayDirY * 0.1;
            
            // Check for enemy hits
            for (let enemy of this.enemies) {
                if (!enemy.alive) continue;
                
                const dx = enemy.x - rayX;
                const dy = enemy.y - rayY;
                const enemyDist = Math.sqrt(dx * dx + dy * dy);
                
                if (enemyDist < 0.3) {
                    return {
                        hit: true,
                        type: 'enemy',
                        enemy: enemy,
                        x: rayX,
                        y: rayY,
                        distance: distance
                    };
                }
            }
            
            // Check for wall hits
            const mapX = Math.floor(rayX);
            const mapY = Math.floor(rayY);
            
            if (mapX < 0 || mapX >= this.map[0].length || mapY < 0 || mapY >= this.map.length) {
                return {
                    hit: true,
                    type: 'wall',
                    x: rayX,
                    y: rayY,
                    distance: distance
                };
            }
            
            if (this.map[mapY][mapX] === 1 || this.map[mapY][mapX] === 2) {
                return {
                    hit: true,
                    type: 'wall',
                    x: rayX,
                    y: rayY,
                    distance: distance
                };
            }
        }
        
        return { hit: false };
    }
    
    createBulletTrail(startX, startY, endX, endY) {
        const steps = 10;
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            
            setTimeout(() => {
                this.createParticle(x, y, '#ffff00', 200, 'bullet');
            }, i * 20);
        }
    }
    
    createBloodParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createParticle(
                    x + (Math.random() - 0.5) * 0.5,
                    y + (Math.random() - 0.5) * 0.5,
                    '#ff0000',
                    1000,
                    'blood'
                );
            }, i * 50);
        }
    }
    
    createWallParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createParticle(
                    x + (Math.random() - 0.5) * 0.3,
                    y + (Math.random() - 0.5) * 0.3,
                    '#888',
                    800,
                    'wall'
                );
            }, i * 30);
        }
    }
    
    createParticle(worldX, worldY, color, duration, type) {
        // Convert world coordinates to screen coordinates
        const dx = worldX - this.player.x;
        const dy = worldY - this.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) - this.player.angle;
        
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
            
            if (type === 'blood') {
                particle.classList.add('blood-particle');
            } else if (type === 'wall') {
                particle.classList.add('wall-particle');
            } else if (type === 'explosion') {
                particle.style.width = '8px';
                particle.style.height = '8px';
            }
            
            document.getElementById('gameContainer').appendChild(particle);
            
            // Animate particle
            const moveX = (Math.random() - 0.5) * 100;
            const moveY = (Math.random() - 0.5) * 100;
            
            particle.style.transition = `all ${duration}ms ease-out`;
            particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            particle.style.opacity = '0';
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration);
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Check powerup status
        if (this.powerupActive && Date.now() > this.powerupEndTime) {
            this.powerupActive = false;
            document.getElementById('powerupIndicator').style.display = 'none';
        }
        
        const moveSpeed = this.powerupActive ? 0.08 : 0.05;
        const newX = this.player.x + (this.keys['keyw'] ? Math.cos(this.player.angle) * moveSpeed : 0) + 
                   (this.keys['keys'] ? -Math.cos(this.player.angle) * moveSpeed : 0) +
                   (this.keys['keya'] ? Math.sin(this.player.angle) * moveSpeed : 0) +
                   (this.keys['keyd'] ? -Math.sin(this.player.angle) * moveSpeed : 0);
                   
        const newY = this.player.y + (this.keys['keyw'] ? Math.sin(this.player.angle) * moveSpeed : 0) + 
                   (this.keys['keys'] ? -Math.sin(this.player.angle) * moveSpeed : 0) +
                   (this.keys['keya'] ? -Math.cos(this.player.angle) * moveSpeed : 0) +
                   (this.keys['keyd'] ? Math.cos(this.player.angle) * moveSpeed : 0);
        
        // Check collision with walls and closed doors
        const mapX = Math.floor(newX);
        const mapY = Math.floor(newY);
        
        if (mapX >= 0 && mapX < this.map[0].length && mapY >= 0 && mapY < this.map.length) {
            const tile = this.map[mapY][mapX];
            if (tile === 0 || (tile === 2 && this.isDoorOpen(mapX, mapY))) {
                this.player.x = newX;
                this.player.y = newY;
            }
        }
        
        // Check for item collection
        this.items.forEach(item => {
            if (item.collected) return;
            
            const dx = item.x - this.player.x;
            const dy = item.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 0.5) {
                this.collectItem(item);
            }
        });
        
        // Enhanced enemy AI with wall collision detection
        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;
            
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if enemy can see player (line of sight)
            const canSeePlayer = this.hasLineOfSight(enemy.x, enemy.y, this.player.x, this.player.y);
            
            // Move towards player if close and can see them
            if (distance < 8 && distance > 1 && canSeePlayer) {
                const moveSpeed = enemy.type === 'demon' ? 0.03 : 0.02;
                const moveX = enemy.x + (dx / distance) * moveSpeed;
                const moveY = enemy.y + (dy / distance) * moveSpeed;
                
                // Check collision with walls and doors
                const mapX = Math.floor(moveX);
                const mapY = Math.floor(moveY);
                
                if (mapX >= 0 && mapX < this.map[0].length && mapY >= 0 && mapY < this.map.length) {
                    const tile = this.map[mapY][mapX];
                    if (tile === 0 || (tile === 2 && this.isDoorOpen(mapX, mapY))) {
                        enemy.x = moveX;
                        enemy.y = moveY;
                    }
                }
            }
            
            // Attack player only if can see them and close enough
            if (distance < 5 && canSeePlayer && Date.now() - enemy.lastShot > (enemy.type === 'guard' ? 1500 : 2000)) {
                enemy.lastShot = Date.now();
                const damage = enemy.type === 'demon' ? 15 : enemy.type === 'guard' ? 12 : 10;
                
                if (this.player.armor > 0) {
                    const absorbed = Math.min(damage / 2, this.player.armor);
                    this.player.armor -= absorbed;
                    this.player.health -= (damage - absorbed);
                } else {
                    this.player.health -= damage;
                }
                
                this.showDamage();
                
                if (this.player.health <= 0) {
                    this.showGameOver();
                }
            }
        });
        
        this.updateHUD();
    }
    
    // Line of sight check - prevents seeing/attacking through walls
    hasLineOfSight(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(distance * 10); // More steps for accuracy
        
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const checkX = x1 + dx * t;
            const checkY = y1 + dy * t;
            
            const mapX = Math.floor(checkX);
            const mapY = Math.floor(checkY);
            
            // Check bounds
            if (mapX < 0 || mapX >= this.map[0].length || mapY < 0 || mapY >= this.map.length) {
                return false;
            }
            
            const tile = this.map[mapY][mapX];
            // Blocked by walls or closed doors
            if (tile === 1 || (tile === 2 && !this.isDoorOpen(mapX, mapY))) {
                return false;
            }
        }
        
        return true;
    }
    
    isDoorOpen(x, y) {
        const door = this.doors.find(d => d.x === x && d.y === y);
        return door ? door.open : false;
    }
    
    collectItem(item) {
        item.collected = true;
        
        switch(item.type) {
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + item.value);
                break;
            case 'armor':
                this.player.armor = Math.min(this.player.maxArmor, this.player.armor + item.value);
                break;
            case 'ammo':
                this.player.ammo[3] = Math.min(this.player.maxAmmo[3], this.player.ammo[3] + item.value);
                this.player.ammo[4] = Math.min(this.player.maxAmmo[4], this.player.ammo[4] + item.value);
                break;
            case 'rocket':
                this.player.ammo[5] = Math.min(this.player.maxAmmo[5], this.player.ammo[5] + item.value);
                break;
            case 'key':
                this.player.hasKey = true;
                this.updateInventory();
                break;
            case 'powerup':
                this.powerupActive = true;
                this.powerupEndTime = Date.now() + item.value;
                document.getElementById('powerupIndicator').style.display = 'block';
                break;
        }
    }
    
    updateInventory() {
        const keyStatus = document.getElementById('keyStatus');
        if (this.player.hasKey) {
            keyStatus.innerHTML = '🗝️ Chiave: <span style="color: #00ff00">SÌ</span>';
        } else {
            keyStatus.innerHTML = '🗝️ Chiave: <span style="color: #ff0000">NO</span>';
        }
    }
    
    updateKillCounter() {
        document.getElementById('kills').textContent = this.kills;
        document.getElementById('totalEnemies').textContent = this.totalEnemies;
    }
    
    showDamage() {
        const overlay = document.getElementById('damageOverlay');
        overlay.style.opacity = '1';
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 300);
    }
    
    castRay(angle) {
        const rayDirX = Math.cos(angle);
        const rayDirY = Math.sin(angle);
        
        let rayX = this.player.x;
        let rayY = this.player.y;
        
        for (let distance = 0; distance < 25; distance += 0.05) {
            rayX += rayDirX * 0.05;
            rayY += rayDirY * 0.05;
            
            const mapX = Math.floor(rayX);
            const mapY = Math.floor(rayY);
            
            if (mapX < 0 || mapX >= this.map[0].length || mapY < 0 || mapY >= this.map.length) {
                return distance;
            }
            
            const tile = this.map[mapY][mapX];
            if (tile === 1 || (tile === 2 && !this.isDoorOpen(mapX, mapY))) {
                return distance;
            }
        }
        
        return 25;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Render floor and ceiling
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.gameHeight);
        gradient.addColorStop(0, '#696969');
        gradient.addColorStop(0.5, '#000');
        gradient.addColorStop(1, '#2F4F2F');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Cast rays for walls
        const numRays = this.gameWidth / 2;
        const fov = Math.PI / 3;
        
        for (let i = 0; i < numRays; i++) {
            const rayAngle = this.player.angle - fov / 2 + (i / numRays) * fov;
            const distance = this.castRay(rayAngle);
            
            const wallHeight = Math.min(this.gameHeight, this.gameHeight / distance);
            const wallTop = (this.gameHeight - wallHeight) / 2;
            
            // Darken walls based on distance
            const darkness = Math.min(1, distance / 15);
            const brightness = 1 - darkness;
            
            this.ctx.fillStyle = `rgb(${Math.floor(139 * brightness)}, ${Math.floor(69 * brightness)}, ${Math.floor(19 * brightness)})`;
            this.ctx.fillRect(i * 2, wallTop, 2, wallHeight);
        }
        
        // Render items
        this.items.forEach(item => {
            if (item.collected) return;
            
            const dx = item.x - this.player.x;
            const dy = item.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) - this.player.angle;
            
            let normalizedAngle = angle;
            while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
            while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;
            
            if (Math.abs(normalizedAngle) < Math.PI / 3 && this.hasLineOfSight(this.player.x, this.player.y, item.x, item.y)) {
                const screenX = (normalizedAngle / (Math.PI / 3)) * (this.gameWidth / 2) + (this.gameWidth / 2);
                const size = Math.max(10, 40 / distance);
                
                if (this.itemSprites && this.itemSprites[item.type]) {
                    this.ctx.drawImage(
                        this.itemSprites[item.type],
                        screenX - size/2,
                        this.gameHeight/2 - size/2,
                        size,
                        size
                    );
                }
            }
        });
        
        // Render enemies with sprites
        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;
            
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) - this.player.angle;
            
            let normalizedAngle = angle;
            while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
            while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;
            
            // Only render if enemy is visible (line of sight) and in field of view
            if (Math.abs(normalizedAngle) < Math.PI / 3 && this.hasLineOfSight(this.player.x, this.player.y, enemy.x, enemy.y)) {
                const screenX = (normalizedAngle / (Math.PI / 3)) * (this.gameWidth / 2) + (this.gameWidth / 2);
                const size = Math.max(20, 150 / distance);
                
                // Enemy health bar
                const healthPercent = enemy.health / enemy.maxHealth;
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(screenX - size/2, this.gameHeight/2 - size - 30, size, 5);
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(screenX - size/2, this.gameHeight/2 - size - 30, size * healthPercent, 5);
                
                // Draw enemy sprite
                if (this.enemySprites && this.enemySprites[enemy.type]) {
                    this.ctx.drawImage(
                        this.enemySprites[enemy.type],
                        screenX - size/2,
                        this.gameHeight/2 - size/2,
                        size,
                        size
                    );
                } else {
                    // Fallback colored rectangle
                    const colors = {imp: '#8B0000', demon: '#FF69B4', guard: '#8B4513'};
                    this.ctx.fillStyle = colors[enemy.type] || '#ff0000';
                    this.ctx.fillRect(screenX - size/2, this.gameHeight/2 - size/2, size, size);
                }
            }
        });
        
        // Render doors with enhanced graphics
        this.doors.forEach(door => {
            if (door.open) return;
            
            const dx = door.x + 0.5 - this.player.x;
            const dy = door.y + 0.5 - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) - this.player.angle;
            
            let normalizedAngle = angle;
            while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
            while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;
            
            if (Math.abs(normalizedAngle) < Math.PI / 3) {
                const screenX = (normalizedAngle / (Math.PI / 3)) * (this.gameWidth / 2) + (this.gameWidth / 2);
                const size = Math.max(10, 100 / distance);
                
                // Door with wood texture
                this.ctx.fillStyle = door.opening ? '#654321' : '#8B4513';
                this.ctx.fillRect(screenX - size/2, this.gameHeight/2 - size/2, size * (1 - door.openAmount), size);
                
                // Door panels (vertical lines)
                this.ctx.fillStyle = '#5D4037';
                const panelWidth = (size * (1 - door.openAmount)) / 4;
                for (let i = 1; i < 4; i++) {
                    this.ctx.fillRect(screenX - size/2 + i * panelWidth, this.gameHeight/2 - size/2 + 5, 2, size - 10);
                }
                
                // Door handle
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(screenX + size/3, this.gameHeight/2 - 2, 4, 4);
                
                // Door frame
                this.ctx.strokeStyle = '#654321';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(screenX - size/2, this.gameHeight/2 - size/2, size * (1 - door.openAmount), size);
            }
        });
    }
    
    updateHUD() {
        document.getElementById('health').textContent = Math.max(0, Math.floor(this.player.health));
        document.getElementById('armor').textContent = Math.max(0, Math.floor(this.player.armor));
        
        const weapon = this.weapons[this.player.weapon];
        const ammo = this.player.ammo[weapon.ammoType];
        document.getElementById('ammo').textContent = ammo === Infinity ? '∞' : ammo;
        
        const ammoFill = document.getElementById('ammoFill');
        if (ammo === Infinity) {
            ammoFill.style.width = '100%';
        } else {
            const maxAmmo = this.player.maxAmmo[weapon.ammoType];
            const percentage = (ammo / maxAmmo) * 100;
            ammoFill.style.width = percentage + '%';
        }
        
        this.updateWeaponDisplay();
        this.updateInventory();
        this.updateKillCounter();
    }
    
    updateWeaponDisplay() {
        const weapon = this.weapons[this.player.weapon];
        document.getElementById('weaponIcon').textContent = weapon.name.substring(0, 8);
        document.getElementById('weaponName').textContent = weapon.name;
        
        document.querySelectorAll('.weapon-slot').forEach((slot, index) => {
            if (index + 1 === this.player.weapon) {
                slot.classList.add('active');
            } else {
                slot.classList.remove('active');
            }
        });
    }
    
    gameLoop() {
        this.update();
        this.render();
        
        if (this.gameState === 'playing') {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new DoomEngine();
});

if (document.readyState !== 'loading') {
    window.game = new DoomEngine();
}
// Renderer.js - Sistema di rendering
export class Renderer {
    constructor(canvas, gameWidth, gameHeight) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        this.loadTextures();
        this.loadSprites();
    }
    
    async loadTextures() {
        this.wallTextures = this.generateWallTextures();
        this.floorTexture = this.generateFloorTexture();
        this.ceilingTexture = this.generateCeilingTexture();
    }
    
    async loadSprites() {
        this.enemySprites = {
            imp: this.createImpSprite(),
            demon: this.createDemonSprite(),
            guard: this.createGuardSprite()
        };
        
        this.itemSprites = {
            health: this.createHealthSprite(),
            armor: this.createArmorSprite(),
            ammo: this.createAmmoSprite(),
            rocket: this.createRocketSprite(),
            key: this.createKeySprite(),
            powerup: this.createPowerupSprite()
        };
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
    
    castRay(playerX, playerY, angle, map, isDoorOpen) {
        const rayDirX = Math.cos(angle);
        const rayDirY = Math.sin(angle);
        
        let rayX = playerX;
        let rayY = playerY;
        
        for (let distance = 0; distance < 25; distance += 0.05) {
            rayX += rayDirX * 0.05;
            rayY += rayDirY * 0.05;
            
            const mapX = Math.floor(rayX);
            const mapY = Math.floor(rayY);
            
            if (mapX < 0 || mapX >= map[0].length || mapY < 0 || mapY >= map.length) {
                return distance;
            }
            
            const tile = map[mapY][mapX];
            if (tile === 1 || (tile === 2 && !isDoorOpen(mapX, mapY))) {
                return distance;
            }
        }
        
        return 25;
    }
    
    hasLineOfSight(x1, y1, x2, y2, map, isDoorOpen) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(distance * 10);
        
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const checkX = x1 + dx * t;
            const checkY = y1 + dy * t;
            
            const mapX = Math.floor(checkX);
            const mapY = Math.floor(checkY);
            
            if (mapX < 0 || mapX >= map[0].length || mapY < 0 || mapY >= map.length) {
                return false;
            }
            
            const tile = map[mapY][mapX];
            if (tile === 1 || (tile === 2 && !isDoorOpen(mapX, mapY))) {
                return false;
            }
        }
        
        return true;
    }
    
    render(player, enemies, items, doors, map, isDoorOpen) {
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
            const rayAngle = player.angle - fov / 2 + (i / numRays) * fov;
            const distance = this.castRay(player.x, player.y, rayAngle, map, isDoorOpen);
            
            const wallHeight = Math.min(this.gameHeight, this.gameHeight / distance);
            const wallTop = (this.gameHeight - wallHeight) / 2;
            
            // Darken walls based on distance
            const darkness = Math.min(1, distance / 15);
            const brightness = 1 - darkness;
            
            this.ctx.fillStyle = `rgb(${Math.floor(139 * brightness)}, ${Math.floor(69 * brightness)}, ${Math.floor(19 * brightness)})`;
            this.ctx.fillRect(i * 2, wallTop, 2, wallHeight);
        }
        
        // Render items
        this.renderItems(player, items);
        
        // Render enemies
        this.renderEnemies(player, enemies);
        
        // Render doors
        this.renderDoors(player, doors);
    }
    
    renderItems(player, items) {
        items.forEach(item => {
            if (item.collected) return;
            
            const dx = item.x - player.x;
            const dy = item.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) - player.angle;
            
            let normalizedAngle = angle;
            while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
            while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;
            
            if (Math.abs(normalizedAngle) < Math.PI / 3) {
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
    }
    
    renderEnemies(player, enemies) {
        enemies.forEach(enemy => {
            if (!enemy.alive) return;
            
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) - player.angle;
            
            let normalizedAngle = angle;
            while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
            while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;
            
            if (Math.abs(normalizedAngle) < Math.PI / 3) {
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
                }
            }
        });
    }
    
    renderDoors(player, doors) {
        doors.forEach(door => {
            if (door.open) return;
            
            const dx = door.x + 0.5 - player.x;
            const dy = door.y + 0.5 - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) - player.angle;
            
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
    
    // Include all sprite creation methods...
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
        ctx.fillRect(12, 6, 8, 20);
        ctx.fillRect(6, 12, 20, 8);
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, 2 * Math.PI);
        ctx.stroke();
        
        return canvas;
    }
    
    // ... (include all other sprite creation methods from original)
    
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
}
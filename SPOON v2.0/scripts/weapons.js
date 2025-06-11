// Weapons.js - Sistema delle armi e combattimento
export class WeaponSystem {
    constructor() {
        this.weapons = {
            1: {name: 'PUGNI', damage: 20, range: 1.5, fireRate: 300, ammoType: 1},
            2: {name: 'PISTOLA', damage: 15, range: 15, fireRate: 400, ammoType: 2},
            3: {name: 'FUCILE', damage: 70, range: 5, fireRate: 800, ammoType: 3, spread: 5, maxAmmo: 2},
            4: {name: 'MINIGUN', damage: 20, range: 20, fireRate: 100, ammoType: 4},
            5: {name: 'LANCIARAZZI', damage: 100, range: 30, fireRate: 1000, ammoType: 5, splash: 3, maxAmmo: 1}
        };
        
        this.lastShot = 0;
    }
    
    getWeapon(weaponNum) {
        return this.weapons[weaponNum];
    }
    
    canFire(weaponNum) {
        const weapon = this.weapons[weaponNum];
        const now = Date.now();
        return now - this.lastShot >= weapon.fireRate;
    }
    
    fire(weaponNum) {
        if (!this.canFire(weaponNum)) return false;
        
        this.lastShot = Date.now();
        return true;
    }
    
    castShot(playerX, playerY, angle, maxRange, map, enemies) {
        const rayDirX = Math.cos(angle);
        const rayDirY = Math.sin(angle);
        
        let rayX = playerX;
        let rayY = playerY;
        
        // Check enemies first
        for (let distance = 0; distance < maxRange; distance += 0.1) {
            rayX += rayDirX * 0.1;
            rayY += rayDirY * 0.1;
            
            // Check for enemy hits
            for (let enemy of enemies) {
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
            
            if (mapX < 0 || mapX >= map[0].length || mapY < 0 || mapY >= map.length) {
                return {
                    hit: true,
                    type: 'wall',
                    x: rayX,
                    y: rayY,
                    distance: distance
                };
            }
            
            if (map[mapY][mapX] === 1 || map[mapY][mapX] === 2) {
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
    
    calculateSplashDamage(explosionX, explosionY, radius, enemies, baseDamage) {
        const damagedEnemies = [];
        
        enemies.forEach(enemy => {
            if (!enemy.alive) return;
            
            const dx = enemy.x - explosionX;
            const dy = enemy.y - explosionY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < radius) {
                const damage = Math.floor((1 - distance / radius) * baseDamage);
                damagedEnemies.push({ enemy, damage });
            }
        });
        
        return damagedEnemies;
    }
}
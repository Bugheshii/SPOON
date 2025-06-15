// Enemy.js - Gestione nemici e AI
export class Enemy {
    constructor(x, y, type, health) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.health = health;
        this.maxHealth = health;
        this.alive = true;
        this.lastShot = 0;
        this.moveTime = 0;
        this.targetX = x;
        this.targetY = y;
        this.angle = 0;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0 && this.alive) {
            this.alive = false;
            return true; // Enemy killed
        }
        return false;
    }
    
    getDamage() {
        const damages = {
            imp: 10,
            demon: 15,
            guard: 12
        };
        return damages[this.type] || 10;
    }
    
    getAttackRate() {
        const rates = {
            imp: 2000,
            demon: 2000,
            guard: 1500
        };
        return rates[this.type] || 2000;
    }
    
    getMoveSpeed() {
        const speeds = {
            imp: 0.02,
            demon: 0.03,
            guard: 0.02
        };
        return speeds[this.type] || 0.02;
    }
}

export class EnemyManager {
    constructor() {
        this.enemies = [];
        this.totalEnemies = 0;
    }
    
    initEnemies() {
        this.enemies = [
            new Enemy(4.5, 4.5, 'imp', 30),
            new Enemy(15.5, 4.5, 'demon', 50),
            new Enemy(4.5, 15.5, 'guard', 40),
            new Enemy(15.5, 15.5, 'imp', 30),
            new Enemy(9.5, 7.5, 'demon', 60),
            new Enemy(9.5, 13.5, 'guard', 40)
        ];
        this.totalEnemies = this.enemies.length;
    }
    
    updateEnemies(player, map, isDoorOpen, hasLineOfSight) {
        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;
            
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if enemy can see player
            const canSeePlayer = hasLineOfSight(enemy.x, enemy.y, player.x, player.y);
            
            // Move towards player if close and can see them
            if (distance < 8 && distance > 1 && canSeePlayer) {
                const moveSpeed = enemy.getMoveSpeed();
                const moveX = enemy.x + (dx / distance) * moveSpeed;
                const moveY = enemy.y + (dy / distance) * moveSpeed;
                
                // Check collision with walls and doors
                if (this.canMoveTo(moveX, moveY, map, isDoorOpen)) {
                    enemy.x = moveX;
                    enemy.y = moveY;
                }
            }
            
            // Attack player if close enough and can see them
            if (distance < 5 && canSeePlayer && Date.now() - enemy.lastShot > enemy.getAttackRate()) {
                enemy.lastShot = Date.now();
                return {
                    enemyAttack: true,
                    enemy: enemy,
                    damage: enemy.getDamage()
                };
            }
        });
        
        return { enemyAttack: false };
    }
    
    canMoveTo(x, y, map, isDoorOpen) {
        const mapX = Math.floor(x);
        const mapY = Math.floor(y);
        
        if (mapX < 0 || mapX >= map[0].length || mapY < 0 || mapY >= map.length) {
            return false;
        }
        
        const tile = map[mapY][mapX];
        return tile === 0 || (tile === 2 && isDoorOpen(mapX, mapY));
    }
    
    damageEnemy(enemy, damage) {
        const killed = enemy.takeDamage(damage);
        if (killed) {
            return true; // Enemy was killed
        }
        return false;
    }
    
    getAliveEnemies() {
        return this.enemies.filter(enemy => enemy.alive);
    }
    
    getKillCount() {
        return this.enemies.filter(enemy => !enemy.alive).length;
    }
    
    allEnemiesKilled() {
        return this.getAliveEnemies().length === 0;
    }
    
    reset() {
        this.initEnemies();
    }
}
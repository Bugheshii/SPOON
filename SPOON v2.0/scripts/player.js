// Player.js - Gestione del giocatore
export class Player {
    constructor(x = 2.5, y = 2.5) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.armor = 0;
        this.maxArmor = 200;
        this.weapon = 1;
        this.ammo = {1: Infinity, 2: Infinity, 3: 50, 4: 200, 5: 10};
        this.maxAmmo = {1: Infinity, 2: Infinity, 3: 50, 4: 200, 5: 50};
        this.hasKey = false;
    }
    
    move(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
    
    rotate(angle) {
        this.angle += angle;
    }
    
    takeDamage(damage) {
        if (this.armor > 0) {
            const absorbed = Math.min(damage / 2, this.armor);
            this.armor -= absorbed;
            this.health -= (damage - absorbed);
        } else {
            this.health -= damage;
        }
        
        return this.health <= 0;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    addArmor(amount) {
        this.armor = Math.min(this.maxArmor, this.armor + amount);
    }
    
    addAmmo(type, amount) {
        if (this.maxAmmo[type] !== Infinity) {
            this.ammo[type] = Math.min(this.maxAmmo[type], this.ammo[type] + amount);
        }
    }
    
    switchWeapon(weaponNum) {
        if (weaponNum >= 1 && weaponNum <= 5) {
            this.weapon = weaponNum;
            return true;
        }
        return false;
    }
    
    canShoot(weapon) {
        return this.ammo[weapon.ammoType] > 0 || weapon.ammoType === 1 || weapon.ammoType === 2;
    }
    
    consumeAmmo(weapon) {
        if (weapon.ammoType !== 1 && weapon.ammoType !== 2) {
            this.ammo[weapon.ammoType]--;
        }
    }
    
    reload(weapon) {
        if (weapon.ammoType === 1 || weapon.ammoType === 2) return false;
        
        if (weapon.ammoType === 3) {
            if (this.ammo[weapon.ammoType] < weapon.maxAmmo) {
                this.ammo[weapon.ammoType] = Math.min(this.maxAmmo[weapon.ammoType], this.ammo[weapon.ammoType] + 2);
                return true;
            }
        }
        
        if (weapon.ammoType === 5) {
            if (this.ammo[weapon.ammoType] < weapon.maxAmmo) {
                this.ammo[weapon.ammoType] = 1;
                return true;
            }
        }
        
        return false;
    }
}
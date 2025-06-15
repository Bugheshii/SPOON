// GameMap.js - Gestione mappa, porte e oggetti
export class GameMap {
    constructor() {
        this.map = [];
        this.doors = [];
        this.items = [];
        
        this.initMap();
        this.initDoors();
        this.initItems();
    }
    
    initMap() {
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
    }
    
    initDoors() {
        this.doors = [
            {x: 12, y: 6, open: false, opening: false, openAmount: 0},
            {x: 9, y: 11, open: false, opening: false, openAmount: 0}
        ];
    }
    
    initItems() {
        this.items = [
            {x: 3.5, y: 3.5, type: 'health', value: 25, collected: false},
            {x: 16.5, y: 3.5, type: 'armor', value: 50, collected: false},
            {x: 3.5, y: 16.5, type: 'ammo', value: 20, collected: false},
            {x: 16.5, y: 16.5, type: 'health', value: 25, collected: false},
            {x: 10.5, y: 10.5, type: 'ammo', value: 30, collected: false},
            {x: 17.5, y: 17.5, type: 'rocket', value: 5, collected: false},
            {x: 18.5, y: 1.5, type: 'key', value: 1, collected: false},
            {x: 1.5, y: 18.5, type: 'powerup', value: 10000, collected: false}
        ];
    }
    
    getTile(x, y) {
        if (x < 0 || x >= this.map[0].length || y < 0 || y >= this.map.length) {
            return 1; // Wall if out of bounds
        }
        return this.map[y][x];
    }
    
    isWalkable(x, y) {
        const tile = this.getTile(Math.floor(x), Math.floor(y));
        return tile === 0 || (tile === 2 && this.isDoorOpen(Math.floor(x), Math.floor(y)));
    }
    
    isDoorOpen(x, y) {
        const door = this.doors.find(d => d.x === x && d.y === y);
        return door ? door.open : false;
    }
    
    getDoor(x, y) {
        return this.doors.find(d => d.x === x && d.y === y);
    }
    
    openDoor(door) {
        if (door.opening || door.open) return false;
        
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
        
        return true;
    }
    
    checkDoorInteraction(playerX, playerY, hasKey) {
        const playerTileX = Math.floor(playerX);
        const playerTileY = Math.floor(playerY);
        
        for (let door of this.doors) {
            const dx = Math.abs(door.x - playerTileX);
            const dy = Math.abs(door.y - playerTileY);
            
            if (dx <= 1 && dy <= 1 && hasKey && !door.open) {
                return door;
            }
        }
        
        return null;
    }
    
    checkItemCollection(playerX, playerY) {
        const collectedItems = [];
        
        this.items.forEach(item => {
            if (item.collected) return;
            
            const dx = item.x - playerX;
            const dy = item.y - playerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 0.5) {
                item.collected = true;
                collectedItems.push(item);
            }
        });
        
        return collectedItems;
    }
    
    getMapDimensions() {
        return {
            width: this.map[0].length,
            height: this.map.length
        };
    }
    
    resetItems() {
        this.items.forEach(item => {
            item.collected = false;
        });
    }
    
    resetDoors() {
        this.doors.forEach(door => {
            door.open = false;
            door.opening = false;
            door.openAmount = 0;
        });
        
        // Reset door tiles in map
        this.doors.forEach(door => {
            this.map[door.y][door.x] = 2;
        });
    }
    
    reset() {
        this.resetItems();
        this.resetDoors();
    }
    
    // Utility method for pathfinding or AI
    getNeighbors(x, y) {
        const neighbors = [];
        const directions = [
            {dx: -1, dy: 0}, {dx: 1, dy: 0},
            {dx: 0, dy: -1}, {dx: 0, dy: 1}
        ];
        
        directions.forEach(dir => {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            
            if (this.isWalkable(newX, newY)) {
                neighbors.push({x: newX, y: newY});
            }
        });
        
        return neighbors;
    }
    
    // Check if there's a clear path between two points (for line of sight)
    hasLineOfSight(x1, y1, x2, y2) {
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
            
            const tile = this.getTile(mapX, mapY);
            if (tile === 1 || (tile === 2 && !this.isDoorOpen(mapX, mapY))) {
                return false;
            }
        }
        
        return true;
    }
}
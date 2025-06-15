// Config.js - Configurazione centrale del gioco
export const GameConfig = {
    // Impostazioni display
    HUD_HEIGHT: 140,
    FOV: Math.PI / 3,
    RENDER_DISTANCE: 25,
    RAY_STEP: 0.05,
    
    // Impostazioni movimento
    MOVE_SPEED: 0.05,
    MOVE_SPEED_POWERUP: 0.08,
    MOUSE_SENSITIVITY: 0.003,
    
    // Impostazioni combattimento
    COLLISION_RADIUS: 0.3,
    ITEM_COLLECTION_RADIUS: 0.5,
    DOOR_INTERACTION_RADIUS: 1,
    
    // Valori damage overlay
    DAMAGE_OVERLAY_DURATION: 300,
    MUZZLE_FLASH_DURATION: 100,
    
    // Particelle
    BLOOD_PARTICLES: 8,
    WALL_PARTICLES: 5,
    EXPLOSION_PARTICLES: 20,
    BULLET_TRAIL_STEPS: 10,
    
    // Timing delle particelle
    BLOOD_DELAY: 50,
    WALL_DELAY: 30,
    EXPLOSION_DELAY: 20,
    BULLET_DELAY: 20,
    
    // Durata particelle
    BLOOD_DURATION: 1000,
    WALL_DURATION: 800,
    EXPLOSION_DURATION: 500,
    BULLET_DURATION: 200,
    
    // Colori
    COLORS: {
        BLOOD: '#ff0000',
        WALL_PARTICLES: '#888',
        EXPLOSION: '#ff6600',
        BULLET_TRAIL: '#ffff00',
        HEALTH_BAR_FULL: '#00ff00',
        HEALTH_BAR_EMPTY: '#ff0000'
    },
    
    // Messaggi UI
    MESSAGES: {
        RELOAD_SHOTGUN_FULL: "Fucile già carico!",
        RELOAD_ROCKET_FULL: "Lanciarazzi già carico!",
        NO_AMMO: "Munizioni finite!",
        DOOR_OPENED: "Porta aperta!",
        KEY_OBTAINED: "Chiave ottenuta!",
        POWERUP_ACTIVE: "POTENZIAMENTO ATTIVO!",
        HEALTH_PICKUP: "Salute",
        ARMOR_PICKUP: "Armatura", 
        AMMO_PICKUP: "Munizioni",
        ROCKET_PICKUP: "Razzi"
    },
    
    // Durata messaggi
    MESSAGE_DURATIONS: {
        SHORT: 1500,
        MEDIUM: 2000,
        LONG: 2500
    },
    
    // Impostazioni nemici
    ENEMY_CONFIG: {
        VISION_RANGE: 8,
        ATTACK_RANGE: 5,
        MIN_DISTANCE: 1,
        LINE_OF_SIGHT_STEPS: 10,
        
        TYPES: {
            imp: {
                health: 30,
                damage: 10,
                moveSpeed: 0.02,
                attackRate: 2000
            },
            demon: {
                health: 50,
                damage: 15,
                moveSpeed: 0.03,
                attackRate: 2000
            },
            guard: {
                health: 40,
                damage: 12,
                moveSpeed: 0.02,
                attackRate: 1500
            }
        }
    },
    
    // Configurazione armi
    WEAPON_CONFIG: {
        1: {name: 'PUGNI', damage: 20, range: 1.5, fireRate: 300, ammoType: 1},
        2: {name: 'PISTOLA', damage: 15, range: 15, fireRate: 400, ammoType: 2},
        3: {name: 'FUCILE', damage: 70, range: 5, fireRate: 800, ammoType: 3, spread: 5, maxAmmo: 2},
        4: {name: 'MINIGUN', damage: 20, range: 20, fireRate: 100, ammoType: 4},
        5: {name: 'LANCIARAZZI', damage: 100, range: 30, fireRate: 1000, ammoType: 5, splash: 3, maxAmmo: 1}
    },
    
    // Configurazione powerup
    POWERUP_CONFIG: {
        DURATION: 10000, // 10 secondi
        DAMAGE_MULTIPLIER: 2,
        SPEED_MULTIPLIER: 1.6
    },
    
    // Dimensioni sprites
    SPRITE_SIZES: {
        ENEMY_MIN: 20,
        ENEMY_SCALE: 150,
        ITEM_MIN: 10,
        ITEM_SCALE: 40,
        DOOR_MIN: 10,
        DOOR_SCALE: 100
    },
    
    // Controlli (keycode mapping)
    CONTROLS: {
        MOVE_FORWARD: 'keyw',
        MOVE_BACKWARD: 'keys', 
        STRAFE_LEFT: 'keya',
        STRAFE_RIGHT: 'keyd',
        RELOAD: 'keyr',
        USE_ACTION: 'keye',
        WEAPON_1: 'digit1',
        WEAPON_2: 'digit2',
        WEAPON_3: 'digit3',
        WEAPON_4: 'digit4',
        WEAPON_5: 'digit5'
    },
    
    // Impostazioni debug
    DEBUG: {
        SHOW_FPS: false,
        SHOW_PLAYER_COORDS: false,
        SHOW_ENEMY_PATHS: false,
        LOG_COLLISIONS: false
    }
};

// Configurazioni specifiche per livello di difficoltà
export const DifficultyConfig = {
    EASY: {
        enemyDamageMultiplier: 0.5,
        enemySpeedMultiplier: 0.8,
        playerHealthMultiplier: 1.5,
        ammoMultiplier: 2
    },
    
    NORMAL: {
        enemyDamageMultiplier: 1,
        enemySpeedMultiplier: 1,
        playerHealthMultiplier: 1,
        ammoMultiplier: 1
    },
    
    HARD: {
        enemyDamageMultiplier: 1.5,
        enemySpeedMultiplier: 1.2,
        playerHealthMultiplier: 0.75,
        ammoMultiplier: 0.8
    },
    
    NIGHTMARE: {
        enemyDamageMultiplier: 2,
        enemySpeedMultiplier: 1.5,
        playerHealthMultiplier: 0.5,
        ammoMultiplier: 0.5
    }
};

// Configurazione audio (per future implementazioni)
export const AudioConfig = {
    VOLUME: {
        MASTER: 1.0,
        SFX: 0.8,
        MUSIC: 0.6
    },
    
    SOUNDS: {
        WEAPON_FIRE: 'sounds/weapon_fire.mp3',
        WEAPON_RELOAD: 'sounds/reload.mp3',
        ENEMY_DEATH: 'sounds/enemy_death.mp3',
        ITEM_PICKUP: 'sounds/pickup.mp3',
        DOOR_OPEN: 'sounds/door.mp3',
        POWERUP: 'sounds/powerup.mp3'
    }
};
// Controls.js - Gestione controlli e input
export class Controls {
    constructor(canvas, gameContainer) {
        this.canvas = canvas;
        this.gameContainer = gameContainer;
        this.keys = {};
        this.mouseLocked = false;
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Event callbacks
        this.onShoot = null;
        this.onWeaponSwitch = null;
        this.onReload = null;
        this.onUseAction = null;
        this.onMouseMove = null;
        this.onStartGame = null;
        this.onRestartGame = null;
        
        this.initControls();
    }
    
    initControls() {
        this.initButtons();
        this.initKeyboard();
        this.initMouse();
        this.initWeaponSlots();
    }
    
    initButtons() {
        const startButton = document.getElementById('startButton');
        const restartButton = document.getElementById('restartButton');
        const victoryRestartButton = document.getElementById('victoryRestartButton');
        
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (this.onStartGame) 
                    this.onStartGame();
            });
        }
        
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                if (this.onRestartGame) this.onRestartGame();
            });
        }
        
        if (victoryRestartButton) {
            victoryRestartButton.addEventListener('click', () => {
                if (this.onRestartGame) this.onRestartGame();
            });
        }
    }
    
    initKeyboard() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code.toLowerCase()] = true;
            
            // Weapon switching
            if (e.code === 'Digit1' && this.onWeaponSwitch) this.onWeaponSwitch(1);
            if (e.code === 'Digit2' && this.onWeaponSwitch) this.onWeaponSwitch(2);
            if (e.code === 'Digit3' && this.onWeaponSwitch) this.onWeaponSwitch(3);
            if (e.code === 'Digit4' && this.onWeaponSwitch) this.onWeaponSwitch(4);
            if (e.code === 'Digit5' && this.onWeaponSwitch) this.onWeaponSwitch(5);
            
            // Actions
            if (e.code === 'KeyR' && this.onReload) this.onReload();
            if (e.code === 'KeyE' && this.onUseAction) this.onUseAction();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code.toLowerCase()] = false;
        });
    }
    
    initMouse() {
        this.canvas.addEventListener('click', (e) => {
            if (!document.pointerLockElement) {
                this.canvas.requestPointerLock();
            } else {
                if (this.onShoot) this.onShoot();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            this.mouseLocked = document.pointerLockElement === this.canvas;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.mouseLocked) {
                if (this.onMouseMove) {
                    this.onMouseMove(e.movementX, e.movementY);
                }
            }
        });
    }
    
    initWeaponSlots() {
        document.querySelectorAll('.weapon-slot').forEach(slot => {
            slot.addEventListener('click', (e) => {
                const weapon = parseInt(e.currentTarget.dataset.weapon);
                if (this.onWeaponSwitch) this.onWeaponSwitch(weapon);
            });
        });
    }
    
    // Movement helpers
    isMovingForward() {
        return this.keys['keyw'] || false;
    }
    
    isMovingBackward() {
        return this.keys['keys'] || false;
    }
    
    isStrafingLeft() {
        return this.keys['keya'] || false;
    }
    
    isStrafingRight() {
        return this.keys['keyd'] || false;
    }
    
    getMovementVector() {
        return {
            forward: this.isMovingForward() ? 1 : (this.isMovingBackward() ? -1 : 0),
            strafe: this.isStrafingRight() ? 1 : (this.isStrafingLeft() ? -1 : 0)
        };
    }
    
    // Callback setters
    setShootCallback(callback) {
        this.onShoot = callback;
    }
    
    setWeaponSwitchCallback(callback) {
        this.onWeaponSwitch = callback;
    }
    
    setReloadCallback(callback) {
        this.onReload = callback;
    }
    
    setUseActionCallback(callback) {
        this.onUseAction = callback;
    }
    
    setMouseMoveCallback(callback) {
        this.onMouseMove = callback;
    }
    
    setStartGameCallback(callback) {
        this.onStartGame = callback;
    }
    
    setRestartGameCallback(callback) {
        this.onRestartGame = callback;
    }
    
    // Utility methods
    isPointerLocked() {
        return this.mouseLocked;
    }
    
    requestPointerLock() {
        this.canvas.requestPointerLock();
    }
    
    exitPointerLock() {
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
    }
}
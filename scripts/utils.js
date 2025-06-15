// Utils.js - Funzioni di utilità condivise
export class Utils {
    
    // Matematica
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    static angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
    
    static normalizeAngle(angle) {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }
    
    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Colori
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    static adjustBrightness(hex, factor) {
        const rgb = Utils.hexToRgb(hex);
        if (!rgb) return hex;
        
        const newR = Utils.clamp(Math.floor(rgb.r * factor), 0, 255);
        const newG = Utils.clamp(Math.floor(rgb.g * factor), 0, 255);
        const newB = Utils.clamp(Math.floor(rgb.b * factor), 0, 255);
        
        return Utils.rgbToHex(newR, newG, newB);
    }
    
    // Timing
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Array utilities
    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    static removeFromArray(array, item) {
        const index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    }
    
    // Vector math
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    
    static magnitude(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }
    
    static normalize(vector) {
        const mag = Utils.magnitude(vector);
        if (mag === 0) return { x: 0, y: 0 };
        return { x: vector.x / mag, y: vector.y / mag };
    }
    
    static rotate(vector, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: vector.x * cos - vector.y * sin,
            y: vector.x * sin + vector.y * cos
        };
    }
    
    // Canvas utilities
    static createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
    
    static getCanvasContext(canvas, type = '2d') {
        return canvas.getContext(type);
    }
    
    static clearCanvas(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
    }
    
    // Performance
    static createFrameCounter() {
        let frames = 0;
        let lastTime = performance.now();
        let fps = 0;
        
        return {
            update: () => {
                frames++;
                const currentTime = performance.now();
                if (currentTime - lastTime >= 1000) {
                    fps = frames;
                    frames = 0;
                    lastTime = currentTime;
                }
                return fps;
            },
            getFPS: () => fps
        };
    }
    
    // Local Storage helpers
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
            return false;
        }
    }
    
    static loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
            return defaultValue;
        }
    }
    
    static removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Failed to remove from localStorage:', e);
            return false;
        }
    }
    
    // DOM helpers
    static createElement(tag, className = '', id = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (id) element.id = id;
        return element;
    }
    
    static $ (selector) {
        return document.querySelector(selector);
    }
    
    static $$ (selector) {
        return document.querySelectorAll(selector);
    }
    
    // Validation
    static isValidNumber(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }
    
    static isValidPosition(x, y) {
        return Utils.isValidNumber(x) && Utils.isValidNumber(y);
    }
    
    static isInBounds(x, y, width, height) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }
    
    // Animation helpers
    static easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    static easeIn(t) {
        return t * t;
    }
    
    static easeOut(t) {
        return 1 - Math.pow(1 - t, 2);
    }
    
    // Game specific utilities
    static mapWorldToScreen(worldX, worldY, playerX, playerY, playerAngle, screenWidth, screenHeight, fov) {
        const dx = worldX - playerX;
        const dy = worldY - playerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) - playerAngle;
        
        let normalizedAngle = Utils.normalizeAngle(angle);
        
        if (Math.abs(normalizedAngle) < fov / 2) {
            const screenX = (normalizedAngle / (fov / 2)) * (screenWidth / 2) + (screenWidth / 2);
            const screenY = screenHeight / 2; // Basic projection
            return { x: screenX, y: screenY, distance, visible: true };
        }
        
        return { x: 0, y: 0, distance, visible: false };
    }
    
    static checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    static checkCircleCollision(circle1, circle2) {
        const distance = Utils.distance(circle1.x, circle1.y, circle2.x, circle2.y);
        return distance < (circle1.radius + circle2.radius);
    }
    
    // Logger utility
    static createLogger(prefix = '') {
        return {
            log: (...args) => console.log(`[${prefix}]`, ...args),
            warn: (...args) => console.warn(`[${prefix}]`, ...args),
            error: (...args) => console.error(`[${prefix}]`, ...args),
            debug: (...args) => {
                if (window.DEBUG) console.log(`[${prefix}DEBUG]`, ...args);
            }
        };
    }
}

// Export anche come oggetto per retrocompatibilità
export default Utils;
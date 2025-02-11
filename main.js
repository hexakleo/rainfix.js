class rainfx {
    constructor(canvasId, options = {}) {
        this.config = {
            dropCount: 100,       
            dropColor: "rgba(173, 216, 230, 0.5)",  
            dropWidth: 2,  
            dropMinLength: 10,   
            dropMaxLength: 30, 
            dropSpeedMin: 2,     
            dropSpeedMax: 6,      
            windEffect: 0,       
            gravity: 1,    
            dispersion: 0.2,      
            backgroundBlur: false,  
            glowEffect: false,    
            rainIntensity: 1,      
            direction: "down",   
            lightning: false,   
            lightningFrequency: 0.01, 
            fadeEffect: true,   
            responsive: true    
        };

     
        Object.assign(this.config, options);
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) throw new Error("Canvas ID no encontrado");

        this.ctx = this.canvas.getContext("2d");
        this.drops = [];

        if (this.config.responsive) {
            window.addEventListener("resize", () => this.resizeCanvas());
        }
        this.resizeCanvas();
        this.initDrops();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initDrops() {
        this.drops = Array.from({ length: this.config.dropCount }, () => this.createDrop());
    }

    createDrop() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            length: Math.random() * (this.config.dropMaxLength - this.config.dropMinLength) + this.config.dropMinLength,
            speed: Math.random() * (this.config.dropSpeedMax - this.config.dropSpeedMin) + this.config.dropSpeedMin,
            opacity: Math.random() * 0.5 + 0.5
        };
    }

    drawDrop(drop) {
        const { x, y, length, opacity } = drop;
        const { dropColor, dropWidth, windEffect, glowEffect } = this.config;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + windEffect * 10, y + length);
        this.ctx.strokeStyle = dropColor.replace("0.5", opacity.toFixed(2));
        this.ctx.lineWidth = dropWidth;
        this.ctx.globalAlpha = opacity;

        if (glowEffect) {
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = dropColor;
        }

        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.config.backgroundBlur) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        for (const drop of this.drops) {
            this.drawDrop(drop);
            drop.y += drop.speed * this.config.gravity;
            drop.x += this.config.windEffect * drop.speed * this.config.dispersion;

            if (drop.y > this.canvas.height || drop.x < 0 || drop.x > this.canvas.width) {
                Object.assign(drop, this.createDrop(), { y: -drop.length });
            }
        }

        if (this.config.lightning && Math.random() < this.config.lightningFrequency) {
            this.drawLightning();
        }
    }

    drawLightning() {
        const x = Math.random() * this.canvas.width;
        const gradient = this.ctx.createLinearGradient(x, 0, x + 50, this.canvas.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, 0, 50, this.canvas.height);
    }
}

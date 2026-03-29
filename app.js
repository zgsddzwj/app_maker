// App Store Screenshot Generator
// Main Application Logic

class AppStoreScreenshotGenerator {
    constructor() {
        // Device sizes (width x height)
        this.deviceSizes = {
            iphone67: { width: 1290, height: 2796, name: 'iPhone 6.7"' },
            iphone65: { width: 1242, height: 2688, name: 'iPhone 6.5"' },
            iphone55: { width: 1242, height: 2208, name: 'iPhone 5.5"' },
            ipad13: { width: 2048, height: 2732, name: 'iPad 13"' },
            ipad11: { width: 1668, height: 2388, name: 'iPad 11"' }
        };

        // Current state
        this.state = {
            device: 'iphone67',
            screenshot: null,
            bgImage: null,
            bgType: 'gradient',
            gradientColor1: '#667eea',
            gradientColor2: '#764ba2',
            solidColor: '#1a1a2e',
            title: '',
            subtitle: '',
            titleColor: '#ffffff',
            subtitleColor: '#e0e0e0',
            titleFontSize: 72,
            subtitleFontSize: 36,
            textPosition: 'top',
            showFrame: true,
            frameColor: '#1a1a1a',
            zoom: 50
        };

        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.updatePreview();
    }

    bindElements() {
        // Device buttons
        this.deviceBtns = document.querySelectorAll('.device-btn');
        
        // Screenshot upload
        this.screenshotUpload = document.getElementById('screenshotUpload');
        this.screenshotInput = document.getElementById('screenshotInput');
        this.screenshotPreview = document.getElementById('screenshotPreview');
        this.screenshotImage = document.getElementById('screenshotImage');
        this.removeScreenshot = document.getElementById('removeScreenshot');
        
        // Text inputs
        this.titleInput = document.getElementById('titleInput');
        this.subtitleInput = document.getElementById('subtitleInput');
        
        // Background type
        this.bgTypeBtns = document.querySelectorAll('.bg-type-btn');
        this.gradientSettings = document.getElementById('gradientSettings');
        this.solidSettings = document.getElementById('solidSettings');
        this.imageSettings = document.getElementById('imageSettings');
        
        // Color inputs
        this.gradientColor1 = document.getElementById('gradientColor1');
        this.gradientColor2 = document.getElementById('gradientColor2');
        this.solidColorInput = document.getElementById('solidColor');
        this.titleColorInput = document.getElementById('titleColor');
        this.subtitleColorInput = document.getElementById('subtitleColor');
        this.frameColorInput = document.getElementById('frameColor');
        
        // Gradient presets
        this.presetBtns = document.querySelectorAll('.preset-btn');
        
        // Background image
        this.bgImageUpload = document.getElementById('bgImageUpload');
        this.bgImageInput = document.getElementById('bgImageInput');
        this.bgPreview = document.getElementById('bgPreview');
        this.bgImage = document.getElementById('bgImage');
        this.removeBgImage = document.getElementById('removeBgImage');
        
        // Font size sliders
        this.titleFontSize = document.getElementById('titleFontSize');
        this.titleFontSizeValue = document.getElementById('titleFontSizeValue');
        this.subtitleFontSize = document.getElementById('subtitleFontSize');
        this.subtitleFontSizeValue = document.getElementById('subtitleFontSizeValue');
        
        // Position buttons
        this.positionBtns = document.querySelectorAll('.position-btn');
        
        // Frame toggle
        this.showFrame = document.getElementById('showFrame');
        
        // Zoom controls
        this.zoomIn = document.getElementById('zoomIn');
        this.zoomOut = document.getElementById('zoomOut');
        this.zoomLevel = document.getElementById('zoomLevel');
        
        // Preview canvas
        this.previewCanvas = document.getElementById('previewCanvas');
        
        // Export
        this.exportBtn = document.getElementById('exportBtn');
        this.exportCanvas = document.getElementById('exportCanvas');
    }

    bindEvents() {
        // Device selection
        this.deviceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.deviceBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.device = btn.dataset.device;
                this.updatePreview();
            });
        });

        // Screenshot upload
        this.screenshotUpload.addEventListener('click', () => this.screenshotInput.click());
        this.screenshotInput.addEventListener('change', (e) => this.handleScreenshotUpload(e));
        this.screenshotUpload.addEventListener('dragover', (e) => this.handleDragOver(e, this.screenshotUpload));
        this.screenshotUpload.addEventListener('dragleave', () => this.screenshotUpload.classList.remove('dragover'));
        this.screenshotUpload.addEventListener('drop', (e) => this.handleScreenshotDrop(e));
        this.removeScreenshot.addEventListener('click', () => this.removeScreenshotImage());

        // Text inputs
        this.titleInput.addEventListener('input', () => {
            this.state.title = this.titleInput.value;
            this.updatePreview();
        });
        this.subtitleInput.addEventListener('input', () => {
            this.state.subtitle = this.subtitleInput.value;
            this.updatePreview();
        });

        // Background type
        this.bgTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.bgTypeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.bgType = btn.dataset.type;
                this.updateBackgroundSettings();
                this.updatePreview();
            });
        });

        // Color inputs
        this.gradientColor1.addEventListener('input', () => {
            this.state.gradientColor1 = this.gradientColor1.value;
            this.updatePreview();
        });
        this.gradientColor2.addEventListener('input', () => {
            this.state.gradientColor2 = this.gradientColor2.value;
            this.updatePreview();
        });
        this.solidColorInput.addEventListener('input', () => {
            this.state.solidColor = this.solidColorInput.value;
            this.updatePreview();
        });
        this.titleColorInput.addEventListener('input', () => {
            this.state.titleColor = this.titleColorInput.value;
            this.updatePreview();
        });
        this.subtitleColorInput.addEventListener('input', () => {
            this.state.subtitleColor = this.subtitleColorInput.value;
            this.updatePreview();
        });
        this.frameColorInput.addEventListener('input', () => {
            this.state.frameColor = this.frameColorInput.value;
            this.updatePreview();
        });

        // Gradient presets
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const colors = btn.dataset.colors.split(',');
                this.state.gradientColor1 = colors[0];
                this.state.gradientColor2 = colors[1];
                this.gradientColor1.value = colors[0];
                this.gradientColor2.value = colors[1];
                this.updatePreview();
            });
        });

        // Background image
        this.bgImageUpload.addEventListener('click', () => this.bgImageInput.click());
        this.bgImageInput.addEventListener('change', (e) => this.handleBgImageUpload(e));
        this.removeBgImage.addEventListener('click', () => this.removeBgImageFile());

        // Font size sliders
        this.titleFontSize.addEventListener('input', () => {
            this.state.titleFontSize = parseInt(this.titleFontSize.value);
            this.titleFontSizeValue.textContent = this.state.titleFontSize + 'px';
            this.updatePreview();
        });
        this.subtitleFontSize.addEventListener('input', () => {
            this.state.subtitleFontSize = parseInt(this.subtitleFontSize.value);
            this.subtitleFontSizeValue.textContent = this.state.subtitleFontSize + 'px';
            this.updatePreview();
        });

        // Position buttons
        this.positionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.positionBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.textPosition = btn.dataset.position;
                this.updatePreview();
            });
        });

        // Frame toggle
        this.showFrame.addEventListener('change', () => {
            this.state.showFrame = this.showFrame.checked;
            this.updatePreview();
        });

        // Zoom controls
        this.zoomIn.addEventListener('click', () => this.adjustZoom(10));
        this.zoomOut.addEventListener('click', () => this.adjustZoom(-10));

        // Export
        this.exportBtn.addEventListener('click', () => this.exportImage());
    }

    handleDragOver(e, element) {
        e.preventDefault();
        element.classList.add('dragover');
    }

    handleScreenshotUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.loadImage(file, (img) => {
                this.state.screenshot = img;
                this.screenshotImage.src = img.src;
                this.screenshotPreview.style.display = 'block';
                this.screenshotUpload.style.display = 'none';
                this.updatePreview();
            });
        }
    }

    handleScreenshotDrop(e) {
        e.preventDefault();
        this.screenshotUpload.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadImage(file, (img) => {
                this.state.screenshot = img;
                this.screenshotImage.src = img.src;
                this.screenshotPreview.style.display = 'block';
                this.screenshotUpload.style.display = 'none';
                this.updatePreview();
            });
        }
    }

    removeScreenshotImage() {
        this.state.screenshot = null;
        this.screenshotInput.value = '';
        this.screenshotPreview.style.display = 'none';
        this.screenshotUpload.style.display = 'block';
        this.updatePreview();
    }

    handleBgImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.loadImage(file, (img) => {
                this.state.bgImage = img;
                this.bgImage.src = img.src;
                this.bgPreview.style.display = 'block';
                this.updatePreview();
            });
        }
    }

    removeBgImageFile() {
        this.state.bgImage = null;
        this.bgImageInput.value = '';
        this.bgPreview.style.display = 'none';
        this.updatePreview();
    }

    loadImage(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => callback(img);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    updateBackgroundSettings() {
        this.gradientSettings.style.display = this.state.bgType === 'gradient' ? 'block' : 'none';
        this.solidSettings.style.display = this.state.bgType === 'solid' ? 'block' : 'none';
        this.imageSettings.style.display = this.state.bgType === 'image' ? 'block' : 'none';
    }

    adjustZoom(delta) {
        this.state.zoom = Math.max(10, Math.min(100, this.state.zoom + delta));
        this.zoomLevel.textContent = this.state.zoom + '%';
        this.updatePreview();
    }

    updatePreview() {
        const device = this.deviceSizes[this.state.device];
        const scale = this.state.zoom / 100;

        // Set canvas size
        this.previewCanvas.style.width = device.width * scale + 'px';
        this.previewCanvas.style.height = device.height * scale + 'px';

        // Build preview content
        let html = '';

        // Background
        if (this.state.bgType === 'gradient') {
            html += `<div class="preview-canvas-content" style="background: linear-gradient(135deg, ${this.state.gradientColor1}, ${this.state.gradientColor2});">`;
        } else if (this.state.bgType === 'solid') {
            html += `<div class="preview-canvas-content" style="background: ${this.state.solidColor};">`;
        } else if (this.state.bgType === 'image' && this.state.bgImage) {
            html += `<div class="preview-canvas-content" style="background: url(${this.state.bgImage.src}) center/cover no-repeat;">`;
        } else {
            html += `<div class="preview-canvas-content" style="background: linear-gradient(135deg, ${this.state.gradientColor1}, ${this.state.gradientColor2});">`;
        }

        // Text container position
        const textPositionClass = this.state.textPosition;
        
        // Build content based on position
        if (this.state.textPosition === 'top') {
            // Text first, then device
            html += this.buildTextContainer(textPositionClass);
            html += this.buildDeviceFrame(device, scale);
        } else if (this.state.textPosition === 'bottom') {
            // Device first, then text
            html += this.buildDeviceFrame(device, scale);
            html += this.buildTextContainer(textPositionClass);
        } else {
            // Center - text overlaid on center
            html += `<div style="flex: 1;"></div>`;
            html += this.buildTextContainer(textPositionClass);
            html += `<div style="flex: 1;"></div>`;
        }

        html += '</div>';
        this.previewCanvas.innerHTML = html;
    }

    buildTextContainer(positionClass) {
        let html = `<div class="text-container ${positionClass}">`;
        
        if (this.state.title) {
            html += `<h2 class="preview-title" style="color: ${this.state.titleColor}; font-size: ${this.state.titleFontSize}px;">${this.escapeHtml(this.state.title)}</h2>`;
        } else {
            html += `<h2 class="preview-title" style="color: ${this.state.titleColor}; font-size: ${this.state.titleFontSize}px;">输入标题文字</h2>`;
        }
        
        if (this.state.subtitle) {
            html += `<p class="preview-subtitle" style="color: ${this.state.subtitleColor}; font-size: ${this.state.subtitleFontSize}px;">${this.escapeHtml(this.state.subtitle)}</p>`;
        } else {
            html += `<p class="preview-subtitle" style="color: ${this.state.subtitleColor}; font-size: ${this.state.subtitleFontSize}px;">输入副标题文字</p>`;
        }
        
        html += '</div>';
        return html;
    }

    buildDeviceFrame(device, scale) {
        if (!this.state.screenshot) return '';
        
        const framePadding = 12 * scale;
        const borderRadius = this.state.showFrame ? 40 * scale : 0;
        const innerBorderRadius = this.state.showFrame ? 32 * scale : 0;

        let html = '';
        
        if (this.state.showFrame) {
            // Calculate screenshot size to fit in device
            const maxScreenshotWidth = device.width * 0.7;
            const maxScreenshotHeight = device.height * 0.55;
            
            let screenshotWidth = this.state.screenshot.width;
            let screenshotHeight = this.state.screenshot.height;
            
            // Scale to fit
            const widthRatio = maxScreenshotWidth / screenshotWidth;
            const heightRatio = maxScreenshotHeight / screenshotHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            
            screenshotWidth *= ratio * scale;
            screenshotHeight *= ratio * scale;
            
            html += `<div class="device-frame" style="background: ${this.state.frameColor}; border-radius: ${borderRadius}px; padding: ${framePadding}px;">`;
            html += `<div class="device-frame-inner" style="border-radius: ${innerBorderRadius}px;">`;
            html += `<img src="${this.state.screenshot.src}" style="width: ${screenshotWidth}px; height: ${screenshotHeight}px; object-fit: cover;">`;
            html += '</div>';
            html += '</div>';
        } else {
            // No frame, just screenshot
            const maxScreenshotWidth = device.width * 0.8;
            const maxScreenshotHeight = device.height * 0.6;
            
            let screenshotWidth = this.state.screenshot.width;
            let screenshotHeight = this.state.screenshot.height;
            
            const widthRatio = maxScreenshotWidth / screenshotWidth;
            const heightRatio = maxScreenshotHeight / screenshotHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            
            screenshotWidth *= ratio * scale;
            screenshotHeight *= ratio * scale;
            
            html += `<div style="margin: 20px ${framePadding}px;">`;
            html += `<img src="${this.state.screenshot.src}" style="width: ${screenshotWidth}px; height: ${screenshotHeight}px; object-fit: cover; border-radius: ${innerBorderRadius}px;">`;
            html += '</div>';
        }
        
        return html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async exportImage() {
        const device = this.deviceSizes[this.state.device];
        const canvas = this.exportCanvas;
        const ctx = canvas.getContext('2d');

        // Set canvas size to device size
        canvas.width = device.width;
        canvas.height = device.height;

        // Draw background
        if (this.state.bgType === 'gradient') {
            const gradient = ctx.createLinearGradient(0, 0, device.width, device.height);
            gradient.addColorStop(0, this.state.gradientColor1);
            gradient.addColorStop(1, this.state.gradientColor2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, device.width, device.height);
        } else if (this.state.bgType === 'solid') {
            ctx.fillStyle = this.state.solidColor;
            ctx.fillRect(0, 0, device.width, device.height);
        } else if (this.state.bgType === 'image' && this.state.bgImage) {
            ctx.drawImage(this.state.bgImage, 0, 0, device.width, device.height);
        }

        // Calculate positions
        const isTop = this.state.textPosition === 'top';
        const isBottom = this.state.textPosition === 'bottom';
        const isCenter = this.state.textPosition === 'center';

        // Calculate screenshot size and position
        let screenshotWidth = 0;
        let screenshotHeight = 0;
        let screenshotX = 0;
        let screenshotY = 0;

        if (this.state.screenshot) {
            const maxScreenshotWidth = device.width * 0.7;
            const maxScreenshotHeight = device.height * 0.55;
            
            screenshotWidth = this.state.screenshot.width;
            screenshotHeight = this.state.screenshot.height;
            
            const widthRatio = maxScreenshotWidth / screenshotWidth;
            const heightRatio = maxScreenshotHeight / screenshotHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            
            screenshotWidth *= ratio;
            screenshotHeight *= ratio;
            screenshotX = (device.width - screenshotWidth) / 2;
        }

        // Text measurements
        const titleY = isTop ? device.height * 0.12 : (isBottom ? device.height * 0.82 : device.height * 0.25);
        const subtitleY = titleY + this.state.titleFontSize * 1.5;
        const deviceY = isTop ? device.height * 0.22 : (isBottom ? device.height * 0.08 : device.height * 0.4);
        
        if (this.state.screenshot && !isCenter) {
            screenshotY = isTop ? deviceY : device.height - deviceY - screenshotHeight;
        }

        // Draw text
        ctx.textAlign = 'center';
        
        // Title
        ctx.fillStyle = this.state.titleColor;
        ctx.font = `bold ${this.state.titleFontSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif`;
        const title = this.state.title || '输入标题文字';
        ctx.fillText(title, device.width / 2, titleY);

        // Subtitle
        ctx.fillStyle = this.state.subtitleColor;
        ctx.font = `500 ${this.state.subtitleFontSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif`;
        const subtitle = this.state.subtitle || '输入副标题文字';
        ctx.fillText(subtitle, device.width / 2, subtitleY);

        // Draw device frame and screenshot
        if (this.state.screenshot) {
            if (this.state.showFrame) {
                const framePadding = 12;
                const frameBorderRadius = 40;
                const innerBorderRadius = 32;
                
                const frameWidth = screenshotWidth + framePadding * 2;
                const frameHeight = screenshotHeight + framePadding * 2;
                const frameX = screenshotX - framePadding;
                const frameY = screenshotY - framePadding;

                // Draw frame
                ctx.fillStyle = this.state.frameColor;
                this.roundRect(ctx, frameX, frameY, frameWidth, frameHeight, frameBorderRadius);
                ctx.fill();

                // Clip and draw screenshot
                ctx.save();
                this.roundRect(ctx, screenshotX, screenshotY, screenshotWidth, screenshotHeight, innerBorderRadius);
                ctx.clip();
                ctx.drawImage(this.state.screenshot, screenshotX, screenshotY, screenshotWidth, screenshotHeight);
                ctx.restore();
            } else {
                // Draw screenshot without frame
                ctx.drawImage(this.state.screenshot, screenshotX, screenshotY, screenshotWidth, screenshotHeight);
            }
        }

        // Export
        const link = document.createElement('a');
        link.download = `appstore-${this.state.device}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppStoreScreenshotGenerator();
});

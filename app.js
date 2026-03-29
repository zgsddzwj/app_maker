// App Store Screenshot Generator
// Main Application Logic

class AppStoreScreenshotGenerator {
    constructor() {
        // Device sizes (width x height)
        this.deviceSizes = {
            iphone67: { width: 1290, height: 2796, name: 'iPhone 6.7" (1290×2796)' },
            iphone69: { width: 1284, height: 2778, name: 'iPhone 6.9" (1284×2778)' },
            iphone65: { width: 1242, height: 2688, name: 'iPhone 6.5" (1242×2688)' },
            iphone55: { width: 1242, height: 2208, name: 'iPhone 5.5" (1242×2208)' },
            ipad13: { width: 2048, height: 2732, name: 'iPad 13" (2048×2732)' },
            ipad11: { width: 1668, height: 2388, name: 'iPad 11" (1668×2388)' }
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
            titleFontSize: 48,
            subtitleFontSize: 28,
            textPosition: 'top',
            showFrame: true,
            frameColor: '#1a1a1a',
            // Element positions (relative to canvas, 0-1)
            textX: 0.5,
            textY: 0.08,
            screenshotX: 0.5,
            screenshotY: 0.22,
            // Screenshot scale (1 = original size)
            screenshotScale: 1
        };

        // Drag state
        this.dragState = {
            isDragging: false,
            dragTarget: null,
            startX: 0,
            startY: 0,
            elementStartX: 0,
            elementStartY: 0
        };

        // Pinch state for scaling
        this.pinchState = {
            isPinching: false,
            startDistance: 0,
            startScale: 1
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
                this.applyPresetPosition(this.state.textPosition);
                this.updatePreview();
            });
        });

        // Frame toggle
        this.showFrame.addEventListener('change', () => {
            this.state.showFrame = this.showFrame.checked;
            this.updatePreview();
        });

        // Export
        this.exportBtn.addEventListener('click', () => this.exportImage());

        // Drag events for preview canvas
        this.previewCanvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        document.addEventListener('mouseup', () => this.handleCanvasMouseUp());
        
        // Touch events for mobile
        this.previewCanvas.addEventListener('touchstart', (e) => this.handleCanvasTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleCanvasTouchMove(e), { passive: false });
        document.addEventListener('touchend', () => this.handleCanvasMouseUp());

        // Wheel event for scaling screenshot (desktop)
        this.previewCanvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

        // Screenshot scale slider
        this.screenshotScale = document.getElementById('screenshotScale');
        this.screenshotScaleValue = document.getElementById('screenshotScaleValue');
        if (this.screenshotScale) {
            this.screenshotScale.addEventListener('input', () => {
                this.state.screenshotScale = parseFloat(this.screenshotScale.value);
                this.screenshotScaleValue.textContent = Math.round(this.state.screenshotScale * 100) + '%';
                this.updatePreview();
            });
        }
    }

    applyPresetPosition(position) {
        switch(position) {
            case 'top':
                this.state.textY = 0.08;
                this.state.screenshotY = 0.28;
                break;
            case 'center':
                this.state.textY = 0.12;
                this.state.screenshotY = 0.38;
                break;
            case 'bottom':
                this.state.textY = 0.78;
                this.state.screenshotY = 0.15;
                break;
        }
    }

    handleCanvasMouseDown(e) {
        const target = e.target.closest('.draggable-element');
        if (!target) return;
        
        e.preventDefault();
        const rect = this.previewCanvas.getBoundingClientRect();
        
        // Check if clicking on frame (for scaling) or inner image (for dragging)
        const isOnFrame = target.classList.contains('device-frame') && !e.target.closest('.device-frame-inner');
        
        if (isOnFrame && target.dataset.element === 'screenshot') {
            // On frame - start scaling
            this.dragState = {
                isDragging: true,
                dragTarget: 'scale',
                startX: e.clientX,
                startY: e.clientY,
                elementStartX: this.state.screenshotX,
                elementStartY: this.state.screenshotY,
                startScale: this.state.screenshotScale,
                canvasRect: rect
            };
        } else {
            // On inner image or text - start dragging
            this.dragState = {
                isDragging: true,
                dragTarget: target.dataset.element,
                startX: e.clientX,
                startY: e.clientY,
                elementStartX: target.dataset.element === 'text' ? this.state.textX : this.state.screenshotX,
                elementStartY: target.dataset.element === 'text' ? this.state.textY : this.state.screenshotY,
                canvasRect: rect
            };
            target.style.cursor = 'grabbing';
        }
    }

    handleCanvasTouchStart(e) {
        const target = e.target.closest('.draggable-element');
        
        // Handle pinch zoom with two fingers only when both touches are on the screenshot image (not frame)
        if (e.touches.length === 2) {
            const target1 = e.touches[0].target.closest('.draggable-element');
            const target2 = e.touches[1].target.closest('.draggable-element');
            
            // Only pinch zoom if both touches are on the inner image, not on the frame
            const isOnInnerImage = (t) => t && (t.tagName === 'IMG' || t.closest('.device-frame-inner'));
            const touch1OnImage = isOnInnerImage(e.touches[0].target);
            const touch2OnImage = isOnInnerImage(e.touches[1].target);
            
            if (target1 && target1.dataset.element === 'screenshot' && 
                target2 && target2.dataset.element === 'screenshot' &&
                touch1OnImage && touch2OnImage) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
                
                this.pinchState = {
                    isPinching: true,
                    startDistance: distance,
                    startScale: this.state.screenshotScale
                };
                return;
            }
        }
        
        if (!target) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.previewCanvas.getBoundingClientRect();
        
        // Check if touching on frame (for scaling) or inner image (for dragging)
        const isOnFrame = target.classList.contains('device-frame') && !touch.target.closest('.device-frame-inner');
        
        if (isOnFrame && target.dataset.element === 'screenshot') {
            // On frame - start scaling
            this.dragState = {
                isDragging: true,
                dragTarget: 'scale',
                startX: touch.clientX,
                startY: touch.clientY,
                elementStartX: this.state.screenshotX,
                elementStartY: this.state.screenshotY,
                startScale: this.state.screenshotScale,
                canvasRect: rect
            };
        } else {
            // On inner image or text - start dragging
            this.dragState = {
                isDragging: true,
                dragTarget: target.dataset.element,
                startX: touch.clientX,
                startY: touch.clientY,
                elementStartX: target.dataset.element === 'text' ? this.state.textX : this.state.screenshotX,
                elementStartY: target.dataset.element === 'text' ? this.state.textY : this.state.screenshotY,
                canvasRect: rect
            };
        }
    }

    handleCanvasMouseMove(e) {
        if (!this.dragState.isDragging) return;
        
        const dx = e.clientX - this.dragState.startX;
        const dy = e.clientY - this.dragState.startY;
        
        const canvasWidth = this.dragState.canvasRect.width;
        const canvasHeight = this.dragState.canvasRect.height;
        
        if (this.dragState.dragTarget === 'scale') {
            // On frame - scale the screenshot
            // Use diagonal distance for more intuitive scaling
            const distance = Math.hypot(dx, dy);
            const avgCanvasSize = (canvasWidth + canvasHeight) / 2;
            const scaleDelta = distance / avgCanvasSize;
            
            // Determine direction based on whether moving away from or towards center
            const direction = (dx + dy) > 0 ? 1 : -1;
            const newScale = Math.max(0.1, Math.min(3, this.dragState.startScale + scaleDelta * direction * 2));
            this.state.screenshotScale = newScale;
            
            // Update slider
            if (this.screenshotScale) {
                this.screenshotScale.value = newScale;
                this.screenshotScaleValue.textContent = Math.round(newScale * 100) + '%';
            }
        } else {
            // On inner image or text - drag to move
            const relativeDx = dx / canvasWidth;
            const relativeDy = dy / canvasHeight;
            
            if (this.dragState.dragTarget === 'text') {
                this.state.textX = Math.max(0, Math.min(1, this.dragState.elementStartX + relativeDx));
                this.state.textY = Math.max(0, Math.min(1, this.dragState.elementStartY + relativeDy));
            } else if (this.dragState.dragTarget === 'screenshot') {
                this.state.screenshotX = Math.max(0, Math.min(1, this.dragState.elementStartX + relativeDx));
                this.state.screenshotY = Math.max(0, Math.min(1, this.dragState.elementStartY + relativeDy));
            }
        }
        
        this.updatePreview();
    }

    handleCanvasTouchMove(e) {
        // Handle pinch zoom
        if (this.pinchState.isPinching && e.touches.length === 2) {
            this.handlePinchMove(e);
            return;
        }
        
        if (!this.dragState.isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const dx = touch.clientX - this.dragState.startX;
        const dy = touch.clientY - this.dragState.startY;
        
        const canvasWidth = this.dragState.canvasRect.width;
        const canvasHeight = this.dragState.canvasRect.height;
        
        if (this.dragState.dragTarget === 'scale') {
            // On frame - scale the screenshot
            const distance = Math.hypot(dx, dy);
            const avgCanvasSize = (canvasWidth + canvasHeight) / 2;
            const scaleDelta = distance / avgCanvasSize;
            
            const direction = (dx + dy) > 0 ? 1 : -1;
            const newScale = Math.max(0.1, Math.min(3, this.dragState.startScale + scaleDelta * direction * 2));
            this.state.screenshotScale = newScale;
            
            // Update slider
            if (this.screenshotScale) {
                this.screenshotScale.value = newScale;
                this.screenshotScaleValue.textContent = Math.round(newScale * 100) + '%';
            }
        } else {
            // On inner image or text - drag to move
            const relativeDx = dx / canvasWidth;
            const relativeDy = dy / canvasHeight;
            
            if (this.dragState.dragTarget === 'text') {
                this.state.textX = Math.max(0, Math.min(1, this.dragState.elementStartX + relativeDx));
                this.state.textY = Math.max(0, Math.min(1, this.dragState.elementStartY + relativeDy));
            } else if (this.dragState.dragTarget === 'screenshot') {
                this.state.screenshotX = Math.max(0, Math.min(1, this.dragState.elementStartX + relativeDx));
                this.state.screenshotY = Math.max(0, Math.min(1, this.dragState.elementStartY + relativeDy));
            }
        }
        
        this.updatePreview();
    }

    handleCanvasMouseUp() {
        if (this.dragState.isDragging) {
            this.dragState.isDragging = false;
            this.dragState.dragTarget = null;
        }
        if (this.pinchState.isPinching) {
            this.pinchState.isPinching = false;
        }
    }

    // Handle mouse wheel for scaling screenshot (desktop)
    handleWheel(e) {
        const target = e.target.closest('.draggable-element');
        if (!target || target.dataset.element !== 'screenshot') return;
        
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newScale = Math.max(0.1, Math.min(3, this.state.screenshotScale + delta));
        this.state.screenshotScale = newScale;
        
        // Update slider if exists
        if (this.screenshotScale) {
            this.screenshotScale.value = newScale;
            this.screenshotScaleValue.textContent = Math.round(newScale * 100) + '%';
        }
        
        this.updatePreview();
    }

    // Handle pinch zoom (mobile)
    handlePinchMove(e) {
        if (!this.pinchState.isPinching || e.touches.length !== 2) return;
        
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        
        const scale = distance / this.pinchState.startDistance;
        const newScale = Math.max(0.1, Math.min(3, this.pinchState.startScale * scale));
        this.state.screenshotScale = newScale;
        
        // Update slider if exists
        if (this.screenshotScale) {
            this.screenshotScale.value = newScale;
            this.screenshotScaleValue.textContent = Math.round(newScale * 100) + '%';
        }
        
        this.updatePreview();
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

    updatePreview() {
        const device = this.deviceSizes[this.state.device];
        
        // Preview uses fixed width (375px), height calculated by aspect ratio
        const previewWidth = 375;
        const previewHeight = previewWidth * (device.height / device.width);
        const scale = previewWidth / device.width; // Scale factor for preview

        // Set canvas size (fixed preview width)
        this.previewCanvas.style.width = previewWidth + 'px';
        this.previewCanvas.style.height = previewHeight + 'px';

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

        // Text container - draggable
        const textTop = this.state.textY * 100;
        html += `<div class="text-container draggable-element" data-element="text" style="position: absolute; top: ${textTop}%; left: 50%; transform: translateX(-50%); padding: 20px 40px;">`;
        
        if (this.state.title) {
            html += `<h2 class="preview-title" style="color: ${this.state.titleColor}; font-size: ${this.state.titleFontSize}px; white-space: nowrap;">${this.escapeHtml(this.state.title)}</h2>`;
        } else {
            html += `<h2 class="preview-title" style="color: ${this.state.titleColor}; font-size: ${this.state.titleFontSize}px; white-space: nowrap;">输入标题文字</h2>`;
        }
        
        if (this.state.subtitle) {
            html += `<p class="preview-subtitle" style="color: ${this.state.subtitleColor}; font-size: ${this.state.subtitleFontSize}px; white-space: pre-line;">${this.escapeHtml(this.state.subtitle)}</p>`;
        } else {
            html += `<p class="preview-subtitle" style="color: ${this.state.subtitleColor}; font-size: ${this.state.subtitleFontSize}px; white-space: pre-line;">输入副标题文字</p>`;
        }
        
        html += '</div>';

        // Screenshot frame - draggable
        html += this.buildDeviceFrame(device, scale);

        html += '</div>';
        this.previewCanvas.innerHTML = html;
    }

    buildDeviceFrame(device, scale) {
        if (!this.state.screenshot) return '';
        
        // Use screenshot size with custom scale (scaled by zoom for preview)
        let screenshotWidth = this.state.screenshot.width * this.state.screenshotScale * scale;
        let screenshotHeight = this.state.screenshot.height * this.state.screenshotScale * scale;
        
        const framePadding = 12 * scale;
        const borderRadius = this.state.showFrame ? 40 * scale : 0;
        const innerBorderRadius = this.state.showFrame ? 32 * scale : 20 * scale;

        // Position based on state (in pixels for more precise control)
        const left = this.state.screenshotX * 100;
        const top = this.state.screenshotY * 100;

        let html = '';
        
        if (this.state.showFrame) {
            html += `<div class="device-frame draggable-element" data-element="screenshot" style="position: absolute; top: ${top}%; left: ${left}%; transform: translate(-50%, 0); background: ${this.state.frameColor}; border-radius: ${borderRadius}px; padding: ${framePadding}px; cursor: grab;">`;
            html += `<div class="device-frame-inner" style="border-radius: ${innerBorderRadius}px;">`;
            html += `<img src="${this.state.screenshot.src}" style="width: ${screenshotWidth}px; height: ${screenshotHeight}px; object-fit: cover; display: block;">`;
            html += '</div>';
            html += '</div>';
        } else {
            html += `<div class="draggable-element" data-element="screenshot" style="position: absolute; top: ${top}%; left: ${left}%; transform: translate(-50%, 0); cursor: grab;">`;
            html += `<img src="${this.state.screenshot.src}" style="width: ${screenshotWidth}px; height: ${screenshotHeight}px; object-fit: cover; border-radius: ${innerBorderRadius}px; display: block;">`;
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

        // Draw text at custom position
        if (this.state.title || this.state.subtitle) {
            // Scale factor: preview is 375px, export is actual device width
            const exportScale = device.width / 375;
            
            const textX = this.state.textX * device.width;
            // Account for text container padding (20px in preview, scaled for export)
            const paddingTop = 20 * exportScale;
            const textY = this.state.textY * device.height + paddingTop;

            ctx.textAlign = 'center';
            
            // Title - scale font size for export
            const exportTitleFontSize = this.state.titleFontSize * exportScale;
            ctx.fillStyle = this.state.titleColor;
            ctx.font = `bold ${exportTitleFontSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif`;
            const title = this.state.title || '输入标题文字';
            ctx.fillText(title, textX, textY);

            // Subtitle (support multiple lines) - scale font size for export
            const exportSubtitleFontSize = this.state.subtitleFontSize * exportScale;
            ctx.fillStyle = this.state.subtitleColor;
            ctx.font = `500 ${exportSubtitleFontSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif`;
            const subtitle = this.state.subtitle || '输入副标题文字';
            const lines = subtitle.split('\n');
            const lineHeight = exportSubtitleFontSize * 1.4;
            lines.forEach((line, index) => {
                ctx.fillText(line, textX, textY + exportTitleFontSize * 1.4 + index * lineHeight);
            });
        }

        // Draw screenshot at custom position
        if (this.state.screenshot) {
            // Apply custom scale to screenshot
            const screenshotWidth = this.state.screenshot.width * this.state.screenshotScale;
            const screenshotHeight = this.state.screenshot.height * this.state.screenshotScale;

            const framePadding = 12;
            const frameBorderRadius = 40;
            const innerBorderRadius = 32;

            // Calculate position from relative coordinates
            const centerX = this.state.screenshotX * device.width;
            const topY = this.state.screenshotY * device.height;
            const screenshotX = centerX - screenshotWidth / 2;
            const screenshotY = topY;

            if (this.state.showFrame) {
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
                ctx.save();
                this.roundRect(ctx, screenshotX, screenshotY, screenshotWidth, screenshotHeight, innerBorderRadius);
                ctx.clip();
                ctx.drawImage(this.state.screenshot, screenshotX, screenshotY, screenshotWidth, screenshotHeight);
                ctx.restore();
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

/**
 * ShapeGrid - Vanilla JS Version
 * Ported from React component provided by user.
 */
class ShapeGrid {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.direction = options.direction || 'right';
    this.speed = options.speed || 1;
    this.borderColor = options.borderColor || '#999';
    this.squareSize = options.squareSize || 40;
    this.hoverFillColor = options.hoverFillColor || '#222';
    this.shape = options.shape || 'square';
    this.hoverTrailAmount = options.hoverTrailAmount || 0;

    this.numSquaresX = 0;
    this.numSquaresY = 0;
    this.gridOffset = { x: 0, y: 0 };
    this.hoveredSquare = null;
    this.trailCells = [];
    this.cellOpacities = new Map();
    this.requestRef = null;

    this.init();
  }

  init() {
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.updateAnimation = this.updateAnimation.bind(this);

    window.addEventListener('resize', this.resizeCanvas);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);

    this.resizeCanvas();
    this.requestRef = requestAnimationFrame(this.updateAnimation);
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.numSquaresX = Math.ceil(this.canvas.width / this.squareSize) + 1;
    this.numSquaresY = Math.ceil(this.canvas.height / this.squareSize) + 1;
  }

  drawHex(cx, cy, size) {
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const vx = cx + size * Math.cos(angle);
      const vy = cy + size * Math.sin(angle);
      if (i === 0) this.ctx.moveTo(vx, vy);
      else this.ctx.lineTo(vx, vy);
    }
    this.ctx.closePath();
  }

  drawCircle(cx, cy, size) {
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    this.ctx.closePath();
  }

  drawTriangle(cx, cy, size, flip) {
    this.ctx.beginPath();
    if (flip) {
      this.ctx.moveTo(cx, cy + size / 2);
      this.ctx.lineTo(cx + size / 2, cy - size / 2);
      this.ctx.lineTo(cx - size / 2, cy - size / 2);
    } else {
      this.ctx.moveTo(cx, cy - size / 2);
      this.ctx.lineTo(cx + size / 2, cy + size / 2);
      this.ctx.lineTo(cx - size / 2, cy + size / 2);
    }
    this.ctx.closePath();
  }

  drawGrid() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const isHex = this.shape === 'hexagon';
    const isTri = this.shape === 'triangle';
    const hexHoriz = this.squareSize * 1.5;
    const hexVert = this.squareSize * Math.sqrt(3);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isHex) {
      const colShift = Math.floor(this.gridOffset.x / hexHoriz);
      const offsetX = ((this.gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
      const offsetY = ((this.gridOffset.y % hexVert) + hexVert) % hexVert;
      const cols = Math.ceil(canvas.width / hexHoriz) + 3;
      const rows = Math.ceil(canvas.height / hexVert) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * hexHoriz + offsetX;
          const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY;
          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this.drawHex(cx, cy, this.squareSize);
            ctx.fillStyle = this.hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          this.drawHex(cx, cy, this.squareSize);
          ctx.strokeStyle = this.borderColor;
          ctx.stroke();
        }
      }
    } else if (isTri) {
      const halfW = this.squareSize / 2;
      const colShift = Math.floor(this.gridOffset.x / halfW);
      const rowShift = Math.floor(this.gridOffset.y / this.squareSize);
      const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
      const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;
      const cols = Math.ceil(canvas.width / halfW) + 4;
      const rows = Math.ceil(canvas.height / this.squareSize) + 4;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * halfW + offsetX;
          const cy = row * this.squareSize + this.squareSize / 2 + offsetY;
          const flip = ((col + colShift + row + rowShift) % 2 + 2) % 2 !== 0;
          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this.drawTriangle(cx, cy, this.squareSize, flip);
            ctx.fillStyle = this.hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          this.drawTriangle(cx, cy, this.squareSize, flip);
          ctx.strokeStyle = this.borderColor;
          ctx.stroke();
        }
      }
    } else if (this.shape === 'circle') {
      const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
      const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;
      const cols = Math.ceil(canvas.width / this.squareSize) + 3;
      const rows = Math.ceil(canvas.height / this.squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * this.squareSize + this.squareSize / 2 + offsetX;
          const cy = row * this.squareSize + this.squareSize / 2 + offsetY;
          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this.drawCircle(cx, cy, this.squareSize);
            ctx.fillStyle = this.hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          this.drawCircle(cx, cy, this.squareSize);
          ctx.strokeStyle = this.borderColor;
          ctx.stroke();
        }
      }
    } else {
      const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
      const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;
      const cols = Math.ceil(canvas.width / this.squareSize) + 3;
      const rows = Math.ceil(canvas.height / this.squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const sx = col * this.squareSize + offsetX;
          const sy = row * this.squareSize + offsetY;
          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.hoverFillColor;
            ctx.fillRect(sx, sy, this.squareSize, this.squareSize);
            ctx.globalAlpha = 1;
          }
          ctx.strokeStyle = this.borderColor;
          ctx.strokeRect(sx, sy, this.squareSize, this.squareSize);
        }
      }
    }

    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    // Removed the fillRect gradient to avoid blocking background visibility
  }

  updateAnimation() {
    const effectiveSpeed = Math.max(this.speed, 0.1);
    const isHex = this.shape === 'hexagon';
    const isTri = this.shape === 'triangle';
    const hexHoriz = this.squareSize * 1.5;
    const hexVert = this.squareSize * Math.sqrt(3);
    const wrapX = isHex ? hexHoriz * 2 : this.squareSize;
    const wrapY = isHex ? hexVert : isTri ? this.squareSize * 2 : this.squareSize;

    switch (this.direction) {
      case 'right':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
        break;
      case 'left':
        this.gridOffset.x = (this.gridOffset.x + effectiveSpeed + wrapX) % wrapX;
        break;
      case 'up':
        this.gridOffset.y = (this.gridOffset.y + effectiveSpeed + wrapY) % wrapY;
        break;
      case 'down':
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
        break;
      case 'diagonal':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
        break;
    }

    this.updateCellOpacities();
    this.drawGrid();
    this.requestRef = requestAnimationFrame(this.updateAnimation);
  }

  updateCellOpacities() {
    const targets = new Map();
    if (this.hoveredSquare) {
      targets.set(`${this.hoveredSquare.x},${this.hoveredSquare.y}`, 1);
    }

    if (this.hoverTrailAmount > 0) {
      for (let i = 0; i < this.trailCells.length; i++) {
        const t = this.trailCells[i];
        const key = `${t.x},${t.y}`;
        if (!targets.has(key)) {
          targets.set(key, (this.trailCells.length - i) / (this.trailCells.length + 1));
        }
      }
    }

    for (const [key] of targets) {
      if (!this.cellOpacities.has(key)) {
        this.cellOpacities.set(key, 0);
      }
    }

    for (const [key, opacity] of this.cellOpacities) {
      const target = targets.get(key) || 0;
      const next = opacity + (target - opacity) * 0.15;
      if (next < 0.005) {
        this.cellOpacities.delete(key);
      } else {
        this.cellOpacities.set(key, next);
      }
    }
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const isHex = this.shape === 'hexagon';
    const isTri = this.shape === 'triangle';
    const hexHoriz = this.squareSize * 1.5;
    const hexVert = this.squareSize * Math.sqrt(3);

    let col, row;
    if (isHex) {
      const colShift = Math.floor(this.gridOffset.x / hexHoriz);
      const offsetX = ((this.gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
      const offsetY = ((this.gridOffset.y % hexVert) + hexVert) % hexVert;
      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;
      col = Math.round(adjustedX / hexHoriz);
      const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
      row = Math.round((adjustedY - rowOffset) / hexVert);
    } else if (isTri) {
      const halfW = this.squareSize / 2;
      const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
      const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;
      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;
      col = Math.round(adjustedX / halfW);
      row = Math.floor(adjustedY / this.squareSize);
    } else if (this.shape === 'circle') {
      const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
      const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;
      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;
      col = Math.round(adjustedX / this.squareSize);
      row = Math.round(adjustedY / this.squareSize);
    } else {
      const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
      const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;
      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;
      col = Math.floor(adjustedX / this.squareSize);
      row = Math.floor(adjustedY / this.squareSize);
    }

    if (!this.hoveredSquare || this.hoveredSquare.x !== col || this.hoveredSquare.y !== row) {
      if (this.hoveredSquare && this.hoverTrailAmount > 0) {
        this.trailCells.unshift({ ...this.hoveredSquare });
        if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
      }
      this.hoveredSquare = { x: col, y: row };
    }
  }

  handleMouseLeave() {
    if (this.hoveredSquare && this.hoverTrailAmount > 0) {
      this.trailCells.unshift({ ...this.hoveredSquare });
      if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
    }
    this.hoveredSquare = null;
  }

  destroy() {
    window.removeEventListener('resize', this.resizeCanvas);
    cancelAnimationFrame(this.requestRef);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}

// Global initialization function
window.initShapeGrid = (canvasId, options) => {
  const canvas = document.getElementById(canvasId);
  if (canvas) return new ShapeGrid(canvas, options);
  return null;
};

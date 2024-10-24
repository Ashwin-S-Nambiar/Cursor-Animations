class CursorTrail {
  constructor() {
    this.images = [
      './images/image1.jpg',
      './images/image2.jpg',
      './images/image3.jpg'
    ];
    this.trailElements = [];
    this.currentIndex = 0;
    this.timeouts = [];
    this.lastMoveTime = 0;
    this.moveThreshold = 5; // Minimum pixels moved to trigger new image
    this.lastX = 0;
    this.lastY = 0;
    
    this.init();
  }

  init() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  createTrailElement(x, y) {
    const trail = document.createElement('div');
    trail.className = 'trail-image';
    
    const img = document.createElement('img');
    img.src = this.images[this.currentIndex];
    trail.appendChild(img);
    
    document.body.appendChild(trail);
    
    // Initial position and state
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    
    // Trigger reflow
    trail.offsetHeight;
    
    // Animate in
    requestAnimationFrame(() => {
      trail.style.opacity = '1';
      trail.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Remove after animation
    const timeout = setTimeout(() => {
      trail.style.opacity = '0';
      trail.style.transform = 'translate(-50%, -50%) scale(0.8)';
      
      setTimeout(() => {
        trail.remove();
      }, 500);
    }, 1000);
    
    this.timeouts.push(timeout);
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    
    return trail;
  }

  handleMouseMove(e) {
    const currentTime = Date.now();
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only create new trail element if moved enough and enough time has passed
    if (distance > this.moveThreshold && currentTime - this.lastMoveTime > 100) {
      this.createTrailElement(e.clientX, e.clientY);
      this.lastMoveTime = currentTime;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }
  }

  // Clean up method
  destroy() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.trailElements.forEach(element => element.remove());
    document.removeEventListener('mousemove', this.handleMouseMove);
  }
}

// Initialize
const cursorTrail = new CursorTrail();
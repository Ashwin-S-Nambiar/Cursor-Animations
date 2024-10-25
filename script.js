class CursorTrail {
  constructor() {
    this.trailElements = [];
    this.timeouts = [];
    this.lastMoveTime = 0;
    this.moveThreshold = 5;
    this.lastX = 0;
    this.lastY = 0;
    this.currentIndex = 0;
    this.isHovering = false;
    this.currentImages = [];
    
    this.init();
  }

  init() {
    // Add mousemove listener to handle trail creation
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Add event listeners to all hover-trail elements
    const hoverElements = document.querySelectorAll('.hover-trail');
    hoverElements.forEach(element => {
      // Get images from data attribute
      // Expects data-images to be a comma-separated list of image paths
      const imagePathsStr = element.dataset.images;
      const imagePaths = imagePathsStr ? imagePathsStr.split(',').map(path => path.trim()) : [];
      
      element.addEventListener('mouseenter', () => {
        this.isHovering = true;
        this.currentImages = imagePaths;
        this.currentIndex = 0;
      });
      
      element.addEventListener('mouseleave', () => {
        this.isHovering = false;
        this.currentImages = [];
      });
    });
  }

  createTrailElement(x, y) {
    if (!this.isHovering || this.currentImages.length === 0) return;
    
    const trail = document.createElement('div');
    trail.className = 'trail-image';
    
    const img = document.createElement('img');
    img.src = this.currentImages[this.currentIndex];
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
    this.currentIndex = (this.currentIndex + 1) % this.currentImages.length;
    
    return trail;
  }

  handleMouseMove(e) {
    if (!this.isHovering) return;
    
    const currentTime = Date.now();
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > this.moveThreshold && currentTime - this.lastMoveTime > 100) {
      this.createTrailElement(e.clientX, e.clientY);
      this.lastMoveTime = currentTime;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }
  }

  destroy() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.trailElements.forEach(element => element.remove());
    document.removeEventListener('mousemove', this.handleMouseMove);
  }
}

// Initialize
const cursorTrail = new CursorTrail();
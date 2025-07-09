/**
 * Common JavaScript functionality for Fusefy slides
 * Ensures consistent behavior and scaling across all slides
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing slide consistency features');
  
  // Apply hover handlers to all funnel elements
  setupGlobalHoverHandlers();
  
  // Set up resize handler for consistent scaling
  window.addEventListener('resize', adjustContentScaling);
  adjustContentScaling(); // Run once on load
  
  // Once Reveal is loaded
  window.addEventListener('load', function() {
    if (typeof Reveal !== 'undefined') {
      // Configure fragment appearance settings consistently
      Reveal.configure({
        // Use a shorter fragment appearance time
        fragmentInTransition: 'slide-in fade-in',
        fragmentOutTransition: 'slide-out fade-out',
        // Ensure fragments are visible
        fragments: true,
        // Avoid fragment issues
        preloadFragments: true
      });

      // Add consistent event listeners for fragments
      Reveal.addEventListener('fragmentshown', function(event) {
        // Add active class to fragment for additional styling
        if (event.fragment) {
          event.fragment.classList.add('active');
        }
      });

      // Remove active class when fragment is hidden
      Reveal.addEventListener('fragmenthidden', function(event) {
        if (event.fragment) {
          event.fragment.classList.remove('active');
        }
      });
      
      // Add listeners for slide changes to apply consistent behavior
      Reveal.addEventListener('slidechanged', function(event) {
        // Reapply scaling when slides change
        adjustContentScaling();
        
        // Setup hover handlers again for the new slide
        setupGlobalHoverHandlers();
      });
    }
  });
});

/**
 * Sets up hover handlers for all funnel elements and info boxes
 * across all slides for consistent behavior
 */
function setupGlobalHoverHandlers() {
  console.log('Setting up global hover handlers');
  
  // Apply to all slides
  const allFunnelLevels = document.querySelectorAll('.funnel-level');
  const allInfoBoxes = document.querySelectorAll('.info-box');
  
  console.log(`Found ${allFunnelLevels.length} funnel levels and ${allInfoBoxes.length} info boxes globally`);
  
  // Apply hover handlers to funnel levels
  allFunnelLevels.forEach(function(level) {
    level.addEventListener('mouseenter', function() {
      // Find the level number from class name
      const levelClass = Array.from(this.classList)
        .find(cls => cls.startsWith('funnel-level-'));
      
      if (!levelClass) return;
      
      const levelNum = parseInt(levelClass.split('-').pop());
      const infoBoxId = `info-box-${levelNum-1}`;
      const infoBox = document.getElementById(infoBoxId);
      
      if (infoBox) {
        // Show info box
        infoBox.style.display = 'block';
        infoBox.classList.add('hover-visible');
        
        // Position it near the funnel level
        positionInfoBoxGlobal(infoBox, this);
      }
    });
    
    level.addEventListener('mouseleave', function() {
      // Find the level number from class name
      const levelClass = Array.from(this.classList)
        .find(cls => cls.startsWith('funnel-level-'));
      
      if (!levelClass) return;
      
      const levelNum = parseInt(levelClass.split('-').pop());
      const infoBoxId = `info-box-${levelNum-1}`;
      const infoBox = document.getElementById(infoBoxId);
      
      if (infoBox) {
        // Hide after a delay to allow mouse to move to the info box
        setTimeout(function() {
          if (!infoBox.matches(':hover')) {
            infoBox.classList.remove('hover-visible');
            setTimeout(function() {
              if (!infoBox.classList.contains('hover-visible') && !infoBox.classList.contains('active')) {
                infoBox.style.display = 'none';
              }
            }, 300);
          }
        }, 200);
      }
    });
  });
  
  // Apply hover handlers to info boxes
  allInfoBoxes.forEach(function(box) {
    box.addEventListener('mouseenter', function() {
      this.classList.add('hover-visible');
    });
    
    box.addEventListener('mouseleave', function() {
      this.classList.remove('hover-visible');
      
      // Hide after transition completes if not active
      setTimeout(() => {
        if (!this.classList.contains('hover-visible') && !this.classList.contains('active')) {
          this.style.display = 'none';
        }
      }, 300);
    });
    
    // Set up close button
    const closeBtn = box.querySelector('.info-box-close');
    if (closeBtn) {
      closeBtn.onclick = function(e) {
        e.stopPropagation();
        box.classList.remove('hover-visible');
        box.classList.remove('active');
        
        setTimeout(() => {
          if (!box.classList.contains('hover-visible') && !box.classList.contains('active')) {
            box.style.display = 'none';
          }
        }, 300);
      };
    }
  });
}

/**
 * Global function to position info boxes near funnel elements
 * Used for consistent positioning across all slides
 */
function positionInfoBoxGlobal(infoBox, targetElement) {
  if (!infoBox || !targetElement) return;
  
  const targetRect = targetElement.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Ensure the info box is temporarily visible for measuring
  const originalVisibility = infoBox.style.visibility;
  const originalOpacity = infoBox.style.opacity;
  
  infoBox.style.visibility = 'hidden';
  infoBox.style.opacity = '0';
  
  // Force layout to get dimensions
  const infoBoxWidth = infoBox.offsetWidth || 240;
  const infoBoxHeight = infoBox.offsetHeight || 180;
  
  // Restore original styles
  infoBox.style.visibility = originalVisibility;
  infoBox.style.opacity = originalOpacity;
  
  // For consistent positioning, always place boxes on the right at larger screens
  const shouldPositionOnRight = windowWidth >= 1280;
  
  // Remove any existing positioning classes
  infoBox.classList.remove('left-side');
  infoBox.classList.remove('right-side');
  
  let leftPos;
  if (shouldPositionOnRight) {
    leftPos = Math.min(windowWidth - infoBoxWidth - 10, targetRect.right + 10);
    infoBox.classList.add('right-side');
  } else {
    // Position based on which half of the screen the target is in
    const isInRightHalf = (targetRect.left + targetRect.width/2) > windowWidth/2;
    
    if (isInRightHalf) {
      leftPos = Math.max(10, targetRect.left - infoBoxWidth - 10);
      infoBox.classList.add('left-side');
    } else {
      leftPos = Math.min(windowWidth - infoBoxWidth - 10, targetRect.right + 10);
      infoBox.classList.add('right-side');
    }
  }
  
  // Vertical positioning - center with target
  const centerY = targetRect.top + targetRect.height / 2;
  const topPos = centerY - infoBoxHeight / 2;
  
  // Ensure it stays on screen
  const finalTop = Math.max(10, Math.min(windowHeight - infoBoxHeight - 10, topPos));
  
  // Apply position
  infoBox.style.position = 'fixed';
  infoBox.style.left = leftPos + 'px';
  infoBox.style.top = finalTop + 'px';
}

/**
 * Adjusts scaling of content based on screen size
 * Ensures all content fits properly at 100% scale
 */
function adjustContentScaling() {
  console.log('Adjusting global content scaling');
  
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Scale factor based on screen size
  let scaleFactor = 1;
  
  if (windowWidth >= 1920) {
    scaleFactor = 0.95; // Slight reduction for very large screens
  } else if (windowWidth >= 1600) {
    scaleFactor = 0.92;
  } else if (windowWidth >= 1440) {
    scaleFactor = 0.9;
  } else if (windowWidth >= 1280) {
    scaleFactor = 0.85;
  } else if (windowWidth >= 1024) {
    scaleFactor = 0.8;
  } else {
    scaleFactor = 0.75; // Smaller screens need more reduction
  }
  
  // Apply font size scaling to all slide contents
  document.querySelectorAll('.reveal .slides section').forEach(function(slideSection) {
    slideSection.style.fontSize = `${scaleFactor * 100}%`;
  });
  
  // Scale specific elements that might need extra attention
  document.querySelectorAll('.funnel-3d-container').forEach(function(funnel) {
    funnel.style.height = `${Math.min(380, windowHeight * 0.5)}px`;
  });
  
  // Scale headings based on screen width
  document.querySelectorAll('.reveal h2').forEach(function(heading) {
    if (windowWidth <= 1280) {
      heading.style.fontSize = '22px';
    } else if (windowWidth <= 1440) {
      heading.style.fontSize = '24px';
    }
  });
  
  console.log(`Applied scaling factor: ${scaleFactor}`);
}

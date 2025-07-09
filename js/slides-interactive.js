/**
 * Global interactive elements handler for all Fusefy slides
 * This file manages all click events, animations, and interactive elements
 * across all slides to ensure consistent behavior.
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Slides interactive handler initialized');
  
  // Initialize all slide interactivity
  setupAllSlideInteractions();
  
  // Listen for Reveal.js events if available
  if (typeof Reveal !== 'undefined') {
    // Re-initialize when slides change
    Reveal.addEventListener('slidechanged', function(event) {
      console.log('Slide changed, reinitializing interactions');
      setupAllSlideInteractions();
      
      // Reset to first fragment on index slide
      if (event.currentSlide && event.currentSlide.classList.contains("index-slide")) {
        Reveal.navigateFragment(-1); // Reset to beginning
      }
    });
    
    // Handle fragment events
    Reveal.addEventListener('fragmentshown', function(event) {
      handleFragmentVisibility(event.fragment, true);
    });
    
    Reveal.addEventListener('fragmenthidden', function(event) {
      handleFragmentVisibility(event.fragment, false);
    });
  } else {
    // If Reveal.js isn't available yet, wait for it
    window.addEventListener('load', function() {
      if (typeof Reveal !== 'undefined') {
        Reveal.addEventListener('ready', function() {
          setupAllSlideInteractions();
        });
      }
    });
  }
});

/**
 * Master function to set up all interactive elements
 */
function setupAllSlideInteractions() {
  // Setup clickable images for zoom
  setupZoomableImages();
  
  // Setup navigation buttons within slides
  setupNavigationButtons();
  
  // Setup progress rings and multipliers in business impact slide
  setupBusinessImpactAnimations();
  
  // Add pulse effect to logos
  setupLogoPulseEffects();
  
  // Setup any other interactive elements
  setupMiscInteractions();
}

/**
 * Handle clickable images that show a zoomed version
 */
function setupZoomableImages() {
  // Remove any existing event listeners
  document.querySelectorAll('.clickable-image').forEach(img => {
    img.removeAttribute('onclick');
  });
  
  // Add event delegation for clickable images
  document.addEventListener('click', function(event) {
    // Check if the clicked element has the clickable-image class
    if (event.target.classList.contains('clickable-image')) {
      event.preventDefault();
      event.stopPropagation();
      
      const imgSrc = event.target.getAttribute('data-src') || event.target.src;
      showZoom(imgSrc);
      return false;
    }
    
    // Handle zoom overlay close button
    if (event.target.closest('.close-zoom')) {
      event.preventDefault();
      event.stopPropagation();
      closeZoom();
      return false;
    }
  }, true);

  // Keyboard event for closing zoom overlay
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const zoomOverlay = document.querySelector('.zoom-overlay.active');
      if (zoomOverlay) {
        closeZoom();
        event.preventDefault();
      }
    }
  });
}

/**
 * Show zoomed image in overlay
 */
function showZoom(imgSrc) {
  let overlay = document.getElementById('zoomOverlay');
  
  // If the overlay doesn't exist, create it
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'zoomOverlay';
    overlay.className = 'zoom-overlay';
    overlay.innerHTML = `
      <div class="close-zoom">×</div>
      <img class="zoom-image" id="zoomedImage" src="" alt="Zoomed Image" />
    `;
    document.body.appendChild(overlay);
  }
  
  const zoomedImg = document.getElementById('zoomedImage');
  zoomedImg.src = imgSrc;
  overlay.classList.add('active');
  
  if (typeof Reveal !== 'undefined') {
    Reveal.configure({ keyboard: false });
  }
}

/**
 * Close zoomed image overlay
 */
function closeZoom() {
  const overlay = document.getElementById('zoomOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
  
  if (typeof Reveal !== 'undefined') {
    Reveal.configure({ keyboard: true });
  }
}

/**
 * Setup navigation buttons within slides
 */
function setupNavigationButtons() {
  // Remove any existing event handlers
  document.querySelectorAll('#next-button, #back-button').forEach(btn => {
    btn.removeAttribute('onclick');
  });
  
  // Use event delegation for navigation buttons
  document.addEventListener('click', function(event) {
    // Next button in slide3
    if (event.target.closest('#next-button')) {
      event.preventDefault();
      event.stopPropagation();
      
      const aiSlide = document.querySelector('.ai-adoption-slide');
      if (aiSlide) {
        // Get references to content sets
        const contentSet1 = document.getElementById('content-set-1');
        const contentSet2 = document.getElementById('content-set-2');
        
        if (contentSet1 && contentSet2) {
          contentSet1.style.display = 'none';
          contentSet2.style.display = 'block';
          
          // Animate elements
          const title = contentSet2.querySelector('.services-title');
          const boxes = contentSet2.querySelectorAll('.service-box');
          const backButton = contentSet2.querySelector('.back-button-container');
          
          if (title) title.style.animation = 'fadeInUp 0.6s 0.2s forwards';
          if (boxes.length) {
            boxes.forEach((box, index) => {
              box.style.animation = `fadeInUp 0.6s ${0.4 + index * 0.2}s forwards`;
            });
          }
          if (backButton) backButton.style.animation = 'fadeIn 0.8s 1.2s forwards';
        }
      }
      return false;
    }
    
    // Back button in slide3
    if (event.target.closest('#back-button')) {
      event.preventDefault();
      event.stopPropagation();
      
      const aiSlide = document.querySelector('.ai-adoption-slide');
      if (aiSlide) {
        // Get references to content sets
        const contentSet1 = document.getElementById('content-set-1');
        const contentSet2 = document.getElementById('content-set-2');
        
        if (contentSet1 && contentSet2) {
          contentSet2.style.display = 'none';
          contentSet1.style.display = 'block';
          
          // Reset animations in content-set-2
          const elementsToReset = contentSet2.querySelectorAll('.animate-on-show');
          elementsToReset.forEach(el => el.style.animation = 'none');
        }
      }
      return false;
    }
  }, true);
  
  // Add keyboard navigation support
  document.addEventListener('keydown', function(event) {
    const aiSlide = document.querySelector('.ai-adoption-slide');
    if (!aiSlide) return;
    
    if (event.key === 'ArrowDown') {
      const currentSlide = typeof Reveal !== 'undefined' ? Reveal.getCurrentSlide() : aiSlide;
      if (currentSlide && currentSlide.classList.contains('ai-adoption-slide')) {
        const contentSet1 = document.getElementById('content-set-1');
        const contentSet2 = document.getElementById('content-set-2');
        if (contentSet1 && contentSet2 && getComputedStyle(contentSet1).display !== 'none') {
          contentSet1.style.display = 'none';
          contentSet2.style.display = 'block';
          
          // Animate elements
          const title = contentSet2.querySelector('.services-title');
          const boxes = contentSet2.querySelectorAll('.service-box');
          const backButton = contentSet2.querySelector('.back-button-container');
          
          if (title) title.style.animation = 'fadeInUp 0.6s 0.2s forwards';
          if (boxes.length) {
            boxes.forEach((box, index) => {
              box.style.animation = `fadeInUp 0.6s ${0.4 + index * 0.2}s forwards`;
            });
          }
          if (backButton) backButton.style.animation = 'fadeIn 0.8s 1.2s forwards';
          
          event.preventDefault();
        }
      }
    } else if (event.key === 'ArrowUp') {
      const currentSlide = typeof Reveal !== 'undefined' ? Reveal.getCurrentSlide() : aiSlide;
      if (currentSlide && currentSlide.classList.contains('ai-adoption-slide')) {
        const contentSet1 = document.getElementById('content-set-1');
        const contentSet2 = document.getElementById('content-set-2');
        if (contentSet1 && contentSet2 && getComputedStyle(contentSet2).display !== 'none') {
          contentSet2.style.display = 'none';
          contentSet1.style.display = 'block';
          
          // Reset animations in content-set-2
          const elementsToReset = contentSet2.querySelectorAll('.animate-on-show');
          elementsToReset.forEach(el => el.style.animation = 'none');
          
          event.preventDefault();
        }
      }
    }
  });
}

/**
 * Handle business impact slide animations (progress rings, multipliers)
 */
function setupBusinessImpactAnimations() {
  const businessImpactSlide = document.querySelector('.business-impact-slide');
  if (!businessImpactSlide) return;
  
  // Ensure the slide header is always visible
  const slideHeader = businessImpactSlide.querySelector('.slide-header');
  if (slideHeader) {
    slideHeader.style.visibility = 'visible';
    slideHeader.style.opacity = '1';
  }
  
  // Calculate offset for progress rings
  const circles = businessImpactSlide.querySelectorAll('.progress-ring-circle');
  circles.forEach(circle => {
    const radius = circle.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    
    // Set the stroke-dasharray to the circumference
    const valueCircle = circle.nextElementSibling;
    if (valueCircle && valueCircle.classList.contains('progress-ring-circle-value')) {
      valueCircle.style.strokeDasharray = `${circumference}`;
      valueCircle.setAttribute('data-circumference', circumference);
      
      // Initially set to full circumference (0% progress)
      valueCircle.style.strokeDashoffset = circumference;
    }
  });
  
  // Initialize animations if this is not within Reveal.js
  if (typeof Reveal === 'undefined') {
    // Find all animation elements
    const ringCircles = businessImpactSlide.querySelectorAll('.progress-ring-circle-value');
    const animateCounts = businessImpactSlide.querySelectorAll('.animate-count');
    const multiplierProgress = businessImpactSlide.querySelectorAll('.multiplier-progress');
    const activeMarkers = businessImpactSlide.querySelectorAll('.multiplier-marker.active');
    const currentMarkers = businessImpactSlide.querySelectorAll('.multiplier-marker.current');
    const multiplierValues = businessImpactSlide.querySelectorAll('.multiplier-value');
    
    // Animate all elements
    ringCircles.forEach(circle => circle.classList.add('animate'));
    animateCounts.forEach(count => count.classList.add('animate'));
    multiplierProgress.forEach(progress => progress.classList.add('animate'));
    activeMarkers.forEach(marker => marker.classList.add('animate'));
    currentMarkers.forEach(marker => marker.classList.add('animate'));
    multiplierValues.forEach(value => value.classList.add('animate'));
  }
}

/**
 * Handle fragment visibility changes
 */
function handleFragmentVisibility(fragment, isVisible) {
  if (!fragment) return;
  
  // Check if it's a business impact slide fragment
  if (fragment.closest('.business-impact-slide')) {
    // Find all animation elements within this fragment
    const ringCircle = fragment.querySelector('.progress-ring-circle-value');
    const animateCount = fragment.querySelector('.animate-count');
    const multiplierProgress = fragment.querySelector('.multiplier-progress');
    const activeMarkers = fragment.querySelectorAll('.multiplier-marker.active');
    const currentMarker = fragment.querySelector('.multiplier-marker.current');
    const multiplierValue = fragment.querySelector('.multiplier-value');
    
    if (isVisible) {
      // Animate the progress ring
      if (ringCircle) {
        // Get the target percentage from the associated counter
        const percentEl = fragment.querySelector('.animate-count');
        let targetPercent = 0;
        
        if (percentEl) {
          targetPercent = parseInt(percentEl.style.getPropertyValue('--target-value') || "0");
        }
        
        // Calculate the appropriate strokeDashoffset
        const circumference = parseFloat(ringCircle.getAttribute('data-circumference') || 2 * Math.PI * 20);
        const targetOffset = calculateOffset(targetPercent, circumference);
        
        // Apply the calculated offset
        ringCircle.style.setProperty('--target-offset', targetOffset);
        ringCircle.classList.add('animate');
      }
      
      // Animate the counter
      if (animateCount) {
        animateCount.classList.add('animate');
      }
      
      // Animate the multiplier progress bar
      if (multiplierProgress) {
        multiplierProgress.classList.add('animate');
      }
      
      // Animate the active markers
      if (activeMarkers.length) {
        activeMarkers.forEach(marker => marker.classList.add('animate'));
      }
      
      // Animate the current marker
      if (currentMarker) {
        currentMarker.classList.add('animate');
      }
      
      // Animate the multiplier value
      if (multiplierValue) {
        multiplierValue.classList.add('animate');
      }
    } else {
      // Reset the progress ring animation
      if (ringCircle) {
        const circumference = parseFloat(ringCircle.getAttribute('data-circumference') || 2 * Math.PI * 20);
        ringCircle.style.strokeDashoffset = circumference; // Reset to 0%
        ringCircle.classList.remove('animate');
      }
      
      // Reset the counter animation
      if (animateCount) {
        animateCount.classList.remove('animate');
      }
      
      // Reset the multiplier progress animation
      if (multiplierProgress) {
        multiplierProgress.style.width = '0%';
        multiplierProgress.classList.remove('animate');
      }
      
      // Reset the active markers animation
      if (activeMarkers.length) {
        activeMarkers.forEach(marker => marker.classList.remove('animate'));
      }
      
      // Reset the current marker animation
      if (currentMarker) {
        currentMarker.classList.remove('animate');
      }
      
      // Reset the multiplier value animation
      if (multiplierValue) {
        multiplierValue.classList.remove('animate');
      }
    }
  }
}

/**
 * Calculate stroke-dashoffset based on percentage
 */
function calculateOffset(percent, circumference) {
  return circumference - (circumference * percent / 100);
}

/**
 * Setup the Storylane demos for agent cards
 */
function setupStorylaneDemos() {
  // Check if we're on the intelligent agents slide
  const agentsSlide = document.querySelector('.intelligent-agents-slide');
  if (!agentsSlide) return;
  
  // Remove any existing event listeners from agent cards
  document.querySelectorAll('.agent-card').forEach(card => {
    card.removeAttribute('onclick');
    
    // Add visual feedback for clickability
    card.classList.add('clickable');
    
    // Show loading indicator on hover
    card.addEventListener('mouseenter', function() {
      this.classList.add('loading');
      
      // Trigger preload on hover if preloader is available
      const agentId = this.getAttribute('data-agent-id');
      if (agentId && window.storylaneUtils && typeof window.storylaneUtils.preloadStorylaneDemos === 'function') {
        window.storylaneUtils.preloadStorylaneDemos(agentId);
      }
    });
  });
  
  // Use event delegation for agent card clicks
  document.addEventListener('click', function(event) {
    const agentCard = event.target.closest('.agent-card');
    if (agentCard) {
      event.preventDefault();
      event.stopPropagation();
      
      // Get the agent ID from the data attribute
      const agentId = agentCard.getAttribute('data-agent-id');
      if (!agentId) return;
      
      // Visual feedback on click
      agentCard.classList.add('clicked');
      
      // Show the corresponding Storylane modal
      showStoryLaneModal(agentId);
      
      // Reset visual state after delay
      setTimeout(() => {
        agentCard.classList.remove('clicked');
      }, 1000);
      
      return false;
    }
    
    // Handle modal close button
    if (event.target.closest('.close-storylane')) {
      event.preventDefault();
      event.stopPropagation();
      closeStoryLaneModals();
      return false;
    }
  }, true);

  // Keyboard event for closing Storylane modals
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const activeModal = document.querySelector('.storylane-modal.active');
      if (activeModal) {
        closeStoryLaneModals();
        event.preventDefault();
      }
    }
  });
  
  // Start preloading if the preloader is available
  if (typeof initStorylaneDemoPreloader === 'function') {
    initStorylaneDemoPreloader();
  }
}

/**
 * Show a specific Storylane modal
 */
function showStoryLaneModal(agentId) {
  // Close any open modals first
  closeStoryLaneModals();
  
  // Map agent IDs to their corresponding modal IDs
  const modalMap = {
    'po-agent': 'storylane-modal-po',
    'onboarding-agent': 'storylane-modal-onboarding',
    'interview-agent': 'storylane-modal-interview',
    'claim-agent': 'storylane-modal-claim'
  };
  
  const modalId = modalMap[agentId];
  if (!modalId) return;
  
  // Show the corresponding modal
  const modal = document.getElementById(modalId);
  if (modal) {
    console.log(`Opening modal for ${agentId}...`);
    
    // Make sure the overflow is hidden on body to prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Try to use a preloaded iframe if available
    let usedPreloadedFrame = false;
    if (window.storylaneUtils && typeof window.storylaneUtils.swapPreloadedIframe === 'function') {
      usedPreloadedFrame = window.storylaneUtils.swapPreloadedIframe(agentId);
      console.log(`Using preloaded frame: ${usedPreloadedFrame}`);
    }
    
    // Activate the modal
    modal.classList.add('active');
    
    // Handle iframe loading if not using preloaded frame
    if (!usedPreloadedFrame) {
      const iframe = modal.querySelector('iframe');
      if (iframe) {
        // Show a loading spinner or text until the iframe is fully loaded
        iframe.style.opacity = '0';
        
        iframe.addEventListener('load', function() {
          // Make iframe visible once loaded
          iframe.style.opacity = '1';
          
          // If we want to add transition effect
          iframe.style.transition = 'opacity 0.3s ease';
        });
      }
    }
    
    // Disable Reveal.js keyboard navigation while modal is open
    if (typeof Reveal !== 'undefined') {
      Reveal.configure({ keyboard: false });
    }
  }
}

/**
 * Close all Storylane modals
 */
function closeStoryLaneModals() {
  document.querySelectorAll('.storylane-modal').forEach(modal => {
    modal.classList.remove('active');
  });
  
  // Restore body scrolling
  document.body.style.overflow = '';
  
  // Re-enable Reveal.js keyboard navigation
  if (typeof Reveal !== 'undefined') {
    Reveal.configure({ keyboard: true });
  }
}

/**
 * Setup logo pulse effects
 */
function setupLogoPulseEffects() {
  // Remove inline onclick handlers
  document.querySelectorAll('.company-logo, .fusefy-logo').forEach(logo => {
    logo.removeAttribute('onclick');
  });
  
  // Use event delegation for logo clicks
  document.addEventListener('click', function(event) {
    const logo = event.target.closest('.company-logo, .fusefy-logo');
    if (logo) {
      event.preventDefault();
      event.stopPropagation();
      
      logo.classList.add('pulse');
      setTimeout(() => logo.classList.remove('pulse'), 500);
      
      return false;
    }
  });
}

/**
 * Setup other miscellaneous interactions
 */
function setupMiscInteractions() {
  // Reset animations when slides become visible
  const aiSlide = document.querySelector('.ai-adoption-slide');
  if (aiSlide) {
    // Only run if not already initialized or if slide is active
    if (!aiSlide.dataset.initialized || 
        (typeof Reveal !== 'undefined' && Reveal.getCurrentSlide() === aiSlide)) {
      
      // Show content set 1 by default
      const contentSet1 = document.getElementById('content-set-1');
      const contentSet2 = document.getElementById('content-set-2');
      
      if (contentSet1 && contentSet2) {
        contentSet1.style.display = 'block';
        contentSet2.style.display = 'none';
      }
      
      // Reset and restart animations
      const animatedElements = aiSlide.querySelectorAll('.animate-on-load');
      animatedElements.forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth; // Force reflow
        el.style.animation = '';
      });
      
      // Ensure next button is visible
      const buttonDiv = document.getElementById('next-button-wrapper');
      if (buttonDiv) {
        buttonDiv.style.opacity = '0';
        buttonDiv.style.animation = 'none';
        void buttonDiv.offsetWidth; // Force reflow
        buttonDiv.style.animation = 'fadeIn 0.8s 1.8s forwards';
        setTimeout(() => {
          if (getComputedStyle(buttonDiv).opacity === '0') {
            buttonDiv.style.opacity = '1';
          }
        }, 2500);
      }
      
      // Mark as initialized
      aiSlide.dataset.initialized = 'true';
    }
  }
  
  // Setup Storylane modals for agent slides
  setupStorylaneDemos();
}

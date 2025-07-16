/**
 * Storylane Preloader
 * This script preloads Storylane demos in the background to improve loading times
 */

// Global state to track preloaded iframes
window.storylanePreloadStatus = {
  'po-agent': false,
  'onboarding-agent': false,
  'interview-agent': false,
  'claim-agent': false
};

// URLs for each Storylane demo
const storylaneUrls = {
  'po-agent': 'https://app.storylane.io/demo/d9xx3md7cyhg?embed=inline',
  'onboarding-agent': 'https://app.storylane.io/demo/daptmkw6awmo?embed=inline',
  'interview-agent': 'https://app.storylane.io/demo/dhhssqjljjan?embed=inline',
  'claim-agent': 'https://app.storylane.io/demo/1qaq6ksdkphn?embed=inline'
};

// Function to preload a specific Storylane demo
function preloadStorylaneDemos(agentId) {
  if (!agentId || window.storylanePreloadStatus[agentId]) {
    return; // Already preloaded or invalid agent ID
  }

  const url = storylaneUrls[agentId];
  if (!url) return;
  
  console.log(`Preloading Storylane demo for ${agentId}...`);
  
  // Create a hidden iframe to preload the content
  const preloadFrame = document.createElement('iframe');
  preloadFrame.style.position = 'absolute';
  preloadFrame.style.width = '1px';
  preloadFrame.style.height = '1px';
  preloadFrame.style.opacity = '0';
  preloadFrame.style.pointerEvents = 'none';
  preloadFrame.style.zIndex = '-1000';
  preloadFrame.setAttribute('aria-hidden', 'true');
  preloadFrame.setAttribute('tabindex', '-1');
  preloadFrame.setAttribute('src', url);
  preloadFrame.setAttribute('data-agent-id', agentId);
  preloadFrame.className = 'storylane-preloader';
  
  // Add to the document
  document.body.appendChild(preloadFrame);
  
  // Mark as preloaded
  window.storylanePreloadStatus[agentId] = true;
}

// Detect when the slide with agents is shown and start preloading
function initStorylaneDemoPreloader() {
  // Load the Storylane script once
  if (!document.getElementById('storylane-script')) {
    const script = document.createElement('script');
    script.id = 'storylane-script';
    script.src = 'https://js.storylane.io/js/v2/storylane.js';
    script.async = true;
    document.head.appendChild(script);
  }
  
  // Determine if we're on the agents slide
  const agentsSlide = document.querySelector('.intelligent-agents-slide');
  if (!agentsSlide) return;

  // Start preloading in sequence with delays
  setTimeout(() => preloadStorylaneDemos('po-agent'), 500);
  setTimeout(() => preloadStorylaneDemos('onboarding-agent'), 2000);
  setTimeout(() => preloadStorylaneDemos('interview-agent'), 3500);
  setTimeout(() => preloadStorylaneDemos('claim-agent'), 5000);
  
  // Listen for hover events on agent cards to prioritize preloading
  document.querySelectorAll('.agent-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      const agentId = this.getAttribute('data-agent-id');
      if (agentId) {
        // Prioritize this demo preload
        preloadStorylaneDemos(agentId);
      }
    });
  });
}

// Function to swap preloaded iframes into modal when opened
function swapPreloadedIframe(agentId) {
  const preloadedFrame = document.querySelector(`.storylane-preloader[data-agent-id="${agentId}"]`);
  if (!preloadedFrame) return false;
  
  const modalMap = {
    'po-agent': 'storylane-modal-po',
    'onboarding-agent': 'storylane-modal-onboarding',
    'interview-agent': 'storylane-modal-interview',
    'claim-agent': 'storylane-modal-claim'
  };
  
  const modalId = modalMap[agentId];
  if (!modalId) return false;
  
  const modal = document.getElementById(modalId);
  if (!modal) return false;
  
  const targetContainer = modal.querySelector('.sl-embed');
  if (!targetContainer) return false;
  
  // Remove the existing iframe if any
  const existingIframe = targetContainer.querySelector('iframe');
  if (existingIframe) {
    existingIframe.remove();
  }
  
  // Clone the preloaded iframe and place it in the modal
  const clonedFrame = preloadedFrame.cloneNode(true);
  clonedFrame.style.position = 'absolute';
  clonedFrame.style.top = '0';
  clonedFrame.style.left = '0';
  clonedFrame.style.width = '100%';
  clonedFrame.style.height = '100%';
  clonedFrame.style.border = 'none';
  clonedFrame.style.opacity = '1';
  clonedFrame.style.pointerEvents = 'auto';
  clonedFrame.style.zIndex = '1';
  clonedFrame.removeAttribute('aria-hidden');
  clonedFrame.removeAttribute('tabindex');
  clonedFrame.className = 'sl-demo';
  
  targetContainer.appendChild(clonedFrame);
  return true;
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
  initStorylaneDemoPreloader();
});

// Expose for other scripts to use
window.storylaneUtils = {
  preloadStorylaneDemos,
  swapPreloadedIframe
};

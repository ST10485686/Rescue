// ===== MAIN JAVASCRIPT FILE =====
// Neptune Claws & Paws Rescue - Interactive Features

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Neptune Claws & Paws Rescue - Website Loaded');
    
    // Initialize all functionality
    initNavigation();
    initAnimations();
    initInteractiveElements();
    initContactForm();
    initImageLoading();
    initAccessibilityFeatures();
});

// ===== NAVIGATION FUNCTIONS =====
function initNavigation() {
    // Highlight active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mobile navigation toggle (for future mobile menu)
    const setupMobileMenu = () => {
        const nav = document.querySelector('nav');
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
            // Create mobile menu button
            const mobileBtn = document.createElement('button');
            mobileBtn.className = 'mobile-menu-btn';
            mobileBtn.innerHTML = '☰';
            mobileBtn.setAttribute('aria-label', 'Toggle navigation menu');
            
            // Insert before navigation
            nav.parentNode.insertBefore(mobileBtn, nav);
            
            // Add mobile menu functionality
            mobileBtn.addEventListener('click', function() {
                nav.classList.toggle('mobile-open');
                this.setAttribute('aria-expanded', nav.classList.contains('mobile-open'));
            });
        }
    };
    
    // Check for mobile menu on load and resize
    setupMobileMenu();
    window.addEventListener('resize', setupMobileMenu);
}

// ===== ANIMATION FUNCTIONS =====
function initAnimations() {
    // Scroll-triggered animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                    
                    // Special animations for stats counting
                    if (entry.target.classList.contains('stats-section')) {
                        animateStats();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Stats counting animation
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.textContent);
            let currentValue = 0;
            const duration = 2000; // 2 seconds
            const increment = targetValue / (duration / 16);
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(currentValue).toLocaleString();
            }, 16);
        });
    }
}

// ===== INTERACTIVE ELEMENTS =====
function initInteractiveElements() {
    // Pet card interactions
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        setupCardInteractions(card, 'pet');
    });
    
    // Help card interactions
    const helpCards = document.querySelectorAll('.help-card');
    helpCards.forEach(card => {
        setupCardInteractions(card, 'help');
    });
    
    // Blog card interactions
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        setupCardInteractions(card, 'blog');
    });
    
    // Action card interactions
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        setupCardInteractions(card, 'action');
    });
    
    // Button click handlers
    initButtonHandlers();
}

function setupCardInteractions(card, type) {
    // Click event for cards
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn')) {
            const title = this.querySelector('h3').textContent;
            handleCardClick(type, title, this);
        }
    });
    
    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const title = this.querySelector('h3').textContent;
            handleCardClick(type, title, this);
        }
    });
}

function handleCardClick(type, title, element) {
    switch(type) {
        case 'pet':
            showModal(`You selected ${title}! In a real application, this would show detailed information about this pet.`);
            break;
        case 'help':
            showModal(`You're interested in ${title}! This would open a detailed information page about how to ${title.toLowerCase()}.`);
            break;
        case 'blog':
            showModal(`Loading article: "${title}". This would open the full blog post.`);
            break;
        case 'action':
            showModal(`Taking action: ${title}. This would guide you through the process.`);
            break;
    }
    
    // Track analytics (in a real application)
    trackUserInteraction(type, title);
}

function initButtonHandlers() {
    // Adopt buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.pet-card, .help-card, .blog-card, .action-card');
            const title = card ? card.querySelector('h3').textContent : 'Unknown';
            const buttonText = this.textContent;
            
            handleButtonClick(buttonText, title, this);
        });
    });
}

function handleButtonClick(buttonText, context, element) {
    switch(buttonText.toLowerCase()) {
        case 'adopt':
        case 'adopt joe':
        case 'adopt grace':
        case 'adopt smeagol':
        case 'adopt asher':
            showModal(`Thank you for your interest in adoption! This would open an adoption application form for ${context}.`);
            break;
        case 'foster':
            showModal(`Thank you for your interest in fostering! This would open a fostering application form.`);
            break;
        case 'donate':
            showModal(`Thank you for your interest in donating! This would open a donation form.`);
            break;
        case 'volunteer':
            showModal(`Thank you for your interest in volunteering! This would open a volunteer application form.`);
            break;
        case 'read more':
            showModal(`Loading full article: "${context}". This would open the complete blog post.`);
            break;
        default:
            showModal(`Action: ${buttonText}. This would perform the requested action.`);
    }
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initContactForm() {
    const contactForm = document.querySelector('.contact-card form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (validateContactForm(name, email, message)) {
                // Simulate form submission
                simulateFormSubmission(this);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateContactForm(name, email, message) {
    let isValid = true;
    
    if (!name.trim()) {
        showFieldError('name', 'Please enter your name');
        isValid = false;
    }
    
    if (!email.trim() || !isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!message.trim()) {
        showFieldError('message', 'Please enter your message');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    switch(field.type) {
        case 'text':
            if (!value) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
            break;
        case 'email':
            if (!value || !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
            break;
        default:
            if (!value) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    if (typeof field === 'string') {
        field = document.querySelector(`[name="${field}"]`);
    }
    
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = 'var(--error-color)';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showModal('Thank you for your message! We will get back to you within 24 hours.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// ===== IMAGE HANDLING =====
function initImageLoading() {
    // Lazy loading for images
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (img.classList.contains('lazy')) {
                imageObserver.observe(img);
            }
        });
    }
    
    // Add loading error handling
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
            this.alt = 'Image not available';
        });
    });
}

// ===== ACCESSIBILITY FEATURES =====
function initAccessibilityFeatures() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-10000px';
    skipLink.style.top = 'auto';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.overflow = 'hidden';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for modals
    let lastFocusedElement;
    
    window.showModal = function(message) {
        // Store last focused element
        lastFocusedElement = document.activeElement;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" role="dialog" aria-labelledby="modal-title" aria-modal="true">
                <h3 id="modal-title">Notice</h3>
                <p>${message}</p>
                <button class="btn modal-close">Close</button>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            padding: var(--spacing-lg);
            border-radius: var(--border-radius-md);
            max-width: 500px;
            width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.focus();
        
        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
        
        function closeModal() {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
            if (lastFocusedElement) lastFocusedElement.focus();
        }
    };
}

// ===== UTILITY FUNCTIONS =====
function trackUserInteraction(type, details) {
    // In a real application, this would send data to analytics
    console.log(`User interaction: ${type} - ${details}`);
    
    // Example of storing in localStorage for basic analytics
    const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
    interactions.push({
        type: type,
        details: details,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    });
    
    localStorage.setItem('userInteractions', JSON.stringify(interactions.slice(-50))); // Keep last 50
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for resize events
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
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

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// ===== SERVICE WORKER REGISTRATION (for PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // This would be implemented for a Progressive Web App
        // navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker support detected - ready for PWA implementation');
    });
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initAnimations,
        initInteractiveElements,
        validateContactForm,
        trackUserInteraction
    };
}

// ===== CONTACT PAGE SPECIFIC FUNCTIONS =====
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('open');
                }
            });
            
            // Toggle current item
            this.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('open', !isExpanded);
        });
        
        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Enhanced contact form validation
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            if (validateContactForm(name, email, subject, message)) {
                simulateContactFormSubmission(this);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateContactForm(name, email, subject, message) {
    let isValid = true;
    
    if (!name.trim()) {
        showFieldError('name', 'Please enter your name');
        isValid = false;
    }
    
    if (!email.trim() || !isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!subject) {
        showFieldError('subject', 'Please select a subject');
        isValid = false;
    }
    
    if (!message.trim()) {
        showFieldError('message', 'Please enter your message');
        isValid = false;
    }
    
    return isValid;
}

// Update the existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log('Neptune Claws & Paws Rescue - Website Loaded');
    
    // Initialize all functionality
    initNavigation();
    initAnimations();
    initInteractiveElements();
    initContactForm(); // Updated function
    initImageLoading();
    initAccessibilityFeatures();
    initFAQAccordion(); // New FAQ functionality
    
    // Initialize map interaction tracking
    initMapTracking();
});

// Map interaction tracking
function initMapTracking() {
    const mapIframe = document.querySelector('iframe[title*="Location Map"]');
    if (mapIframe) {
        mapIframe.addEventListener('load', function() {
            console.log('Map loaded successfully');
            trackUserInteraction('map', 'map_loaded');
        });
        
        // Note: Actual map interaction tracking would require postMessage API
        // This is a simplified version
    }
}

// Enhanced modal for contact success
function showContactSuccessModal() {
    showModal(`
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for contacting Neptune Claws & Paws Rescue. We'll get back to you within 24 hours.</p>
        <p>For urgent matters, please call our emergency line: <strong>(011) 456-7891</strong></p>
    `);
}

// Update the simulateFormSubmission function for contact form
function simulateContactFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showContactSuccessModal();
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Track form submission
        trackUserInteraction('contact_form', 'submission_success');
    }, 2000);
}

// ===== ENQUIRY PAGE FUNCTIONALITY =====
function initEnquiryTabs() {
    const tabs = document.querySelectorAll('.enquiry-tab');
    const forms = document.querySelectorAll('.enquiry-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}-form`) {
                    form.classList.add('active');
                }
            });
            
            trackUserInteraction('enquiry_tab', targetTab);
        });
    });
}

// ===== LIGHTBOX FUNCTIONALITY =====
function initLightbox() {
    // Create lightbox HTML
    const lightboxHTML = `
        <div class="lightbox" id="lightbox">
            <button class="lightbox-close" aria-label="Close lightbox">×</button>
            <div class="lightbox-nav">
                <button class="lightbox-prev" aria-label="Previous image">‹</button>
                <button class="lightbox-next" aria-label="Next image">›</button>
            </div>
            <div class="lightbox-content">
                <img class="lightbox-img" src="" alt="">
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentImages = [];
    let currentIndex = 0;
    
    // Add click events to all pet images
    document.querySelectorAll('.pet-card img, .blog-card img').forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt, Array.from(document.querySelectorAll('.pet-card img, .blog-card img')), index);
        });
        
        // Keyboard accessibility
        img.setAttribute('tabindex', '0');
        img.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(this.src, this.alt, Array.from(document.querySelectorAll('.pet-card img, .blog-card img')), index);
            }
        });
    });
    
    function openLightbox(src, alt, images, index) {
        currentImages = images;
        currentIndex = index;
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        trackUserInteraction('lightbox', 'opened');
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        currentImages = [];
        currentIndex = 0;
    }
    
    function showNextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex].src;
        lightboxImg.alt = currentImages[currentIndex].alt;
    }
    
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex].src;
        lightboxImg.alt = currentImages[currentIndex].alt;
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    // Create search container for pets page
    const petsPage = document.querySelector('.pet-gallery');
    if (petsPage) {
        const searchHTML = `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Search pets by name, breed, or description..." aria-label="Search pets">
                <button class="search-btn" aria-label="Search">🔍</button>
            </div>
            <div class="search-results"></div>
        `;
        
        petsPage.insertAdjacentHTML('beforebegin', searchHTML);
        
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const searchResults = document.querySelector('.search-results');
        const petCards = document.querySelectorAll('.pet-card');
        
        function performSearch() {
            const query = searchInput.value.toLowerCase().trim();
            let hasResults = false;
            
            if (query === '') {
                searchResults.innerHTML = '';
                petCards.forEach(card => card.style.display = '');
                return;
            }
            
            petCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (cardText.includes(query)) {
                    card.style.display = '';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            if (!hasResults) {
                searchResults.innerHTML = '<div class="no-results">No pets found matching your search. Try different keywords.</div>';
            } else {
                searchResults.innerHTML = '';
            }
            
            trackUserInteraction('search', query);
        }
        
        searchInput.addEventListener('input', debounce(performSearch, 300));
        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Create search for blog page
    const blogPage = document.querySelector('.blog-gallery');
    if (blogPage) {
        const searchHTML = `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Search blog posts by title or content..." aria-label="Search blog posts">
                <button class="search-btn" aria-label="Search">🔍</button>
            </div>
            <div class="search-results"></div>
        `;
        
        blogPage.insertAdjacentHTML('beforebegin', searchHTML);
        
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const searchResults = document.querySelector('.search-results');
        const blogCards = document.querySelectorAll('.blog-card');
        
        function performBlogSearch() {
            const query = searchInput.value.toLowerCase().trim();
            let hasResults = false;
            
            if (query === '') {
                searchResults.innerHTML = '';
                blogCards.forEach(card => card.style.display = '');
                return;
            }
            
            blogCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (cardText.includes(query)) {
                    card.style.display = '';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            if (!hasResults) {
                searchResults.innerHTML = '<div class="no-results">No blog posts found matching your search.</div>';
            } else {
                searchResults.innerHTML = '';
            }
            
            trackUserInteraction('blog_search', query);
        }
        
        searchInput.addEventListener('input', debounce(performBlogSearch, 300));
        searchBtn.addEventListener('click', performBlogSearch);
    }
}

// ===== ENHANCED FORM VALIDATION =====
function initEnhancedFormValidation() {
    // Phone number validation
    document.addEventListener('blur', function(e) {
        if (e.target.type === 'tel') {
            validatePhoneNumber(e.target);
        }
    }, true);
    
    // Email validation
    document.addEventListener('blur', function(e) {
        if (e.target.type === 'email') {
            validateEmail(e.target);
        }
    }, true);
}

function validatePhoneNumber(input) {
    const phone = input.value.replace(/\D/g, ''); // Remove non-digits
    if (phone.length < 10) {
        showFieldError(input, 'Please enter a valid phone number with at least 10 digits');
        return false;
    }
    clearFieldError(input);
    return true;
}

function validateEmail(input) {
    const email = input.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showFieldError(input, 'Please enter a valid email address');
        return false;
    }
    clearFieldError(input);
    return true;
}

// ===== AJAX FORM SUBMISSION =====
function initAjaxFormSubmission() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitFormViaAJAX(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

function submitFormViaAJAX(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    const formData = new FormData(form);
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate AJAX request (in real implementation, use fetch or XMLHttpRequest)
    setTimeout(() => {
        // This would be replaced with actual AJAX call
        // fetch(form.action, { method: 'POST', body: formData })
        //   .then(response => response.json())
        //   .then(data => handleFormResponse(data, form))
        //   .catch(error => handleFormError(error, form));
        
        handleFormSuccess(form);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleFormSuccess(form) {
    showModal(`
        <h3>Success!</h3>
        <p>Your form has been submitted successfully. We'll get back to you soon.</p>
        <p><strong>Reference #:</strong> NCPR-${Date.now().toString().slice(-6)}</p>
    `);
    
    form.reset();
    trackUserInteraction('form_submission', form.id);
}

function handleFormError(error, form) {
    showModal(`
        <h3>Error</h3>
        <p>Sorry, there was an error submitting your form. Please try again or contact us directly.</p>
        <p>Error: ${error.message}</p>
    `);
    
    trackUserInteraction('form_error', form.id);
}

// ===== UPDATE MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Neptune Claws & Paws Rescue - Website Loaded');
    
    // Initialize all functionality
    initNavigation();
    initAnimations();
    initInteractiveElements();
    initContactForm();
    initImageLoading();
    initAccessibilityFeatures();
    initFAQAccordion();
    initMapTracking();
    
    // New functionality for Part 3
    initEnquiryTabs();
    initLightbox();
    initSearch();
    initEnhancedFormValidation();
    initAjaxFormSubmission();
    
    // Add structured data for SEO
    addStructuredData();
});

// ===== STRUCTURED DATA FOR SEO =====
function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "AnimalShelter",
        "name": "Neptune Claws & Paws Rescue",
        "description": "Rescuing and rehoming abandoned cats and dogs in Johannesburg since 2015",
        "url": "https://ncpr.org.za",
        "telephone": "+27-11-456-7890",
        "email": "info@ncpr.org.za",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Rescue Street",
            "addressLocality": "Johannesburg",
            "postalCode": "2000",
            "addressCountry": "ZA"
        },
        "openingHours": [
            "Mo-Fr 09:00-18:00",
            "Sa 10:00-16:00",
            "Su 12:00-16:00"
        ],
        "areaServed": "Johannesburg and surrounding areas",
        "sameAs": [
            "https://www.facebook.com/neptunecpr",
            "https://www.instagram.com/neptunecpr"
        ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}
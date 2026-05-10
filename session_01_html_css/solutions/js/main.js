// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#lightbox-1' && href !== '#lightbox-2' && 
            href !== '#lightbox-3' && href !== '#lightbox-4' && href !== '#lightbox-5' && 
            href !== '#lightbox-6') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Add scroll class to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animate skill progress bars when they come into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.skill-progress');
            if (progressBar && !progressBar.classList.contains('animate')) {
                progressBar.classList.add('animate');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-item').forEach(item => {
    skillObserver.observe(item);
});

// Close mobile menu when a link is clicked
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function() {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.checked = false;
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill out all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email');
            return;
        }
        
        // Show success message
        alert(`Thank you ${name}! Your message has been sent.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Portfolio filter functionality (CSS-only with data attributes)
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const filterValue = this.textContent.toLowerCase();
        
        // Filter items
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 0);
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Add transition to portfolio items
portfolioItems.forEach(item => {
    item.style.transition = 'opacity 0.3s ease';
});

// Lightbox click handling
document.querySelectorAll('.lightbox-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.hash = '';
    });
});

// Close lightbox when clicking on the background
document.querySelectorAll('.lightbox').forEach(lightbox => {
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            window.location.hash = '';
        }
    });
});

// Prevent body scroll when lightbox is open
window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    const lightboxes = document.querySelectorAll('.lightbox');
    let isLightboxOpen = false;
    
    lightboxes.forEach(lightbox => {
        if (hash === '#' + lightbox.id) {
            isLightboxOpen = true;
        }
    });
    
    if (isLightboxOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Initialize
console.log('Portfolio loaded successfully!');

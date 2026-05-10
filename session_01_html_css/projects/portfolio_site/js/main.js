// Main JavaScript file
console.log('Portfolio site loaded');

// Trigger progress bar animation when scrolling into view
document.addEventListener('DOMContentLoaded', function() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    // Create Intersection Observer to detect when elements come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    // Observe all progress bars
    skillProgressBars.forEach(bar => {
        observer.observe(bar);
    });
});


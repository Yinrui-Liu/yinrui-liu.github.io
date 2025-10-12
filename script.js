// Theme management
const themes = ['auto', 'light', 'dark'];
let currentThemeIndex = 0;

function setTheme(theme) {
    const html = document.documentElement;
    const themeIcon = document.querySelector('.theme-icon');
    
    // Remove existing theme classes
    html.removeAttribute('data-theme');
    
    if (theme === 'auto') {
        // Auto theme - use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            html.setAttribute('data-theme', 'dark');
        }
        themeIcon.textContent = '🌓';
    } else if (theme === 'light') {
        themeIcon.textContent = '☀️';
    } else if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '🌙';
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
}

function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    setTheme(themes[currentThemeIndex]);
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes.includes(savedTheme)) {
        currentThemeIndex = themes.indexOf(savedTheme);
    } else {
        // Default to auto theme
        currentThemeIndex = 0; // auto is at index 0
    }
    setTheme(themes[currentThemeIndex]);
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    if (themes[currentThemeIndex] === 'auto') {
        setTheme('auto');
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navigation').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to navigation links based on scroll position
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-list a');
    
    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.navigation').offsetHeight;
            
            if (window.pageYOffset >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call to set active link
    updateActiveNavLink();
    
    // Initialize theme
    initTheme();
    
    // Add theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', cycleTheme);
    }
    
    // Video cover functionality
    const videoCover = document.getElementById('video-cover');
    if (videoCover) {
        videoCover.addEventListener('click', function() {
            // Hide the cover when clicked
            this.style.display = 'none';
        });
        
        // Also hide cover when iframe loads (as a backup)
        const iframe = document.querySelector('iframe[src*="drive.google.com"]');
        if (iframe) {
            iframe.addEventListener('load', function() {
                setTimeout(() => {
                    if (videoCover) {
                        videoCover.style.display = 'none';
                    }
                }, 1000);
            });
        }
    }
});

// Add some interactivity to the CV download
document.addEventListener('DOMContentLoaded', function() {
    const cvDownload = document.querySelector('.cv-download');
    
    if (cvDownload) {
        cvDownload.addEventListener('click', function(e) {
            // Check if CV file exists, if not show alert
            fetch('cv.pdf')
                .then(response => {
                    if (!response.ok) {
                        e.preventDefault();
                        alert('CV file not found. Please contact me directly for my CV.');
                    }
                })
                .catch(() => {
                    e.preventDefault();
                    alert('CV file not found. Please contact me directly for my CV.');
                });
        });
    }
});

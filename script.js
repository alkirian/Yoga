// ========================================
// Academia Online de Yoga - JavaScript
// ========================================

// Storage keys (same as admin)
const STORAGE_KEYS = {
    COURSES: 'yoga_admin_courses',
    PLANS: 'yoga_admin_plans',
    CONFIG: 'yoga_admin_config'
};

document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic data from localStorage
    loadDynamicContent();
    
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Accordion for course modules
    const accordionHeaders = document.querySelectorAll('.module-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const module = this.parentElement;
            const isActive = module.classList.contains('active');
            
            // Close all modules
            document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
            
            // Open clicked module if it wasn't active
            if (!isActive) {
                module.classList.add('active');
            }
        });
    });
    
    // Filter functionality for course catalog
    setupFilters();
    
    // Animate elements on scroll (Flow Flow)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observers targeting the new fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
});

// ========================================
// Dynamic Content Loading
// ========================================

function loadDynamicContent() {
    const page = document.body.dataset.page || detectPage();
    
    switch(page) {
        case 'home':
            loadHomeContent();
            break;
        case 'cursos':
            loadCatalogContent();
            break;
        case 'curso':
            // Course detail page - could be enhanced to load specific course
            break;
        case 'planes':
            loadPlansContent();
            break;
    }
}

function detectPage() {
    const path = window.location.pathname;
    if (path.includes('cursos.html')) return 'cursos';
    if (path.includes('curso.html')) return 'curso';
    if (path.includes('planes.html')) return 'planes';
    return 'home';
}

// Get data from localStorage
function getCourses() {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : [];
}

function getPlans() {
    const data = localStorage.getItem(STORAGE_KEYS.PLANS);
    return data ? JSON.parse(data) : {};
}

function getConfig() {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return data ? JSON.parse(data) : {};
}

// Load home page content
function loadHomeContent() {
    const courses = getCourses().filter(c => c.active && c.featured);
    const config = getConfig();
    
    // Update hero text if config exists
    if (config.heroTitle) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const parts = config.heroTitle.split('.');
            if (parts.length > 1) {
                heroTitle.innerHTML = `${parts[0]}.<br><span class="accent">${parts.slice(1).join('.')}</span>`;
            } else {
                heroTitle.textContent = config.heroTitle;
            }
        }
    }
    
    if (config.heroSubtitle) {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = config.heroSubtitle;
    }
    
    // Update about section
    if (config.instructorBio) {
        const aboutTexts = document.querySelectorAll('.about-text');
        if (aboutTexts.length > 0) aboutTexts[0].textContent = config.instructorBio;
    }
    
    // Update featured courses
    const coursesGrid = document.querySelector('.courses-preview .courses-grid');
    if (coursesGrid && courses.length > 0) {
        coursesGrid.innerHTML = courses.slice(0, 3).map(course => createCourseCard(course)).join('');
    }
}

// Load catalog page content
function loadCatalogContent() {
    const courses = getCourses().filter(c => c.active);
    const coursesGrid = document.querySelector('.catalog-content .courses-grid');
    
    if (coursesGrid && courses.length > 0) {
        coursesGrid.innerHTML = courses.map(course => createCourseCard(course)).join('');
        // Re-setup filters after loading dynamic content
        setupFilters();
    }
}

// Load plans page content
function loadPlansContent() {
    const plans = getPlans();
    
    if (plans.individual) {
        updatePlanCard('individual', plans.individual);
    }
    if (plans.pack) {
        updatePlanCard('pack', plans.pack);
    }
    if (plans.total) {
        updatePlanCard('total', plans.total);
    }
}

function updatePlanCard(planType, planData) {
    // Update price
    const priceSelectors = {
        'individual': '.pricing-card:nth-child(1) .price-amount',
        'pack': '.pricing-card:nth-child(2) .price-amount',
        'total': '.pricing-card:nth-child(3) .price-amount'
    };
    
    const priceEl = document.querySelector(priceSelectors[planType]);
    if (priceEl && planData.price) {
        priceEl.textContent = '$' + planData.price;
    }
    
    // Update features
    const featureSelectors = {
        'individual': '.pricing-card:nth-child(1) .pricing-features',
        'pack': '.pricing-card:nth-child(2) .pricing-features',
        'total': '.pricing-card:nth-child(3) .pricing-features'
    };
    
    const featuresEl = document.querySelector(featureSelectors[planType]);
    if (featuresEl && planData.features) {
        const features = planData.features.split('\n').filter(f => f.trim());
        featuresEl.innerHTML = features.map(f => `
            <li>
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg> ${f}
            </li>
        `).join('');
    }
    
    // Update Hotmart URL
    const btnSelectors = {
        'individual': '.pricing-card:nth-child(1) .btn',
        'pack': '.pricing-card:nth-child(2) .btn',
        'total': '.pricing-card:nth-child(3) .btn'
    };
    
    const btnEl = document.querySelector(btnSelectors[planType]);
    if (btnEl && planData.hotmartUrl) {
        btnEl.href = planData.hotmartUrl;
        btnEl.target = '_blank';
    }
}

// Create course card HTML
function createCourseCard(course) {
    const levelLabels = {
        'principiante': 'Principiante',
        'intermedio': 'Intermedio',
        'avanzado': 'Avanzado',
        'todos': 'Todos los niveles'
    };
    
    const levelClass = course.level === 'intermedio' ? 'badge-intermediate' : 
                       course.level === 'avanzado' ? 'badge-advanced' : '';
    
    return `
        <article class="course-card" data-level="${course.level}" data-style="${course.style}">
            <div class="course-image">
                <img src="${course.image || 'https://via.placeholder.com/400x250'}" alt="${course.title}" loading="lazy">
                <span class="course-badge ${levelClass}">${levelLabels[course.level] || course.level}</span>
            </div>
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span class="course-duration">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        ${course.duration || '4 semanas'}
                    </span>
                    <span class="course-lessons">${course.lessons || 0} clases</span>
                </div>
                <div class="course-footer">
                    <span class="course-price">$${course.price} USD</span>
                    <a href="${course.hotmartUrl || 'curso.html'}" class="btn btn-sm" ${course.hotmartUrl ? 'target="_blank"' : ''}>
                        ${course.hotmartUrl ? 'Comprar' : 'Ver Curso'}
                    </a>
                </div>
            </div>
        </article>
    `;
}

// Setup filter functionality
function setupFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const courseCards = document.querySelectorAll('.course-card[data-level], .course-card[data-style]');
    
    if (filterCheckboxes.length > 0) {
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => filterCourses(filterCheckboxes, courseCards));
        });
    }
}

function filterCourses(filterCheckboxes, courseCards) {
    const activeFilters = {
        level: [],
        style: []
    };
    
    filterCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const filterType = checkbox.dataset.filterType;
            const filterValue = checkbox.dataset.filterValue;
            if (filterType && filterValue) {
                activeFilters[filterType].push(filterValue);
            }
        }
    });
    
    courseCards.forEach(card => {
        const cardLevel = card.dataset.level;
        const cardStyle = card.dataset.style;
        
        const levelMatch = activeFilters.level.length === 0 || activeFilters.level.includes(cardLevel);
        const styleMatch = activeFilters.style.length === 0 || activeFilters.style.includes(cardStyle);
        
        if (levelMatch && styleMatch) {
            card.style.display = '';
            card.classList.remove('hidden');
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });
}

// Utility function to handle Hotmart redirect
function redirectToHotmart(productUrl) {
    if (productUrl) {
        window.open(productUrl, '_blank');
    }
}

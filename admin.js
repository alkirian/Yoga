// ========================================
// Admin Panel - JavaScript
// ========================================

// Data Store
const STORAGE_KEYS = {
    COURSES: 'yoga_admin_courses',
    PLANS: 'yoga_admin_plans',
    CONFIG: 'yoga_admin_config'
};

// Default data
const defaultCourses = [
    {
        id: '1',
        title: 'Introducción al Yoga: Fundamentos',
        description: 'Aprende las posturas básicas, la respiración y la meditación. Perfecto para empezar tu práctica.',
        level: 'principiante',
        style: 'hatha',
        price: 49,
        originalPrice: null,
        duration: '4 semanas',
        lessons: 12,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop',
        hotmartUrl: '',
        featured: true,
        active: true
    },
    {
        id: '2',
        title: 'Vinyasa Flow: Energía y Movimiento',
        description: 'Clases dinámicas para fortalecer el cuerpo y calmar la mente con secuencias fluidas.',
        level: 'intermedio',
        style: 'vinyasa',
        price: 69,
        originalPrice: 99,
        duration: '6 semanas',
        lessons: 18,
        image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=250&fit=crop',
        hotmartUrl: '',
        featured: true,
        active: true
    },
    {
        id: '3',
        title: 'Yoga Restaurativo: Relajación Profunda',
        description: 'Alivia el estrés y restaura tu energía con prácticas suaves y meditaciones guiadas.',
        level: 'todos',
        style: 'restaurativo',
        price: 39,
        originalPrice: null,
        duration: '4 semanas',
        lessons: 10,
        image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&h=250&fit=crop',
        hotmartUrl: '',
        featured: true,
        active: true
    }
];

const defaultPlans = {
    individual: {
        price: 49,
        features: 'Acceso ilimitado a 1 curso\nMaterial descargable\nSoporte por email',
        hotmartUrl: ''
    },
    pack: {
        price: 99,
        features: 'Acceso ilimitado a 3 cursos\nMaterial descargable\nCertificado de finalización\nSoporte prioritario por chat\nAcceso a comunidad privada',
        hotmartUrl: ''
    },
    total: {
        price: 29,
        features: 'Acceso a TODOS los cursos\nNuevos cursos cada mes\nMaterial premium descargable\nCertificado oficial\nSoporte VIP personalizado\nAcceso exclusivo a retiros online',
        hotmartUrl: ''
    }
};

const defaultConfig = {
    heroTitle: 'Encuentra tu Equilibrio Interior. Practica Yoga Online.',
    heroSubtitle: 'Únete a nuestra comunidad y transforma tu bienestar desde casa con clases guiadas por instructores certificados.',
    instructorName: 'Tu Nombre',
    instructorBio: 'Soy instructora certificada con más de 10 años de experiencia en Hatha, Vinyasa y Yoga Restaurativo. Mi misión es hacer el yoga accesible para todos.',
    instructorCredentials: 'RYT-500 Certified',
    email: 'hola@academiadeyoga.com',
    instagram: '',
    youtube: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupNavigation();
    loadDashboard();
    loadCourses();
    loadPlans();
    loadConfig();
});

// Initialize default data if not exists
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
        localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(defaultCourses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLANS)) {
        localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(defaultPlans));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(defaultConfig));
    }
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });
}

function showSection(sectionId) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });
    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });
}

// Dashboard
function loadDashboard() {
    const courses = getCourses();
    const plans = getPlans();
    
    document.getElementById('total-cursos').textContent = courses.length;
    document.getElementById('total-planes').textContent = Object.keys(plans).length;
    document.getElementById('total-clases').textContent = courses.reduce((sum, c) => sum + (c.lessons || 0), 0);
}

// Courses CRUD
function getCourses() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
}

function saveCourses(courses) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    loadCourses();
    loadDashboard();
}

function loadCourses() {
    const courses = getCourses();
    const tbody = document.getElementById('courses-tbody');
    const emptyState = document.getElementById('no-courses');
    
    if (courses.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    tbody.innerHTML = courses.map(course => `
        <tr>
            <td><img src="${course.image || 'https://via.placeholder.com/80x50'}" class="course-thumb" alt="${course.title}"></td>
            <td><strong>${course.title}</strong></td>
            <td><span class="badge badge-level">${getLevelLabel(course.level)}</span></td>
            <td>$${course.price} USD</td>
            <td>${course.lessons || '-'}</td>
            <td><span class="badge ${course.active ? 'badge-success' : 'badge-warning'}">${course.active ? 'Activo' : 'Oculto'}</span></td>
            <td>
                <div class="table-actions">
                    <button onclick="editCourse('${course.id}')" title="Editar">✏️</button>
                    <button onclick="duplicateCourse('${course.id}')" title="Duplicar">📋</button>
                    <button class="btn-delete" onclick="deleteCourse('${course.id}')" title="Eliminar">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getLevelLabel(level) {
    const labels = {
        'principiante': 'Principiante',
        'intermedio': 'Intermedio',
        'avanzado': 'Avanzado',
        'todos': 'Todos'
    };
    return labels[level] || level;
}

function openCourseModal(courseId = null) {
    const modal = document.getElementById('course-modal');
    const form = document.getElementById('course-form');
    const title = document.getElementById('modal-title');
    
    form.reset();
    document.getElementById('course-id').value = '';
    document.getElementById('course-active').checked = true;
    
    if (courseId) {
        const courses = getCourses();
        const course = courses.find(c => c.id === courseId);
        if (course) {
            title.textContent = 'Editar Curso';
            document.getElementById('course-id').value = course.id;
            document.getElementById('course-title').value = course.title || '';
            document.getElementById('course-level').value = course.level || 'principiante';
            document.getElementById('course-description').value = course.description || '';
            document.getElementById('course-price').value = course.price || '';
            document.getElementById('course-original-price').value = course.originalPrice || '';
            document.getElementById('course-duration').value = course.duration || '';
            document.getElementById('course-lessons').value = course.lessons || '';
            document.getElementById('course-image').value = course.image || '';
            document.getElementById('course-hotmart').value = course.hotmartUrl || '';
            document.getElementById('course-style').value = course.style || 'hatha';
            document.getElementById('course-featured').checked = course.featured || false;
            document.getElementById('course-active').checked = course.active !== false;
        }
    } else {
        title.textContent = 'Nuevo Curso';
    }
    
    modal.classList.add('active');
}

function closeCourseModal() {
    document.getElementById('course-modal').classList.remove('active');
}

function saveCourse() {
    const id = document.getElementById('course-id').value;
    const course = {
        id: id || Date.now().toString(),
        title: document.getElementById('course-title').value,
        level: document.getElementById('course-level').value,
        description: document.getElementById('course-description').value,
        price: parseFloat(document.getElementById('course-price').value) || 0,
        originalPrice: parseFloat(document.getElementById('course-original-price').value) || null,
        duration: document.getElementById('course-duration').value,
        lessons: parseInt(document.getElementById('course-lessons').value) || 0,
        image: document.getElementById('course-image').value,
        hotmartUrl: document.getElementById('course-hotmart').value,
        style: document.getElementById('course-style').value,
        featured: document.getElementById('course-featured').checked,
        active: document.getElementById('course-active').checked
    };
    
    let courses = getCourses();
    
    if (id) {
        courses = courses.map(c => c.id === id ? course : c);
    } else {
        courses.push(course);
    }
    
    saveCourses(courses);
    closeCourseModal();
    showToast('Curso guardado correctamente');
}

function editCourse(id) {
    openCourseModal(id);
}

function duplicateCourse(id) {
    const courses = getCourses();
    const course = courses.find(c => c.id === id);
    if (course) {
        const newCourse = {
            ...course,
            id: Date.now().toString(),
            title: course.title + ' (copia)'
        };
        courses.push(newCourse);
        saveCourses(courses);
        showToast('Curso duplicado');
    }
}

function deleteCourse(id) {
    if (confirm('¿Estás segura de eliminar este curso?')) {
        let courses = getCourses();
        courses = courses.filter(c => c.id !== id);
        saveCourses(courses);
        showToast('Curso eliminado');
    }
}

// Plans
function getPlans() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANS) || '{}');
}

function loadPlans() {
    const plans = getPlans();
    
    if (plans.individual) {
        document.getElementById('price-individual').value = plans.individual.price || 49;
        document.getElementById('features-individual').value = plans.individual.features || '';
        document.getElementById('hotmart-individual').value = plans.individual.hotmartUrl || '';
    }
    if (plans.pack) {
        document.getElementById('price-pack').value = plans.pack.price || 99;
        document.getElementById('features-pack').value = plans.pack.features || '';
        document.getElementById('hotmart-pack').value = plans.pack.hotmartUrl || '';
    }
    if (plans.total) {
        document.getElementById('price-total').value = plans.total.price || 29;
        document.getElementById('features-total').value = plans.total.features || '';
        document.getElementById('hotmart-total').value = plans.total.hotmartUrl || '';
    }
}

function savePlans() {
    const plans = {
        individual: {
            price: parseFloat(document.getElementById('price-individual').value) || 49,
            features: document.getElementById('features-individual').value,
            hotmartUrl: document.getElementById('hotmart-individual').value
        },
        pack: {
            price: parseFloat(document.getElementById('price-pack').value) || 99,
            features: document.getElementById('features-pack').value,
            hotmartUrl: document.getElementById('hotmart-pack').value
        },
        total: {
            price: parseFloat(document.getElementById('price-total').value) || 29,
            features: document.getElementById('features-total').value,
            hotmartUrl: document.getElementById('hotmart-total').value
        }
    };
    
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    showToast('Planes guardados correctamente');
}

// Config
function getConfig() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || '{}');
}

function loadConfig() {
    const config = getConfig();
    
    document.getElementById('config-hero-title').value = config.heroTitle || '';
    document.getElementById('config-hero-subtitle').value = config.heroSubtitle || '';
    document.getElementById('config-instructor-name').value = config.instructorName || '';
    document.getElementById('config-instructor-bio').value = config.instructorBio || '';
    document.getElementById('config-instructor-credentials').value = config.instructorCredentials || '';
    document.getElementById('config-email').value = config.email || '';
    document.getElementById('config-instagram').value = config.instagram || '';
    document.getElementById('config-youtube').value = config.youtube || '';
}

function saveConfig() {
    const config = {
        heroTitle: document.getElementById('config-hero-title').value,
        heroSubtitle: document.getElementById('config-hero-subtitle').value,
        instructorName: document.getElementById('config-instructor-name').value,
        instructorBio: document.getElementById('config-instructor-bio').value,
        instructorCredentials: document.getElementById('config-instructor-credentials').value,
        email: document.getElementById('config-email').value,
        instagram: document.getElementById('config-instagram').value,
        youtube: document.getElementById('config-youtube').value
    };
    
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    showToast('Configuración guardada');
}

// Export/Import
function exportData() {
    const data = {
        courses: getCourses(),
        plans: getPlans(),
        config: getConfig(),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yoga-academy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Datos exportados');
}

function importData() {
    document.getElementById('import-file').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.courses) {
                localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(data.courses));
            }
            if (data.plans) {
                localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(data.plans));
            }
            if (data.config) {
                localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(data.config));
            }
            
            loadDashboard();
            loadCourses();
            loadPlans();
            loadConfig();
            showToast('Datos importados correctamente');
        } catch (err) {
            alert('Error al importar: archivo inválido');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

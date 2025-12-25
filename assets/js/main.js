// Configuration
const CONFIG = {
    dataPath: 'data/',
    templates: {
        navbar: `
            <div class="container">
                <a class="navbar-brand" href="#">{{brand}}</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul class="navbar-nav">
                        {{#links}}
                        <li class="nav-item">
                            <a class="nav-link" href="{{url}}">{{title}}</a>
                        </li>
                        {{/links}}
                    </ul>
                </div>
            </div>
        `,
        hero: `
            <div class="hero" style="background-image: url('{{backgroundImage}}')">
                <div class="container content">
                    <h1>{{title}}</h1>
                    <p class="lead">{{subtitle}}</p>
                    <a href="{{button.url}}" class="btn btn-custom btn-lg">{{button.text}}</a>
                </div>
            </div>
        `,
        worship: `
            <div class="container text-center">
                <h2 class="section-title">{{title}}</h2>
                <p class="mb-4">{{description}}</p>
                <div class="row mt-5">
                    {{#serviceTimes}}
                    <div class="col-md-6 mb-4">
                        <div class="service-time p-4">
                            <h4>{{day}}</h4>
                            <p class="h5 text-primary">{{time}}</p>
                            <p class="text-muted">{{description}}</p>
                        </div>
                    </div>
                    {{/serviceTimes}}
                </div>
                <a href="{{button.url}}" class="btn btn-custom mt-3">{{button.text}}</a>
            </div>
        `,
        events: `
            <div class="container">
                <h2 class="section-title">{{title}}</h2>
                <div class="row g-4 justify-content-center">
                    {{#events}}
                    <div class="col-md-4">
                        <div class="event-card">
                            <h5>{{title}}</h5>
                            <div class="event-date">
                                <i class="far fa-calendar-alt me-2"></i>{{date}} • {{time}}<br>
                                <i class="fas fa-map-marker-alt me-2"></i>{{location}}
                            </div>
                            <p>{{description}}</p>
                        </div>
                    </div>
                    {{/events}}
                </div>
            </div>
        `,
        footer: `
            <div class="container">
                <div class="footer-content">
                    <div class="social-links">
                        {{#social}}
                        <a href="{{url}}" class="social-link me-3" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-{{icon}} fa-lg"></i>
                        </a>
                        {{/social}}
                    </div>
                    <div class="contact-info mb-3">
                        <p class="mb-1">{{contact.address}}</p>
                        <p class="mb-1">{{contact.phone}} • {{contact.email}}</p>
                    </div>
                    <div class="copyright">
                        {{copyright}}
                    </div>
                </div>
            </div>
        `
    }
};

// Main Application
class ChurchWebsite {
    constructor() {
        this.data = {};
        this.currentYear = new Date().getFullYear();
        this.initialize();
    }

    async initialize() {
        try {
            // Load all data files
            await this.loadData('site');
            await this.loadData('navigation');
            await this.loadData('hero');
            await this.loadData('worship');
            await this.loadData('events');
            await this.loadData('footer');
            
            // Render all components
            this.renderAll();
            
            // Update copyright year
            this.updateCopyrightYear();
            
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    }

    async loadData(name) {
        try {
            const response = await fetch(`${CONFIG.dataPath}${name}.yml`);
            if (!response.ok) {
                throw new Error(`Failed to load ${name}.yml`);
            }
            const yamlText = await response.text();
            this.data[name] = jsyaml.load(yamlText);
        } catch (error) {
            console.error(`Error loading ${name}:`, error);
            this.data[name] = {};
        }
    }

    render(templateName, data, targetId) {
        const template = CONFIG.templates[templateName];
        if (!template) {
            console.error(`Template '${templateName}' not found`);
            return;
        }

        const rendered = Mustache.render(template, data);
        const target = document.getElementById(targetId || templateName);
        if (target) {
            target.innerHTML = rendered;
        } else {
            console.error(`Target element '${targetId || templateName}' not found`);
        }
    }

    renderAll() {
        // Render navigation
        this.render('navbar', this.data.navigation, 'navbar');
        
        // Render hero section with background image
        this.render('hero', {
            ...this.data.hero,
            backgroundImage: this.data.hero.backgroundImage
        }, 'hero');
        
        // Render worship section
        this.render('worship', this.data.worship, 'worship');
        
        // Render events section
        this.render('events', this.data.events, 'events');
        
        // Render footer with current year
        this.render('footer', {
            ...this.data.footer,
            copyright: this.data.footer.copyright.replace('{{year}}', this.currentYear)
        }, 'footer');
    }

    updateCopyrightYear() {
        const yearElements = document.querySelectorAll('[data-year]');
        yearElements.forEach(el => {
            el.textContent = this.currentYear;
        });
    }
}

// Initialize the website when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.churchWebsite = new ChurchWebsite();
});

// Add Font Awesome for icons
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
document.head.appendChild(fontAwesome);
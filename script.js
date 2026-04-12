/* ================================================================
   VANGUARD SOFT — Main JavaScript
   Pure JS, no frameworks, modular & performant
   ================================================================ */

(function () {
    'use strict';

    // ============================================================
    // LOADER
    // ============================================================
    const loader = document.getElementById('loader');
    
    function hideLoader() {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }

    document.body.classList.add('no-scroll');
    window.addEventListener('load', function () {
        setTimeout(hideLoader, 2000);
    });

    // Safety fallback — hide loader after 4s regardless
    setTimeout(hideLoader, 4000);

    // ============================================================
    // CURSOR GLOW (desktop only)
    // ============================================================
    const cursorGlow = document.getElementById('cursor-glow');

    if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        let rafId = null;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorGlow.classList.add('visible');
        }, { passive: true });

        document.addEventListener('mouseleave', function () {
            cursorGlow.classList.remove('visible');
        });

        function updateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            rafId = requestAnimationFrame(updateGlow);
        }
        rafId = requestAnimationFrame(updateGlow);
    }

    // ============================================================
    // NAVBAR
    // ============================================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    let lastScrollY = 0;

    function handleNavbarScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ============================================================
    // SCROLL PROGRESS BAR
    // ============================================================
    var scrollProgressBar = document.getElementById('scroll-progress');

    function updateScrollProgress() {
        var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        if (scrollProgressBar) {
            scrollProgressBar.style.width = progress + '%';
        }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ============================================================
    // PARALLAX on data-parallax elements
    // ============================================================
    var parallaxElements = document.querySelectorAll('[data-parallax]');
    var parallaxTicking = false;

    function updateParallax() {
        var scrollY = window.scrollY;
        parallaxElements.forEach(function (el) {
            var speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
            var yOffset = -(scrollY * speed * 0.4);
            el.style.transform = 'translateY(' + yOffset + 'px)';
        });
        parallaxTicking = false;
    }

    window.addEventListener('scroll', function () {
        if (!parallaxTicking) {
            requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });

    // ============================================================
    // SECTION SCALE-IN on scroll (data-scroll-scale)
    // ============================================================
    var scaleSections = document.querySelectorAll('[data-scroll-scale]');

    if ('IntersectionObserver' in window && scaleSections.length) {
        var scaleObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

        scaleSections.forEach(function (el) {
            scaleObserver.observe(el);
        });
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('open');

        if (isOpen) {
            closeMobileMenu();
        } else {
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    }

    navToggle.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // ============================================================
    // SMOOTH SCROLL for anchor links
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 72;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // SCROLL REVEAL — IntersectionObserver
    // ============================================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger delay for siblings
                    const parent = entry.target.parentElement;
                    const siblings = parent.querySelectorAll('.reveal');
                    let index = 0;
                    siblings.forEach(function (sib, i) {
                        if (sib === entry.target) index = i;
                    });

                    entry.target.style.transitionDelay = (index * 0.1) + 's';
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show all
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // ============================================================
    // COUNTER ANIMATION
    // ============================================================
    const counters = document.querySelectorAll('[data-count]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = Math.round(startValue + (target - startValue) * easedProgress);

            el.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) {
            counterObserver.observe(el);
        });
    } else {
        counters.forEach(function (el) {
            el.textContent = el.getAttribute('data-count');
        });
    }

    // ============================================================
    // HERO PARTICLES — Canvas
    // ============================================================
    const particlesContainer = document.getElementById('hero-particles');

    if (particlesContainer) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        particlesContainer.appendChild(canvas);

        let particles = [];
        const PARTICLE_COUNT = 60;
        let animationId = null;

        function resizeCanvas() {
            canvas.width = particlesContainer.offsetWidth;
            canvas.height = particlesContainer.offsetHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(74, 144, 217, ' + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(74, 144, 217, ' + p.opacity + ')';
                ctx.fill();

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            }

            animationId = requestAnimationFrame(drawParticles);
        }

        // Only animate when Hero is visible
        if ('IntersectionObserver' in window) {
            const heroSection = document.getElementById('hero');
            const heroObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (!animationId) {
                            drawParticles();
                        }
                    } else {
                        if (animationId) {
                            cancelAnimationFrame(animationId);
                            animationId = null;
                        }
                    }
                });
            }, { threshold: 0 });

            heroObserver.observe(heroSection);
        } else {
            drawParticles();
        }

        resizeCanvas();
        createParticles();

        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                resizeCanvas();
                createParticles();
            }, 250);
        });
    }

    // ============================================================
    // SERVICE CARD TILT (desktop only)
    // ============================================================
    if (window.matchMedia('(pointer: fine)').matches) {
        const tiltCards = document.querySelectorAll('[data-tilt]');

        tiltCards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
            }, { passive: true });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    // ============================================================
    // ACTIVE NAV LINK on scroll
    // ============================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ============================================================
    // CONTACT FORM — Simulation
    // ============================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear previous errors
            clearFormErrors();

            // Get values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validate
            let isValid = true;

            if (!name || name.length < 2) {
                showFieldError('name', 'Por favor, ingresa tu nombre.');
                isValid = false;
            }

            if (!email || !isValidEmail(email)) {
                showFieldError('email', 'Por favor, ingresa un email válido.');
                isValid = false;
            }

            if (!message || message.length < 10) {
                showFieldError('message', 'El mensaje debe tener al menos 10 caracteres.');
                isValid = false;
            }

            if (!isValid) return;

            // Simulate submission
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(function () {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                contactForm.reset();
                formSuccess.hidden = false;

                // Hide success after 5s
                setTimeout(function () {
                    formSuccess.hidden = true;
                }, 5000);
            }, 1500);
        });

        // Real-time validation on blur
        ['name', 'email', 'message'].forEach(function (fieldId) {
            var field = document.getElementById(fieldId);
            field.addEventListener('blur', function () {
                clearFieldError(fieldId);
                var value = field.value.trim();

                if (fieldId === 'name' && value && value.length < 2) {
                    showFieldError('name', 'El nombre es muy corto.');
                }
                if (fieldId === 'email' && value && !isValidEmail(value)) {
                    showFieldError('email', 'Email no válido.');
                }
                if (fieldId === 'message' && value && value.length < 10) {
                    showFieldError('message', 'El mensaje es muy corto.');
                }
            });

            // Clear error on input
            field.addEventListener('input', function () {
                clearFieldError(fieldId);
            });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFieldError(fieldId, message) {
        var field = document.getElementById(fieldId);
        var error = document.getElementById(fieldId + '-error');
        if (field) field.classList.add('error');
        if (error) error.textContent = message;
    }

    function clearFieldError(fieldId) {
        var field = document.getElementById(fieldId);
        var error = document.getElementById(fieldId + '-error');
        if (field) field.classList.remove('error');
        if (error) error.textContent = '';
    }

    function clearFormErrors() {
        ['name', 'email', 'message'].forEach(function (id) {
            clearFieldError(id);
        });
    }

    // ============================================================
    // TECH CHIPS — Stagger animation on scroll
    // ============================================================
    if ('IntersectionObserver' in window) {
        const techChips = document.querySelectorAll('.tech-chip');

        const chipObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const parent = entry.target.closest('.tech__chips');
                    if (parent) {
                        const chips = parent.querySelectorAll('.tech-chip');
                        chips.forEach(function (chip, i) {
                            chip.style.opacity = '0';
                            chip.style.transform = 'translateY(10px)';
                            setTimeout(function () {
                                chip.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                                chip.style.opacity = '1';
                                chip.style.transform = 'translateY(0)';
                            }, i * 60);
                        });
                    }
                    chipObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        // Observe first chip in each group
        document.querySelectorAll('.tech__chips').forEach(function (group) {
            const firstChip = group.querySelector('.tech-chip');
            if (firstChip) chipObserver.observe(firstChip);
        });
    }

    // ============================================================
    // SCROLL TO TOP BUTTON
    // ============================================================
    const scrollTopBtn = document.getElementById('scroll-top');

    if (scrollTopBtn) {
        function handleScrollTop() {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', handleScrollTop, { passive: true });

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // ENHANCED REVEAL — Support reveal-left, reveal-right, reveal-scale
    // ============================================================
    var extraRevealEls = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window && extraRevealEls.length) {
        var extraRevealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    extraRevealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        extraRevealEls.forEach(function (el) {
            extraRevealObserver.observe(el);
        });
    }

    // ============================================================
    // 3D REVEAL — Perspective entrance animations
    // ============================================================
    var reveal3dEls = document.querySelectorAll('.reveal-3d, .reveal-3d-right');

    if ('IntersectionObserver' in window && reveal3dEls.length) {
        var reveal3dObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    reveal3dObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        reveal3dEls.forEach(function (el) {
            reveal3dObserver.observe(el);
        });
    }

    // ============================================================
    // LANGUAGE TOGGLE — ES / EN
    // ============================================================
    var currentLang = 'es';

    var translations = {
        en: {
            // Nav
            nav_about: 'About',
            nav_services: 'Services',
            nav_impact: 'Impact',
            nav_contact: 'Contact',
            // Hero
            hero_badge: 'Custom software for businesses',
            hero_title: 'Your operation, optimized.<br><span class="hero__title--gradient">Your software, custom-built.</span>',
            hero_subtitle: 'We develop software, automate processes and build mobile apps that cut operational costs and scale with your business.',
            hero_cta_primary: 'Book a free consultation',
            hero_cta_secondary: 'View services',
            hero_stat_projects: 'Projects',
            hero_stat_clients: 'Clients',
            hero_stat_satisfaction: 'Satisfaction',
            // About
            about_card1: 'Python Backend',
            about_card2: 'Process Automation',
            about_card3: 'Flutter Apps',
            about_label: 'About Us',
            about_title: 'Software with purpose.<br><span class="text--gradient">Results you can measure.</span>',
            about_text1: 'Led by David, a developer specialized in Python, Flutter and business automation. At VanguardSoft we don\'t sell tech for trends: we analyze your operation, find bottlenecks and build the exact software you need.',
            about_h1: 'Faster processes, lower costs',
            about_h2: 'Python, Flutter & APIs',
            about_h3: 'Direct access to the developer',
            // Services
            services_label: 'Our Services',
            services_title: 'What we do for<br><span class="text--gradient">your business</span>',
            services_desc: 'Each service solves a specific problem in your operation. No filler, no unnecessary tech.',
            svc1_title: 'Web Development',
            svc1_desc: 'Is your website failing to build trust or convert? We create sites and web platforms that capture clients and reflect your company\'s quality.',
            svc2_title: 'Custom Software',
            svc2_desc: 'Using spreadsheets or generic tools that don\'t fit? We build the exact system your operation needs, integrated with your real processes.',
            svc3_title: 'Cross-platform Apps',
            svc3_desc: 'Need an app for iOS and Android without doubling costs? With Flutter, we build one app that runs on every platform.',
            svc4_title: 'Process Automation',
            svc4_desc: 'Is your team wasting hours on repetitive tasks? We automate workflows, connect systems and free up time for what matters.',
            svc5_title: 'Systems Integration',
            svc5_desc: 'Your tools don\'t talk to each other? We connect your platforms, APIs and databases so information flows without manual intervention.',
            // Impact
            impact_label: 'Real Impact',
            impact_title: 'Processes that took days,<br><span class="text--gradient">solved in seconds</span>',
            impact_desc: 'We find the bottlenecks in your operation and automate them. Your team stops losing time on manual tasks and focuses on growing the business.',
            impact_before: 'Before',
            impact_now: 'Now',
            impact_time_before: 'Hours \u00b7 Days',
            impact_time_after: 'Seconds',
            impact_pill1: 'Lower operational costs',
            impact_pill2: 'Zero manual errors',
            impact_pill3: 'Continuous 24/7 operation',
            portfolio_label: 'Portfolio',
            portfolio_title: 'Projects that<br><span class="text--gradient">speak for themselves</span>',
            portfolio_desc: 'A showcase of what we\'re capable of building. Each project is an innovation story.',
            port1_cat: 'Web Platform',
            port1_title: 'Premium E-Commerce',
            port1_desc: 'E-commerce platform with immersive design, integrated payments and advanced admin panel.',
            port2_cat: 'Mobile App',
            port2_title: 'FinTech Dashboard',
            port2_desc: 'Cross-platform financial app with real-time analytics and exceptional user experience.',
            port3_cat: 'Enterprise Software',
            port3_title: 'ERP Intelligence',
            port3_desc: 'Enterprise management system with integrated artificial intelligence for operations automation.',
            // Tech
            tech_label: 'Tech Stack',
            tech_title: 'Tools that<br><span class="text--gradient">power results</span>',
            tech_frontend: 'Frontend',
            tech_backend: 'Backend',
            tech_mobile: 'Mobile & Desktop',
            tech_cloud: 'Cloud & DevOps',
            tech_ai: 'AI & Data',
            // Differentiators
            diff_label: 'Guarantees',
            diff_title: 'Why trust<br><span class="text--gradient">VanguardSoft</span>',
            diff1_title: 'Fast Delivery',
            diff1_desc: 'Short sprints with visible progress every week. You see real results from day one, no months of waiting.',
            diff2_title: 'Direct Contact',
            diff2_desc: 'You talk to the person building your software. No middlemen, no noise. Clear technical communication and agile decisions.',
            diff3_title: 'Built to Scale',
            diff3_desc: 'Modular architectures that grow with you. What we build today handles tomorrow\'s volume without rebuilding anything.',
            diff4_title: 'Post-Delivery Support',
            diff4_desc: 'We don\'t vanish after delivery. Maintenance, adjustments and ongoing support so your software always works.',
            // CTA
            cta_title: 'Ready to optimize<br><span class="text--gradient">your operation?</span>',
            cta_desc: 'Tell us the problem you want to solve. Within 24 hours we\'ll tell you how we can help \u2014 no strings attached.',
            cta_btn: 'Request free consultation',
            // Contact
            contact_label: 'Contact',
            contact_title: 'Tell us your challenge.<br><span class="text--gradient">We\'ll propose a solution.</span>',
            contact_text: 'Fill out the form with your project details. We respond within 24 hours with a clear proposal, no commitment required.',
            contact_email: 'contacto@vanguardsoft.com',
            contact_location: 'Remote \u2014 Global',
            form_name: 'Name',
            form_name_ph: 'Your full name',
            form_email: 'Email',
            form_email_ph: 'you@email.com',
            form_message: 'Message',
            form_message_ph: 'Tell us about your project...',
            form_submit: 'Send message',
            form_success: 'Message sent! We\'ll get in touch soon.',
            // Footer
            footer_tagline: 'Software company specialized in custom development, process automation and mobile apps for businesses that want to operate better.',
            footer_nav: 'Navigation',
            footer_services: 'Services',
            footer_follow: 'Follow Us',
            footer_copy: '\u00a9 2026 VanguardSoft. All rights reserved.',
            footer_built: 'Built with discipline and purpose.'
        },
        es: {
            nav_about: 'Nosotros',
            nav_services: 'Servicios',
            nav_impact: 'Impacto',
            nav_contact: 'Contacto',
            hero_badge: 'Software a medida para empresas',
            hero_title: 'Tu operaci\u00f3n, optimizada.<br><span class="hero__title--gradient">Tu software, a medida.</span>',
            hero_subtitle: 'Desarrollamos software, automatizamos procesos y creamos aplicaciones m\u00f3viles que reducen costos operativos y escalan con tu negocio.',
            hero_cta_primary: 'Agenda una asesor\u00eda gratis',
            hero_cta_secondary: 'Ver servicios',
            hero_stat_projects: 'Proyectos',
            hero_stat_clients: 'Clientes',
            hero_stat_satisfaction: 'Satisfacci\u00f3n',
            about_card1: 'Backend en Python',
            about_card2: 'Automatizaci\u00f3n de Procesos',
            about_card3: 'Apps con Flutter',
            about_label: 'Sobre Nosotros',
            about_title: 'Software con prop\u00f3sito.<br><span class="text--gradient">Resultados que se miden.</span>',
            about_text1: 'Liderado por David, desarrollador especializado en Python, Flutter y automatizaci\u00f3n empresarial. En VanguardSoft no vendemos tecnolog\u00eda por moda: analizamos tu operaci\u00f3n, identificamos cuellos de botella y construimos el software exacto que necesitas.',
            about_h1: 'Procesos m\u00e1s r\u00e1pidos, costos m\u00e1s bajos',
            about_h2: 'Python, Flutter y APIs',
            about_h3: 'Trato directo con el desarrollador',
            services_label: 'Nuestros Servicios',
            services_title: 'Lo que hacemos por<br><span class="text--gradient">tu negocio</span>',
            services_desc: 'Cada servicio resuelve un problema concreto de tu operaci\u00f3n. Sin relleno, sin tecnolog\u00eda innecesaria.',
            svc1_title: 'Desarrollo Web',
            svc1_desc: '\u00bfTu web no genera confianza o no convierte? Creamos sitios y plataformas web que captan clientes y reflejan la calidad de tu empresa.',
            svc2_title: 'Software a Medida',
            svc2_desc: '\u00bfUsas Excel o herramientas gen\u00e9ricas que no encajan? Desarrollamos el sistema exacto que tu operaci\u00f3n necesita, integrado con tus procesos reales.',
            svc3_title: 'Apps Multiplataforma',
            svc3_desc: '\u00bfNecesitas una app que funcione en iOS y Android sin duplicar costos? Con Flutter, desarrollamos una sola app que corre en todas las plataformas.',
            svc4_title: 'Automatizaci\u00f3n de Procesos',
            svc4_desc: '\u00bfTu equipo pierde horas en tareas repetitivas? Automatizamos flujos de trabajo, conectamos sistemas y liberamos tiempo para lo que importa.',
            svc5_title: 'Integraci\u00f3n de Sistemas',
            svc5_desc: '\u00bfTus herramientas no se comunican entre s\u00ed? Conectamos tus plataformas, APIs y bases de datos para que la informaci\u00f3n fluya sin intervenci\u00f3n manual.',
            // Impact
            impact_label: 'Impacto Real',
            impact_title: 'Procesos que tardaban d\u00edas,<br><span class="text--gradient">resueltos en segundos</span>',
            impact_desc: 'Identificamos los cuellos de botella de tu operaci\u00f3n y los automatizamos. Tu equipo deja de perder tiempo en tareas manuales y se enfoca en hacer crecer el negocio.',
            impact_before: 'Antes',
            impact_now: 'Ahora',
            impact_time_before: 'Horas \u00b7 D\u00edas',
            impact_time_after: 'Segundos',
            impact_pill1: 'Reducci\u00f3n de costos operativos',
            impact_pill2: 'Eliminaci\u00f3n de errores manuales',
            impact_pill3: 'Operaci\u00f3n continua 24/7',
            portfolio_title: 'Proyectos que<br><span class="text--gradient">hablan por s\u00ed solos</span>',
            portfolio_desc: 'Una muestra de lo que somos capaces de construir. Cada proyecto es una historia de innovaci\u00f3n.',
            port1_cat: 'Plataforma Web',
            port1_title: 'E-Commerce Premium',
            port1_desc: 'Plataforma de comercio electr\u00f3nico con dise\u00f1o inmersivo, pagos integrados y panel de administraci\u00f3n avanzado.',
            port2_cat: 'App M\u00f3vil',
            port2_title: 'FinTech Dashboard',
            port2_desc: 'Aplicaci\u00f3n financiera multiplataforma con anal\u00edticas en tiempo real y experiencia de usuario excepcional.',
            port3_cat: 'Software Empresarial',
            port3_title: 'ERP Intelligence',
            port3_desc: 'Sistema de gesti\u00f3n empresarial con inteligencia artificial integrada para automatizaci\u00f3n de operaciones.',
            tech_label: 'Stack Tecnol\u00f3gico',
            tech_title: 'Herramientas que<br><span class="text--gradient">potencian resultados</span>',
            tech_frontend: 'Frontend',
            tech_backend: 'Backend',
            tech_mobile: 'Mobile & Desktop',
            tech_cloud: 'Cloud & DevOps',
            tech_ai: 'IA & Data',
            diff_label: 'Garant\u00edas',
            diff_title: 'Por qu\u00e9 confiar en<br><span class="text--gradient">VanguardSoft</span>',
            diff1_title: 'Entregas R\u00e1pidas',
            diff1_desc: 'Sprints cortos con avances visibles cada semana. Ves progreso real desde el d\u00eda uno, sin esperar meses.',
            diff2_title: 'Trato Directo',
            diff2_desc: 'Hablas con quien construye tu software. Sin intermediarios, sin ruido. Comunicaci\u00f3n t\u00e9cnica clara y decisiones \u00e1giles.',
            diff3_title: 'Hecho para Crecer',
            diff3_desc: 'Arquitecturas modulares que escalan contigo. Lo que construimos hoy soporta el volumen de ma\u00f1ana sin rehacer nada.',
            diff4_title: 'Soporte Post-Entrega',
            diff4_desc: 'No desaparecemos al entregar. Mantenimiento, ajustes y soporte continuo para que tu software siempre funcione.',
            cta_title: '\u00bfListo para optimizar<br><span class="text--gradient">tu operaci\u00f3n?</span>',
            cta_desc: 'Cu\u00e9ntanos qu\u00e9 problema quieres resolver. En 24 horas te decimos c\u00f3mo podemos ayudarte \u2014 sin compromiso.',
            cta_btn: 'Solicitar asesor\u00eda gratuita',
            contact_label: 'Contacto',
            contact_title: 'Cu\u00e9ntanos tu reto.<br><span class="text--gradient">Te proponemos una soluci\u00f3n.</span>',
            contact_text: 'Completa el formulario con los detalles de tu proyecto. Respondemos en menos de 24 horas con una propuesta clara y sin compromiso.',
            contact_email: 'contacto@vanguardsoft.com',
            contact_location: 'Remoto \u2014 Global',
            form_name: 'Nombre',
            form_name_ph: 'Tu nombre completo',
            form_email: 'Email',
            form_email_ph: 'tu@email.com',
            form_message: 'Mensaje',
            form_message_ph: 'Cu\u00e9ntanos sobre tu proyecto...',
            form_submit: 'Enviar mensaje',
            form_success: '\u00a1Mensaje enviado! Nos pondremos en contacto pronto.',
            footer_tagline: 'Empresa de software especializada en desarrollo a medida, automatizaci\u00f3n de procesos y aplicaciones m\u00f3viles para empresas que quieren operar mejor.',
            footer_nav: 'Navegaci\u00f3n',
            footer_services: 'Servicios',
            footer_follow: 'S\u00edguenos',
            footer_copy: '\u00a9 2026 VanguardSoft. Todos los derechos reservados.',
            footer_built: 'Construido con disciplina y prop\u00f3sito.'
        }
    };

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.setAttribute('lang', lang);

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update innerHTML (for elements with HTML like <br> and <span>)
        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update toggle labels
        var newLabel = lang === 'es' ? 'EN' : 'ES';
        var labelEl = document.getElementById('lang-label');
        var labelMobileEl = document.getElementById('lang-label-mobile');
        if (labelEl) labelEl.textContent = newLabel;
        if (labelMobileEl) labelMobileEl.textContent = newLabel;
    }

    // Toggle buttons
    var langToggle = document.getElementById('lang-toggle');
    var langToggleMobile = document.getElementById('lang-toggle-mobile');

    function handleLangToggle() {
        var newLang = currentLang === 'es' ? 'en' : 'es';
        setLanguage(newLang);
    }

    if (langToggle) langToggle.addEventListener('click', handleLangToggle);
    if (langToggleMobile) langToggleMobile.addEventListener('click', handleLangToggle);

})();

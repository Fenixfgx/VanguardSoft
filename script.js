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
                        ctx.strokeStyle = 'rgba(0, 113, 227, ' + opacity + ')';
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
                ctx.fillStyle = 'rgba(0, 113, 227, ' + p.opacity + ')';
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
            hero_badge: 'Technological Innovation',
            hero_title: 'We build the<br><span class="hero__title--gradient">digital future</span>',
            hero_subtitle: 'Technology solutions on another level. We create software, platforms and digital experiences that transform businesses.',
            hero_cta_primary: 'Work with us',
            hero_cta_secondary: 'Explore services',
            hero_stat_projects: 'Projects',
            hero_stat_clients: 'Clients',
            hero_stat_satisfaction: 'Satisfaction',
            // About
            about_card1: 'Scalable Architecture',
            about_card2: 'AI Integration',
            about_card3: 'Premium Design',
            about_label: 'About Us',
            about_title: 'We don\'t just develop software.<br><span class="text--gradient">We create competitive advantages.</span>',
            about_text1: 'At Vanguard Soft we combine advanced software engineering with cutting-edge design to create digital products that make a difference. Every line of code has a purpose: to drive your business into the future.',
            about_text2: 'Our approach goes beyond technical development. We think like strategists, design like artists and build like engineers. The result: solutions that don\'t just work, but inspire.',
            about_h1: 'Focus on measurable results',
            about_h2: 'Cutting-edge technology',
            about_h3: 'Commitment to excellence',
            // Services
            services_label: 'Our Services',
            services_title: 'Solutions that<br><span class="text--gradient">transform industries</span>',
            services_desc: 'We offer a complete ecosystem of technology services designed to drive your business.',
            svc1_title: 'Web Development',
            svc1_desc: 'Corporate websites, landing pages, e-commerce and high-performance web platforms with premium design.',
            svc2_title: 'Custom Software',
            svc2_desc: 'Enterprise systems, internal tools and customized solutions that adapt to your processes.',
            svc3_title: 'Cross-platform Apps',
            svc3_desc: 'Native and cross-platform applications for iOS, Android, desktop and web from a single codebase.',
            svc4_title: 'Automation',
            svc4_desc: 'Automate processes, eliminate repetitive tasks and integrate systems to maximize operational efficiency.',
            svc5_title: 'AI & Smart Solutions',
            svc5_desc: 'We integrate artificial intelligence into your processes. Chatbots, predictive analytics and smart automation.',
            // Impact
            impact_label: 'Real Impact',
            impact_title: 'What used to take days,<br><span class="text--gradient">now takes seconds</span>',
            impact_desc: 'We automate the bottlenecks of your business. Your team focuses on creating value; technology handles the rest — non-stop, error-free, without delays.',
            impact_before: 'Before',
            impact_now: 'Now',
            impact_time_before: 'Hours · Days',
            impact_time_after: 'Seconds',
            impact_pill1: 'Exponential speed',
            impact_pill2: 'Zero manual errors',
            impact_pill3: 'Available 24/7',
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
            diff_label: 'Why choose us?',
            diff_title: 'What makes us<br><span class="text--gradient">different</span>',
            diff1_title: 'Speed',
            diff1_desc: 'We develop fast without sacrificing quality. Agile methodologies, incremental deliveries and results from the first sprint.',
            diff2_title: 'Innovation',
            diff2_desc: 'We use the most advanced technologies on the market. Always one step ahead to give you a competitive edge.',
            diff3_title: 'Scalability',
            diff3_desc: 'Modular architectures designed to grow. Today\'s solution will be the foundation of tomorrow\'s empire.',
            diff4_title: 'Dedicated Support',
            diff4_desc: 'Continuous post-delivery support. Your success is our success, and we\'re with you every step of the way.',
            // CTA
            cta_title: 'Take your idea to the<br><span class="text--gradient">next level</span>',
            cta_desc: 'Every great project starts with a conversation. Tell us your vision and we\'ll turn it into digital reality.',
            cta_btn: 'Let\'s start creating',
            // Contact
            contact_label: 'Contact',
            contact_title: 'Let\'s talk about your<br><span class="text--gradient">next project</span>',
            contact_text: 'We\'re ready to listen. Fill out the form and we\'ll get back to you within 24 hours.',
            contact_email: 'contacto@vanguardsoft.com',
            contact_location: 'Remote — Global',
            form_name: 'Name',
            form_name_ph: 'Your full name',
            form_email: 'Email',
            form_email_ph: 'you@email.com',
            form_message: 'Message',
            form_message_ph: 'Tell us about your project...',
            form_submit: 'Send message',
            form_success: 'Message sent! We\'ll get in touch soon.',
            // Footer
            footer_tagline: 'We build the digital future. High-impact technology solutions for companies that want to lead.',
            footer_nav: 'Navigation',
            footer_services: 'Services',
            footer_follow: 'Follow Us',
            footer_copy: '\u00a9 2026 Vanguard Soft. All rights reserved.',
            footer_built: 'Built with passion for innovation.'
        },
        es: {
            nav_about: 'Nosotros',
            nav_services: 'Servicios',
            nav_impact: 'Impacto',
            nav_contact: 'Contacto',
            hero_badge: 'Innovaci\u00f3n Tecnol\u00f3gica',
            hero_title: 'Construimos el<br><span class="hero__title--gradient">futuro digital</span>',
            hero_subtitle: 'Soluciones tecnol\u00f3gicas a otro nivel. Creamos software, plataformas y experiencias digitales que transforman negocios.',
            hero_cta_primary: 'Trabaja con nosotros',
            hero_cta_secondary: 'Explorar servicios',
            hero_stat_projects: 'Proyectos',
            hero_stat_clients: 'Clientes',
            hero_stat_satisfaction: 'Satisfacci\u00f3n',
            about_card1: 'Arquitectura Escalable',
            about_card2: 'Integraci\u00f3n IA',
            about_card3: 'Dise\u00f1o Premium',
            about_label: 'Sobre Nosotros',
            about_title: 'No solo desarrollamos software.<br><span class="text--gradient">Creamos ventajas competitivas.</span>',
            about_text1: 'En Vanguard Soft combinamos ingenier\u00eda de software avanzada con dise\u00f1o de vanguardia para crear productos digitales que marcan la diferencia. Cada l\u00ednea de c\u00f3digo tiene un prop\u00f3sito: impulsar tu negocio hacia el futuro.',
            about_text2: 'Nuestro enfoque va m\u00e1s all\u00e1 del desarrollo t\u00e9cnico. Pensamos como estrategas, dise\u00f1amos como artistas y construimos como ingenieros. El resultado: soluciones que no solo funcionan, sino que inspiran.',
            about_h1: 'Enfoque en resultados medibles',
            about_h2: 'Tecnolog\u00eda de \u00faltima generaci\u00f3n',
            about_h3: 'Compromiso con la excelencia',
            services_label: 'Nuestros Servicios',
            services_title: 'Soluciones que<br><span class="text--gradient">transforman industrias</span>',
            services_desc: 'Ofrecemos un ecosistema completo de servicios tecnol\u00f3gicos dise\u00f1ados para impulsar tu negocio.',
            svc1_title: 'Desarrollo Web',
            svc1_desc: 'P\u00e1ginas corporativas, landing pages, e-commerce y plataformas web de alto rendimiento con dise\u00f1o premium.',
            svc2_title: 'Software a Medida',
            svc2_desc: 'Sistemas empresariales, herramientas internas y soluciones personalizadas que se adaptan a tus procesos.',
            svc3_title: 'Apps Multiplataforma',
            svc3_desc: 'Aplicaciones nativas y multiplataforma para iOS, Android, escritorio y web desde una sola base de c\u00f3digo.',
            svc4_title: 'Automatizaci\u00f3n',
            svc4_desc: 'Automatiza procesos, elimina tareas repetitivas e integra sistemas para maximizar la eficiencia operativa.',
            svc5_title: 'IA y Soluciones Inteligentes',
            svc5_desc: 'Integramos inteligencia artificial en tus procesos. Chatbots, an\u00e1lisis predictivo y automatizaci\u00f3n inteligente.',
            // Impact
            impact_label: 'Impacto Real',
            impact_title: 'Lo que antes tardaba d\u00edas,<br><span class="text--gradient">ahora tarda segundos</span>',
            impact_desc: 'Automatizamos los cuellos de botella de tu empresa. Tu equipo se enfoca en crear valor; la tecnolog\u00eda se encarga del resto \u2014 sin parar, sin errores, sin demoras.',
            impact_before: 'Antes',
            impact_now: 'Ahora',
            impact_time_before: 'Horas \u00b7 D\u00edas',
            impact_time_after: 'Segundos',
            impact_pill1: 'Velocidad exponencial',
            impact_pill2: 'Cero errores manuales',
            impact_pill3: 'Disponible 24/7',
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
            diff_label: '\u00bfPor qu\u00e9 elegirnos?',
            diff_title: 'Lo que nos hace<br><span class="text--gradient">diferentes</span>',
            diff1_title: 'Velocidad',
            diff1_desc: 'Desarrollamos r\u00e1pido sin sacrificar calidad. Metodolog\u00edas \u00e1giles, entregas incrementales y resultados desde el primer sprint.',
            diff2_title: 'Innovaci\u00f3n',
            diff2_desc: 'Utilizamos las tecnolog\u00edas m\u00e1s avanzadas del mercado. Siempre un paso adelante para darte ventaja competitiva.',
            diff3_title: 'Escalabilidad',
            diff3_desc: 'Arquitecturas modulares dise\u00f1adas para crecer. Tu soluci\u00f3n de hoy ser\u00e1 la base de tu imperio de ma\u00f1ana.',
            diff4_title: 'Soporte Dedicado',
            diff4_desc: 'Acompa\u00f1amiento continuo post-entrega. Tu \u00e9xito es nuestro \u00e9xito, y estamos contigo en cada paso del camino.',
            cta_title: 'Lleva tu idea al<br><span class="text--gradient">siguiente nivel</span>',
            cta_desc: 'Cada gran proyecto comienza con una conversaci\u00f3n. Cu\u00e9ntanos tu visi\u00f3n y la convertiremos en realidad digital.',
            cta_btn: 'Empecemos a crear',
            contact_label: 'Contacto',
            contact_title: 'Hablemos de tu<br><span class="text--gradient">pr\u00f3ximo proyecto</span>',
            contact_text: 'Estamos listos para escucharte. Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.',
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
            footer_tagline: 'Construimos el futuro digital. Soluciones tecnol\u00f3gicas de alto impacto para empresas que quieren liderar.',
            footer_nav: 'Navegaci\u00f3n',
            footer_services: 'Servicios',
            footer_follow: 'S\u00edguenos',
            footer_copy: '\u00a9 2026 Vanguard Soft. Todos los derechos reservados.',
            footer_built: 'Construido con pasi\u00f3n por la innovaci\u00f3n.'
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

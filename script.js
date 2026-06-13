/* ====================================================
   YASH ASSOCIATE — Interactive JavaScript
   Scroll Animations | Parallax | 3D Tilt | Counters
   ==================================================== */

function initializeApp() {
    const highCourtNames = [
        'Bombay High Court',
        'High Court of Bombay at Goa',
        'Gujarat High Court',
        'Allahabad High Court',
        'Madhya Pradesh High Court',
        'Jammu Kashmir & Ladakh High Court',
        'Delhi High Court',
        'Calcutta High Court',
        'Madras High Court',
        'Karnataka High Court',
        'Kerala High Court',
        'Punjab & Haryana High Court',
        'Andhra Pradesh High Court',
        'Bombay High Court - Aurangabad Bench',
        'Bombay High Court - Nagpur Bench',
        'Patna High Court',
        'Rajasthan High Court',
        'Himachal Pradesh High Court',
        'Jharkhand High Court',
        'Chhattisgarh High Court',
        'Uttarakhand High Court',
        'Orissa High Court',
        'Gauhati High Court',
        'Telangana High Court',
        'Tripura High Court',
        'Meghalaya High Court',
        'Manipur High Court',
        'Sikkim High Court'
    ];

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    function renderHighCourtCard(num) {
        const listItems = highCourtNames.map(court => `<li>${escapeHtml(court)}</li>`).join('');
        return `
                            <div class="court-card court-expandable" id="highCourtCard" tabindex="0" role="button" aria-expanded="false" aria-controls="highCourtList" style="opacity:1; transform:translateY(0); filter:blur(0);">
                                <div class="court-rank">${num}</div>
                                <h3>High Court</h3>
                                <p>Bombay High Court <span class="court-more">+ More</span></p>
                                <div class="court-sub-list" id="highCourtList">
                                    <ul>${listItems}</ul>
                                </div>
                            </div>`;
    }

    // ────── PRELOADER ──────
    const preloader = document.getElementById('preloader');
    // Keep branded entry visible for at least 0.5 seconds
    const preloaderStart = Date.now();
    const minPreloaderMs = 500;
    let preloaderHidden = false;

    function hidePreloader() {
        if (preloaderHidden) return;
        preloaderHidden = true;
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }

    // If window is already loaded, hide immediately or after min time
    if (document.readyState === 'complete') {
        const elapsed = Date.now() - preloaderStart;
        const remaining = Math.max(0, minPreloaderMs - elapsed);
        setTimeout(hidePreloader, remaining);
    } else {
        window.addEventListener('load', () => {
            const elapsed = Date.now() - preloaderStart;
            const remaining = Math.max(0, minPreloaderMs - elapsed);
            setTimeout(hidePreloader, remaining);
        });
    }

    // Safety fallback if load event is delayed
    setTimeout(hidePreloader, 3000); // Shorter fallback (3s) for better UX

    // ────── FETCH DYNAMIC CONTENT FROM DB ──────
    async function loadDynamicContent() {
        try {
            const res = await fetch('/api/get-content');
            const result = await res.json();
            if (result.success && result.data) {
                const data = result.data;
                const update = (id, text) => {
                    const el = document.getElementById(id);
                    if (el && text) el.textContent = text;
                };
                const withPlus = value => {
                    const text = String(value || '').trim();
                    if (!text) return '';
                    return text.endsWith('+') ? text : `${text}+`;
                };
                const normalizeMetricText = value => String(value || '')
                    .replace(/\b20\+?\s+years/gi, '21+ years')
                    .replace(/\b11\+?\s+(dedicated\s+)?legal professionals/gi, (match, prefix = '') => `11+ ${prefix || ''}legal professionals`)
                    .replace(/\b8\+?\s+court/gi, '8+ court');
                
                // Update Hero
                if (data.heroTitle) {
                    const parts = data.heroTitle.split(' ');
                    const titleEl = document.getElementById('db-heroTitle');
                    if (titleEl) {
                        titleEl.innerHTML = `<span class="hero-line line-1">${parts[0] || ''}</span><span class="hero-line line-2">${parts.slice(1).join(' ') || ''}</span>`;
                    }
                }
                update('db-heroSubtitle', data.heroSubtitle);
                update('db-heroDescription', normalizeMetricText(data.heroDescription));
                
                // Update About
                update('db-aboutTitle', data.aboutTitle);
                update('db-aboutText', normalizeMetricText(data.aboutText));
                
                // Update Contact
                update('db-address', data.address);
                if (data.phone) {
                    const phoneEl = document.getElementById('db-phone');
                    if(phoneEl) phoneEl.innerHTML = `<a href="tel:${data.phone.replace(/[^0-9+]/g, '')}">${data.phone}</a>`;
                }
                if (data.email) {
                    const emailEl = document.getElementById('db-email');
                    if(emailEl) emailEl.innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;
                }

                // Update Images
                const images = ['heroBgImg', 'heroPortraitImg', 'aboutBgImg', 'aboutPortraitImg', 'practiceBgImg', 'courtsBgImg', 'clientsBgImg', 'teamBgImg', 'dividerBgImg'];
                images.forEach(img => {
                    if (data[img]) {
                        const el = document.getElementById('db-' + img);
                        if (el) el.src = data[img];
                    }
                });

                // Update Practice Areas
                if (data.practiceAreasText) {
                    const grid = document.getElementById('db-practiceGrid');
                    if (grid) {
                        const areas = data.practiceAreasText.split('\n').filter(l => l.trim());
                        const cards = grid.querySelectorAll('.practice-card');
                        
                        areas.forEach((area, index) => {
                            const parts = area.split('|');
                            const title = parts[0];
                            const desc = parts.slice(1).join('|');
                            
                            if (cards[index]) {
                                const h3 = cards[index].querySelector('h3');
                                const p = cards[index].querySelector('p');
                                if (h3) h3.textContent = title;
                                if (p) p.textContent = desc;
                            } else {
                                const newCard = document.createElement('div');
                                newCard.className = `practice-card stagger-${(index%9)+1}`;
                                newCard.setAttribute('data-scroll', 'reveal');
                                newCard.setAttribute('data-tilt', '');
                                newCard.innerHTML = `
                                <div class="card-inner">
                                    <div class="card-front">
                                        <div class="card-icon" style="font-size:2rem; margin-bottom:15px; color:var(--gold);">✦</div>
                                        <h3>${title}</h3>
                                        <p>${desc || ''}</p>
                                    </div>
                                </div>`;
                                grid.appendChild(newCard);
                            }
                        });
                        
                        // Remove extra cards if any
                        for (let i = areas.length; i < cards.length; i++) {
                            cards[i].remove();
                        }
                    }
                }

                // Update Courts
                if (data.courtsText) {
                    const grid = document.getElementById('db-courtsGrid');
                    if (grid) {
                        const courts = data.courtsText.split('\n').filter(l => l.trim());
                        let html = '';
                        courts.forEach((court, index) => {
                            const parts = court.split('|');
                            const title = parts[0].trim();
                            const desc = parts.slice(1).join('|').trim();
                            const num = (index + 1).toString().padStart(2, '0');
                            if (title.toLowerCase() === 'high court') {
                                html += renderHighCourtCard(num);
                                return;
                            }
                            html += `
                            <div class="court-card" style="opacity:1; transform:translateY(0); filter:blur(0);">
                                <div class="court-rank">${num}</div>
                                <h3>${escapeHtml(title)}</h3>
                                <p>${escapeHtml(desc)}</p>
                            </div>`;
                        });
                        grid.innerHTML = html;
                    }
                }

                // Update Clients
                if (data.clientsText) {
                    const marquee = document.getElementById('db-clientsMarquee');
                    if (marquee) {
                        const clients = data.clientsText.split(',').map(c => c.trim()).filter(c => c);
                        const allClients = [...clients, ...clients]; // Duplicate for scrolling
                        let html = '';
                        allClients.forEach(client => {
                            html += `<div class="client-item">${client}</div>`;
                        });
                        marquee.innerHTML = html;
                    }
                }

                // Update Team
                update('db-teamCount', withPlus(data.teamCount));
                update('db-teamText', normalizeMetricText(data.teamText));
            }
        } catch (error) {
            console.error('Failed to load dynamic content', error);
        }
    }
    loadDynamicContent();

    // ────── NAVBAR SCROLL ──────
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavScroll() {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 60);

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (scrollY >= top) {
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
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ────── MOBILE MENU ──────
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.getElementById('navLinks');

    // Create overlay element for mobile menu backdrop
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);

    let scrollPosition = 0;

    function openMobileMenu() {
        scrollPosition = window.scrollY;
        menuToggle.classList.add('active');
        navLinksContainer.classList.add('open');
        navOverlay.classList.add('visible');
        document.body.classList.add('menu-open');
        document.body.style.top = `-${scrollPosition}px`;
    }

    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('open');
        navOverlay.classList.remove('visible');
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);
    }

    menuToggle.addEventListener('click', () => {
        if (navLinksContainer.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when overlay is tapped
    navOverlay.addEventListener('click', closeMobileMenu);

    // Close menu on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ────── SCROLL REVEAL (Intersection Observer) ──────
    const revealElements = document.querySelectorAll('[data-scroll]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // ────── COUNTER ANIMATION ──────
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let counterAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counterAnimated = true;
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        counterObserver.observe(counters[0].closest('.about-stats'));
    }

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const start = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const current = Math.round(eased * target);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // ────── PARALLAX SCROLL EFFECT (disabled on touch devices) ──────
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const heroImg = document.querySelector('.hero-bg-img');
    const dividerBg = document.querySelector('.divider-bg');

    function handleParallax() {
        if (isTouchDevice) return; // Skip parallax on mobile for performance
        const scrollY = window.scrollY;
        const windowH = window.innerHeight;

        // Hero parallax
        if (heroImg) {
            const heroSection = document.querySelector('.hero-section');
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (scrollY < heroBottom) {
                const parallaxY = scrollY * 0.3;
                heroImg.style.transform = `scale(1.1) translateY(${parallaxY}px)`;
            }
        }

        // Divider parallax
        if (dividerBg) {
            const divider = document.querySelector('.parallax-divider');
            const dividerTop = divider.offsetTop;
            const dividerH = divider.offsetHeight;
            if (scrollY + windowH > dividerTop && scrollY < dividerTop + dividerH) {
                const progress = (scrollY + windowH - dividerTop) / (windowH + dividerH);
                const parallaxY = (progress - 0.5) * 80;
                dividerBg.style.transform = `translateY(${parallaxY}px)`;
            }
        }
    }
    if (!isTouchDevice) {
        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // ────── 3D TILT EFFECT ON CARDS (disabled on touch devices) ──────
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('[data-tilt]');
        tiltCards.forEach(card => {
            const inner = card.querySelector('.card-inner');
            if (!inner) return;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                inner.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ────── SMOOTH SCROLL FOR NAV LINKS ──────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ────── STAGGER ANIMATION ON PRACTICE CARDS ──────
    const practiceCards = document.querySelectorAll('.practice-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 80);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    practiceCards.forEach(card => cardObserver.observe(card));

    // ────── COURT CARDS STAGGER ──────
    const courtCards = document.querySelectorAll('.court-card');
    const courtObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const cards = entry.target.parentElement.querySelectorAll('.court-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                        card.style.filter = 'blur(0)';
                    }, i * 120);
                });
                courtObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    if (courtCards.length > 0) {
        courtCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.92)';
            card.style.filter = 'blur(4px)';
            card.style.transition = 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
        });
        courtObserver.observe(courtCards[0]);
    }

    // ────── EXPANDABLE HIGH COURT CARD ──────
    document.addEventListener('click', event => {
        const highCourtCard = event.target.closest('#highCourtCard');
        if (!highCourtCard) return;
        const isExpanded = highCourtCard.classList.toggle('expanded');
        highCourtCard.setAttribute('aria-expanded', String(isExpanded));
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const highCourtCard = event.target.closest('#highCourtCard');
        if (!highCourtCard) return;
        event.preventDefault();
        const isExpanded = highCourtCard.classList.toggle('expanded');
        highCourtCard.setAttribute('aria-expanded', String(isExpanded));
    });

    // ────── SCROLL PROGRESS BAR ──────
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        width: 0%;
        background: linear-gradient(90deg, #a68a3a, #c9a84c, #e2c97e);
        z-index: 9999;
        transition: width 0.1s linear;
        box-shadow: 0 0 10px rgba(201, 168, 76, 0.5);
    `;
    document.body.appendChild(progressBar);

    function updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }
    window.addEventListener('scroll', updateProgressBar, { passive: true });

    // ────── GOLD CURSOR GLOW ON HERO (skip on touch devices) ──────
    if (!isTouchDevice) {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const glow = document.createElement('div');
            glow.style.cssText = `
                position: absolute;
                width: 400px;
                height: 400px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%);
                pointer-events: none;
                z-index: 1;
                transition: transform 0.12s ease-out;
                will-change: transform;
            `;
            heroSection.appendChild(glow);

            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = e.clientX - rect.left - 200;
                const y = e.clientY - rect.top - 200;
                glow.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
    }
    // ────── CONSULTATION MODAL ──────
    const consultModal = document.getElementById('consultationModal');
    const openBtn = document.getElementById('openConsultationBtn');
    const closeBtn = document.getElementById('modalCloseBtn');
    const backdrop = document.getElementById('modalBackdrop');
    const successClose = document.getElementById('successCloseBtn');
    const consultForm = document.getElementById('consultationForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('formSubmitBtn');
    const quickContactWrap = document.querySelector('.floating-actions');
    const quickContactToggle = document.getElementById('quickContactToggle');
    const quickContactMenu = document.getElementById('quickContactMenu');

    let modalScrollPos = 0;

    function openModal() {
        modalScrollPos = window.scrollY;
        consultModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus first input after animation
        setTimeout(() => {
            const firstInput = consultForm.querySelector('input:not([type="hidden"])');
            if (firstInput) firstInput.focus();
        }, 400);
    }

    function closeModal() {
        consultModal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form after close animation
        setTimeout(() => {
            consultForm.reset();
            consultForm.style.display = '';
            formSuccess.classList.remove('show');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            // Clear all errors
            consultForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
        }, 400);
    }

    // Open modal
    if (openBtn) openBtn.addEventListener('click', openModal);

    // Close modal
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (successClose) successClose.addEventListener('click', closeModal);

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && consultModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Quick contact toggle menu
    if (quickContactWrap && quickContactToggle && quickContactMenu) {
        quickContactToggle.addEventListener('click', () => {
            const isOpen = quickContactWrap.classList.toggle('open');
            quickContactToggle.setAttribute('aria-expanded', String(isOpen));
            quickContactMenu.setAttribute('aria-hidden', String(!isOpen));
        });

        document.addEventListener('click', (e) => {
            if (!quickContactWrap.contains(e.target)) {
                quickContactWrap.classList.remove('open');
                quickContactToggle.setAttribute('aria-expanded', 'false');
                quickContactMenu.setAttribute('aria-hidden', 'true');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                quickContactWrap.classList.remove('open');
                quickContactToggle.setAttribute('aria-expanded', 'false');
                quickContactMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // ────── FORM VALIDATION & SUBMISSION ──────
    // Only allow digits in mobile field
    const mobileInput = document.getElementById('formMobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Clear error on input
    consultForm.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.form-group').classList.remove('has-error');
        });
    });

    // Form submit handler
    consultForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Validate Name
        const nameInput = document.getElementById('formName');
        if (!nameInput.value.trim()) {
            nameInput.closest('.form-group').classList.add('has-error');
            isValid = false;
        }

        // Validate Mobile
        const mobileVal = mobileInput.value.trim();
        if (!mobileVal || !/^[0-9]{10}$/.test(mobileVal)) {
            mobileInput.closest('.form-group').classList.add('has-error');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Submit via fetch (AJAX)
        const formData = new FormData(consultForm);
        const jsonData = {
            name: formData.get('Full Name'),
            phone: formData.get('Mobile Number'),
            email: formData.get('Email'),
            message: `Topic: ${formData.get('Case Topic') || 'None'}\n\n${formData.get('Message') || 'No description provided.'}`
        };

        fetch(consultForm.action, {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                // Show success
                consultForm.style.display = 'none';
                formSuccess.classList.add('show');
            } else {
                alert('Failed to send message. Please try again.');
            }
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        })
        .catch(error => {
            // Still show success (formsubmit may redirect)
            consultForm.style.display = 'none';
            formSuccess.classList.add('show');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    });

    // ────── INITIAL CALL ──────
    const internshipForm = document.getElementById('internshipApplyForm');
    const internshipSubmitBtn = document.getElementById('internshipSubmitBtn');
    const internshipStatus = document.getElementById('internshipFormStatus');
    const internshipSuccess = document.getElementById('internshipSuccess');
    const internshipApplyAgainBtn = document.getElementById('internshipApplyAgainBtn');
    const internshipPhoneInput = document.getElementById('internPhone');

    if (internshipPhoneInput) {
        internshipPhoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9+ -]/g, '');
        });
    }

    if (internshipApplyAgainBtn && internshipForm && internshipSuccess && internshipStatus) {
        internshipApplyAgainBtn.addEventListener('click', () => {
            internshipSuccess.classList.remove('show');
            internshipForm.style.display = '';
            internshipStatus.textContent = '';
            internshipStatus.className = 'form-status';
            document.getElementById('internFullName')?.focus();
        });
    }

    if (internshipForm && internshipSubmitBtn && internshipStatus && internshipSuccess) {
        internshipForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!internshipForm.checkValidity()) {
                internshipForm.reportValidity();
                return;
            }

            const formData = new FormData(internshipForm);
            const resumeFile = formData.get('Upload Resume');
            const resumeName = resumeFile && resumeFile.name ? resumeFile.name : 'Not provided';

            const jsonData = {
                name: formData.get('Full Name'),
                phone: formData.get('Phone Number'),
                email: formData.get('Email'),
                message: [
                    'Internship Application',
                    `College: ${formData.get('College Name') || 'Not provided'}`,
                    `Year/Semester: ${formData.get('Year/Semester') || 'Not provided'}`,
                    `Preferred Duration: ${formData.get('Preferred Duration') || 'Not provided'}`,
                    `Area Of Interest: ${formData.get('Area Of Interest') || 'Not provided'}`,
                    `Resume File: ${resumeName}`
                ].join('\n')
            };

            internshipStatus.textContent = '';
            internshipStatus.className = 'form-status';
            internshipSubmitBtn.classList.add('loading');
            internshipSubmitBtn.disabled = true;

            fetch(internshipForm.action, {
                method: 'POST',
                body: JSON.stringify(jsonData),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json().then(data => ({ ok: response.ok, data })))
            .then(({ ok, data }) => {
                if (!ok || !data.success) {
                    throw new Error(data.error || 'Failed to submit application');
                }

                internshipForm.reset();
                internshipForm.style.display = 'none';
                internshipSuccess.classList.add('show');
            })
            .catch(() => {
                internshipStatus.textContent = 'Unable to send application right now. Please try again or contact us directly.';
                internshipStatus.classList.add('error');
            })
            .finally(() => {
                internshipSubmitBtn.classList.remove('loading');
                internshipSubmitBtn.disabled = false;
            });
        });
    }

    handleNavScroll();
    updateProgressBar();
}

// Robust execution model
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

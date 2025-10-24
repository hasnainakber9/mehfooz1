// MEHFOOZ | DIGITAL ENLIGHTENMENT - PRODUCTION JAVASCRIPT
// Contains: Intro Sequence, Custom Cursor, Smooth Scrolling (Lenis), GSAP Animations,
// Three.js Cosmic Background, Chatbot Logic, and Accessibility Controls.

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- Selectors ---
    const selectors = {
        loadingScreen: '#loadingScreen', loadingParticles: '#loadingParticles',
        introGame: '#introGame', sparkContainer: '#sparkContainer', gameSkip: '#gameSkip',
        siteWrapper: '#site-wrapper', cursorDot: '#cursor-dot', cursorLight: '#cursor-light',
        siteHeader: '#site-header', navLinksContainer: '#nav-links', mobileNavToggle: '#mobile-nav-toggle',
        heroHeadline: '#hero-headline', heroSubheadline: '#hero-subheadline',
        cosmicBackground: '#cosmicBackground', staticBackground: '#staticBackground', networkCanvas: '#network-canvas',
        userCounter: '#user-counter', platformCounter: '#platform-counter',
        settingsToggleBtn: '#settings-toggle-btn', settingsModal: '#settings-modal', settingsCloseBtn: '#settings-close-btn',
        motionToggle: '#motion-toggle', helpToggleBtn: '#help-toggle-btn', keyboardHelp: '#keyboard-help',
        modalBackdrop: '#modal-backdrop',
        chatLog: '#chat-log', chatForm: '#chat-form', chatInput: '#chat-input', promptButtonsContainer: '#prompt-buttons',
        openBotBtn: '#open-bot-demo-approach', botModal: '#bot-modal', closeBotBtn: '#close-bot-demo',
        modalChatLog: '#modal-chat-log', modalChatForm: '#modal-chat-form', modalChatInput: '#modal-chat-input', modalPillContainer: '#modal-question-pills',
        contactForm: '#contact-form', formSuccess: '#form-success', chatBubble: '#chatBubble'
    };

    // --- Element Cache & State ---
    const els = {};
    let criticalElementMissing = false;
    for (const key in selectors) {
        els[key] = document.querySelector(selectors[key]);
        // Simple check for required elements
        if (!els[key] && ['loadingScreen', 'introGame', 'siteWrapper', 'siteHeader', 'cosmicBackground', 'staticBackground'].includes(key)) {
            console.error(`Critical element missing: ${key} (${selectors[key]})`);
            criticalElementMissing = true;
        }
    }
    if (criticalElementMissing) return;

    let lenis;
    let isSiteEntered = false;
    let cosmicBgAnimator = null;
    let skipKeyListenerRef = null;

    // --- Initial Setup ---
    registerGsapPlugins();
    initCustomCursor();
    startLoadingSequence();

    // --- GSAP Plugin Registration (Safety Check) ---
    function registerGsapPlugins() {
        if (typeof gsap === 'undefined') {
            console.error("GSAP not loaded. Animations disabled.");
            document.body.classList.add('reduced-motion');
            return;
        }
        // Conditionally register plugins based on usage
        if (els.userCounter || els.platformCounter) {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);
        } else {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        }
    }

    // --- Custom Cursor Logic ---
    function initCustomCursor() {
        if (window.matchMedia("(hover: none)").matches || document.body.classList.contains('reduced-motion') || typeof gsap === 'undefined' || !els.cursorDot || !els.cursorLight) {
            document.body.style.cursor = 'auto';
            if(els.cursorDot) els.cursorDot.style.display = 'none';
            if(els.cursorLight) els.cursorLight.style.display = 'none';
            return;
        }

        gsap.set([els.cursorDot, els.cursorLight], { opacity: 1 });
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        // Use GSAP ticker for smooth cursor following
        gsap.ticker.add(() => {
            gsap.to(els.cursorDot, { duration: 0.2, x: mouse.x, y: mouse.y });
            gsap.to(els.cursorLight, { duration: 0.5, x: mouse.x, y: mouse.y, ease: 'power2.out' });
        });
    }

    // --- Intro Sequence Functions ---
    function startLoadingSequence() {
        if (!els.loadingScreen) return;
        createLoadingParticles();
        setTimeout(hideLoadingScreen, 500);
    }

    function createLoadingParticles() {
        const container = els.loadingParticles;
        if (!container || document.body.classList.contains('reduced-motion')) return;
        container.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 200 + 'px';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(particle);
        }
    }

    function hideLoadingScreen() {
        if (typeof gsap === 'undefined' || !els.loadingScreen || !els.introGame) return;
        gsap.to(els.loadingScreen, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                els.loadingScreen.classList.add('hidden');
                els.loadingScreen.style.display = 'none';
                els.introGame.classList.add('active');
                initVisualIntro();
            }
        });
    }

    function initVisualIntro() {
        const { sparkContainer, gameSkip } = els;
        if (!sparkContainer || !gameSkip || document.body.classList.contains('reduced-motion')) {
            setTimeout(completeIntroGame, 100); // Skip visual intro if disabled or missing elements
            return;
        }
        const sparks = sparkContainer.querySelectorAll('.spark');
        const totalSparks = sparks.length;
        let collectedCount = 0;
        let isProcessing = false;

        sparks.forEach(spark => {
            spark.addEventListener('click', () => {
                if (isProcessing || spark.classList.contains('collected')) return;
                spark.classList.add('collected');
                collectedCount++;
                if (collectedCount >= totalSparks) {
                    isProcessing = true;
                    setTimeout(completeIntroGame, 500);
                }
            });
        });

        gameSkip.addEventListener('click', () => {
            if (!isProcessing) completeIntroGame();
        });

        skipKeyListenerRef = (e) => {
            if (!isProcessing && els.introGame.classList.contains('active')) {
                if (e.key === 'Escape' || e.key.toLowerCase() === 's') {
                    completeIntroGame();
                }
            }
        };
        document.addEventListener('keydown', skipKeyListenerRef);
    }

    function completeIntroGame() {
        if (isSiteEntered || !els.introGame || !els.siteWrapper || typeof gsap === 'undefined') {
            // Fallback for no-js or reduced-motion
            els.introGame.style.display = 'none';
            els.siteWrapper.classList.remove('opacity-0');
            els.siteWrapper.style.visibility = 'visible';
            document.body.classList.add('site-entered');
            initSmoothScroll();
            initNavigation();
            initAccessibility();
            initMotionAndBackground();
            initChatbot();
            initContactForm();
            initFloatingChatBubble();
            return;
        }

        isSiteEntered = true;
        if (skipKeyListenerRef) {
            document.removeEventListener('keydown', skipKeyListenerRef);
            skipKeyListenerRef = null;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                els.introGame.style.display = 'none';
                els.siteWrapper.style.visibility = 'visible';
                document.body.classList.add('site-entered');
                initSmoothScroll();
                initNavigation();
                initAccessibility();
                initMotionAndBackground();
                initHeroAnimation();
                initChallengeAnimation();
                initSiteAnimations();
                initChatbot();
                initContactForm();
                initFloatingChatBubble();
            }
        });

        tl.to(els.introGame, { opacity: 0, duration: 1.0, ease: 'power2.inOut' })
          .to(els.siteWrapper, { opacity: 1, duration: 1.0, ease: 'power2.out' }, "-=0.5")
          .to(els.siteHeader, { y: '0%', opacity: 1, duration: 1.2, ease: 'power3.out' }, "-=0.7");
    }

    // --- Smooth Scroll (Lenis) ---
    function initSmoothScroll() {
        if (typeof Lenis === 'undefined' || document.body.classList.contains('reduced-motion')) return;
        lenis = new Lenis();
        gsap.ticker.add((time) => lenis.raf(time * 1000));
    }

    // --- Navigation & Anchor Links ---
    function initNavigation() {
        if (els.siteHeader && typeof ScrollTrigger !== 'undefined') {
            // Header opacity/backdrop on scroll
            ScrollTrigger.create({
                start: 'top top-=-10px',
                onUpdate: self => els.siteHeader.classList.toggle('is-scrolled', self.direction === 1 && self.scroll() > 10)
            });
        }

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetEl = document.querySelector(targetId);

                if (targetEl) {
                    const offset = - (els.siteHeader?.offsetHeight || 72) - 10;
                    if (lenis) {
                        lenis.scrollTo(targetEl, { offset: offset });
                    } else {
                        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY + offset;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                    if (els.navLinksContainer?.classList.contains('is-visible')) {
                        els.mobileNavToggle?.click(); // Close mobile nav after click
                    }
                } else {
                    console.warn(`Target element not found: ${targetId}`);
                }
            });
        });

        // Navigation link active state (via ScrollTrigger)
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.utils.toArray('main section[id]').forEach((section) => {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top center+=100px',
                    end: 'bottom center-=100px',
                    onToggle: self => {
                        const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
                        if (link) {
                            // Deactivate all others, activate current
                            if (self.isActive) {
                                document.querySelectorAll('.nav-link.active').forEach(l => l.classList.remove('active'));
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        }
                    }
                });
            });
            // Ensure home link is active on initial load/top
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if(homeLink && !document.querySelector('.nav-link.active')) homeLink.classList.add('active');
        }

        // Mobile Navigation Toggle
        if (els.mobileNavToggle && els.navLinksContainer) {
            els.mobileNavToggle.addEventListener('click', () => {
                const isExpanded = els.mobileNavToggle.getAttribute('aria-expanded') === 'true';
                els.mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
                els.navLinksContainer.classList.toggle('is-visible');
                document.body.classList.toggle('nav-open');
            });
        }
    }

    // --- Motion Preferences & Background Control ---
    function initMotionAndBackground() {
        if (!els.motionToggle) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let motionEnabled = !prefersReducedMotion;
        els.motionToggle.checked = motionEnabled;
        setMotion(motionEnabled); // Apply initial setting

        els.motionToggle.addEventListener('change', (e) => setMotion(e.target.checked));

        // Listen to OS preference change
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
            if (e.matches) {
                setMotion(false);
                els.motionToggle.checked = false;
            }
        });
    }

    function setMotion(enabled) {
        const wasReduced = document.body.classList.contains('reduced-motion');
        const isNowReduced = !enabled;

        document.body.classList.toggle('reduced-motion', isNowReduced);

        if (lenis) enabled ? lenis.start() : lenis.stop();

        if (els.cosmicBackground && els.staticBackground) {
            const showStatic = !enabled || typeof THREE === 'undefined';
            els.cosmicBackground.style.display = showStatic ? 'none' : 'block';
            els.staticBackground.style.display = showStatic ? 'block' : 'none';

            if (cosmicBgAnimator) {
                if (showStatic) {
                    cosmicBgAnimator.stop();
                } else {
                    cosmicBgAnimator.animate();
                }
            } else if (!showStatic && typeof THREE !== 'undefined') {
                initCosmicBackground();
            }
        }

        // Refresh ScrollTrigger when motion state changes to recalculate positions
        if (wasReduced !== isNowReduced && typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    // --- Cosmic Background (Three.js) Initialization ---
    function initCosmicBackground() {
        if (typeof THREE === 'undefined' || !els.cosmicBackground || cosmicBgAnimator || document.body.classList.contains('reduced-motion')) {
            return;
        }

        try {
            const container = els.cosmicBackground;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            container.innerHTML = '';
            container.appendChild(renderer.domElement);

            const particleCount = window.innerWidth > 1024 ? 1500 : 400;
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            // Fetch CSS variables for colors
            const getCssColor = (name) => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
            const colorPalette = [
                getCssColor('--color-accent-gold'),
                getCssColor('--color-accent-teal'),
                getCssColor('--color-text'),
                getCssColor('--color-medium')
            ];

            // Initialize particle positions and colors
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 1500;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 1500;
                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }

            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            const particleSystem = new THREE.Points(particles, particleMaterial);
            scene.add(particleSystem);
            camera.position.z = 400;

            let animationId;
            const animate = () => {
                if (!animationId && document.body.classList.contains('reduced-motion')) return;
                animationId = requestAnimationFrame(animate);

                // Gentle rotation and movement
                particleSystem.rotation.y += 0.0003;
                const time = Date.now() * 0.00005;
                particleSystem.position.x = Math.sin(time * 0.7) * 5;
                particleSystem.position.y = Math.cos(time * 0.5) * 5;

                renderer.render(scene, camera);
            };

            const stop = () => {
                if (animationId) cancelAnimationFrame(animationId);
                animationId = null;
            };

            cosmicBgAnimator = { animate, stop };
            animate(); // Start animation immediately

            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            window.addEventListener('resize', handleResize);

        } catch (error) {
            console.error('Three.js background failed:', error);
            els.cosmicBackground.style.display = 'none';
            els.staticBackground.style.display = 'block';
            cosmicBgAnimator = { animate: ()=>{}, stop: ()=>{} }; // Null out the animator
        }
    }

    // --- Hero Content Animation (GSAP) ---
    function initHeroAnimation() {
        if (document.body.classList.contains('reduced-motion') || typeof gsap === 'undefined' || !els.heroHeadline || !els.heroSubheadline) return;

        gsap.set(els.heroHeadline, { opacity: 1 }); // Set opacity to 1 before gradient animation
        const tl = gsap.timeline({ delay: 0.5 });

        tl.to(els.heroHeadline, {
            backgroundPosition: '0% 0', // Animate gradient to reveal full text
            duration: 1.5,
            ease: 'power2.inOut'
        })
        .to(els.heroSubheadline, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out'
        }, "-=1");
    }

    // --- Challenge Section Canvas Animation (Network Effect) ---
    function initChallengeAnimation() {
        if (!els.networkCanvas || document.body.classList.contains('reduced-motion')) return;

        const canvas = els.networkCanvas;
        const ctx = canvas.getContext('2d');
        let nodes = [];
        let animationFrameId;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            createNodes();
        }

        class Node {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = Math.random() * 2 + 1;
                this.baseColor = 'rgba(168, 162, 154, 0.5)';
                this.color = this.baseColor;
                this.isGlitched = false;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function createNodes() {
            nodes = [];
            const density = window.innerWidth < 768 ? 80 : 60;
            const cols = Math.floor(canvas.width / density);
            const rows = Math.floor(canvas.height / density);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * density + (Math.random()) * density;
                    const y = j * density + (Math.random()) * density;
                    nodes.push(new Node(x, y));
                }
            }
        }

        function connectNodes() {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 90) { // Connection threshold
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        const opacity = 1 - (dist / 90);
                        // Glitch effect on scroll
                        const color = nodes[i].isGlitched && nodes[j].isGlitched ?
                            `rgba(255, 107, 107, ${opacity * 0.5})` : // Error red
                            `rgba(168, 162, 154, ${opacity * 0.4})`;  // Normal gray
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            nodes.forEach(node => node.draw());
            connectNodes();
            animationFrameId = requestAnimationFrame(animate);
        }

        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);

        // ScrollTrigger to activate glitch effect proportional to scroll depth in section
        ScrollTrigger.create({
            trigger: '#challenge',
            start: 'top center',
            end: 'bottom center',
            onUpdate: (self) => {
                const progress = self.progress; // 0 to 1 as section scrolls
                nodes.forEach(node => {
                    // Random chance of glitching based on scroll progress
                    if (Math.random() < progress * 0.01) {
                        node.isGlitched = true;
                        node.color = `rgba(255, 107, 107, ${Math.random() * 0.5 + 0.5})`;
                    } else if (node.isGlitched && Math.random() > 0.95) {
                        // Random chance to return to normal
                        node.isGlitched = false;
                        node.color = node.baseColor;
                    }
                });
            },
            onLeaveBack: () => {
                // Reset state when scrolling back up
                nodes.forEach(node => {
                    node.isGlitched = false;
                    node.color = node.baseColor;
                });
            }
        });
    }

    // --- General Site Animations (ScrollTrigger Reveals & Counters) ---
    function initSiteAnimations() {
         if (typeof gsap === 'undefined') return;
         
         const mm = gsap.matchMedia();

         // Animations for non-reduced-motion users
         mm.add("(prefers-reduced-motion: no-preference)", () => {
             // General fade-up reveal for most content
             gsap.utils.toArray('.reveal-up').forEach(elem => {
                 gsap.fromTo(elem, { opacity: 0, y: 50 }, {
                     opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                     scrollTrigger: { trigger: elem, start: 'top 88%', once: true }
                 });
             });

             // Journal image reveal
             const journalImageContainer = document.querySelector('.journal-image-container');
             if (journalImageContainer) {
                 gsap.fromTo(journalImageContainer, { opacity: 0, y: 50 }, {
                     opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                     scrollTrigger: { trigger: journalImageContainer, start: 'top 85%', once: true }
                 });
             }

             // Numeric Counters (Vision Section)
             if (els.userCounter && typeof TextPlugin !== 'undefined') {
                 gsap.to(els.userCounter, {
                     textContent: 100000,
                     duration: 3,
                     ease: "power2.inOut",
                     snap: { textContent: 1 },
                     scrollTrigger: { trigger: els.userCounter, start: "top 80%", once: true },
                     onUpdate: function() {
                         // Add commas and the '+' sign
                         this.targets()[0].innerHTML = Math.ceil(parseFloat(this.targets()[0].textContent)).toLocaleString('en-US') + "+";
                     }
                 });
             }
             if (els.platformCounter && typeof TextPlugin !== 'undefined') {
                 gsap.to(els.platformCounter, {
                     textContent: 3,
                     duration: 2.5,
                     ease: "power2.inOut",
                     snap: { textContent: 1 },
                     scrollTrigger: { trigger: els.platformCounter, start: "top 80%", once: true },
                     onUpdate: function() {
                         this.targets()[0].innerHTML = Math.ceil(parseFloat(this.targets()[0].textContent)) + "+";
                     }
                 });
             }
             // Cleanup function (optional but good practice for MM)
             return () => {
                 gsap.utils.toArray('.reveal-up, .journal-image-container').forEach(elem => {
                     const st = ScrollTrigger.getTweensOf(elem); if (st) st.forEach(tween => tween.kill());
                 });
                 if (els.userCounter) gsap.killTweensOf(els.userCounter);
                 if (els.platformCounter) gsap.killTweensOf(els.platformCounter);
             };
         });

         // Instant reveal for reduced-motion users
         mm.add("(prefers-reduced-motion: reduce)", () => {
             gsap.utils.toArray('.reveal-up, .journal-image-container, #hero-headline, #hero-subheadline').forEach(elem => {
                 gsap.set(elem, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
             });
             if(els.userCounter) els.userCounter.innerHTML = "100,000+";
             if(els.platformCounter) els.platformCounter.innerHTML = "3+";
         });
    }

    // --- Chatbot Logic (Demo Simulation) ---
    function initChatbot() {
        const botResponses = {
            "greeting": "Hello! How can I assist you today on your journey to digital clarity?",
            "default": "That's an interesting point. While this demo is limited, the full MehfoozBot explores topics like that in detail.",
            "misinformation": "Spotting misinformation involves a few key steps: Check the source's credibility, look for supporting evidence, be wary of emotionally charged language, and check the date.",
            "safety": "Online safety basics include using strong, unique passwords, enabling two-factor authentication, and being cautious about links or attachments.",
            "story": "Mehfooz began from listening to the community in Skardu. We realized the need wasn't just *more* tech, but *understanding* tech. You can read more in the 'Our Story' section.",
            "ulema": "We proudly partner with local Ulema (religious leaders). They serve as trusted community voices, helping bridge traditional wisdom with essential digital literacy skills."
        };
        const promptQuestions = {
            "How do you work?": "ulema",
            "What's your story?": "story",
            "Spotting fake news?": "misinformation",
            "Staying safe online?": "safety"
        };
        const modalQuestions = ["How can I spot fake news?", "Is my WhatsApp safe?", "What is misinformation?"];

        function getBotResponse(userInput) {
            const lowerInput = userInput.toLowerCase();
            // Check for prompt button text
            if (promptQuestions[userInput]) return botResponses[promptQuestions[userInput]];
            if (modalQuestions.includes(userInput)) {
                if (lowerInput.includes('fake news') || lowerInput.includes('misinformation')) return botResponses.misinformation;
                if (lowerInput.includes('whatsapp') || lowerInput.includes('safe')) return botResponses.safety;
            }
            // Check for keywords in free text input
            if (lowerInput.includes('fake') || lowerInput.includes('misinformation')) return botResponses.misinformation;
            if (lowerInput.includes('safe') || lowerInput.includes('security')) return botResponses.safety;
            if (lowerInput.includes('story') || lowerInput.includes('about')) return botResponses.story;
            if (lowerInput.includes('ulema') || lowerInput.includes('work')) return botResponses.ulema;
            if (lowerInput.includes('hello') || lowerInput.includes('hi')) return botResponses.greeting;
            return botResponses.default;
        }

        function addChatMessage(message, sender, targetLog) {
            if (!targetLog) return;
            const bubble = document.createElement('div');
            bubble.className = `message-bubble ${sender}-bubble`;
            bubble.textContent = message;
            targetLog.appendChild(bubble);

            // Optional animation for new message
            if (typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
                gsap.from(bubble, { opacity: 0, y: 20, duration: 0.5 });
                // Smooth scroll to bottom
                gsap.to(targetLog, { duration: 0.5, scrollTo: { y: "max" }, ease: "power2.out" });
            } else {
                targetLog.scrollTop = targetLog.scrollHeight;
            }
        }

        function handleBotUserInput(input, targetLog, targetInput, targetPrompts) {
            const trimmedInput = input.trim();
            if (!trimmedInput) return;

            addChatMessage(trimmedInput, 'user', targetLog);
            targetInput.value = "";
            targetInput.disabled = true;

            // Dim prompts while processing
            if (targetPrompts && typeof gsap !== 'undefined') {
                targetPrompts.style.pointerEvents = 'none';
                gsap.to(targetPrompts.children, { opacity: 0.5, duration: 0.3 });
            }

            setTimeout(() => {
                addChatMessage(getBotResponse(trimmedInput), 'bot', targetLog);
                targetInput.disabled = false;
                try { targetInput.focus(); } catch(e){}

                // Restore prompts
                if (targetPrompts && typeof gsap !== 'undefined') {
                    targetPrompts.style.pointerEvents = 'auto';
                    gsap.to(targetPrompts.children, { opacity: 1, duration: 0.3 });
                }
            }, 1200);
        }

        // --- Inline Chat Widget Setup ---
        if (els.chatForm && els.chatLog && els.chatInput && els.promptButtonsContainer) {
            els.chatForm.addEventListener('submit', e => {
                e.preventDefault();
                handleBotUserInput(els.chatInput.value, els.chatLog, els.chatInput, els.promptButtonsContainer);
            });
            // Create prompt buttons
            els.promptButtonsContainer.innerHTML = "";
            Object.keys(promptQuestions).forEach(q => {
                const btn = document.createElement('button');
                btn.className = "chat-prompt-btn";
                btn.textContent = q;
                btn.onclick = () => handleBotUserInput(q, els.chatLog, els.chatInput, els.promptButtonsContainer);
                els.promptButtonsContainer.appendChild(btn);
            });
            addChatMessage(botResponses.greeting, 'bot', els.chatLog);
        }

        // --- Modal Chat Demo Setup ---
        if (els.modalChatForm && els.modalChatLog && els.modalChatInput && els.modalPillContainer) {
            els.modalChatForm.addEventListener('submit', e => {
                e.preventDefault();
                handleBotUserInput(els.modalChatInput.value, els.modalChatLog, els.modalChatInput, els.modalPillContainer);
            });

            // Create modal pill buttons
            els.modalPillContainer.innerHTML = "";
            modalQuestions.forEach(q => {
                const pill = document.createElement('button');
                pill.className = 'chat-prompt-btn';
                pill.textContent = q;
                pill.onclick = () => handleBotUserInput(q, els.modalChatLog, els.modalChatInput, els.modalPillContainer);
                els.modalPillContainer.appendChild(pill);
            });

            // Function to initialize modal chat on open
            window.initModalChat = () => {
                if (els.modalChatLog.children.length === 0) {
                    addChatMessage("Hello! Ask a question or click a topic.", 'bot', els.modalChatLog);
                }
            };

            // Hook for the "See in Action" button in the Approach section
            if (els.openBotBtn) {
                els.openBotBtn.addEventListener('click', () => {
                    window.initModalChat();
                    setTimeout(() => els.modalChatInput.focus(), 300);
                });
            }
        }
    }

    // --- Contact Form Submission Logic (Formspree) ---
    function initContactForm() {
        if (!els.contactForm || !els.formSuccess) return;

        els.contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);

            // Simple front-end validation
            let isValid = true;
            if (!formData.get('name').trim() || !formData.get('email').trim() || !formData.get('message').trim()) {
                 isValid = false;
                 alert("Please fill in all required fields.");
            }

            if (isValid) {
                // Send data to Formspree
                fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        // Show success message
                        if (document.body.classList.contains('reduced-motion') || typeof gsap === 'undefined') {
                            els.contactForm.style.display = 'none';
                            els.formSuccess.classList.remove('hidden');
                        } else {
                            gsap.to(els.contactForm, { opacity: 0, duration: 0.5, height: 0, ease: 'power2.in', onComplete: () => {
                                els.contactForm.style.display = 'none';
                                els.formSuccess.classList.remove('hidden');
                                gsap.from(els.formSuccess, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
                            }});
                        }
                        els.contactForm.reset();
                    } else {
                        // Handle form submission error
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert(data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert("Oops! There was a problem sending your message. Please try again later.");
                            }
                        });
                    }
                }).catch(error => {
                    // Handle network error
                    alert("Oops! There was a network error. Please check your connection and try again.");
                });
            }
        });
    }

    // --- Modals and Accessibility Toggles ---
    function toggleModal(modal, forceOpen) {
        if (!modal || !els.modalBackdrop || typeof gsap === 'undefined') {
            // Fallback for no-js or reduced motion (instant toggle)
            const show = forceOpen === undefined ? modal.hasAttribute('hidden') : forceOpen;
            if (show) { modal.removeAttribute('hidden'); els.modalBackdrop.removeAttribute('hidden'); }
            else { modal.setAttribute('hidden', 'true'); els.modalBackdrop.setAttribute('hidden', 'true'); }
            const relatedButton = document.querySelector(`[aria-controls="${modal.id}"]`);
            if (relatedButton) relatedButton.setAttribute('aria-expanded', show);
            return;
        }

        const show = forceOpen === undefined ? !modal.classList.contains('is-visible') : forceOpen;
        const relatedButton = document.querySelector(`[aria-controls="${modal.id}"]`);
        if (relatedButton) relatedButton.setAttribute('aria-expanded', show);

        if (show) {
            modal.removeAttribute('hidden');
            els.modalBackdrop.removeAttribute('hidden');

            gsap.to([modal, els.modalBackdrop], {
                opacity: 1, duration: 0.3,
                onStart: () => {
                    modal.classList.add('is-visible');
                    els.modalBackdrop.classList.add('is-visible');
                }
            });
            gsap.fromTo(modal, {scale: 0.95}, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
        } else {
            gsap.to(modal, {
                scale: 0.95, opacity: 0, duration: 0.3,
                onComplete: () => {
                    modal.classList.remove('is-visible');
                    modal.setAttribute('hidden', 'true');
                }
            });
            gsap.to(els.modalBackdrop, {
                opacity: 0, duration: 0.3,
                onComplete: () => {
                    els.modalBackdrop.classList.remove('is-visible');
                    els.modalBackdrop.setAttribute('hidden', 'true');
                }
            });
        }
    }

    function toggleHelp(forceOpen) {
        if (!els.keyboardHelp || typeof gsap === 'undefined') return;

        const show = forceOpen === undefined ? !els.keyboardHelp.classList.contains('is-visible') : forceOpen;
        els.helpToggleBtn?.setAttribute('aria-expanded', show);

        if (show) {
            els.keyboardHelp.removeAttribute('hidden');
            gsap.fromTo(els.keyboardHelp, {opacity: 0, scale: 0.95}, {
                opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)',
                onStart: () => els.keyboardHelp.classList.add('is-visible')
            });
        } else {
            gsap.to(els.keyboardHelp, {
                opacity: 0, scale: 0.95, duration: 0.3,
                onComplete: () => {
                    els.keyboardHelp.classList.remove('is-visible');
                    els.keyboardHelp.setAttribute('hidden', 'true');
                }
            });
        }
    }

    function initAccessibility() {
        // Button listeners
        if (els.settingsToggleBtn) els.settingsToggleBtn.addEventListener('click', () => toggleModal(els.settingsModal));
        if (els.settingsCloseBtn) els.settingsCloseBtn.addEventListener('click', () => toggleModal(els.settingsModal, false));
        if (els.helpToggleBtn) els.helpToggleBtn.addEventListener('click', () => toggleHelp());
        if (els.openBotBtn) els.openBotBtn.addEventListener('click', () => toggleModal(els.botModal));
        if (els.closeBotBtn) els.closeBotBtn.addEventListener('click', () => toggleModal(els.botModal, false));
        
        // Backdrop close
        if (els.modalBackdrop) els.modalBackdrop.addEventListener('click', () => {
            toggleModal(els.settingsModal, false);
            toggleModal(els.botModal, false);
        });

        // Global Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            // Escape key closes open modals/navs
            if (e.key === 'Escape') {
                if (els.settingsModal?.classList.contains('is-visible')) toggleModal(els.settingsModal, false);
                if (els.botModal?.classList.contains('is-visible')) toggleModal(els.botModal, false);
                if (els.keyboardHelp?.classList.contains('is-visible')) toggleHelp(false);
                if (els.navLinksContainer?.classList.contains('is-visible')) els.mobileNavToggle?.click();
            }

            // Prevent shortcut actions when typing
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || els.introGame?.classList.contains('active')) return;

            // Access keys
            if (e.key === '?') { e.preventDefault(); toggleHelp(); }
            if (e.key.toLowerCase() === 'h') { e.preventDefault(); document.querySelector('a[href="#home"]')?.click(); }
            if (e.key.toLowerCase() === 'm') {
                e.preventDefault();
                toggleModal(els.botModal, true);
                if (window.initModalChat) { window.initModalChat(); }
                setTimeout(() => els.modalChatInput?.focus(), 300);
            }
            if (e.key.toLowerCase() === 's') { e.preventDefault(); document.querySelector('.skip-link')?.focus(); }
        });
    }

    // --- Floating Chat Bubble Interaction ---
    function initFloatingChatBubble() {
        if (els.chatBubble) {
            els.chatBubble.addEventListener('click', () => {
                toggleModal(els.botModal, true);
                if (window.initModalChat) { window.initModalChat(); }
                setTimeout(() => els.modalChatInput?.focus(), 300);
            });
        }
    }

    // --- Page Visibility API for Performance ---
    document.addEventListener('visibilitychange', () => {
        if (cosmicBgAnimator) {
            if (document.hidden) {
                cosmicBgAnimator.stop();
            } else if (!document.body.classList.contains('reduced-motion')) {
                cosmicBgAnimator.animate();
            }
        }
    });

}); // End DOMContentLoaded

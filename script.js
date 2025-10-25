// MEHFOOZ | DIGITAL ENLIGHTENMENT - PRODUCTION JAVASCRIPT
// Contains: Advanced Motion Graphics, Scroll-Based Interactivity, and Enhanced Visuals.

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
        dataStreamCanvas: '#data-stream-canvas',
        userCounter: '#user-counter', platformCounter: '#platform-counter',
        settingsToggleBtn: '#settings-toggle-btn', settingsModal: '#settings-modal', settingsCloseBtn: '#settings-close-btn',
        motionToggle: '#motion-toggle', helpToggleBtn: '#help-toggle-btn', keyboardHelp: '#keyboard-help',
        modalBackdrop: '#modal-backdrop',
        chatLog: '#chat-log', chatForm: '#chat-form', chatInput: '#chat-input', promptButtonsContainer: '#prompt-buttons',
        openBotBtn: '#open-bot-demo-approach', botModal: '#bot-modal', closeBotBtn: '#close-bot-demo',
        modalChatLog: '#modal-chat-log', modalChatForm: '#modal-chat-form', modalChatInput: '#modal-chat-input', modalPillContainer: '#modal-question-pills',
        contactForm: '#contact-form', formSuccess: '#form-success', chatBubble: '#chatBubble',
        pillarCardsContainer: '#pillar-cards-container',
        approachSection: '#approach'
    };

    // --- Element Cache & State ---
    const els = {};
    let criticalElementMissing = false;
    for (const key in selectors) {
        els[key] = document.querySelector(selectors[key]);
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
    let splitHeadline;
    let isLoadingScreenHidden = false; // FIX FLAG: To prevent re-triggering

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
        // Plugins are now loaded in HTML head
        if (els.userCounter || els.platformCounter) {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, SplitText);
        } else {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);
        }
    }

    // --- FIX: Robust Startup Flow ---
    function startLoadingSequence() {
        if (!els.loadingScreen) return;
        createLoadingParticles();
        
        // Use a slightly longer timeout for reliable library loading
        setTimeout(hideLoadingScreen, 1200); 
    }
    
    function hideLoadingScreen() {
        if (!els.loadingScreen || !els.introGame || isLoadingScreenHidden) return; 
        isLoadingScreenHidden = true;

        const onComplete = () => { 
            els.loadingScreen.classList.add('hidden'); 
            els.loadingScreen.style.display = 'none'; 
            els.introGame.classList.add('active'); 
            initVisualIntro(); 
        };

        if (typeof gsap !== 'undefined') {
            gsap.to(els.loadingScreen, { 
                opacity: 0, 
                duration: 0.5, 
                ease: 'power2.out', 
                onComplete: onComplete 
            });
        } else {
            onComplete();
        }
    }
    // --- End FIX: Startup Flow ---


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

    function initVisualIntro() {
        const { sparkContainer, gameSkip } = els;
        if (!sparkContainer || !gameSkip || document.body.classList.contains('reduced-motion')) { setTimeout(completeIntroGame, 100); return; }
        const sparks = sparkContainer.querySelectorAll('.spark');
        let collectedCount = 0;
        let isProcessing = false;
        sparks.forEach(spark => {
            spark.addEventListener('click', () => { if (isProcessing || spark.classList.contains('collected')) return; spark.classList.add('collected'); collectedCount++; if (collectedCount >= sparks.length) { isProcessing = true; setTimeout(completeIntroGame, 500); } });
        });
        gameSkip.addEventListener('click', () => { if (!isProcessing) completeIntroGame(); });
        skipKeyListenerRef = (e) => { if (!isProcessing && els.introGame.classList.contains('active')) { if (e.key === 'Escape' || e.key.toLowerCase() === 's') { completeIntroGame(); } } };
        document.addEventListener('keydown', skipKeyListenerRef);
    }
    
    function completeIntroGame() {
        if (isSiteEntered || !els.introGame || !els.siteWrapper) {
            // Fallback for non-GSAP environments
            els.introGame.style.display = 'none';
            els.siteWrapper.classList.remove('opacity-0');
            els.siteWrapper.style.visibility = 'visible';
            document.body.classList.add('site-entered');
            initSmoothScroll(); initNavigation(); initAccessibility(); initMotionAndBackground(); initDataStreamCanvas(); initChallengeAnimation(); initChatbot(); initContactForm(); initFloatingChatBubble(); initPillarCardInteraction(); initSiteAnimations(); // Added initChallengeAnimation
            return;
        }

        isSiteEntered = true;
        if (skipKeyListenerRef) { document.removeEventListener('keydown', skipKeyListenerRef); skipKeyListenerRef = null; }

        const tl = gsap.timeline({
            onComplete: () => {
                els.introGame.style.display = 'none';
                els.siteWrapper.style.visibility = 'visible';
                document.body.classList.add('site-entered');
                initSmoothScroll(); initNavigation(); initAccessibility(); initMotionAndBackground(); initHeroAnimation(); initChallengeAnimation(); initSiteAnimations(); initChatbot(); initContactForm(); initFloatingChatBubble(); initPillarCardInteraction();
            }
        });

        tl.to(els.introGame, { opacity: 0, duration: 1.0, ease: 'power2.inOut' })
          .to(els.siteWrapper, { opacity: 1, duration: 1.0, ease: 'power2.out' }, "-=0.5")
          .to(els.siteHeader, { y: '0%', opacity: 1, duration: 1.2, ease: 'power3.out' }, "-=0.7");
    }

    // --- Smooth Scroll (Kept from previous version) ---
    function initSmoothScroll() { if (typeof Lenis === 'undefined' || document.body.classList.contains('reduced-motion')) return; lenis = new Lenis(); gsap.ticker.add((time) => lenis.raf(time * 1000)); }

    // --- Navigation (Kept from previous version) ---
    function initNavigation() {
        if (els.siteHeader && typeof ScrollTrigger !== 'undefined') { ScrollTrigger.create({ start: 'top top-=-10px', onUpdate: self => els.siteHeader.classList.toggle('is-scrolled', self.direction === 1 && self.scroll() > 10) }); }
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault(); const targetId = this.getAttribute('href'); const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    const offset = - (els.siteHeader?.offsetHeight || 72) - 10;
                    if (lenis) { lenis.scrollTo(targetEl, { offset: offset }); } else { const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY + offset; window.scrollTo({ top: targetPosition, behavior: 'smooth' }); }
                    if (els.navLinksContainer?.classList.contains('is-visible')) { els.mobileNavToggle?.click(); }
                } else { console.warn(`Target element not found: ${targetId}`); }
            });
        });
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.utils.toArray('main section[id]').forEach((section) => {
                ScrollTrigger.create({
                    trigger: section, start: 'top center+=100px', end: 'bottom center-=100px',
                    onToggle: self => {
                        const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
                        if (link) {
                            if (self.isActive) { document.querySelectorAll('.nav-link.active').forEach(l => l.classList.remove('active')); link.classList.add('active'); } else { link.classList.remove('active'); }
                        }
                    }
                });
            });
            const homeLink = document.querySelector('.nav-link[href="#home"]'); if(homeLink && !document.querySelector('.nav-link.active')) homeLink.classList.add('active');
        }
        if (els.mobileNavToggle && els.navLinksContainer) {
            els.mobileNavToggle.addEventListener('click', () => {
                const isExpanded = els.mobileNavToggle.getAttribute('aria-expanded') === 'true'; els.mobileNavToggle.setAttribute('aria-expanded', !isExpanded); els.navLinksContainer.classList.toggle('is-visible'); document.body.classList.toggle('nav-open');
            });
        }
    }

    // --- Motion Preferences & Background Control (Kept from previous version) ---
    function initMotionAndBackground() {
        if (!els.motionToggle) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let motionEnabled = !prefersReducedMotion;
        els.motionToggle.checked = motionEnabled;
        setMotion(motionEnabled);
        els.motionToggle.addEventListener('change', (e) => setMotion(e.target.checked));
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
            if (e.matches) { setMotion(false); els.motionToggle.checked = false; }
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
            els.dataStreamCanvas.style.display = showStatic ? 'none' : 'block';

            if (cosmicBgAnimator) {
                if (showStatic) { cosmicBgAnimator.stop(); } else { cosmicBgAnimator.animate(); }
            } else if (!showStatic && typeof THREE !== 'undefined') { initCosmicBackground(); }
            if (!showStatic) initDataStreamCanvas();
        }
        if (wasReduced !== isNowReduced && typeof ScrollTrigger !== 'undefined') { ScrollTrigger.refresh(); }
    }

    // --- Cosmic Background (Kept from previous version) ---
    function initCosmicBackground() {
        if (typeof THREE === 'undefined' || !els.cosmicBackground || cosmicBgAnimator || document.body.classList.contains('reduced-motion')) { return; }
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
            const getCssColor = (name) => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
            const colorPalette = [ getCssColor('--color-accent-gold'), getCssColor('--color-accent-teal'), getCssColor('--color-text'), getCssColor('--color-medium') ];
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 1500; positions[i * 3 + 1] = (Math.random() - 0.5) * 1500; positions[i * 3 + 2] = (Math.random() - 0.5) * 1500;
                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
            }
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3)); particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const particleMaterial = new THREE.PointsMaterial({ size: 2, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, sizeAttenuation: true });
            const particleSystem = new THREE.Points(particles, particleMaterial); scene.add(particleSystem); camera.position.z = 400;
            let animationId;
            const animate = () => {
                if (!animationId && document.body.classList.contains('reduced-motion')) return;
                animationId = requestAnimationFrame(animate); particleSystem.rotation.y += 0.0003;
                const time = Date.now() * 0.00005; particleSystem.position.x = Math.sin(time * 0.7) * 5; particleSystem.position.y = Math.cos(time * 0.5) * 5;
                renderer.render(scene, camera);
            };
            const stop = () => { if (animationId) cancelAnimationFrame(animationId); animationId = null; };
            cosmicBgAnimator = { animate, stop }; animate();
            const handleResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
            window.addEventListener('resize', handleResize);
        } catch (error) { console.error('Three.js background failed:', error); els.cosmicBackground.style.display = 'none'; els.staticBackground.style.display = 'block'; cosmicBgAnimator = { animate: ()=>{}, stop: ()=>{} }; }
    }

    // --- Data Stream Canvas Animation (Kept from previous version) ---
    function initDataStreamCanvas() {
        if (!els.dataStreamCanvas || document.body.classList.contains('reduced-motion')) return;

        const canvas = els.dataStreamCanvas;
        const ctx = canvas.getContext('2d');
        const codes = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-~`{}[]|\\:;"\'<>,./?'.split('');
        const fontSize = 16;
        let columns;
        let drops;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = canvas.width / fontSize;
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let lastTime = 0;
        const fps = 25;
        const interval = 1000 / fps;

        function animateDataStream(timestamp) {
            if (document.body.classList.contains('reduced-motion')) return;
            const elapsed = timestamp - lastTime;

            if (elapsed > interval) {
                lastTime = timestamp - (elapsed % interval);

                ctx.fillStyle = 'rgba(10, 13, 24, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-teal').trim() || '#00FFFF';
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = codes[Math.floor(Math.random() * codes.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }
            requestAnimationFrame(animateDataStream);
        }

        animateDataStream(0);
    }

    // --- Hero Content Animation (FIX: Uses safer element reference) ---
    function initHeroAnimation() {
        if (document.body.classList.contains('reduced-motion') || typeof gsap === 'undefined' || !els.heroHeadline || !els.heroSubheadline) return;

        initDataStreamCanvas();

        if (typeof SplitText === 'undefined') {
            gsap.set(els.heroHeadline, { opacity: 1 });
            const tl = gsap.timeline({ delay: 0.5 });
            tl.to(els.heroHeadline, { backgroundPosition: '0% 0', duration: 1.5, ease: 'power2.inOut' })
              .to(els.heroSubheadline, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, "-=1");
            return;
        }

        // FIX: Split the simple inner text of the H1 element
        splitHeadline = new SplitText(els.heroHeadline, { type: "words", wordsClass: "word" });

        const tl = gsap.timeline({ delay: 0.8 });

        tl.from(splitHeadline.words, {
            y: 50,
            opacity: 0,
            rotationX: -90,
            stagger: 0.05,
            ease: "back.out(1.7)",
            duration: 1.5,
            onStart: () => {
                els.heroHeadline.style.animation = 'none';
                gsap.to(els.heroHeadline, { opacity: 1, duration: 0.1 });
            }
        })
        .add(() => {
            els.heroHeadline.style.animation = 'heavenlyGlow 5s ease-in-out infinite alternate';
        })
        .to(els.heroSubheadline, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out'
        }, "-=0.8");
    }

    // --- Challenge Animation (Kept from previous version) ---
    function initChallengeAnimation() {
        if (!els.networkCanvas || document.body.classList.contains('reduced-motion')) return;
        const canvas = els.networkCanvas;
        const ctx = canvas.getContext('2d');
        let nodes = [];
        let animationFrameId;
        function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; createNodes(); }
        class Node {
            constructor(x, y) { this.x = x; this.y = y; this.radius = Math.random() * 2 + 1; this.baseColor = 'rgba(168, 162, 154, 0.5)'; this.color = this.baseColor; this.isGlitched = false; }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
        }
        function createNodes() {
            nodes = []; const density = window.innerWidth < 768 ? 80 : 60; const cols = Math.floor(canvas.width / density); const rows = Math.floor(canvas.height / density);
            for (let i = 0; i < cols; i++) { for (let j = 0; j < rows; j++) { const x = i * density + (Math.random()) * density; const y = j * density + (Math.random()) * density; nodes.push(new Node(x, y)); } }
        }
        function connectNodes() {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x; const dy = nodes[i].y - nodes[j].y; const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 90) {
                        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
                        const opacity = 1 - (dist / 90); const color = nodes[i].isGlitched && nodes[j].isGlitched ? `rgba(255, 107, 107, ${opacity * 0.5})` : `rgba(168, 162, 154, ${opacity * 0.4})`;
                        ctx.strokeStyle = color; ctx.lineWidth = 0.5; ctx.stroke();
                    }
                }
            }
        }
        function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); nodes.forEach(node => node.draw()); connectNodes(); animationFrameId = requestAnimationFrame(animate); }
        resizeCanvas(); animate(); window.addEventListener('resize', resizeCanvas);
        ScrollTrigger.create({
            trigger: '#challenge', start: 'top center', end: 'bottom center',
            onUpdate: (self) => {
                const progress = self.progress; nodes.forEach(node => {
                    if (Math.random() < progress * 0.01) { node.isGlitched = true; node.color = `rgba(255, 107, 107, ${Math.random() * 0.5 + 0.5})`; }
                    else if (node.isGlitched && Math.random() > 0.95) { node.isGlitched = false; node.color = node.baseColor; }
                });
            },
            onLeaveBack: () => { nodes.forEach(node => { node.isGlitched = false; node.color = node.baseColor; }); }
        });
    }

    // --- General Site Animations (Kept from previous version) ---
    function initSiteAnimations() {
         if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
         
         const mm = gsap.matchMedia();

         mm.add("(prefers-reduced-motion: no-preference)", () => {
             gsap.utils.toArray('.reveal-up').forEach(elem => {
                 gsap.fromTo(elem, { opacity: 0, y: 50 }, {
                     opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                     scrollTrigger: { trigger: elem, start: 'top 88%', once: true }
                 });
             });

             gsap.utils.toArray('[data-speed]').forEach(elem => {
                 const speed = parseFloat(elem.getAttribute('data-speed'));
                 gsap.to(elem, {
                     y: () => -(ScrollTrigger.maxScroll(window) * speed),
                     ease: "none",
                     force3D: true, 
                     scrollTrigger: {
                         trigger: elem,
                         start: "top bottom",
                         end: "bottom top",
                         scrub: true,
                     }
                 });
             });

             if (els.userCounter && typeof TextPlugin !== 'undefined') {
                 gsap.to(els.userCounter, {
                     textContent: 100000, duration: 3, ease: "power2.inOut", snap: { textContent: 1 },
                     scrollTrigger: { trigger: els.userCounter, start: "top 80%", once: true },
                     onUpdate: function() { this.targets()[0].innerHTML = Math.ceil(parseFloat(this.targets()[0].textContent)).toLocaleString('en-US') + "+"; }
                 });
             }
             if (els.platformCounter && typeof TextPlugin !== 'undefined') {
                 gsap.to(els.platformCounter, {
                     textContent: 3, duration: 2.5, ease: "power2.inOut", snap: { textContent: 1 },
                     scrollTrigger: { trigger: els.platformCounter, start: "top 80%", once: true },
                     onUpdate: function() { this.targets()[0].innerHTML = Math.ceil(parseFloat(this.targets()[0].textContent)) + "+"; }
                 });
             }

             if (els.pillarCardsContainer && els.approachSection) {
                 const cards = gsap.utils.toArray('.pillar-card');
                 
                 ScrollTrigger.create({
                     trigger: els.approachSection,
                     start: 'top top',
                     end: '+=200%',
                     pin: els.pillarCardsContainer, 
                     pinSpacing: true,
                     
                     onUpdate: (self) => {
                         const progress = self.progress;
                         const cardDuration = 0.33; 
                         
                         cards.forEach((card, index) => {
                             const startTime = index * cardDuration; 
                             const endTime = startTime + cardDuration; 
                             
                             let cardProgress = 0;
                             if (progress >= startTime && progress <= endTime) {
                                 cardProgress = (progress - startTime) / cardDuration;
                             } else if (progress > endTime) {
                                 cardProgress = 1;
                             }
                             
                             const cardActive = progress >= startTime && progress < startTime + 0.4;
                             
                             const scale = 1 + (cardProgress * 0.05); 
                             const opacity = 0.5 + (cardProgress * 0.5); 
                             const glowIntensity = Math.min(1, cardProgress * 2); 
                             
                             gsap.to(card, {
                                 opacity: opacity,
                                 scale: scale,
                                 boxShadow: `0 0 ${glowIntensity * 30}px rgba(0, 255, 255, ${glowIntensity * 0.6}), 0 0 15px rgba(0, 127, 255, ${glowIntensity * 0.4})`,
                                 duration: 0.1,
                                 ease: "none",
                                 force3D: true
                             });

                             const borderScale = gsap.utils.clamp(0, 1, cardProgress * 1.5);
                             gsap.set(card, { '--gsap-scaleX': borderScale }); 
                             
                             if (!cardActive && progress > endTime - 0.1) {
                                 card.classList.remove('is-active');
                             } else if (cardActive) {
                                 card.classList.add('is-active');
                             }
                         });
                     }
                 });
             }

             return () => { 
                 if(splitHeadline) splitHeadline.revert();
                 ScrollTrigger.getAll().forEach(st => st.kill()); 
             };
         });
         
         mm.add("(prefers-reduced-motion: reduce)", () => {
             gsap.utils.toArray('.reveal-up, .journal-image-container, #hero-headline, #hero-subheadline').forEach(elem => {
                 gsap.set(elem, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
             });
             if(els.userCounter) els.userCounter.innerHTML = "100,000+";
             if(els.platformCounter) els.platformCounter.innerHTML = "3+";
         });
    }

    // --- Pillar Card Hover Interaction (Kept from previous version) ---
    function initPillarCardInteraction() {
        if (document.body.classList.contains('reduced-motion') || !els.pillarCardsContainer || (window.innerWidth > 768 && els.approachSection)) return;
        
        const cards = els.pillarCardsContainer.querySelectorAll('.pillar-card');
        
        cards.forEach(card => {
            const button = card.querySelector('button');
            const target = button || card; 

            target.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 15px rgba(0, 127, 255, 0.4)',
                    transform: 'translateY(-5px) scale(1.01)',
                    duration: 0.5,
                    ease: "power1.out"
                });
                card.classList.add('is-active');
            });

            target.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    boxShadow: 'var(--shadow-md)',
                    transform: 'translateY(0) scale(1)',
                    duration: 0.5,
                    ease: "power1.out",
                    onComplete: () => card.classList.remove('is-active')
                });
            });
        });
    }

    // --- Challenge Animation (Kept from previous version) ---
    function initChallengeAnimation() {
        if (!els.networkCanvas || document.body.classList.contains('reduced-motion')) return;
        const canvas = els.networkCanvas;
        const ctx = canvas.getContext('2d');
        let nodes = [];
        let animationFrameId;
        function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; createNodes(); }
        class Node {
            constructor(x, y) { this.x = x; this.y = y; this.radius = Math.random() * 2 + 1; this.baseColor = 'rgba(168, 162, 154, 0.5)'; this.color = this.baseColor; this.isGlitched = false; }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
        }
        function createNodes() {
            nodes = []; const density = window.innerWidth < 768 ? 80 : 60; const cols = Math.floor(canvas.width / density); const rows = Math.floor(canvas.height / density);
            for (let i = 0; i < cols; i++) { for (let j = 0; j < rows; j++) { const x = i * density + (Math.random()) * density; const y = j * density + (Math.random()) * density; nodes.push(new Node(x, y)); } }
        }
        function connectNodes() {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x; const dy = nodes[i].y - nodes[j].y; const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 90) {
                        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
                        const opacity = 1 - (dist / 90); const color = nodes[i].isGlitched && nodes[j].isGlitched ? `rgba(255, 107, 107, ${opacity * 0.5})` : `rgba(168, 162, 154, ${opacity * 0.4})`;
                        ctx.strokeStyle = color; ctx.lineWidth = 0.5; ctx.stroke();
                    }
                }
            }
        }
        function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); nodes.forEach(node => node.draw()); connectNodes(); animationFrameId = requestAnimationFrame(animate); }
        resizeCanvas(); animate(); window.addEventListener('resize', resizeCanvas);
        ScrollTrigger.create({
            trigger: '#challenge', start: 'top center', end: 'bottom center',
            onUpdate: (self) => {
                const progress = self.progress; nodes.forEach(node => {
                    if (Math.random() < progress * 0.01) { node.isGlitched = true; node.color = `rgba(255, 107, 107, ${Math.random() * 0.5 + 0.5})`; }
                    else if (node.isGlitched && Math.random() > 0.95) { node.isGlitched = false; node.color = node.baseColor; }
                });
            },
            onLeaveBack: () => { nodes.forEach(node => { node.isGlitched = false; node.color = node.baseColor; }); }
        });
    }

    // --- Remaining functions (Chatbot, Contact, Modals, Accessibility) are unchanged. ---
    const botResponses = { "greeting": "Hello! How can I assist you today on your journey to digital clarity?", "default": "That's an interesting point. While this demo is limited, the full MehfoozBot explores topics like that in detail.", "misinformation": "Spotting misinformation involves a few key steps: Check the source's credibility, look for supporting evidence, be wary of emotionally charged language, and check the date.", "safety": "Online safety basics include using strong, unique passwords, enabling two-factor authentication, and being cautious about links or attachments.", "story": "Mehfooz began from listening to the community in Skardu. We realized the need wasn't just *more* tech, but *understanding* tech. You can read more in the 'Our Story' section.", "ulema": "We proudly partner with local Ulema (religious leaders). They serve as trusted community voices, helping bridge traditional wisdom with essential digital literacy skills." };
    const promptQuestions = { "How do you work?": "ulema", "What's your story?": "story", "Spotting fake news?": "misinformation", "Staying safe online?": "safety" };
    const modalQuestions = ["How can I spot fake news?", "Is my WhatsApp safe?", "What is misinformation?"];

    function getBotResponse(userInput) {
        const lowerInput = userInput.toLowerCase();
        if (promptQuestions[userInput]) return botResponses[promptQuestions[userInput]];
        if (modalQuestions.includes(userInput)) { if (lowerInput.includes('fake news') || lowerInput.includes('misinformation')) return botResponses.misinformation; if (lowerInput.includes('whatsapp') || lowerInput.includes('safe')) return botResponses.safety; }
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
        if (typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) { gsap.from(bubble, { opacity: 0, y: 20, duration: 0.5 }); gsap.to(targetLog, { duration: 0.5, scrollTo: { y: "max" }, ease: "power2.out" }); } else { targetLog.scrollTop = targetLog.scrollHeight; }
    }

    function handleBotUserInput(input, targetLog, targetInput, targetPrompts) {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;
        addChatMessage(trimmedInput, 'user', targetLog);
        targetInput.value = "";
        targetInput.disabled = true;
        if (targetPrompts && typeof gsap !== 'undefined') { targetPrompts.style.pointerEvents = 'none'; gsap.to(targetPrompts.children, { opacity: 0.5, duration: 0.3 }); }
        setTimeout(() => {
            addChatMessage(getBotResponse(trimmedInput), 'bot', targetLog);
            targetInput.disabled = false;
            try { targetInput.focus(); } catch(e){}
            if (targetPrompts && typeof gsap !== 'undefined') { targetPrompts.style.pointerEvents = 'auto'; gsap.to(targetPrompts.children, { opacity: 1, duration: 0.3 }); }
        }, 1200);
    }

    function initChatbot() {
        if (els.chatForm && els.chatLog && els.chatInput && els.promptButtonsContainer) {
            els.chatForm.addEventListener('submit', e => { e.preventDefault(); handleBotUserInput(els.chatInput.value, els.chatLog, els.chatInput, els.promptButtonsContainer); });
            els.promptButtonsContainer.innerHTML = ""; Object.keys(promptQuestions).forEach(q => { const btn = document.createElement('button'); btn.className = "chat-prompt-btn"; btn.textContent = q; btn.onclick = () => handleBotUserInput(q, els.chatLog, els.chatInput, els.promptButtonsContainer); els.promptButtonsContainer.appendChild(btn); }); addChatMessage(botResponses.greeting, 'bot', els.chatLog);
        }
        if (els.modalChatForm && els.modalChatLog && els.modalChatInput && els.modalPillContainer) {
            els.modalChatForm.addEventListener('submit', e => { e.preventDefault(); handleBotUserInput(els.modalChatInput.value, els.modalChatLog, els.modalChatInput, els.modalPillContainer); });
            els.modalPillContainer.innerHTML = ""; modalQuestions.forEach(q => { const pill = document.createElement('button'); pill.className = 'chat-prompt-btn'; pill.textContent = q; pill.onclick = () => handleBotUserInput(q, els.modalChatLog, els.modalChatInput, els.modalPillContainer); els.modalPillContainer.appendChild(pill); });
            window.initModalChat = () => { if (els.modalChatLog.children.length === 0) { addChatMessage("Hello! Ask a question or click a topic.", 'bot', els.modalChatLog); } };
            if (els.openBotBtn) { els.openBotBtn.addEventListener('click', () => { window.initModalChat(); setTimeout(() => els.modalChatInput?.focus(), 300); }); }
        }
    }

    function initContactForm() {
        if (!els.contactForm || !els.formSuccess) return;
        els.contactForm.addEventListener('submit', e => {
            e.preventDefault(); const form = e.target; const formData = new FormData(form); let isValid = true;
            if (!formData.get('name').trim() || !formData.get('email').trim() || !formData.get('message').trim()) { isValid = false; alert("Please fill in all required fields."); }
            if (isValid) {
                fetch(form.action, { method: form.method, body: formData, headers: { 'Accept': 'application/json' } }).then(response => {
                    if (response.ok) {
                        if (document.body.classList.contains('reduced-motion') || typeof gsap === 'undefined') { els.contactForm.style.display = 'none'; els.formSuccess.classList.remove('hidden'); }
                        else {
                            gsap.to(els.contactForm, {
                                opacity: 0, duration: 0.5, height: 0, ease: 'power2.in', onComplete: () => {
                                    els.contactForm.style.display = 'none'; els.formSuccess.classList.remove('hidden');
                                    gsap.from(els.formSuccess, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
                                }
                            });
                        }
                        els.contactForm.reset();
                    } else { response.json().then(data => { if (Object.hasOwn(data, 'errors')) { alert(data["errors"].map(error => error["message"]).join(", ")); } else { alert("Oops! There was a problem sending your message. Please try again later."); } }); }
                }).catch(error => { alert("Oops! There was a network error. Please check your connection and try again."); });
            }
        });
    }

    function toggleModal(modal, forceOpen) {
        if (!modal || !els.modalBackdrop || typeof gsap === 'undefined') {
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
            modal.removeAttribute('hidden'); els.modalBackdrop.removeAttribute('hidden');
            gsap.to([modal, els.modalBackdrop], { opacity: 1, duration: 0.3, onStart: () => { modal.classList.add('is-visible'); els.modalBackdrop.classList.add('is-visible'); }});
            gsap.fromTo(modal, {scale: 0.95}, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
        } else {
            gsap.to(modal, { scale: 0.95, opacity: 0, duration: 0.3, onComplete: () => { modal.classList.remove('is-visible'); modal.setAttribute('hidden', 'true'); }});
            gsap.to(els.modalBackdrop, { opacity: 0, duration: 0.3, onComplete: () => { els.modalBackdrop.classList.remove('is-visible'); els.modalBackdrop.setAttribute('hidden', 'true'); }});
        }
    }

    function toggleHelp(forceOpen) {
        if (!els.keyboardHelp || typeof gsap === 'undefined') return;
        const show = forceOpen === undefined ? !els.keyboardHelp.classList.contains('is-visible') : forceOpen;
        els.helpToggleBtn?.setAttribute('aria-expanded', show);
        if (show) {
            els.keyboardHelp.removeAttribute('hidden');
            gsap.fromTo(els.keyboardHelp, {opacity: 0, scale: 0.95}, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)', onStart: () => els.keyboardHelp.classList.add('is-visible') });
        } else {
            gsap.to(els.keyboardHelp, { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => { els.keyboardHelp.classList.remove('is-visible'); els.keyboardHelp.setAttribute('hidden', 'true'); }});
        }
    }

    function initAccessibility() {
        if (els.settingsToggleBtn) els.settingsToggleBtn.addEventListener('click', () => toggleModal(els.settingsModal));
        if (els.settingsCloseBtn) els.settingsCloseBtn.addEventListener('click', () => toggleModal(els.settingsModal, false));
        if (els.helpToggleBtn) els.helpToggleBtn.addEventListener('click', () => toggleHelp());
        if (els.openBotBtn) els.openBotBtn.addEventListener('click', () => toggleModal(els.botModal));
        if (els.closeBotBtn) els.closeBotBtn.addEventListener('click', () => toggleModal(els.botModal, false));
        if (els.modalBackdrop) els.modalBackdrop.addEventListener('click', () => { toggleModal(els.settingsModal, false); toggleModal(els.botModal, false); });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { if (els.settingsModal?.classList.contains('is-visible')) toggleModal(els.settingsModal, false); if (els.botModal?.classList.contains('is-visible')) toggleModal(els.botModal, false); if (els.keyboardHelp?.classList.contains('is-visible')) toggleHelp(false); if (els.navLinksContainer?.classList.contains('is-visible')) els.mobileNavToggle?.click(); }
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || els.introGame?.classList.contains('active')) return;
            if (e.key === '?') { e.preventDefault(); toggleHelp(); }
            if (e.key.toLowerCase() === 'h') { e.preventDefault(); document.querySelector('a[href="#home"]')?.click(); }
            if (e.key.toLowerCase() === 'm') { e.preventDefault(); toggleModal(els.botModal, true); if (window.initModalChat) { window.initModalChat(); } setTimeout(() => els.modalChatInput?.focus(), 300); }
            if (e.key.toLowerCase() === 's') { e.preventDefault(); document.querySelector('.skip-link')?.focus(); }
        });
    }

    function initFloatingChatBubble() {
        if (els.chatBubble) { els.chatBubble.addEventListener('click', () => { toggleModal(els.botModal, true); if (window.initModalChat) { window.initModalChat(); } setTimeout(() => els.modalChatInput?.focus(), 300); }); }
    }

    document.addEventListener('visibilitychange', () => { if (cosmicBgAnimator) { if (document.hidden) { cosmicBgAnimator.stop(); } else if (!document.body.classList.contains('reduced-motion')) { cosmicBgAnimator.animate(); } } });
});

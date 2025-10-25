// MEHFOOZ | DIGITAL ENLIGHTENMENT - PRODUCTION JAVASCRIPT (Stable Base + Blue)
// Contains: Basic Animations, Scroll-Based Interactivity, and Blue Theme.

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
        // dataStreamCanvas: '#data-stream-canvas', // Removed
        userCounter: '#user-counter', platformCounter: '#platform-counter',
        settingsToggleBtn: '#settings-toggle-btn', settingsModal: '#settings-modal', settingsCloseBtn: '#settings-close-btn',
        motionToggle: '#motion-toggle', helpToggleBtn: '#help-toggle-btn', keyboardHelp: '#keyboard-help',
        modalBackdrop: '#modal-backdrop',
        chatLog: '#chat-log', chatForm: '#chat-form', chatInput: '#chat-input', promptButtonsContainer: '#prompt-buttons',
        openBotBtn: '#open-bot-demo-approach', botModal: '#bot-modal', closeBotBtn: '#close-bot-demo',
        modalChatLog: '#modal-chat-log', modalChatForm: '#modal-chat-form', modalChatInput: '#modal-chat-input', modalPillContainer: '#modal-question-pills',
        contactForm: '#contact-form', formSuccess: '#form-success', chatBubble: '#chatBubble',
        pillarCardsContainer: '#pillar-cards-container',
        // approachSection: '#approach' // Removed
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
    // let splitHeadline; // Removed
    let isLoadingScreenHidden = false; 

    // --- Initial Setup ---
    registerGsapPlugins();
    initCustomCursor();
    startLoadingSequence();

    // --- GSAP Plugin Registration (Reverted) ---
    function registerGsapPlugins() {
        if (typeof gsap === 'undefined') {
            console.error("GSAP not loaded. Animations disabled.");
            document.body.classList.add('reduced-motion');
            return;
        }
        if (els.userCounter || els.platformCounter) {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin); // Removed SplitText
        } else {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        }
    }

    // --- Robust Startup Flow (Kept from fix) ---
    function startLoadingSequence() {
        if (!els.loadingScreen) return;
        createLoadingParticles();
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
    // --- End Startup Flow ---

    // --- Intro Sequence (Unchanged) ---
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
            // Fallback
            els.introGame.style.display = 'none';
            els.siteWrapper.classList.remove('opacity-0');
            els.siteWrapper.style.visibility = 'visible';
            document.body.classList.add('site-entered');
            initSmoothScroll(); initNavigation(); initAccessibility(); initMotionAndBackground(); initChallengeAnimation(); initChatbot(); initContactForm(); initFloatingChatBubble(); initPillarCardInteraction(); initSiteAnimations();
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

    // --- Smooth Scroll (Unchanged) ---
    function initSmoothScroll() { if (typeof Lenis === 'undefined' || document.body.classList.contains('reduced-motion')) return; lenis = new Lenis(); gsap.ticker.add((time) => lenis.raf(time * 1000)); }

    // --- Navigation (Unchanged) ---
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

    // --- Motion Preferences & Background Control (Reverted - No Data Stream) ---
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

        // Reverted to simpler background control
        const showVisuals = enabled && typeof THREE !== 'undefined';
        
        if (els.cosmicBackground && els.staticBackground) {
            els.cosmicBackground.style.display = showVisuals ? 'block' : 'none';
            els.staticBackground.style.display = showVisuals ? 'none' : 'block';
            // els.dataStreamCanvas.style.display = showVisuals ? 'none' : 'block'; // Removed

            if (showVisuals) {
                if (!cosmicBgAnimator) initCosmicBackground();
                 else if (!cosmicBgAnimator.animationId) cosmicBgAnimator.animate(); // Restart if stopped
            } else if (cosmicBgAnimator) {
                 cosmicBgAnimator.stop();
            }
        }
        if (wasReduced !== isNowReduced && typeof ScrollTrigger !== 'undefined') { ScrollTrigger.refresh(); }
    }

    // --- Cosmic Background (Unchanged) ---
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
            cosmicBgAnimator = { animate, stop, animationId }; 
            
            animate(); 
            
            const handleResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
            window.addEventListener('resize', handleResize);
        } catch (error) { console.error('Three.js background failed:', error); els.cosmicBackground.style.display = 'none'; els.staticBackground.style.display = 'block'; cosmicBgAnimator = { animate: ()=>{}, stop: ()=>{} }; }
    }

    // --- Data Stream Canvas Animation (Removed) ---
    // function initDataStreamCanvas() { ... }

    // --- Hero Content Animation (Reverted to Gradient) ---
    function initHeroAnimation() {
        if (document.body.classList.contains('reduced-motion') || typeof gsap === 'undefined' || !els.heroHeadline || !els.heroSubheadline) return;

        gsap.set(els.heroHeadline, { opacity: 1 }); // Ensure visibility for gradient
        const tl = gsap.timeline({ delay: 0.5 });

        tl.to(els.heroHeadline, {
            backgroundPosition: '0% 0', // Animate gradient
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

    // --- Challenge Animation (Unchanged) ---
    function initChallengeAnimation() {
        if (!els.networkCanvas || document.body.classList.contains('reduced-motion')) return;
        const canvas = els.networkCanvas;
        const ctx = canvas.getContext('2d');
        let nodes = [];
        let animationFrameId;
        function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; createNodes(); }
        class Node {
            constructor(x, y) { this.x = x; this.y = y; this.radius = Math.random() * 2 + 1; this.baseColor = 'rgba(138, 154, 171, 0.5)'; this.color = this.baseColor; this.isGlitched = false; } // Updated baseColor
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
                        const opacity = 1 - (dist / 90); const color = nodes[i].isGlitched && nodes[j].isGlitched ? `rgba(255, 107, 107, ${opacity * 0.5})` : `rgba(138, 154, 171, ${opacity * 0.4})`; // Updated line color
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

    // --- General Site Animations (Reverted - No Parallax/Pinning) ---
    function initSiteAnimations() {
         if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
         
         const mm = gsap.matchMedia();

         mm.add("(prefers-reduced-motion: no-preference)", () => {
             // Standard reveal-up
             gsap.utils.toArray('.reveal-up').forEach(elem => {
                 gsap.fromTo(elem, { opacity: 0, y: 50 }, {
                     opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                     scrollTrigger: { trigger: elem, start: 'top 88%', once: true }
                 });
             });

             // Counters
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

             // Cleanup function
             return () => { 
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

    // --- Pillar Card Hover Interaction (Simple Version) ---
    function initPillarCardInteraction() {
        if (document.body.classList.contains('reduced-motion') || !els.pillarCardsContainer) return;
        
        const cards = els.pillarCardsContainer.querySelectorAll('.pillar-card');
        
        cards.forEach(card => {
            const button = card.querySelector('button');
            const target = button || card; 

            target.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    // Simpler hover effect
                    boxShadow: 'var(--shadow-lg)',
                    y: -5,
                    duration: 0.3,
                    ease: "power1.out"
                });
                card.classList.add('is-active'); // Still add class for potential future styling
            });

            target.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    boxShadow: 'var(--shadow-md)',
                    y: 0,
                    duration: 0.3,
                    ease: "power1.out",
                    onComplete: () => card.classList.remove('is-active')
                });
            });
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

    document.addEventListener('visibilitychange', () => { 
        if (cosmicBgAnimator && !document.body.classList.contains('reduced-motion')) { 
            if (document.hidden) { cosmicBgAnimator.stop(); } else { cosmicBgAnimator.animate(); } 
        } 
    });
});

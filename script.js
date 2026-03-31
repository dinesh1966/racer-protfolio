// ================================
// Preloader
// ================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => { if (preloader) preloader.classList.add('hidden'); }, 1500);
});

// ================================
// Navigation
// ================================
const navbar    = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
});

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks?.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});

// ================================
// Stat Counters
// ================================
const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let cur = 0;
        const step = Math.ceil(target / 60);
        const t = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = cur;
            if (cur >= target) clearInterval(t);
        }, 24);
        statObs.unobserve(el);
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-counter[data-target]').forEach(el => statObs.observe(el));

// ================================
// Card Tilt
// ================================
document.querySelectorAll('.glass-card, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top)  / r.height - 0.5) * 10;
        const ry = ((e.clientX - r.left) / r.width  - 0.5) * -10;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
});

// ================================
// Mouse Trail (hero)
// ================================
const _ts = document.createElement('style');
_ts.textContent = `@keyframes _tf{0%{opacity:.7;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(3)}}`;
document.head.appendChild(_ts);
const _hero = document.querySelector('.hero');
if (_hero) {
    let _trails = [];
    _hero.addEventListener('mousemove', (e) => {
        const d = document.createElement('div');
        d.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:8px;height:8px;background:radial-gradient(circle,rgba(0,191,255,.5),transparent);border-radius:50%;pointer-events:none;z-index:9997;transform:translate(-50%,-50%);animation:_tf .5s ease forwards;`;
        document.body.appendChild(d);
        _trails.push(d);
        if (_trails.length > 12) _trails.shift()?.remove();
        setTimeout(() => d.remove(), 500);
    });
}

// ================================
// Speed Lines
// ================================
const _sl = document.querySelector('.speed-lines');
if (_sl) {
    let _last = 0;
    window.addEventListener('scroll', () => {
        const spd = Math.abs(window.scrollY - _last);
        _sl.style.opacity = 0.3 + Math.min(spd / 100, 0.08);
        _last = window.scrollY;
    });
}

// ==========================================================
//  STACK-TO-CENTER CAROUSEL
//  10 images stacked on the left side.
//  Each one sequentially:
//   1. Flies to screen center with 360° Y-spin
//   2. Scales up & glows (showcase)
//   3. Spins back 360° and returns to back of stack
// ==========================================================
class StackCarousel {
    constructor() {
        this.el = document.getElementById('stackCarousel');
        if (!this.el) return;

        /* ── Images ── */
        this.IMAGES = [
            {
                src: 'finish.png', alt: 'Victory Finish',
                event: 'World Road Racing Championship 2024',
                place: 'Zurich, Switzerland',
                date: 'September 2024',
                category: 'World Championship',
                achievements: ['🥇 1st Place — Gold Medal', '⏱ Record-breaking 2-min lead', '🌍 World Champion Title'],
                description: 'The defining moment — crossing the finish line at Zurich to claim the World Championship gold with an unprecedented 2-minute advantage over the peloton.'
            },
            {
                src: 'lean.png', alt: 'Alpine Assault',
                event: 'Tour de France — Stage 17 (Col du Galibier)',
                place: 'French Alps, France',
                date: 'July 2023',
                category: 'Grand Tour',
                achievements: ['👕 Yellow Jersey Holder', '⛰ King of the Mountains Stage', '🏆 Tour de France Champion'],
                description: 'Conquering the hairpin turns of Col du Galibier at over 2,600m altitude. This stage sealed the overall Tour de France victory.'
            },
            {
                src: 'victory.png', alt: 'Champion Celebration',
                event: 'Olympic Games — Road Cycling Final',
                place: 'Tokyo, Japan',
                date: 'August 2022',
                category: 'Olympics',
                achievements: ['🥇 Olympic Gold Medal', '🇺🇸 National Record Time', '🏅 Youngest Olympic Cycling Gold'],
                description: 'An emotional victory lap after winning Olympic gold. Representing the nation on the world\'s biggest sporting stage and delivering a flawless performance.'
            },
            {
                src: 'hero.png', alt: 'Night Training',
                event: 'Pre-Season Training Camp',
                place: 'Barcelona, Spain',
                date: 'January 2024',
                category: 'Training',
                achievements: ['💪 Peak VO2 Max Recorded', '🔬 Aero Position Optimized', '📈 FTP Increased by 8%'],
                description: 'Intense pre-season night session at the Barcelona velodrome. Pushing physical limits under the lights to prepare for the championship season ahead.'
            },
            {
                src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=500&auto=format&fit=crop', alt: 'Sprint Finish',
                event: 'Giro d\'Italia — Final Stage',
                place: 'Milan, Italy',
                date: 'May 2021',
                category: 'Grand Tour',
                achievements: ['👕 Pink Jersey Winner', '🏆 3 Stage Wins', '⚡ Sprint Champion'],
                description: 'The final sprint through the streets of Milan to clinch the Giro d\'Italia title. Three consecutive stage wins made this victory decisive.'
            },
            {
                src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=500&auto=format&fit=crop', alt: 'Mountain Pass',
                event: 'Vuelta a España — Mountain Stage',
                place: 'Sierra Nevada, Spain',
                date: 'September 2020',
                category: 'Grand Tour',
                achievements: ['🔴 Red Jersey Claimed', '⛰ Mountain Stage Victory', '🏆 Grand Tour Triple Crown'],
                description: 'The legendary Sierra Nevada climb that secured the red jersey and completed the Grand Tour Triple Crown — winning Tour, Giro, and Vuelta.'
            },
            {
                src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=500&auto=format&fit=crop', alt: 'Time Trial',
                event: 'Individual Time Trial Championship',
                place: 'Innsbruck, Austria',
                date: 'June 2023',
                category: 'Championship',
                achievements: ['⏱ Course Record Broken', '🥇 National TT Champion', '💨 Avg Speed: 54.2 km/h'],
                description: 'A masterclass in time trialing through the Austrian mountains. Breaking the course record with an average speed of 54.2 km/h over 40km.'
            },
            {
                src: 'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=500&auto=format&fit=crop', alt: 'Podium Ceremony',
                event: 'Flanders Classic — Monument Race',
                place: 'Oudenaarde, Belgium',
                date: 'April 2022',
                category: 'Monument Classic',
                achievements: ['🏆 Monument Victory', '🇧🇪 Cobblestone King', '💪 Solo Breakaway Win'],
                description: 'Standing on the podium after conquering the brutal cobblestones of Flanders. A solo breakaway in the final 30km secured this prestigious Monument victory.'
            },
            {
                src: 'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=500&auto=format&fit=crop', alt: 'Team Celebration',
                event: 'Team Time Trial — World Championships',
                place: 'Wollongong, Australia',
                date: 'October 2022',
                category: 'Team Event',
                achievements: ['🥇 Team Gold Medal', '🤝 Team Captain Honor', '⏱ TTT World Record'],
                description: 'Celebrating with teammates after setting a new Team Time Trial world record. Leadership and perfect coordination across 6 riders over 50km.'
            },
            {
                src: 'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=500&auto=format&fit=crop', alt: 'Charity Ride',
                event: 'Velocity Foundation Charity Ride',
                place: 'Los Angeles, USA',
                date: 'December 2023',
                category: 'Charity',
                achievements: ['💰 $2.5M Raised', '❤️ 5,000 Riders Joined', '🌟 Community Champion Award'],
                description: 'Leading the annual Velocity Foundation charity ride through Los Angeles. Over 5,000 riders joined to raise $2.5 million for youth cycling programs.'
            },
        ];

        /* ── Config ── */
        this.CARD_W       = 210;
        this.CARD_H       = 290;
        this.FLY_MS       = 750;          // fly animation duration
        this.SHOWCASE_MS  = 1900;         // time card spends at center
        this.PAUSE_MS     = 350;          // gap between cycles
        this.STACK_LEFT   = 0.06;         // stack position as fraction of width

        /* ── State ── */
        this.cards      = [];             // DOM elements
        this.order      = [];             // front-to-back indices
        this.animating  = false;
        this.paused     = false;
        this.timer      = null;

        /* ── UI refs ── */
        this.label       = null;
        this.dotsEl      = null;
        this.badgeEl     = null;
        this.popupEl     = null;

        this._build();
        this._buildUI();
        this._buildPopup();

        // Start after a short intro delay
        setTimeout(() => this._cycle(), 800);
    }

    /* ─ pixel position of stack left edge ─────────────── */
    _stackX() { return Math.max(30, this.el.clientWidth * this.STACK_LEFT); }

    /* ─ pixel position for center showcase ─────────────── */
    _centerX() { return (this.el.clientWidth / 2) - (this.CARD_W / 2); }

    /* ─ Build card DOM ─────────────────────────────────── */
    _build() {
        this.IMAGES.forEach((img, i) => {
            const card = document.createElement('div');
            card.className = 'stack-card';
            card.dataset.src = img.src;
            card.dataset.alt = img.alt;
            card.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy" draggable="false">`;

            // Click: open popup (only when card is at center)
            card.addEventListener('click', () => {
                if (card.classList.contains('showcasing')) {
                    this._openPopup(img);
                } else {
                    // Click any stack card → pause/resume
                    this._togglePause();
                }
            });

            this.el.appendChild(card);
            this.cards.push(card);
            this.order.push(i);
        });

        this._renderStack(false);
    }

    /* ─ Position all stack cards from front→back ────────── */
    _renderStack(animate = true, skipIdx = -1) {
        const n   = this.order.length;
        const sx  = this._stackX();
        const MAX_OFFSET_X = 36;
        const MAX_OFFSET_Y = 22;
        const MAX_ROT      = 11;

        this.order.forEach((cardIdx, pos) => {
            if (cardIdx === skipIdx) return; // being animated separately
            const card = this.cards[cardIdx];
            const frac = n > 1 ? pos / (n - 1) : 0;
            const ox   = frac * MAX_OFFSET_X;
            const oy   = frac * MAX_OFFSET_Y;
            const rot  = frac * MAX_ROT;
            const opa  = pos > 7 ? Math.max(0.25, 1 - (pos - 7) * 0.18).toFixed(2) : '1';

            card.style.transition = animate
                ? `left .42s ease, transform .42s ease, opacity .42s ease`
                : 'none';
            card.style.left    = `${sx + ox}px`;
            card.style.top     = '50%';
            card.style.zIndex  = n - pos;
            card.style.opacity = opa;
            card.style.transform = `translateY(calc(-50% + ${oy}px)) rotate(${rot}deg)`;
        });
    }

    /* ─ Build overlay UI (label, dots, badge) ───────────── */
    _buildUI() {
        this.label = document.createElement('div');
        this.label.className = 'showcase-label';
        this.label.textContent = '● NOW SHOWCASING';
        this.el.appendChild(this.label);

        this.dotsEl = document.createElement('div');
        this.dotsEl.className = 'carousel-dots';
        this.IMAGES.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = 'carousel-dot';
            d.title = `Card ${i + 1}`;
            this.dotsEl.appendChild(d);
        });
        this.el.appendChild(this.dotsEl);

        this.badgeEl = document.createElement('div');
        this.badgeEl.className = 'carousel-paused-badge';
        this.badgeEl.textContent = '⏸ PAUSED — click to resume';
        this.el.appendChild(this.badgeEl);
    }

    _setDot(idx) {
        this.dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) =>
            d.classList.toggle('active', i === idx));
    }

    /* ─ Popup (fullscreen image + details panel) ──────────── */
    _buildPopup() {
        const overlay = document.createElement('div');
        overlay.className = 'card-popup-overlay';
        overlay.innerHTML = `
            <span class="card-popup-close">&times;</span>
            <div class="card-popup-wrapper">
                <div class="card-popup-img-side">
                    <img class="card-popup-img" src="" alt="">
                </div>
                <div class="card-popup-info">
                    <div class="popup-category-badge"></div>
                    <h2 class="popup-event-title"></h2>
                    <div class="popup-meta">
                        <span class="popup-meta-item popup-place"><i class="fas fa-map-marker-alt"></i> <span></span></span>
                        <span class="popup-meta-item popup-date"><i class="far fa-calendar-alt"></i> <span></span></span>
                    </div>
                    <p class="popup-description"></p>
                    <div class="popup-achievements">
                        <h4 class="popup-ach-title"><i class="fas fa-trophy"></i> Key Achievements</h4>
                        <ul class="popup-ach-list"></ul>
                    </div>
                    <div class="popup-divider"></div>
                    <div class="popup-footer">
                        <span class="popup-tag">Marcus Velocity Portfolio</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.popupEl = overlay;

        const close = () => {
            overlay.classList.remove('active');
            // Pause carousel on close so user can browse
        };
        overlay.querySelector('.card-popup-close').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }

    _openPopup(imgData) {
        const popup = this.popupEl;
        const img = popup.querySelector('.card-popup-img');
        img.src = imgData.src;
        img.alt = imgData.alt;

        popup.querySelector('.popup-category-badge').textContent = imgData.category || 'Race';
        popup.querySelector('.popup-event-title').textContent = imgData.event || imgData.alt;
        popup.querySelector('.popup-place span').textContent = imgData.place || 'Unknown';
        popup.querySelector('.popup-date span').textContent = imgData.date || '';
        popup.querySelector('.popup-description').textContent = imgData.description || '';

        // Achievements list
        const achList = popup.querySelector('.popup-ach-list');
        achList.innerHTML = '';
        (imgData.achievements || []).forEach((ach, i) => {
            const li = document.createElement('li');
            li.textContent = ach;
            li.style.animationDelay = `${0.15 + i * 0.1}s`;
            achList.appendChild(li);
        });

        popup.classList.add('active');
    }

    /* ─ Pause / Resume ───────────────────────────────────── */
    _togglePause() {
        this.paused = !this.paused;
        this.badgeEl.classList.toggle('visible', this.paused);
        if (!this.paused && !this.animating) this._cycle();
    }

    /* ─ Main animation cycle ─────────────────────────────── */
    _cycle() {
        if (this.animating || this.paused) return;
        this.animating = true;

        // Front card
        const frontIdx = this.order[0];
        const card     = this.cards[frontIdx];
        const cx       = this._centerX();
        this._setDot(frontIdx);

        /* ── PHASE 1: Fly from stack → center (spin 360° Y) ── */
        const FLY = `${this.FLY_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        card.style.zIndex     = 200;
        card.style.transition = `left ${FLY}, transform ${FLY}, opacity .4s ease`;

        void card.offsetWidth; // force reflow

        card.style.left      = `${cx}px`;
        card.style.opacity   = '1';
        card.style.transform = `translateY(-50%) rotateY(360deg) scale(1.35)`;

        setTimeout(() => {
            /* ── PHASE 2: Showcase at center ── */
            card.classList.add('showcasing');
            this.label.classList.add('visible');

            // Shift remaining stack cards forward now
            this.order.shift();
            this._renderStack(true, -1);

            setTimeout(() => {
                /* ── PHASE 3: Exit to RIGHT side + fade out ── */
                this.label.classList.remove('visible');
                card.classList.remove('showcasing');

                const exitX = this.el.clientWidth + 40; // beyond right edge

                card.style.transition = `left ${this.FLY_MS}ms cubic-bezier(0.55, 0, 1, 0.45), transform ${this.FLY_MS}ms cubic-bezier(0.55, 0, 1, 0.45), opacity ${this.FLY_MS * 0.7}ms ease`;
                card.style.left      = `${exitX}px`;
                card.style.transform = `translateY(-50%) rotateY(720deg) scale(0.85)`;
                card.style.opacity   = '0';

                setTimeout(() => {
                    /* ── Reset card silently to back of left stack ── */
                    card.style.transition = 'none';

                    const n   = this.order.length;
                    const sx  = this._stackX();
                    const ox  = 36;
                    const oy  = 22;
                    const rot = 11;

                    card.style.left      = `${sx + ox}px`;
                    card.style.top       = '50%';
                    card.style.transform = `translateY(calc(-50% + ${oy}px)) rotate(${rot}deg)`;
                    card.style.opacity   = '0.28';
                    card.style.zIndex    = 1;

                    // Push card to back of queue
                    this.order.push(frontIdx);
                    this._renderStack(false); // snap all to positions (no anim)

                    this.animating = false;
                    this.timer = setTimeout(() => this._cycle(), this.PAUSE_MS);

                }, this.FLY_MS + 60);

            }, this.SHOWCASE_MS);

        }, this.FLY_MS);
    }
}

// ================================
// Init
// ================================
document.addEventListener('DOMContentLoaded', () => {
    new StackCarousel();
    initStoryReader();
    initParallax();
    init3DTrack();
    initAchievementModal();
});

// ================================
// Story Reader (Race Chronicles)
// ================================
function initStoryReader() {
    const stories = {
        'story-1': {
            title: 'Beyond the Finish Line',
            category: 'The Mindset',
            date: 'March 15, 2024',
            readTime: '5 Min Read',
            image: 'hero.png',
            content: `
                <p class="story-lead">The crowd roared like thunder as I crossed the finish line at the 2024 World Championship in Zurich. Two minutes ahead of the peloton. A record-breaking margin. But what nobody saw was the storm inside my head for the 247 kilometers before that moment.</p>

                <p>Winning a world championship doesn't start at the starting line. It starts months before — in the dark hours of the morning when the alarm screams at 4:30 AM and every muscle in your body begs you to stay in bed. It starts in the silence of a hotel room the night before the race, when doubt creeps in like fog through an open window.</p>

                <div class="story-quote">
                    <blockquote>"The race is won or lost in your mind long before the wheels start turning."</blockquote>
                </div>

                <h4>The Night Before</h4>
                <p>I have a ritual. The night before every major race, I sit alone in complete darkness for exactly 20 minutes. No phone. No music. Just the sound of my own breathing. I visualize every climb, every descent, every moment where the peloton might attack. I don't just see the road — I feel the gradient under my tires, the burn in my legs at kilometer 180, the exact moment I'll launch my attack.</p>

                <p>For Zurich, I visualized the Witikon climb 47 times. I knew every crack in the asphalt, every tree that would offer a moment of shade, every turn where the crosswind would try to push me sideways. When race day came, nothing was a surprise. The road felt like an old friend.</p>

                <h4>The Breaking Point</h4>
                <p>At kilometer 163, the Italian team launched a devastating attack. Three riders surged ahead simultaneously. My heart rate spiked to 187 BPM. My legs screamed. This was the moment — the fork in the road between champion and forgotten.</p>

                <p>I have a phrase I repeat when the pain becomes unbearable: <em>"Pain is information. It's not a command."</em> My body was telling me to slow down, to survive, to finish safely in the pack. But my mind — that hardened, battle-tested mind — had other plans.</p>

                <div class="story-stats">
                    <div class="story-stat">
                        <span class="story-stat-value">247 km</span>
                        <span class="story-stat-label">Race Distance</span>
                    </div>
                    <div class="story-stat">
                        <span class="story-stat-value">192 BPM</span>
                        <span class="story-stat-label">Peak Heart Rate</span>
                    </div>
                    <div class="story-stat">
                        <span class="story-stat-value">5:42:18</span>
                        <span class="story-stat-label">Finish Time</span>
                    </div>
                </div>

                <h4>The Silence After</h4>
                <p>The strangest thing about winning is the silence that follows. Yes, there are crowds, cameras, microphones pushed in your face, reporters asking how it feels. But inside, there's a profound stillness. The months of sacrifice, the injuries, the missed birthdays and family dinners — they all crystallize into one perfect, quiet moment of satisfaction.</p>

                <p>I stood on that podium in Zurich and looked out at the Swiss Alps painted gold by the evening sun. The national anthem played. And for 97 seconds, everything was perfectly still inside my chest. That silence — that is what I race for. Not the gold. Not the glory. The silence.</p>

                <p>Because beyond the finish line, there's only one question that matters: <strong>Will you show up tomorrow and do it all again?</strong></p>

                <p>The answer is always yes.</p>
            `
        },
        'story-2': {
            title: 'Engineering Perfection',
            category: 'Tech & Gear',
            date: 'Feb 28, 2024',
            readTime: '8 Min Read',
            image: 'lean.png',
            content: `
                <p class="story-lead">People see a bicycle and think it's simple — two wheels, a frame, a chain. But the machine I ride is the product of 14,000 hours of engineering, wind tunnel testing at 280 km/h equivalent airspeeds, and materials science that would make aerospace engineers jealous.</p>

                <h4>The Frame: 780 Grams of Revolution</h4>
                <p>My race bike weighs exactly 6.8 kilograms — the minimum allowed by UCI regulations. The frame alone is 780 grams of Japanese Toray T1100 carbon fiber, laid up in 412 individual pieces by hand. Each piece is placed at precise angles calculated by AI algorithms that simulate millions of riding positions and stress scenarios.</p>

                <p>The geometry is custom — built to my body down to the millimeter. My saddle height is 76.3 centimeters. My stem length is 13 centimeters with a -17 degree angle. My handlebars are 40 centimeters wide. Change any of these numbers by even 2 millimeters and my power output drops measurably.</p>

                <div class="story-quote">
                    <blockquote>"At 60 km/h, 90% of the energy you produce goes into fighting air. The bike isn't a vehicle — it's a weapon against physics."</blockquote>
                </div>

                <h4>Aerodynamics: Cheating the Wind</h4>
                <p>We spent 340 hours in the wind tunnel during the 2023–24 offseason. Three hundred and forty hours of sitting on a bike in a controlled airflow, adjusting my position by fractions of a degree, testing helmets, skinsuits, shoe covers, even different tape on the handlebars.</p>

                <p>The result? A 7.2-watt saving at race speed compared to last year. That might sound insignificant, but over a 250-kilometer race, it translates to roughly 48 seconds — the difference between gold and not even making the podium.</p>

                <p>My position on the bike is what we call "slam aero" — my back is nearly flat, chin tucked behind the stem, elbows pulled in tight. It's incredibly uncomfortable. After four hours in this position, my neck muscles feel like they're being pulled apart by pliers. But comfort is for training rides. Race day is about speed.</p>

                <div class="story-stats">
                    <div class="story-stat">
                        <span class="story-stat-value">6.8 kg</span>
                        <span class="story-stat-label">Bike Weight</span>
                    </div>
                    <div class="story-stat">
                        <span class="story-stat-value">340 hrs</span>
                        <span class="story-stat-label">Wind Tunnel Time</span>
                    </div>
                    <div class="story-stat">
                        <span class="story-stat-value">412</span>
                        <span class="story-stat-label">Carbon Layup Pieces</span>
                    </div>
                </div>

                <h4>The Wheels: Where Rubber Meets Victory</h4>
                <p>My race wheels cost more than most cars. They're 65mm deep-section carbon rims with ceramic bearings that spin so freely they keep rotating for over 11 minutes from a single push. The tires are hand-glued tubulars — 25mm wide, inflated to precisely 7.2 bar on the front and 7.5 bar on the rear. These pressures change depending on temperature, humidity, and road surface.</p>

                <p>On the morning of the Tour de France's mountain stages, my mechanic arrives at 5 AM to prepare my climbing wheels — lightweight 38mm rims that save 280 grams of rotating mass. This swap happens in the team bus while I'm still eating breakfast, but the precision is surgical. Every spoke is checked with a tension meter. Every quick-release skewer is set to exactly 12 newton-meters of torque.</p>

                <h4>The Human-Machine Interface</h4>
                <p>The most advanced component on my bike isn't the electronic shifting or the power meter — it's the connection between the rider and the machine. After thousands of hours together, the bike becomes an extension of your nervous system. I can feel a 0.1 bar change in tire pressure through the handlebars. I know instantly if a bearing is 0.001mm out of alignment from the vibration through the frame.</p>

                <p>This isn't mysticism. It's neuroplasticity — the brain building new pathways to process sensory information from the bike. The carbon frame transmits road information at the speed of sound through the material. My brain has learned to decode these vibrations into actionable data faster than any sensor could.</p>

                <p>That's the truth about modern racing: <strong>the bike and the rider are one system</strong>. Engineer one without the other, and you've built nothing but an expensive sculpture.</p>
            `
        },
        'story-3': {
            title: 'The Mental Edge',
            category: 'History',
            date: 'Jan 12, 2024',
            readTime: '6 Min Read',
            image: 'victory.png',
            content: `
                <p class="story-lead">September 24, 2023. Zurich, Switzerland. The World Road Race Championship. 169 riders from 45 nations. 271 kilometers of suffering. And one moment — one single decision at kilometer 218 — that would define everything.</p>

                <h4>The Setup</h4>
                <p>The race plan was simple on paper: stay in the shadows for the first 200 kilometers. Save energy. Let the national teams burn their domestic riders to control the pace. Then, on the final ascent of the Zürichberg with 53 kilometers remaining, explode off the front with everything I had left.</p>

                <p>For 200 kilometers, I was invisible. Nineteenth wheel. Twentieth wheel. Tucked safely in the peloton, drafting behind broad-shouldered Belgian and Dutch riders who were doing the hard work at the front. My power output averaged just 180 watts — practically a recovery ride. Meanwhile, the riders at the front were grinding out 350-watt efforts into a brutal north wind.</p>

                <div class="story-quote">
                    <blockquote>"The art of championship racing isn't about who's the strongest. It's about who can be patient enough to let their strength matter at the right moment."</blockquote>
                </div>

                <h4>The Moment</h4>
                <p>At kilometer 218, the race exploded. The Slovenian team launched a coordinated assault — four riders attacking simultaneously on different sides of the road. The peloton shattered like glass. Groups fractured everywhere. Riders who had been saving energy all day suddenly found themselves 30 seconds behind with no way to close the gap.</p>

                <p>This was the moment. Not the planned attack at kilometer 218 on the Zürichberg — that was still 53 kilometers away. But racing doesn't care about your plan. Racing happens when it happens, and champions respond.</p>

                <p>My heart rate went from 142 to 188 BPM in eight seconds. I jumped out of the saddle, threw the bike sideways beneath me, and drove my legs down with everything stored in those 200 kilometers of patient waiting. The acceleration was savage — from 38 km/h to 52 km/h in a matter of seconds.</p>

                <div class="story-stats">
                    <div class="story-stat">
                        <span class="story-stat-value">271 km</span>
                        <span class="story-stat-label">Total Distance</span>
                    </div>
                    <div class="story-stat">
                        <span class="story-stat-value">169</span>
                        <span class="story-stat-label">Riders Started</span>
                    </div>
                    <div class="story-stat">
                        <span class="story-stat-value">53 km</span>
                        <span class="story-stat-label">Solo Breakaway</span>
                    </div>
                </div>

                <h4>The Solo</h4>
                <p>What followed was 53 kilometers of pure suffering. Alone at the front. No draft. No teammates. Just me, the road, and the relentless Swiss wind. Behind me, the world's best riders organized a chase — 12 strong riders from 8 different nations working together with one shared goal: catch Marcus Velocity.</p>

                <p>I had a 28-second advantage at the bottom of the Zürichberg. By the summit, it was 1 minute 15 seconds. The monitors on team cars showed my data: 410 watts sustained, heart rate peaked at 194 BPM, cadence locked at 93 rpm. My sports director's voice crackled through the radio: "Marcus, you're flying. They can't match this. Stay smooth."</p>

                <p>But smoothness is the hardest thing in the world when your body is screaming. My vision narrowed to a tunnel. The crowds lining the course were a blur of color and sound — cowbells, horns, screaming voices in German and French and Italian. I heard none of it. The only sound was my own breathing and the hum of carbon wheels on Swiss asphalt.</p>

                <h4>The Final Kilometer</h4>
                <p>With one kilometer to go, I finally looked back. The road behind me was empty. The chase group was over two minutes behind. The World Championship was mine.</p>

                <p>I sat up. Unzipped my jersey. And for the first time in six hours, I smiled. The crowd noise hit me like a wave — thousands of voices united in celebration. I crossed the finish line with my arms raised, tears streaming down my face, wearing the most beautiful jersey in cycling: the rainbow stripes of the World Champion.</p>

                <p>They ask me what it felt like. I tell them the truth: <strong>it felt like silence</strong>. Perfect, absolute silence inside a hurricane of noise. That's the mental edge — the ability to find stillness in chaos, patience in panic, and courage when every cell in your body is begging you to stop.</p>

                <p>I'll wear the rainbow jersey for one year. But the memory of that day in Zurich will last forever.</p>
            `
        }
    };

    // Modal elements
    const modal = document.getElementById('storyModal');
    const closeBtn = document.getElementById('storyModalClose');

    function openStory(storyId) {
        const story = stories[storyId];
        if (!story) return;

        document.getElementById('storyModalImg').src = story.image;
        document.getElementById('storyModalImg').alt = story.title;
        document.getElementById('storyModalCategory').textContent = story.category;
        document.getElementById('storyModalTitle').textContent = story.title;
        document.getElementById('storyModalMeta').innerHTML = `
            <span><i class="far fa-calendar-alt"></i> ${story.date}</span>
            <span><i class="far fa-clock"></i> ${story.readTime}</span>
        `;
        document.getElementById('storyModalBody').innerHTML = story.content;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Scroll modal to top
        modal.querySelector('.story-modal').scrollTop = 0;
    }

    function closeStory() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Bind triggers
    document.querySelectorAll('[data-story-trigger]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openStory(btn.dataset.storyTrigger);
        });
    });

    // Close handlers
    closeBtn.addEventListener('click', closeStory);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeStory();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeStory();
    });
}

// ================================
// Parallax & Scroll Animations
// ================================
function initParallax() {

    /* ── 1. Parallax Elements (data-speed) ── */
    const parallaxEls = document.querySelectorAll('.parallax-element[data-speed]');

    /* ── 2. Zigzag backgrounds ── */
    const zigzagBgs = document.querySelectorAll('.zigzag-bg');

    /* ── 5. Achievement icon pulse on scroll ── */
    const achIcons = document.querySelectorAll('.achievement-icon');

    /* ── Track revealed items to avoid re-triggering ── */
    const revealed = new Set();

    /* ── Main scroll handler (throttled via rAF) ── */
    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const winH = window.innerHeight;

            // ─── Parallax displacement ───
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0;
                const rect = el.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const offset = (centerY - winH / 2) * speed;
                el.style.transform = `translateY(${offset}px)`;
            });

            // ─── Zigzag background parallax ───
            zigzagBgs.forEach(bg => {
                const parent = bg.parentElement;
                if (!parent) return;
                const pRect = parent.getBoundingClientRect();
                const displacement = (pRect.top / winH) * 25;
                bg.style.transform = `translateY(${displacement}px)`;
            });

            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial run to set states
    onScroll();
}

// ================================
// 3D Moving Track Attributes
// ================================
function init3DTrack() {
    const section = document.getElementById('achievements');
    const scene = document.getElementById('achievementsScene');
    if (!section || !scene) return;

    const milestones = document.querySelectorAll('.milestone');
    
    // Set static Y positions (depth inside the 3D scene)
    milestones.forEach(m => {
        const z = parseInt(m.dataset.z || '0');
        m.style.bottom = `${z}px`;
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = section.getBoundingClientRect();
                const winH = window.innerHeight;
                
                let progress = 0;
                // Calculate how far we've scrolled inside the sticky container bounds
                if (rect.top <= winH && rect.bottom >= 0) {
                    // Only calculate when section is reached
                    // rect.top is 0 when it reaches top, gets negative as we scroll down
                    const scrolled = Math.max(0, -rect.top);
                    const maxScroll = rect.height - winH;
                    if (maxScroll > 0) {
                        progress = Math.max(0, Math.min(1, scrolled / maxScroll));
                    }
                }

                // Scene translate moves the track downward, simulating moving forward
                const trackLength = 10000;
                const currentZ = progress * trackLength;
                scene.style.transform = `rotateX(75deg) translateY(${currentZ}px)`;

                // Compute which milestones to show based on camera proximity
                milestones.forEach(m => {
                    const z = parseInt(m.dataset.z || '0');
                    const distance = z - currentZ;
                    
                    // Activate if it is nearby (-200px passed to 1800px ahead)
                    if (distance > -200 && distance < 1800) {
                        m.classList.add('active');
                        m.style.opacity = '1';
                    } else if (distance >= 1800 && distance < 4000) {
                        m.classList.remove('active');
                        m.style.opacity = '0.3';
                    } else {
                        m.classList.remove('active');
                        m.style.opacity = '0';
                    }
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Trigger a calculation
    window.dispatchEvent(new Event('scroll'));
}

// ================================
// Achievement Popup Modal
// ================================
function initAchievementModal() {
    const modal = document.getElementById('achievementModal');
    if (!modal) return;
    
    const closeBtn = document.getElementById('achievementModalClose');
    const modalYear = document.getElementById('achievementModalYear');
    const modalIcon = document.getElementById('achievementModalIcon');
    const modalTitle = document.getElementById('achievementModalTitle');
    const modalDesc = document.getElementById('achievementModalDesc');

    // Add click listeners to all achievement cards
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('click', () => {
            // Only allow opening if it's the active milestone (pointer-events handles this via CSS mostly, but good to be safe)
            if (!card.closest('.milestone').classList.contains('active')) return;

            // Extract data from card
            const year = card.querySelector('.achievement-year').textContent;
            const iconHtml = card.querySelector('.achievement-icon').innerHTML;
            const titleHtml = card.querySelector('h3').innerHTML;
            const descHtml = card.querySelector('p').innerHTML;

            // Populate modal
            modalYear.textContent = year;
            modalIcon.innerHTML = iconHtml;
            modalTitle.innerHTML = titleHtml;
            modalDesc.innerHTML = `<p>${descHtml}</p>`;

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close handlers
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

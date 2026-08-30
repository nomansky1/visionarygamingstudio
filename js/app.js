/* ==========================================================================
   VISIONARY GAMING STUDIO — OFFICIAL JAVASCRIPT LOGIC
   Architect & Developer: Nelson Rios Perez
   Features: 3D Voxel Hero Engine, 4K Video Trailer Modal,
             Video Thumbnail Switcher, Screenshot Lightbox, Game Demo Launcher,
             Scroll Spy, Smooth Scroll & VIP Alpha Registration Form
   ========================================================================== */

import { initFullSite3DVoxelLogo } from './hero_3d_logo.js';
import { initGlobalVoxelBackground } from './global_voxel_bg.js';
import { initTransparentVideoPlayer } from './transparent_video_player.js';

document.addEventListener('DOMContentLoaded', () => {

    // === 0A. INITIALIZE FULL-WEBSITE 3D VOXEL COSMOS BACKGROUND (VOXKART THEME COLORS) ===
    try {
        initGlobalVoxelBackground('global-voxel-canvas');
    } catch (err) {
        console.warn('Global 3D Voxel Background Engine initialization:', err);
    }

    // === 0B. INITIALIZE STATIONARY 3D CELESTIAL VOXEL EMBLEM BANNER ===
    try {
        initFullSite3DVoxelLogo('hero-3d-banner-viewport');
    } catch (err) {
        console.warn('3D Voxel Banner Engine initialization:', err);
    }

    // === 0C. INITIALIZE 100% TRANSPARENT 3D VOXKART ANIMATED LOGO GPU BLEND ===
    try {
        initTransparentVideoPlayer('voxkart-3d-logo-canvas', 'assets/videos/voxkart_logo_3d_loop_muted.mp4');
    } catch (err) {
        console.warn('Transparent Video Player initialization:', err);
    }

    /* ==========================================================================
       1. AMBIENT VOXEL / PARTICLE MATRIX BACKGROUND CANVAS (IF PRESENT)
       ========================================================================== */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(width > 768 ? 60 : 25, 75);
        const mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class VoxelParticle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3.5 + 2;
                this.density = Math.random() * 20 + 5;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.color = Math.random() > 0.4 ? 'rgba(0, 247, 255, ' : 'rgba(192, 68, 255, ';
                this.alpha = Math.random() * 0.4 + 0.2;
                this.isCube = Math.random() > 0.5;
            }

            draw() {
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.shadowBlur = 6;
                ctx.shadowColor = this.color + '0.8)';

                if (this.isCube) {
                    ctx.fillRect(this.x, this.y, this.size * 1.4, this.size * 1.4);
                } else {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.shadowBlur = 0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const fx = (dx / dist) * force * this.density;
                        const fy = (dy / dist) * force * this.density;
                        this.x -= fx * 0.08;
                        this.y -= fy * 0.08;
                    }
                }
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new VoxelParticle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 110) {
                        const lineAlpha = (1 - dist / 110) * 0.12;
                        ctx.strokeStyle = `rgba(0, 247, 255, ${lineAlpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    /* ==========================================================================
       2. 4K VIDEO TRAILER MODAL & YOUTUBE SHOWCASE CONTROLLER
       ========================================================================== */
    const videoModal = document.getElementById('video-modal');
    const youtubePlayer = document.getElementById('trailer-youtube-player');
    const btnCloseVideo = document.getElementById('btn-close-video');
    const videoModalBackdrop = document.getElementById('video-modal-backdrop');
    const flagshipInlineVideo = document.getElementById('flagship-inline-video');

    let currentYouTubeId = 'HfrzjO09BY0'; // Default: Official VoxKart Trailer

    const trailerTriggers = [
        document.getElementById('btn-header-trailer'),
        document.getElementById('btn-mobile-trailer'),
        document.getElementById('btn-showcase-trailer'),
        document.getElementById('video-card-trigger'),
        document.getElementById('btn-hero-trailer')
    ];

    function openVideoModal(videoId = currentYouTubeId) {
        if (videoModal) {
            videoModal.classList.add('active');
            videoModal.setAttribute('aria-hidden', 'false');
            if (youtubePlayer) {
                youtubePlayer.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
            }
        }
    }

    function closeVideoModal() {
        if (videoModal) {
            videoModal.classList.remove('active');
            videoModal.setAttribute('aria-hidden', 'true');
            if (youtubePlayer) {
                youtubePlayer.src = '';
            }
        }
    }

    trailerTriggers.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openVideoModal(currentYouTubeId);
            });
        }
    });

    if (btnCloseVideo) btnCloseVideo.addEventListener('click', closeVideoModal);
    if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);

    // Video Thumbnail Strip Switcher (Loads YouTube Videos)
    const thumbItems = document.querySelectorAll('.video-thumbnails-strip .thumb-item');
    thumbItems.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            thumbItems.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            
            const ytId = thumb.dataset.youtubeId;
            if (ytId) {
                currentYouTubeId = ytId;
            }

            const posterSrc = thumb.dataset.poster;
            if (flagshipInlineVideo && posterSrc) {
                flagshipInlineVideo.poster = posterSrc;
            }

            // Open modal to play selected YouTube video directly
            openVideoModal(currentYouTubeId);
        });
    });


    /* ==========================================================================
       3. PLAYABLE WEBGL GAME MODAL LAUNCHER
       ========================================================================== */
    const gameModal = document.getElementById('game-modal');
    const gameIframe = document.getElementById('game-iframe');
    const btnCloseGameModal = document.getElementById('btn-close-game-modal');
    const btnFullscreenGame = document.getElementById('btn-fullscreen-game');
    const gameModalBackdrop = document.getElementById('game-modal-backdrop');

    const gameLaunchTriggers = [
        document.getElementById('btn-hero-play'),
        document.getElementById('btn-showcase-launch'),
        document.getElementById('footer-play-game-link')
    ];

    function openGameModal() {
        if (gameModal) {
            gameModal.classList.add('active');
            gameModal.setAttribute('aria-hidden', 'false');
            if (gameIframe && !gameIframe.src) {
                gameIframe.src = '../index.html';
            }
        }
    }

    function closeGameModal() {
        if (gameModal) {
            gameModal.classList.remove('active');
            gameModal.setAttribute('aria-hidden', 'true');
            if (gameIframe) {
                gameIframe.src = '';
            }
        }
    }

    gameLaunchTriggers.forEach((trigger) => {
        if (trigger) trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openGameModal();
        });
    });

    if (btnCloseGameModal) btnCloseGameModal.addEventListener('click', closeGameModal);
    if (gameModalBackdrop) gameModalBackdrop.addEventListener('click', closeGameModal);

    if (btnFullscreenGame) {
        btnFullscreenGame.addEventListener('click', () => {
            const win = gameModal ? gameModal.querySelector('.game-modal-window') : null;
            if (win) {
                if (!document.fullscreenElement) {
                    win.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
                } else {
                    document.exitFullscreen().catch(err => console.log('Exit fullscreen error:', err));
                }
            }
        });
    }


    /* ==========================================================================
       4. 4K SCREENSHOT LIGHTBOX GALLERY
       ========================================================================== */
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');

    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryCards.forEach((card) => {
        card.addEventListener('click', () => {
            const fullSrc = card.dataset.full;
            const title = card.dataset.title;
            const desc = card.dataset.desc;

            if (lightboxImg) lightboxImg.src = fullSrc;
            if (lightboxTitle) lightboxTitle.textContent = title || '';
            if (lightboxDesc) lightboxDesc.textContent = desc || '';

            if (lightboxModal) {
                lightboxModal.classList.add('active');
                lightboxModal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    // Global ESC key to close any active modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGameModal();
            closeVideoModal();
            closeLightbox();
        }
    });


    /* ==========================================================================
       5. MOBILE MENU & NAVIGATION SCROLL SPY
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
        });

        mobileNavItems.forEach((item) => {
            item.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
            });
        });
    }

    // Back to top button & Scroll Spy
    const backToTopBtn = document.getElementById('btn-back-to-top');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.desktop-nav .nav-item');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollY > 400);
        }

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 130;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach((item) => {
                    item.classList.toggle('active', item.getAttribute('href') === `#${sectionId}`);
                });
            }
        });
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* ==========================================================================
       6. VIP ALPHA SIGN-UP & DEVLOG FORM HANDLER
       ========================================================================== */
    const signupForm = document.getElementById('beta-signup-form');
    const signupSuccessMsg = document.getElementById('signup-success-msg');
    const btnSubmitSignup = document.getElementById('btn-submit-signup');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (btnSubmitSignup) {
                btnSubmitSignup.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING PILOT CREDENTIALS...';
                btnSubmitSignup.disabled = true;
            }

            setTimeout(() => {
                if (btnSubmitSignup) {
                    btnSubmitSignup.style.display = 'none';
                }
                signupForm.reset();
                if (signupSuccessMsg) {
                    signupSuccessMsg.style.display = 'flex';
                }
            }, 900);
        });
    }


    /* ==========================================================================
       7. SMOOTH SCROLLING FOR LOCAL ANCHOR LINKS
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                if (mobileDrawer && mobileDrawer.classList.contains('open')) {
                    mobileDrawer.classList.remove('open');
                }
            }
        });
    });

});

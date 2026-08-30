/* ==========================================================================
   VISIONARY GAMING STUDIO — 3D CELESTIAL VOXEL EMBLEM BANNER ENGINE
   Features: Stationary 20,000+ Voxel Celestial Logo Emblem (No Auto-Spin),
             Zoomed Out Full-Framing for Complete Typography Legibility,
             Ultra Low-Glare Epilepsy-Safe UnrealBloomPass (Toned-Down Glare),
             Gentle Perspective Tilt Following Mouse Cursor,
             Subtle Cosmic Nebula Stardust Vortex & Seamless Background Blend
   ========================================================================== */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function initFullSite3DVoxelLogo(containerId = 'hero-3d-banner-viewport') {
    let container = document.getElementById(containerId);
    
    // Fallback search if container id varies
    if (!container) {
        container = document.getElementById('hero-voxel-banner') || 
                    document.getElementById('fullsite-3d-voxel-viewport') ||
                    document.querySelector('.hero-voxel-banner');
    }

    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'hero-3d-banner-viewport';
        const heroSection = document.getElementById('hero') || document.body;
        heroSection.prepend(container);
    }

    // Measure container dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || Math.max(window.innerHeight * 0.72, 540);

    // === 1. Scene & Camera Setup (ZOOMED OUT FOR COMPLETE LEGIBILITY) ===
    const scene = new THREE.Scene();
    scene.background = null; // Transparent to blend seamlessly with background
    scene.fog = new THREE.FogExp2(0x04060f, 0.018);

    // Zoomed out camera with 42 FOV and Z = 9.8 ensures entire emblem + text is fully visible and legible
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, -0.05, 9.8);

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true, 
        powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.10;
    renderer.setClearColor(0x000000, 0); // Full transparency
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // === 2. TONED DOWN BLOOM (LOW OPACITY, ZERO GLARE, MAXIMUM LEGIBILITY) ===
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.18,  // Subdued, gentle bloom strength (eliminates blinding glare)
        0.30,  // Soft radius
        0.92   // High threshold keeps typography sharp and clear
    );
    composer.addPass(bloomPass);

    // === 3. Steady Ambient & Studio Lighting (Soft & Balanced) ===
    const ambient = new THREE.AmbientLight(0x322d48, 1.8);
    scene.add(ambient);

    const whiteKeyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    whiteKeyLight.position.set(0, 6, 8);
    scene.add(whiteKeyLight);

    const violetLight = new THREE.PointLight(0xa855f7, 2.2, 26);
    violetLight.position.set(-5.0, 2.0, 5.0);
    scene.add(violetLight);

    const cyanLight = new THREE.PointLight(0x00f7ff, 2.2, 26);
    cyanLight.position.set(5.0, 1.0, 5.0);
    scene.add(cyanLight);

    const coreLight = new THREE.PointLight(0xffffff, 1.8, 12);
    coreLight.position.set(0, 0.08, 2.0);
    scene.add(coreLight);

    // Subtle Cursor Follow Spotlight
    const mouseSpot = new THREE.PointLight(0xc084fc, 1.5, 14);
    mouseSpot.position.set(0, 0, 4);
    scene.add(mouseSpot);

    // === 4. Main 3D Logo Group (STATIONARY — NO AUTO-SPIN) ===
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // === 5. SLOW SWIRLING COSMIC NEBULA VORTEX ===
    const nebulaGroup = new THREE.Group();
    nebulaGroup.position.set(0, 0, -0.35);
    logoGroup.add(nebulaGroup);

    function createNebulaCloud(colorHex, size, count, radiusX, radiusY) {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.sqrt(Math.random()) * radiusX;
            positions[i * 3] = Math.cos(angle) * dist;
            positions[i * 3 + 1] = Math.sin(angle) * dist * (radiusY / radiusX);
            positions[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: colorHex,
            size: size,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        return new THREE.Points(geo, mat);
    }

    const violetNebula = createNebulaCloud(0xa855f7, 0.10, 220, 3.8, 2.8);
    violetNebula.position.set(-1.0, 0.2, 0);
    nebulaGroup.add(violetNebula);

    const cyanNebula = createNebulaCloud(0x00f7ff, 0.10, 220, 3.8, 2.8);
    cyanNebula.position.set(1.0, 0.2, 0);
    nebulaGroup.add(cyanNebula);

    // Constellation Orbit Ring
    const constellRingGeo = new THREE.RingGeometry(2.85, 2.87, 64);
    const constellRingMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.20,
        side: THREE.DoubleSide
    });
    const constellRing = new THREE.Mesh(constellRingGeo, constellRingMat);
    nebulaGroup.add(constellRing);

    for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const nodeGeo = new THREE.SphereGeometry(0.026, 8, 8);
        const nodeMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xa855f7 : 0x00f7ff
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(Math.cos(angle) * 2.86, Math.sin(angle) * 2.86, 0.02);
        nebulaGroup.add(node);
    }

    // === 6. LOAD CELESTIAL VOXEL EMBLEM (FRAME-0 INSTANT FALLBACK + 20,000+ HD SWAP) ===
    let voxelMesh = null;
    let initialPositions = [];
    let currentPositions = [];
    let velocities = [];
    let explosionFactors = [];
    let voxelCount = 0;

    let targetExplode = 0;
    let explodeProgress = 0;

    function buildInstantCelestialEmblem() {
        const count = 4200;
        const voxelGeo = new THREE.BoxGeometry(0.048, 0.048, 0.048);
        const voxelMat = new THREE.MeshStandardMaterial({
            metalness: 0.75,
            roughness: 0.32,
            emissive: 0x080814,
            emissiveIntensity: 0.12
        });
        voxelMesh = new THREE.InstancedMesh(voxelGeo, voxelMat, count);
        const dummy = new THREE.Object3D();
        const color = new THREE.Color();

        initialPositions = [];
        currentPositions = [];
        velocities = [];
        explosionFactors = [];

        // Build glowing celestial iris and wings
        for (let i = 0; i < count; i++) {
            let x, y, z;
            if (i < 1800) {
                // Outer celestial eye ellipse
                const t = (i / 1800) * Math.PI * 2;
                const r = 2.0 + Math.sin(t * 4) * 0.15 + (Math.random() - 0.5) * 0.35;
                x = Math.cos(t) * r * 1.3;
                y = Math.sin(t) * r * 0.65;
                z = (Math.random() - 0.5) * 0.35;
                color.setHSL(0.55 + Math.random() * 0.25, 0.95, 0.55);
            } else if (i < 3000) {
                // Inner iris core ring
                const t = ((i - 1800) / 1200) * Math.PI * 2;
                const r = 0.9 + (Math.random() - 0.5) * 0.25;
                x = Math.cos(t) * r;
                y = Math.sin(t) * r;
                z = 0.1 + (Math.random() - 0.5) * 0.25;
                color.setHSL(0.78 + Math.random() * 0.15, 0.95, 0.65);
            } else {
                // Outer radiant starlight rays
                const angle = Math.random() * Math.PI * 2;
                const r = 2.2 + Math.random() * 1.6;
                x = Math.cos(angle) * r;
                y = Math.sin(angle) * r * 0.6;
                z = (Math.random() - 0.5) * 0.5;
                color.setHSL(0.5 + Math.random() * 0.45, 0.9, 0.6);
            }

            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            voxelMesh.setMatrixAt(i, dummy.matrix);
            voxelMesh.setColorAt(i, color);

            initialPositions.push(new THREE.Vector3(x, y, z));
            currentPositions.push(new THREE.Vector3(x, y, z));
            velocities.push(new THREE.Vector3(0, 0, 0));
            explosionFactors.push(new THREE.Vector3(x * 1.6, y * 1.6, z * 2.5 + (Math.random() - 0.5) * 2));
        }

        voxelMesh.instanceMatrix.needsUpdate = true;
        if (voxelMesh.instanceColor) voxelMesh.instanceColor.needsUpdate = true;
        logoGroup.add(voxelMesh);
        voxelCount = count;
    }

    // Render immediately on frame 0
    buildInstantCelestialEmblem();

    // Fetch 20,000+ HD Voxels and upgrade seamlessly
    fetch('assets/images/celestial_voxels_hd.json')
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) return;
            
            if (voxelMesh) {
                logoGroup.remove(voxelMesh);
                voxelMesh.geometry.dispose();
                voxelMesh.material.dispose();
            }

            const hdCount = data.length;
            const voxelGeo = new THREE.BoxGeometry(0.042, 0.042, 0.042);
            const voxelMat = new THREE.MeshStandardMaterial({
                metalness: 0.70,
                roughness: 0.35,
                emissive: 0x080812,
                emissiveIntensity: 0.10
            });

            voxelMesh = new THREE.InstancedMesh(voxelGeo, voxelMat, hdCount);
            voxelMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

            const dummy = new THREE.Object3D();
            const color = new THREE.Color();

            initialPositions = [];
            currentPositions = [];
            velocities = [];
            explosionFactors = [];

            for (let i = 0; i < hdCount; i++) {
                const [x, y, z, r, g, b] = data[i];

                dummy.position.set(x, y, z);
                dummy.updateMatrix();
                voxelMesh.setMatrixAt(i, dummy.matrix);

                color.setRGB(r / 255, g / 255, b / 255);
                voxelMesh.setColorAt(i, color);

                initialPositions.push(new THREE.Vector3(x, y, z));
                currentPositions.push(new THREE.Vector3(x, y, z));
                velocities.push(new THREE.Vector3(0, 0, 0));
                
                const expDir = new THREE.Vector3(
                    x * 1.5 + (Math.random() - 0.5) * 2.2,
                    y * 1.5 + (Math.random() - 0.5) * 2.2,
                    z * 2.8 + (Math.random() - 0.5) * 2.8
                );
                explosionFactors.push(expDir);
            }

            voxelMesh.instanceMatrix.needsUpdate = true;
            if (voxelMesh.instanceColor) voxelMesh.instanceColor.needsUpdate = true;

            logoGroup.add(voxelMesh);
            voxelCount = hdCount;
        })
        .catch(err => {
            console.log('Using instant fallback celestial emblem:', err);
        });

    // === 7. SMOOTH MOUSE PERSPECTIVE TRACKING (CALM, GENTLE TILT) ===
    let mouseWorld = new THREE.Vector3(999, 999, 0);
    let isMouseOver = false;
    let targetTiltX = 0;
    let targetTiltY = 0;

    function onMouseMove(e) {
        isMouseOver = true;
        const rect = container.getBoundingClientRect();
        const w = rect.width || window.innerWidth;
        const h = rect.height || window.innerHeight;
        
        const normX = ((e.clientX - rect.left) - w / 2) / (w / 2);
        const normY = ((e.clientY - rect.top) - h / 2) / (h / 2);

        const aspect = w / (h || 1);
        mouseWorld.x = Math.max(-5, Math.min(5, normX * aspect * 3.8));
        mouseWorld.y = Math.max(-4, Math.min(4, -normY * 2.6));
        mouseWorld.z = 0.6;

        // Subtle perspective tilt (keeps emblem stable and stationary)
        targetTiltY = normX * 0.10;
        targetTiltX = -normY * 0.08;

        mouseSpot.position.x = mouseWorld.x * 1.1;
        mouseSpot.position.y = mouseWorld.y * 1.1;
    }

    function onMouseLeave() {
        isMouseOver = false;
        targetTiltX = 0;
        targetTiltY = 0;
        mouseWorld.set(999, 999, 0);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave);

    // Click on banner to toggle Zero-G Explosion & Reassemble
    function toggleExplode() {
        targetExplode = targetExplode === 0 ? 1 : 0;
    }
    container.addEventListener('click', toggleExplode);

    // === 8. MAIN ANIMATION LOOP ===
    const clock = new THREE.Clock();
    let animId = null;
    const dummy = new THREE.Object3D();

    function renderLoop() {
        animId = requestAnimationFrame(renderLoop);
        const delta = Math.min(clock.getDelta(), 0.05);
        const time = clock.getElapsedTime();

        // 1. Smooth Gentle Breathing (STATIONARY — No continuous spin)
        logoGroup.position.y = Math.sin(time * 0.55) * 0.03;
        logoGroup.rotation.x += (targetTiltX - logoGroup.rotation.x) * 0.04;
        logoGroup.rotation.y += (targetTiltY - logoGroup.rotation.y) * 0.04;

        // 2. Slow Cosmic Nebula Drift
        nebulaGroup.rotation.z = time * 0.02;

        // 3. Update 20,000+ Celestial Voxel InstancedMesh
        if (voxelMesh && voxelCount > 0) {
            explodeProgress += (targetExplode - explodeProgress) * 0.05;

            for (let i = 0; i < voxelCount; i++) {
                const init = initialPositions[i];
                const cur = currentPositions[i];
                const vel = velocities[i];
                const exp = explosionFactors[i];

                if (explodeProgress < 0.01) {
                    // Normal state with subtle organic return
                    vel.x += (init.x - cur.x) * 0.04;
                    vel.y += (init.y - cur.y) * 0.04;
                    vel.z += (init.z - cur.z) * 0.04;

                    vel.multiplyScalar(0.90);
                    cur.add(vel);

                    dummy.position.copy(cur);
                    dummy.rotation.set(vel.y * 0.5, vel.x * 0.5, 0);
                } else {
                    // Zero-G Explosion lerp
                    const targetX = init.x + exp.x * explodeProgress;
                    const targetY = init.y + exp.y * explodeProgress;
                    const targetZ = init.z + exp.z * explodeProgress;

                    cur.x += (targetX - cur.x) * 0.07;
                    cur.y += (targetY - cur.y) * 0.07;
                    cur.z += (targetZ - cur.z) * 0.07;

                    dummy.position.copy(cur);
                    dummy.rotation.set(exp.x * explodeProgress * 1.0, exp.y * explodeProgress * 1.0, 0);
                }

                dummy.updateMatrix();
                voxelMesh.setMatrixAt(i, dummy.matrix);
            }
            voxelMesh.instanceMatrix.needsUpdate = true;
        }

        composer.render();
    }
    renderLoop();

    // Window Resize Handling
    function handleResize() {
        width = container.clientWidth || window.innerWidth;
        height = container.clientHeight || Math.max(window.innerHeight * 0.72, 540);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    return {
        toggleExplode,
        destroy: () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseLeave);
            container.removeEventListener('click', toggleExplode);
            renderer.dispose();
        }
    };
}

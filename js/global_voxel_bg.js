/* ==========================================================================
   VISIONARY GAMING STUDIO — GLOBAL 3D VOXEL COSMOS BACKGROUND ENGINE
   Game Color Theme: VoxKart Combat Circuit Racing Palette
   Colors: Neon Circuit Cyan (0x00e5ff), Sunset Racing Orange (0xff6600),
           Cyber Gold / Speed Yellow (0xffcc00), Hot Nitro Coral (0xff2a6d),
           Checkered Flag Diamond White (0xffffff)
   Features: Full-Site 3D Voxel Field spanning all sections (Hero to Footer),
             Sleek 3D Voxel Cubes in varied sizes (0.12 to 0.65),
             Slow Hypnotic Harmonic Floating, Calm Parallax & Zero Twitch
   ========================================================================== */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function initGlobalVoxelBackground(canvasId = 'global-voxel-canvas') {
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        canvas.style.opacity = '0.95';
        document.body.prepend(canvas);
    }

    // === 1. Scene & Camera ===
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060f, 0.007);

    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 160);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // === 2. Low-Glare UnrealBloomPass ===
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.42,  // Gentle bloom strength
        0.35,  // Radius
        0.88   // High threshold avoids harsh flares
    );
    composer.addPass(bloomPass);

    // === 3. VoxKart Color Key Lighting ===
    const ambient = new THREE.AmbientLight(0x221c33, 2.4);
    scene.add(ambient);

    // Cyan Neon Light (from racetrack)
    const cyanLight = new THREE.PointLight(0x00e5ff, 3.8, 70);
    cyanLight.position.set(-15, 15, 12);
    scene.add(cyanLight);

    // Sunset Orange Light (from combat banner)
    const orangeLight = new THREE.PointLight(0xff6600, 3.8, 70);
    orangeLight.position.set(15, -15, 12);
    scene.add(orangeLight);

    // Gold Sparkle Key Light
    const goldLight = new THREE.PointLight(0xffcc00, 2.5, 50);
    goldLight.position.set(0, 25, 8);
    scene.add(goldLight);

    // === 4. VOXKART COLOR-THEMED 3D VOXEL CUBES ===
    const voxkartPalette = [
        { name: 'Circuit Cyan', hex: 0x00e5ff, emissive: 0x00e5ff },
        { name: 'Sunset Orange', hex: 0xff6600, emissive: 0xff6600 },
        { name: 'Speed Gold',    hex: 0xffcc00, emissive: 0xffcc00 },
        { name: 'Nitro Coral',   hex: 0xff2a6d, emissive: 0xff2a6d },
        { name: 'Azure Blue',    hex: 0x0099ff, emissive: 0x0099ff },
        { name: 'Diamond White', hex: 0xffffff, emissive: 0xdde8ff }
    ];

    const voxelSizes = [0.12, 0.18, 0.26, 0.38, 0.52, 0.68];
    const totalVoxels = 750;

    // Cache Geometries
    const geoMap = {};
    voxelSizes.forEach(s => {
        geoMap[s] = new THREE.BoxGeometry(s, s, s);
    });

    // Cache Materials with self-emissive lighting matching the VoxKart video theme
    const matMap = {};
    voxkartPalette.forEach(c => {
        matMap[c.hex] = new THREE.MeshStandardMaterial({
            color: c.hex,
            emissive: c.emissive,
            emissiveIntensity: 0.68,
            metalness: 0.85,
            roughness: 0.20
        });
    });

    const activeVoxelObjects = [];
    const dummy = new THREE.Object3D();

    const combinations = [];
    voxelSizes.forEach(size => {
        voxkartPalette.forEach(col => {
            combinations.push({ size, col });
        });
    });

    const countPerCombo = Math.max(1, Math.floor(totalVoxels / combinations.length));

    combinations.forEach(combo => {
        const iMesh = new THREE.InstancedMesh(geoMap[combo.size], matMap[combo.col.hex], countPerCombo);
        iMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        const items = [];

        for (let i = 0; i < countPerCombo; i++) {
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 125; // Spans entire document height
            const z = (Math.random() - 0.5) * 22 - 2;

            const baseRotX = Math.random() * Math.PI * 2;
            const baseRotY = Math.random() * Math.PI * 2;
            const baseRotZ = Math.random() * Math.PI * 2;

            // Very slow, calm rotation
            const rotSpeedX = (Math.random() - 0.5) * 0.005;
            const rotSpeedY = (Math.random() - 0.5) * 0.005;
            const rotSpeedZ = (Math.random() - 0.5) * 0.003;

            // Calm harmonic floating parameters
            const floatSpeed = 0.12 + Math.random() * 0.18;
            const floatAmp = 0.18 + Math.random() * 0.35;
            const floatOffset = Math.random() * Math.PI * 2;

            items.push({
                x, y, z,
                rotX: baseRotX,
                rotY: baseRotY,
                rotZ: baseRotZ,
                rotSpeedX,
                rotSpeedY,
                rotSpeedZ,
                floatSpeed,
                floatAmp,
                floatOffset
            });

            dummy.position.set(x, y, z);
            dummy.rotation.set(baseRotX, baseRotY, baseRotZ);
            dummy.updateMatrix();
            iMesh.setMatrixAt(i, dummy.matrix);
        }

        iMesh.instanceMatrix.needsUpdate = true;
        scene.add(iMesh);

        activeVoxelObjects.push({
            mesh: iMesh,
            items: items,
            count: countPerCombo
        });
    });

    // === 5. Subtle Starlight Dust in VoxKart Colors ===
    const starCount = 850;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 48;
        starPos[i + 1] = (Math.random() - 0.5) * 135;
        starPos[i + 2] = (Math.random() - 0.5) * 26 - 4;

        const rand = Math.random();
        if (rand < 0.35) {
            // Circuit Cyan
            starColors[i] = 0.0; starColors[i + 1] = 0.90; starColors[i + 2] = 1.0;
        } else if (rand < 0.65) {
            // Sunset Orange
            starColors[i] = 1.0; starColors[i + 1] = 0.40; starColors[i + 2] = 0.0;
        } else if (rand < 0.85) {
            // Speed Gold
            starColors[i] = 1.0; starColors[i + 1] = 0.80; starColors[i + 2] = 0.0;
        } else {
            // Diamond White
            starColors[i] = 0.95; starColors[i + 1] = 0.95; starColors[i + 2] = 1.0;
        }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // === 6. SMOOTH, CALM MOUSE & SCROLL PARALLAX INTERPOLATION ===
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    function onMouseMove(e) {
        const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        targetMouseX = normX * 1.0;
        targetMouseY = -normY * 0.7;
    }

    function onScroll() {
        const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        const scrollFraction = window.scrollY / maxScroll;
        targetScrollY = scrollFraction * 75;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // === 7. CALM ANIMATION LOOP ===
    const clock = new THREE.Clock();
    let animId = null;

    function animate() {
        animId = requestAnimationFrame(animate);
        const delta = Math.min(clock.getDelta(), 0.05);
        const time = clock.getElapsedTime();

        // 1. Smooth, Gentle Camera Parallax
        currentMouseX += (targetMouseX - currentMouseX) * 0.020;
        currentMouseY += (targetMouseY - currentMouseY) * 0.020;
        currentScrollY += (targetScrollY - currentScrollY) * 0.035;

        camera.position.x = currentMouseX;
        camera.position.y = -currentScrollY + currentMouseY;
        camera.lookAt(currentMouseX * 0.25, -currentScrollY + currentMouseY * 0.25, 0);

        // 2. Slow Starlight Drift
        starField.rotation.y = time * 0.005;

        // 3. Update Voxels with calm harmonic floating
        for (let g = 0; g < activeVoxelObjects.length; g++) {
            const group = activeVoxelObjects[g];
            const iMesh = group.mesh;
            const items = group.items;

            for (let i = 0; i < group.count; i++) {
                const item = items[i];

                item.rotX += item.rotSpeedX;
                item.rotY += item.rotSpeedY;
                item.rotZ += item.rotSpeedZ;

                const floatY = item.y + Math.sin(time * item.floatSpeed + item.floatOffset) * item.floatAmp;

                dummy.position.set(item.x, floatY, item.z);
                dummy.rotation.set(item.rotX, item.rotY, item.rotZ);
                dummy.updateMatrix();

                iMesh.setMatrixAt(i, dummy.matrix);
            }
            iMesh.instanceMatrix.needsUpdate = true;
        }

        composer.render();
    }
    animate();

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    return {
        destroy: () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            renderer.dispose();
        }
    };
}

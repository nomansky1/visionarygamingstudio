/* ==========================================================================
   VISIONARY GAMING STUDIO — REAL-TIME WEBGL TRANSPARENT VIDEO ENGINE
   Purpose: Removes 100% of black background from animated 3D video loops
            via GPU Luminance / Chroma-Keying Fragment Shader.
            Preserves exact 16:9 native video aspect ratio with ZERO stretching.
            Renders large, perfectly centered, silky smooth feathered transparency.
   ========================================================================== */

export function initTransparentVideoPlayer(canvasId = 'voxkart-3d-logo-canvas', videoSrc = 'assets/videos/voxkart_logo_3d_loop_muted.mp4') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    // Create hidden background video element
    let video = document.getElementById('voxkart-3d-logo-video-source');
    if (!video) {
        video = document.createElement('video');
        video.id = 'voxkart-3d-logo-video-source';
        video.src = videoSrc;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.style.display = 'none';
        document.body.appendChild(video);
    }

    video.play().catch(() => {
        document.addEventListener('click', () => video.play(), { once: true });
        document.addEventListener('touchstart', () => video.play(), { once: true });
    });

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
               canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });

    if (!gl) {
        return init2DTransparentFallback(canvas, video);
    }

    // === WebGL Shaders with Aspect Ratio Compensation (Zero Stretching) ===
    const vsSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        uniform vec2 u_scale;
        varying vec2 v_texCoord;
        void main() {
            // Apply scale uniform to ensure 100% unstretched centered aspect ratio
            gl_Position = vec4(a_position * u_scale, 0.0, 1.0);
            v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y); // Flip Y for WebGL texture
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform sampler2D u_image;
        varying vec2 v_texCoord;
        void main() {
            vec4 color = texture2D(u_image, v_texCoord);
            
            // Calculate maximum color channel for luminance key
            float maxC = max(color.r, max(color.g, color.b));
            
            // Smooth alpha falloff completely eliminates any black borders
            float alpha = smoothstep(0.04, 0.16, maxC);
            
            // Enhance vibrance
            vec3 rgb = color.rgb * 1.15;
            
            gl_FragColor = vec4(rgb, alpha);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('Program link error:', gl.getProgramInfoLog(program));
        return init2DTransparentFallback(canvas, video);
    }

    gl.useProgram(program);

    // Quad geometry
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const uScaleLocation = gl.getUniformLocation(program, 'u_scale');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let animId = null;

    function resizeCanvas() {
        const displayWidth = canvas.clientWidth || 1100;
        const displayHeight = canvas.clientHeight || 480;
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }

    function render() {
        animId = requestAnimationFrame(render);
        resizeCanvas();

        if (video.readyState >= video.HAVE_CURRENT_DATA) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
            
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Compute exact 16:9 native aspect ratio containment (ZERO STRETCHING)
            const videoAspect = (video.videoWidth > 0 && video.videoHeight > 0) ? (video.videoWidth / video.videoHeight) : (16.0 / 9.0);
            const canvasAspect = (canvas.width || 1) / (canvas.height || 1);

            let scaleX = 1.0;
            let scaleY = 1.0;

            if (canvasAspect > videoAspect) {
                // Canvas is wider than 16:9 video -> fit height, pillarbox width
                scaleX = videoAspect / canvasAspect;
                scaleY = 1.0;
            } else {
                // Canvas is taller than 16:9 video -> fit width, letterbox height
                scaleX = 1.0;
                scaleY = canvasAspect / videoAspect;
            }

            gl.uniform2f(uScaleLocation, scaleX, scaleY);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }

    render();
    window.addEventListener('resize', resizeCanvas);

    return {
        destroy: () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resizeCanvas);
            video.pause();
        }
    };
}

// 2D Canvas Fallback (With Aspect-Ratio Preservation)
function init2DTransparentFallback(canvas, video) {
    const ctx = canvas.getContext('2d');
    let animId = null;

    function render2D() {
        animId = requestAnimationFrame(render2D);
        const w = (canvas.width = canvas.clientWidth || 1100);
        const h = (canvas.height = canvas.clientHeight || 480);

        if (video.readyState >= video.HAVE_CURRENT_DATA) {
            ctx.clearRect(0, 0, w, h);

            const vW = video.videoWidth || 1280;
            const vH = video.videoHeight || 720;
            const videoAspect = vW / vH;
            const canvasAspect = w / h;

            let drawW, drawH, drawX, drawY;
            if (canvasAspect > videoAspect) {
                drawH = h;
                drawW = h * videoAspect;
                drawX = (w - drawW) / 2;
                drawY = 0;
            } else {
                drawW = w;
                drawH = w / videoAspect;
                drawX = 0;
                drawY = (h - drawH) / 2;
            }

            ctx.drawImage(video, drawX, drawY, drawW, drawH);

            const frame = ctx.getImageData(0, 0, w, h);
            const d = frame.data;
            for (let i = 0; i < d.length; i += 4) {
                const maxC = Math.max(d[i], d[i + 1], d[i + 2]);
                if (maxC < 35) {
                    d[i + 3] = (maxC / 35) * d[i + 3];
                }
            }
            ctx.putImageData(frame, 0, 0);
        }
    }
    render2D();

    return {
        destroy: () => cancelAnimationFrame(animId)
    };
}

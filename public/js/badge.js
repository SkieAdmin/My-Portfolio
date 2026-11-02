/* =====================================================================
   SKIE — STUDIO CV · the 3D badge
   An ID card hanging from a satin lanyard. The lanyard is a verlet rope,
   the card hangs from its last point, and both faces are drawn on canvas.
   The card is sized and placed to match #badgeSlot, so CSS owns layout.
   ===================================================================== */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('badgeCanvas');
const hero = document.getElementById('top');
const slot = document.getElementById('badgeSlot');
const dataEl = document.getElementById('badgeData');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Dimensions (world units; the card is 1 unit wide) ---------- */
const CARD_W = 1;
const CARD_H = CARD_W * 85.6 / 54; // CR80 ID card proportions
const CARD_D = 0.022;
const CARD_R = 0.075;
const BEVEL = 0.006;
const CLIP_DROP = 0.06; // swivel to card top edge
const SLOT_Y = 0.075; // slot centre below the card's top edge

const TEX_W = 1024;
const TEX_H = Math.round(TEX_W * CARD_H / CARD_W);
const PX = TEX_W / CARD_W;

const SEGMENTS = 16;
const RIBBON_SAMPLES = 72;
const RIBBON_W = 0.15;
const RIBBON_REPEAT = 1.1;

/* ---------- Physics ---------- */
const STEP = 1 / 120;
const GRAVITY = 26;
const DAMPING = 0.9975;
const ITERATIONS = 24;
const CARD_INV_MASS = 0.22;
const SPIN_K = 3.2;
const SPIN_C = 0.65;
const SPIN_COUPLE = 0.05;

const COLORS = {
    paper: '#f7f8f7',
    ink: '#15191b',
    ink2: '#3f4a4e',
    ink3: '#5a6664',
    satinDeep: '#195d79',
    satinHi: '#67b0c4',
    rule: 'rgba(21, 25, 27, 0.16)',
};

/* ---------- Canvas drawing ---------- */
const setFont = (ctx, weight, size, stretch = 'normal') => {
    ctx.font = `${weight} ${size}px Archivo, system-ui, sans-serif`;
    if ('fontStretch' in ctx) ctx.fontStretch = stretch;
};

const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
};

const satin = (ctx, x0, y0, x1, y1) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#174f68');
    g.addColorStop(0.36, '#1f7491');
    g.addColorStop(0.49, '#6db6c9');
    g.addColorStop(0.56, '#2a86a4');
    g.addColorStop(0.8, '#1d6f8c');
    g.addColorStop(1, '#174f68');
    return g;
};

const fillFit = (ctx, text, x, y, maxW, weight, size, stretch) => {
    setFont(ctx, weight, size, stretch);
    const w = ctx.measureText(text).width;
    if (w > maxW) setFont(ctx, weight, Math.floor(size * maxW / w), stretch);
    ctx.fillText(text, x, y);
};

const drawSlot = (ctx) => {
    const y = SLOT_Y * PX;
    ctx.fillStyle = 'rgba(8, 12, 14, 0.55)';
    roundRect(ctx, TEX_W / 2 - 100, y - 17, 200, 34, 17);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
};

const makeCanvas = (w, h) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return [c, c.getContext('2d')];
};

const drawFront = (photo, d) => {
    const [c, ctx] = makeCanvas(TEX_W, TEX_H);
    const M = 72;
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(0, 0, TEX_W, TEX_H);

    // satin band, like the graduation hood
    const bandH = 330;
    ctx.fillStyle = satin(ctx, 0, 0, TEX_W, bandH * 1.5);
    ctx.fillRect(0, 0, TEX_W, bandH);
    drawSlot(ctx);

    ctx.fillStyle = COLORS.paper;
    setFont(ctx, 820, 100, 'expanded');
    ctx.fillText('Skie', M - 4, 232);
    ctx.textAlign = 'right';
    const [city, ...rest] = d.location.split(',');
    setFont(ctx, 680, 38, 'semi-condensed');
    ctx.fillText(city.trim(), TEX_W - M, 184);
    ctx.globalAlpha = 0.85;
    setFont(ctx, 600, 34, 'semi-condensed');
    ctx.fillText(`${rest.join(',').trim()}, Philippines`, TEX_W - M, 228);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;

    // photo, mounted with a white border that overlaps the band
    const pw = TEX_W - M * 2;
    const ph = Math.round(pw * photo.naturalHeight / photo.naturalWidth);
    const py = 290;
    ctx.save();
    ctx.shadowColor = 'rgba(21, 25, 27, 0.28)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = COLORS.paper;
    roundRect(ctx, M - 10, py - 10, pw + 20, ph + 20, 26);
    ctx.fill();
    ctx.restore();
    ctx.save();
    roundRect(ctx, M, py, pw, ph, 18);
    ctx.clip();
    ctx.drawImage(photo, M, py, pw, ph);
    ctx.restore();

    // Text here ends up ~9px tall on screen, so it stays large and heavy
    let y = py + ph + 84;
    ctx.fillStyle = COLORS.ink2;
    setFont(ctx, 620, 48);
    ctx.fillText(d.firstNames, M, y);
    y += 116;
    ctx.fillStyle = COLORS.ink;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-4px';
    fillFit(ctx, d.lastName, M - 4, y, TEX_W - M * 2, 820, 124, 'expanded');
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    y += 90;
    ctx.fillStyle = COLORS.satinDeep;
    setFont(ctx, 760, 60);
    ctx.fillText(d.role, M, y);
    y += 58;
    ctx.fillStyle = COLORS.ink2;
    fillFit(ctx, d.org, M, y, TEX_W - M * 2, 600, 44);

    y += 48;
    ctx.fillStyle = COLORS.rule;
    ctx.fillRect(M, y, TEX_W - M * 2, 3);

    y += 64;
    ctx.fillStyle = COLORS.ink;
    fillFit(ctx, 'Software developer & systems integrator', M, y, TEX_W - M * 2, 640, 38);
    y += 52;
    ctx.fillStyle = COLORS.satinDeep;
    setFont(ctx, 640, 36);
    ctx.fillText(d.githubUrl, M, y);

    ctx.fillStyle = satin(ctx, 0, TEX_H - 40, TEX_W, TEX_H);
    ctx.fillRect(0, TEX_H - 34, TEX_W, 34);
    return c;
};

const drawBack = (d) => {
    const [c, ctx] = makeCanvas(TEX_W, TEX_H);
    const M = 72;
    ctx.fillStyle = COLORS.ink;
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    const sheen = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
    sheen.addColorStop(0.3, 'rgba(103, 176, 196, 0)');
    sheen.addColorStop(0.48, 'rgba(103, 176, 196, 0.09)');
    sheen.addColorStop(0.62, 'rgba(103, 176, 196, 0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, TEX_W, TEX_H);

    ctx.fillStyle = satin(ctx, 0, 0, TEX_W, 220);
    ctx.fillRect(0, 0, TEX_W, 150);
    drawSlot(ctx);

    ctx.fillStyle = COLORS.paper;
    setFont(ctx, 820, 100, 'expanded');
    ctx.fillText('Skie', M - 4, 300);
    ctx.textAlign = 'right';
    ctx.globalAlpha = 0.75;
    setFont(ctx, 520, 28);
    ctx.fillText(`${d.firstNames} ${d.lastName}`, TEX_W - M, 296);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';

    let y = 420;
    ctx.fillStyle = COLORS.satinHi;
    setFont(ctx, 700, 36, 'semi-condensed');
    ctx.fillText('Stack', M, y);
    ctx.fillStyle = COLORS.paper;
    setFont(ctx, 620, 46);
    d.stack.forEach((item) => { y += 66; ctx.fillText(item, M, y); });

    y += 110;
    ctx.fillStyle = COLORS.satinHi;
    setFont(ctx, 700, 36, 'semi-condensed');
    ctx.fillText('Contact', M, y);
    ctx.fillStyle = COLORS.paper;
    setFont(ctx, 560, 42);
    [d.githubUrl, d.website, d.phone].forEach((line) => { y += 62; ctx.fillText(line, M, y); });

    y += 92;
    ctx.fillStyle = 'rgba(247, 248, 247, 0.18)';
    ctx.fillRect(M, y, TEX_W - M * 2, 2);
    y += 74;
    ctx.fillStyle = 'rgba(247, 248, 247, 0.72)';
    setFont(ctx, 480, 34);
    ctx.fillText('If found, please return to', M, y);
    ctx.fillText(`Kerneil in ${d.location}.`, M, y + 46);

    ctx.fillStyle = satin(ctx, 0, TEX_H - 40, TEX_W, TEX_H);
    ctx.fillRect(0, TEX_H - 34, TEX_W, 34);
    return c;
};

const drawRibbon = () => {
    const [c, ctx] = makeCanvas(128, 1024);
    const g = ctx.createLinearGradient(0, 0, 128, 0);
    g.addColorStop(0, '#154a60');
    g.addColorStop(0.28, '#1f7491');
    g.addColorStop(0.5, '#3793b0');
    g.addColorStop(0.72, '#1f7491');
    g.addColorStop(1, '#154a60');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 1024);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 8]);
    [11, 117].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke(); });

    ctx.save();
    ctx.translate(64, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = 'rgba(247, 248, 247, 0.9)';
    ctx.textBaseline = 'middle';
    setFont(ctx, 760, 54, 'expanded');
    for (let x = 40; x < 1024; x += 256) ctx.fillText('SKIE', x, 2);
    ctx.restore();
    return c;
};

/* ---------- Geometry ---------- */
const cardShape = () => {
    const w = CARD_W, h = CARD_H, r = CARD_R;
    const x = -w / 2, y = -h / 2;
    const s = new THREE.Shape();
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
};

const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
});

const withTimeout = (promise, ms) => Promise.race([promise, new Promise((r) => setTimeout(r, ms))]);

/* ---------- Scene ---------- */
async function init() {
    if (!canvas || !hero || !slot || !dataEl) return;
    const d = JSON.parse(dataEl.textContent);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;

    const [photo] = await Promise.all([
        loadImage(d.photo),
        withTimeout(Promise.all([
            document.fonts.load('820 100px Archivo'),
            document.fonts.load('560 44px Archivo'),
        ]), 2500),
    ]);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x7f8988, 0.45));
    const key = new THREE.DirectionalLight(0xffffff, 1.45);
    key.position.set(-2.5, 4.5, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 14;
    key.shadow.blurSamples = 20;
    key.shadow.bias = -0.0005;
    scene.add(key, key.target);
    const rim = new THREE.DirectionalLight(0xdff2ff, 0.9);
    rim.position.set(6, 3, -5);
    scene.add(rim);

    // Catches the card's shadow so it lands on the studio backdrop behind it
    const backdrop = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80),
        new THREE.ShadowMaterial({ color: 0x1b2628, opacity: 0.16 }),
    );
    backdrop.position.z = -0.5;
    backdrop.receiveShadow = true;
    scene.add(backdrop);

    /* --- card --- */
    const aniso = renderer.capabilities.getMaxAnisotropy();
    const toTexture = (source) => {
        const t = new THREE.CanvasTexture(source);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = aniso;
        return t;
    };

    const shape = cardShape();
    const bodyGeo = new THREE.ExtrudeGeometry(shape, {
        depth: CARD_D, bevelEnabled: true, bevelThickness: BEVEL, bevelSize: BEVEL, bevelSegments: 3, curveSegments: 12,
    });
    bodyGeo.translate(0, 0, -CARD_D / 2);
    const body = new THREE.Mesh(bodyGeo, new THREE.MeshPhysicalMaterial({
        color: 0xeef1f0, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.3,
    }));
    body.castShadow = true;

    const faceGeo = new THREE.ShapeGeometry(shape, 12);
    const pos = faceGeo.attributes.position;
    const uv = faceGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / CARD_W + 0.5, pos.getY(i) / CARD_H + 0.5);
    const faceZ = CARD_D / 2 + BEVEL + 0.0006;
    const faceMaterial = (map, roughness) => new THREE.MeshPhysicalMaterial({
        map, roughness, clearcoat: 0.7, clearcoatRoughness: 0.22,
        polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
    });
    const front = new THREE.Mesh(faceGeo, faceMaterial(toTexture(drawFront(photo, d)), 0.42));
    front.position.z = faceZ;
    const back = new THREE.Mesh(faceGeo.clone().rotateY(Math.PI), faceMaterial(toTexture(drawBack(d)), 0.5));
    back.position.z = -faceZ;

    const card = new THREE.Group();
    card.add(body, front, back);
    card.position.y = -(CLIP_DROP + CARD_H / 2);

    const metal = new THREE.MeshStandardMaterial({ color: 0xc9ced1, metalness: 1, roughness: 0.28 });
    const swivel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.07, 20), metal);
    swivel.position.y = -0.03;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.011, 10, 32), metal);
    ring.position.y = -0.085;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.045, 0.032), metal);
    plate.position.y = -(CLIP_DROP + SLOT_Y);
    [swivel, ring, plate].forEach((m) => { m.castShadow = true; });

    const pivot = new THREE.Group();
    pivot.add(card, swivel, ring, plate);
    scene.add(pivot);
    const hitTargets = [body, front, back];

    /* --- lanyard --- */
    const ribbonTex = toTexture(drawRibbon());
    ribbonTex.wrapT = THREE.RepeatWrapping;
    const ribbonGeo = new THREE.BufferGeometry();
    const vCount = (RIBBON_SAMPLES + 1) * 2;
    const rPos = new Float32Array(vCount * 3);
    const rUv = new Float32Array(vCount * 2);
    const rIdx = [];
    for (let j = 0; j < RIBBON_SAMPLES; j++) {
        const a = j * 2, b = a + 1, c = a + 2, e = a + 3;
        rIdx.push(a, b, c, b, e, c);
    }
    ribbonGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
    ribbonGeo.setAttribute('uv', new THREE.BufferAttribute(rUv, 2));
    ribbonGeo.setIndex(rIdx);
    const ribbon = new THREE.Mesh(ribbonGeo, new THREE.MeshPhysicalMaterial({
        map: ribbonTex, roughness: 0.5, sheen: 1, sheenColor: new THREE.Color('#a8dbe8'), sheenRoughness: 0.35,
        side: THREE.DoubleSide,
    }));
    ribbon.castShadow = true;
    ribbon.frustumCulled = false;
    scene.add(ribbon);

    /* --- rope state --- */
    const P = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
    const Q = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
    const inv = new Float32Array(SEGMENTS + 1).fill(1);
    inv[0] = 0;
    inv[SEGMENTS] = CARD_INV_MASS;
    const curve = new THREE.CatmullRomCurve3(P);
    const anchor = new THREE.Vector3();
    let ropeLength = 0;
    let seg = 0;
    let spin = 0;
    let spinVel = 0;
    let lastVx = 0;
    let laidOut = false;

    const hangStraight = () => {
        P.forEach((p, i) => { p.set(anchor.x, anchor.y - i * seg, 0); Q[i].copy(p); });
        spin = 0; spinVel = 0; lastVx = 0;
    };
    const swingIn = () => {
        // Start off to the upper right so the card swings into place
        const dir = new THREE.Vector3(1, 0.12, 0.45).normalize();
        P.forEach((p, i) => { p.copy(anchor).addScaledVector(dir, i * seg); Q[i].copy(p); });
        spin = -2.2; spinVel = 2.5; lastVx = 0;
    };

    const layout = () => {
        const hr = hero.getBoundingClientRect();
        const sr = slot.getBoundingClientRect();
        if (!hr.width || !hr.height || !sr.height) return;
        renderer.setSize(hr.width, hr.height, false);
        camera.aspect = hr.width / hr.height;

        // Distance the camera so the card's height matches the slot's height
        const viewH = CARD_H * hr.height / sr.height;
        const viewW = viewH * camera.aspect;
        const camZ = viewH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        camera.position.set(0, 0, camZ);
        camera.near = Math.max(0.1, camZ - 10);
        camera.far = camZ + 10;
        camera.updateProjectionMatrix();

        const cx = ((sr.left + sr.width / 2 - hr.left) / hr.width - 0.5) * viewW;
        const cy = (0.5 - (sr.top + sr.height / 2 - hr.top) / hr.height) * viewH;
        const anchorY = viewH / 2 + 0.4;
        const length = Math.max(0.6, anchorY - (cy + CARD_H / 2 + CLIP_DROP));

        const sc = key.shadow.camera;
        sc.left = -viewW; sc.right = viewW; sc.top = viewH; sc.bottom = -viewH;
        sc.near = 0.5; sc.far = 40;
        sc.updateProjectionMatrix();

        const moved = Math.abs(anchor.x - cx) > 1e-3 || Math.abs(anchor.y - anchorY) > 1e-3 || Math.abs(ropeLength - length) > 1e-3;
        anchor.set(cx, anchorY, 0);
        ropeLength = length;
        seg = length / SEGMENTS;
        if (!laidOut) { laidOut = true; if (reduced) hangStraight(); else swingIn(); }
        else if (moved) hangStraight();
    };

    /* --- simulation --- */
    let dragging = false;
    const dragTarget = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    let time = 0;

    const step = (dt) => {
        time += dt;
        const g = GRAVITY * dt * dt;
        const end = P[SEGMENTS];

        for (let i = 1; i <= SEGMENTS; i++) {
            const p = P[i], q = Q[i];
            if (i === SEGMENTS && dragging) {
                q.copy(p);
                p.lerp(dragTarget, 0.35);
                continue;
            }
            const vx = (p.x - q.x) * DAMPING, vy = (p.y - q.y) * DAMPING, vz = (p.z - q.z) * DAMPING;
            q.copy(p);
            p.x += vx; p.y += vy - g; p.z += vz;
        }
        if (!reduced && !dragging) {
            // a faint draft in the studio
            end.x += Math.sin(time * 0.7) * 0.5 * dt * dt;
            end.z += Math.sin(time * 0.43 + 1) * 0.4 * dt * dt;
        }

        for (let k = 0; k < ITERATIONS; k++) {
            for (let i = 0; i < SEGMENTS; i++) {
                const a = P[i], b = P[i + 1];
                const wa = inv[i], wb = dragging && i + 1 === SEGMENTS ? 0 : inv[i + 1];
                const sum = wa + wb;
                if (!sum) continue;
                tmp.subVectors(b, a);
                const len = tmp.length() || 1e-6;
                const diff = (len - seg) / len;
                a.addScaledVector(tmp, diff * wa / sum);
                b.addScaledVector(tmp, -diff * wb / sum);
            }
        }

        const vx = (end.x - Q[SEGMENTS].x) / dt;
        const ax = THREE.MathUtils.clamp((vx - lastVx) / dt, -60, 60);
        lastVx = vx;
        spinVel += (-SPIN_K * spin - SPIN_C * spinVel + ax * SPIN_COUPLE) * dt;
        spinVel = THREE.MathUtils.clamp(spinVel, -22, 22);
        spin += spinVel * dt;
    };

    /* --- visuals from simulation state --- */
    const Y = new THREE.Vector3(0, 1, 0);
    const Z = new THREE.Vector3(0, 0, 1);
    const up = new THREE.Vector3(0, 1, 0);
    const upSmooth = new THREE.Vector3(0, 1, 0);
    const qAlign = new THREE.Quaternion();
    const qSpin = new THREE.Quaternion();
    const pt = new THREE.Vector3();
    const tan = new THREE.Vector3();
    const side = new THREE.Vector3();

    const sync = () => {
        const end = P[SEGMENTS];
        up.subVectors(P[SEGMENTS - 1], end).normalize();
        upSmooth.lerp(up, 0.5).normalize();
        qAlign.setFromUnitVectors(Y, upSmooth);
        qSpin.setFromAxisAngle(Y, spin);
        pivot.quaternion.copy(qAlign).multiply(qSpin);
        pivot.position.copy(end);

        for (let j = 0; j <= RIBBON_SAMPLES; j++) {
            const t = j / RIBBON_SAMPLES;
            curve.getPoint(t, pt);
            curve.getTangent(t, tan);
            side.crossVectors(tan, Z);
            if (side.lengthSq() < 1e-8) side.set(1, 0, 0);
            side.normalize().applyAxisAngle(tan, spin * t * t);
            const o = j * 6;
            rPos[o] = pt.x - side.x * RIBBON_W / 2;
            rPos[o + 1] = pt.y - side.y * RIBBON_W / 2;
            rPos[o + 2] = pt.z - side.z * RIBBON_W / 2;
            rPos[o + 3] = pt.x + side.x * RIBBON_W / 2;
            rPos[o + 4] = pt.y + side.y * RIBBON_W / 2;
            rPos[o + 5] = pt.z + side.z * RIBBON_W / 2;
            const v = t * ropeLength / RIBBON_REPEAT;
            rUv[j * 4] = 0; rUv[j * 4 + 1] = v;
            rUv[j * 4 + 2] = 1; rUv[j * 4 + 3] = v;
        }
        ribbonGeo.attributes.position.needsUpdate = true;
        ribbonGeo.attributes.uv.needsUpdate = true;
        ribbonGeo.computeVertexNormals();
    };

    /* --- pointer interaction --- */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const grabOffset = new THREE.Vector3();
    let down = null;

    const aim = (e) => {
        const r = canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        raycaster.setFromCamera(ndc, camera);
    };
    const hit = (e) => { aim(e); return raycaster.intersectObjects(hitTargets, false)[0]; };
    const clampToRope = (v) => {
        tmp.subVectors(v, anchor);
        if (tmp.length() > ropeLength) v.copy(anchor).addScaledVector(tmp.normalize(), ropeLength);
        return v;
    };

    canvas.addEventListener('pointerdown', (e) => {
        const h = hit(e);
        if (!h) return;
        dragging = true;
        canvas.setPointerCapture(e.pointerId);
        dragPlane.constant = -P[SEGMENTS].z;
        grabOffset.subVectors(P[SEGMENTS], h.point).setZ(0);
        dragTarget.copy(P[SEGMENTS]);
        down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
        canvas.style.cursor = 'grabbing';
        start();
    });
    canvas.addEventListener('pointermove', (e) => {
        if (dragging) {
            aim(e);
            if (raycaster.ray.intersectPlane(dragPlane, tmp)) clampToRope(dragTarget.copy(tmp).add(grabOffset));
            if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) down.moved = true;
        } else if (canHover) {
            canvas.style.cursor = hit(e) ? 'grab' : '';
        }
    });
    const release = () => {
        if (!dragging) return;
        dragging = false;
        canvas.style.cursor = '';
        if (!down.moved && performance.now() - down.t < 350) spinVel += (Math.random() < 0.5 ? -1 : 1) * 7.5; // tap: spin it
        else spinVel += THREE.MathUtils.clamp(lastVx, -10, 10) * 0.9; // flick: carry the throw into a spin
        down = null;
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);

    /* --- loop --- */
    let raf = 0;
    let last = 0;
    let acc = 0;
    let visible = true;
    let ready = false;

    const frame = (now) => {
        if (!visible || document.hidden) { raf = 0; return; }
        raf = requestAnimationFrame(frame);
        acc += Math.min((now - last) / 1000, 1 / 20);
        last = now;
        while (acc >= STEP) { step(STEP); acc -= STEP; }
        sync();
        renderer.render(scene, camera);
        if (!ready) { ready = true; document.documentElement.classList.add('badge-ready'); }
    };
    function start() {
        if (raf) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
    }

    layout();
    new ResizeObserver(layout).observe(hero);
    window.addEventListener('resize', layout);
    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
    }).observe(hero);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
    start();
}

init().catch((err) => {
    // The static badge stays visible if WebGL or the CDN is unavailable
    console.warn('3D badge unavailable:', err);
});

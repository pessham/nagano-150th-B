let particles = [];
const colors = ['#2E7D32', '#EF6C00', '#FBC02D', '#6A1B9A', '#1565C0'];
let animationRunning = true;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas-container');
    for (let i = 0; i < 200; i++) {
        particles.push(new Particle());
    }
    animateHeroText();

    // アニメーション制御ボタンのイベントリスナー
    const controlBtn = document.getElementById('animation-control-btn');
    controlBtn.addEventListener('click', toggleAnimation);

    // キーボードイベントリスナー (Spaceキーでアニメーション制御)
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // スペースキーによるスクロールを防ぐ
            toggleAnimation();
        }
    });

    // アニメーション有効/無効チェックボックスのイベントリスナー
    const animationToggleCheckbox = document.getElementById('animation-toggle');
    animationToggleCheckbox.addEventListener('change', () => {
        if (animationToggleCheckbox.checked) {
            if (!animationRunning) { // アニメーションが停止している場合のみ再開
                toggleAnimation();
            }
        } else {
            if (animationRunning) { // アニメーションが実行中の場合のみ停止
                toggleAnimation();
            }
        }
    });
}

function draw() {
    if (animationRunning) { // アニメーションが有効な場合のみ描画
        background(0, 10); // 少し透明度のある黒で背景を塗り、軌跡を残す
        for (let particle of particles) {
            particle.update();
            particle.show();
            particle.attractedTo(mouseX, mouseY);
        }
    } else {
        // アニメーション停止時は背景をクリアする（残像を残さない）
        background(0);
    }
}

function toggleAnimation() {
    const controlBtn = document.getElementById('animation-control-btn');
    const animationToggleCheckbox = document.getElementById('animation-toggle'); // チェックボックスも更新
    if (animationRunning) {
        noLoop(); // アニメーションを停止
        animationRunning = false;
        controlBtn.innerHTML = '<span class="icon-play"></span>';
        controlBtn.setAttribute('aria-label', '背景アニメーションを再生');
        animationToggleCheckbox.checked = false; // チェックボックスの状態を更新
    } else {
        loop(); // アニメーションを再開
        animationRunning = true;
        controlBtn.innerHTML = '<span class="icon-pause"></span>';
        controlBtn.setAttribute('aria-label', '背景アニメーションを一時停止');
        animationToggleCheckbox.checked = true; // チェックボックスの状態を更新
    }
}

function mousePressed() {
    // AIが新しいアートを生成したかのように、パーティクルの状態をリセット・再生成
    for (let particle of particles) {
        particle.explode();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.acc = createVector(0, 0);
        this.maxSpeed = 2;
        this.color = random(colors);
        this.size = random(5, 12);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

        if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
            this.pos = createVector(random(width), random(height));
        }
    }

    show() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    attractedTo(targetX, targetY) {
        let target = createVector(targetX, targetY);
        let force = p5.Vector.sub(target, this.pos);
        let d = force.mag();
        if (d < 200) { // マウスから200px以内の場合
            let strength = map(d, 0, 200, 5, 0.1);
            force.setMag(strength);
            this.acc.add(force);
        }
    }

    explode() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(random(5, 10));
        this.color = random(colors);
    }
}

function animateHeroText() {
    const phrases = document.querySelectorAll('.hero-text .phrase');
    phrases.forEach((phrase, index) => {
        setTimeout(() => {
            phrase.style.opacity = 1;
            phrase.style.transform = 'translateY(0)';
        }, index * 800 + 500);
    });
}
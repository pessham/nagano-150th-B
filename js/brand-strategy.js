// 長野県150周年 5色ブランド戦略 インタラクティブ機能

document.addEventListener('DOMContentLoaded', function() {
    
    // 融合段階の制御
    const stageButtons = document.querySelectorAll('.stage-btn');
    const centerImage = document.querySelector('.center-image');
    const valueCards = document.querySelectorAll('.value-card');
    const timelineYear = document.querySelector('.timeline-year');
    
    // 段階別の設定
    const stages = {
        1: { // 分離状態
            year: '1876年',
            description: '筑摩県と旧長野県の分離',
            imageFilter: 'brightness(0.8) saturate(0.7) blur(1px)',
            cardOpacity: 0.3,
            cardTransform: 'scale(0.8)'
        },
        2: { // 接近状態
            year: '1926年',
            description: '50周年 - 融合の始まり',
            imageFilter: 'brightness(0.9) saturate(0.85)',
            cardOpacity: 0.6,
            cardTransform: 'scale(0.9)'
        },
        3: { // 融合開始
            year: '1976年',
            description: '100周年 - 融合の深化',
            imageFilter: 'brightness(1.0) saturate(1.0)',
            cardOpacity: 0.8,
            cardTransform: 'scale(0.95)'
        },
        4: { // 調和状態（デフォルト）
            year: '2026年',
            description: '150周年 - 調和の完成',
            imageFilter: 'brightness(1.05) saturate(1.1)',
            cardOpacity: 1,
            cardTransform: 'scale(1)'
        },
        5: { // 昇華状態
            year: '2076年',
            description: '200周年への展望',
            imageFilter: 'brightness(1.1) saturate(1.2) drop-shadow(0 0 20px rgba(249, 168, 37, 0.3))',
            cardOpacity: 1,
            cardTransform: 'scale(1.05)'
        }
    };
    
    // 段階変更機能
    function changeStage(stageNumber) {
        const stage = stages[stageNumber];
        
        // アクティブボタンの更新
        stageButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-stage="${stageNumber}"]`).classList.add('active');
        
        // 年表示の更新
        timelineYear.textContent = stage.year;
        
        // 中央画像の変更
        centerImage.style.filter = stage.imageFilter;
        centerImage.style.transform = stageNumber === 5 ? 'scale(1.02)' : 'scale(1)';
        
        // カードの変更
        valueCards.forEach(card => {
            card.style.opacity = stage.cardOpacity;
            card.style.transform = card.style.transform.replace(/scale\([^)]*\)/, '') + ` ${stage.cardTransform}`;
        });
        
        // 背景の変更
        const heroContainer = document.querySelector('.hero-container');
        if (stageNumber === 1) {
            heroContainer.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #e0e0e0 100%)';
        } else if (stageNumber === 5) {
            heroContainer.style.background = 'linear-gradient(135deg, #FFF8E1 0%, #FFF3C4 50%, #FFECB3 100%)';
        } else {
            heroContainer.style.background = 'linear-gradient(135deg, #FFFBF5 0%, #FFF8E8 50%, #FFF3E0 100%)';
        }
    }
    
    // 段階ボタンのイベントリスナー
    stageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const stage = parseInt(this.getAttribute('data-stage'));
            changeStage(stage);
        });
    });
    
    // 価値カードのインタラクティブ機能
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // ホバー時に他のカードを少し薄くする
            valueCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.opacity = '0.6';
                }
            });
            
            // 中央画像に対応する色の効果を追加
            const cardClass = card.classList[1]; // heritage-green, harmony-gold など
            let colorFilter = '';
            
            switch(cardClass) {
                case 'heritage-green':
                    colorFilter = 'sepia() saturate(2) hue-rotate(90deg)';
                    break;
                case 'harmony-gold':
                    colorFilter = 'sepia() saturate(2) hue-rotate(30deg)';
                    break;
                case 'unity-blue':
                    colorFilter = 'sepia() saturate(2) hue-rotate(200deg)';
                    break;
                case 'wisdom-purple':
                    colorFilter = 'sepia() saturate(2) hue-rotate(260deg)';
                    break;
                case 'inclusive-orange':
                    colorFilter = 'sepia() saturate(2) hue-rotate(10deg)';
                    break;
            }
            
            centerImage.style.filter += ` ${colorFilter}`;
        });
        
        card.addEventListener('mouseleave', function() {
            // ホバー解除時に元に戻す
            valueCards.forEach(otherCard => {
                otherCard.style.opacity = '';
            });
            
            // 中央画像も元に戻す
            const currentStage = document.querySelector('.stage-btn.active').getAttribute('data-stage');
            centerImage.style.filter = stages[currentStage].imageFilter;
        });
        
        // クリック時の詳細表示（将来拡張用）
        card.addEventListener('click', function() {
            const cardTitle = card.querySelector('h3').textContent;
            const colorName = card.querySelector('.color-name').textContent;
            const description = card.querySelector('.value-description').textContent;
            
            console.log(`クリックされた価値: ${cardTitle} (${colorName}) - ${description}`);
            // ここに詳細モーダルやページ遷移の処理を追加できます
        });
    });
    
    // 時間軸プログレスバーのアニメーション制御
    const progressBar = document.querySelector('.progress-bar');
    const progressMarkers = document.querySelectorAll('.progress-markers span');
    
    // 現在の段階に応じてプログレスバーを調整
    function updateProgressBar(stage) {
        const progress = (stage - 1) * 25; // 1-5 → 0-100%
        progressBar.style.width = `${progress}%`;
        
        // マーカーの強調
        progressMarkers.forEach((marker, index) => {
            marker.classList.remove('current');
            if (index === stage - 1) {
                marker.classList.add('current');
            }
        });
    }
    
    // 段階変更時にプログレスバーも更新
    stageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const stage = parseInt(this.getAttribute('data-stage'));
            updateProgressBar(stage);
        });
    });
    
    // 初期状態の設定
    updateProgressBar(4); // デフォルトは調和状態（4段階目）
    
    // 自動スライドショー（オプション）
    let autoSlideInterval;
    
    function startAutoSlide() {
        let currentStage = 1;
        autoSlideInterval = setInterval(() => {
            changeStage(currentStage);
            updateProgressBar(currentStage);
            currentStage = currentStage === 5 ? 1 : currentStage + 1;
        }, 4000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // 手動操作時は自動スライドを停止
    stageButtons.forEach(button => {
        button.addEventListener('click', stopAutoSlide);
    });
    
    // ページロード後、しばらくしてから自動スライドを開始（オプション）
    // setTimeout(startAutoSlide, 8000);
    
    // キーボードショートカット
    document.addEventListener('keydown', function(e) {
        if (e.key >= '1' && e.key <= '5') {
            const stage = parseInt(e.key);
            changeStage(stage);
            updateProgressBar(stage);
            stopAutoSlide();
        }
    });
    
    // スクロール時のパララックス効果（軽微）
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        centerImage.style.transform = `translateY(${rate}px)`;
        
        valueCards.forEach((card, index) => {
            const cardRate = scrolled * (-0.3 - index * 0.1);
            card.style.transform = card.style.transform.replace(/translateY\([^)]*\)/, '') + ` translateY(${cardRate}px)`;
        });
    });
    
    console.log('長野県150周年 5色ブランド戦略システム初期化完了');
});
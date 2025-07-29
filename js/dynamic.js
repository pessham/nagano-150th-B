/**
 * 長野県150周年記念事業 - ダイナミックインタラクション
 * 大型イラストを活用したダイナミックな体験
 */

class NaganoDynamicExperience {
  constructor() {
    this.currentValue = null;
    this.isAnimating = false;
    this.init();
  }

  init() {
    this.setupInteractivePoints();
    this.setupValueCards();
    this.setupScrollEffects();
    this.setupHeaderBehavior();
    this.setupImageInteraction();
    this.setupAccessibility();
    this.setupIntersectionObserver();
    
    console.log('長野県150周年 ダイナミック体験 初期化完了');
  }

  /**
   * インタラクティブポイントの設定
   */
  setupInteractivePoints() {
    const points = document.querySelectorAll('.point');
    const heroIllustration = document.querySelector('.hero-illustration');
    const valueCards = document.querySelectorAll('.value-card-mini');
    
    if (!points.length || !heroIllustration) return;

    // 華やかでカラフルな価値別フィルター定義
    const valueFilters = {
      nature: 'sepia(0.2) saturate(1.6) hue-rotate(-15deg) brightness(1.15) contrast(1.2) drop-shadow(0 0 10px rgba(46, 93, 71, 0.3))',
      culture: 'sepia(0.3) saturate(1.8) hue-rotate(20deg) brightness(1.2) contrast(1.15) drop-shadow(0 0 10px rgba(232, 168, 82, 0.3))',
      community: 'sepia(0.2) saturate(1.7) hue-rotate(5deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 10px rgba(201, 91, 60, 0.3))',
      learning: 'sepia(0.1) saturate(1.5) hue-rotate(-5deg) brightness(1.05) contrast(1.25) drop-shadow(0 0 10px rgba(74, 123, 167, 0.3))',
      craftsmanship: 'sepia(0.2) saturate(1.6) hue-rotate(-30deg) brightness(1.08) contrast(1.2) drop-shadow(0 0 10px rgba(107, 76, 147, 0.3))'
    };

    points.forEach(point => {
      const value = point.dataset.value;
      
      // ホバー時のインタラクション
      point.addEventListener('mouseenter', () => {
        if (this.isAnimating) return;
        
        this.currentValue = value;
        
        // 画像にフィルター効果適用
        if (valueFilters[value]) {
          heroIllustration.style.filter = valueFilters[value];
          heroIllustration.style.transform = 'scale(1.05) rotate(0.5deg)';
        }
        
        // 対応する価値カードをハイライト
        this.highlightValueCard(value);
        
        // 他のポイントを薄くする
        points.forEach(otherPoint => {
          if (otherPoint !== point) {
            otherPoint.style.opacity = '0.3';
          }
        });
        
        // ポイント自体のカラフルエフェクト強化
        const dot = point.querySelector('.point-dot');
        const pulse = point.querySelector('.point-pulse');
        
        if (dot && pulse) {
          dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
          dot.style.boxShadow = `0 0 50px ${this.getValueColor(value)}, 0 0 20px rgba(255, 111, 0, 0.5)`;
          dot.style.background = `radial-gradient(circle, #FFFFFF 0%, ${this.getValueColor(value)}20 100%)`;
          pulse.style.animationDuration = '0.8s';
          pulse.style.background = `radial-gradient(circle, ${this.getValueColor(value)}40 0%, ${this.getValueColor(value)}20 50%, transparent 100%)`;
        }
      });
      
      point.addEventListener('mouseleave', () => {
        if (this.isAnimating) return;
        
        this.currentValue = null;
        
        // 画像をカラフルなデフォルト状態に戻す
        heroIllustration.style.filter = 'brightness(1.1) saturate(1.3) contrast(1.1) drop-shadow(0 0 20px rgba(255, 111, 0, 0.1))';
        heroIllustration.style.transform = 'scale(1)';
        
        // 価値カードのハイライトを解除
        this.removeValueCardHighlight();
        
        // 全ポイントを元に戻す
        points.forEach(otherPoint => {
          otherPoint.style.opacity = '';
        });
        
        // ポイントエフェクトをリセット
        const dot = point.querySelector('.point-dot');
        const pulse = point.querySelector('.point-pulse');
        
        if (dot && pulse) {
          dot.style.transform = '';
          dot.style.boxShadow = '';
          pulse.style.animationDuration = '';
        }
      });
      
      // クリック時のアクション
      point.addEventListener('click', () => {
        this.animateToValueDetail(value);
      });
    });
  }

  /**
   * 価値カード（ミニ版）のインタラクション
   */
  setupValueCards() {
    const miniCards = document.querySelectorAll('.value-card-mini');
    const points = document.querySelectorAll('.point');
    const heroIllustration = document.querySelector('.hero-illustration');
    
    miniCards.forEach(card => {
      const value = card.dataset.value;
      
      card.addEventListener('mouseenter', () => {
        // 対応するポイントをハイライト
        const correspondingPoint = document.querySelector(`.point[data-value="${value}"]`);
        if (correspondingPoint) {
          correspondingPoint.style.transform = 'scale(1.2)';
          const dot = correspondingPoint.querySelector('.point-dot');
          if (dot) {
            dot.style.transform = 'translate(-50%, -50%) scale(1.3)';
            dot.style.boxShadow = `0 0 30px ${this.getValueColor(value)}`;
          }
        }
        
        // 画像に軽いエフェクト
        if (heroIllustration) {
          heroIllustration.style.filter = 'brightness(1.08) saturate(1.15)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        // ポイントを元に戻す
        const correspondingPoint = document.querySelector(`.point[data-value="${value}"]`);
        if (correspondingPoint) {
          correspondingPoint.style.transform = '';
          const dot = correspondingPoint.querySelector('.point-dot');
          if (dot) {
            dot.style.transform = '';
            dot.style.boxShadow = '';
          }
        }
        
        // 画像を元に戻す
        if (heroIllustration) {
          heroIllustration.style.filter = '';
        }
      });
      
      card.addEventListener('click', () => {
        this.animateToValueDetail(value);
      });
    });
  }

  /**
   * スクロール効果の実装
   */
  setupScrollEffects() {
    // パララックス効果
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const heroIllustration = document.querySelector('.hero-illustration');
      const timelineOverlay = document.querySelector('.timeline-overlay');
      
      if (heroIllustration) {
        const rate = scrolled * -0.2;
        heroIllustration.style.transform = `translateY(${rate}px) scale(1)`;
      }
      
      if (timelineOverlay) {
        const rate = scrolled * -0.1;
        timelineOverlay.style.transform = `translateY(${rate}px)`;
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  /**
   * ヘッダーの動的な挙動
   */
  setupHeaderBehavior() {
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    let ticking = false;

    const updateHeader = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // 下スクロール時はヘッダーを隠す
        header.style.transform = 'translateY(-100%)';
      } else {
        // 上スクロール時はヘッダーを表示
        header.style.transform = 'translateY(0)';
      }
      
      // スクロール位置に応じて背景の透明度を調整
      const opacity = Math.min(scrollTop / 100, 0.98);
      header.style.background = `rgba(255, 254, 247, ${opacity})`;
      
      lastScrollTop = scrollTop;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }

  /**
   * メイン画像のインタラクション
   */
  setupImageInteraction() {
    const imageContainer = document.querySelector('.main-illustration');
    const image = document.querySelector('.hero-illustration');
    
    if (!imageContainer || !image) return;

    // 高度なマウス追従効果
    imageContainer.addEventListener('mousemove', (e) => {
      const rect = imageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;
      
      image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    imageContainer.addEventListener('mouseleave', () => {
      image.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });

    // クリック時の全体的なエフェクト
    image.addEventListener('click', () => {
      this.playFusionAnimation();
    });
  }

  /**
   * アクセシビリティ機能
   */
  setupAccessibility() {
    // キーボードナビゲーション（1-5キー）
    document.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '5') {
        const valueIndex = parseInt(e.key) - 1;
        const values = ['nature', 'culture', 'community', 'learning', 'craftsmanship'];
        const targetValue = values[valueIndex];
        
        if (targetValue) {
          this.animateToValueDetail(targetValue);
        }
      }
    });

    // フォーカス管理
    const focusableElements = document.querySelectorAll(
      'a, button, .point, .value-card-mini, .value-card-full'
    );
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '3px solid #D69E2E';
        element.style.outlineOffset = '2px';
      });
      
      element.addEventListener('blur', () => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      });
    });
  }

  /**
   * Intersection Observer for scroll animations
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // カードの連続アニメーション
          if (entry.target.classList.contains('value-card-full')) {
            const cards = document.querySelectorAll('.value-card-full');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.style.animation = `slideInUp 0.8s ease-out forwards`;
              }, index * 200);
            });
          }
        }
      });
    }, observerOptions);

    // 観察対象要素を追加
    const animateElements = document.querySelectorAll(
      '.value-card-full, .section-header, .cta-content'
    );
    animateElements.forEach(el => observer.observe(el));
  }

  /**
   * ヘルパーメソッド
   */
  highlightValueCard(value) {
    const targetCard = document.querySelector(`.value-card-mini[data-value="${value}"]`);
    if (targetCard) {
      // より強いハイライト効果
      targetCard.style.transform = 'translateX(15px) scale(1.05)';
      targetCard.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
      targetCard.style.borderColor = this.getValueColor(value);
      targetCard.style.backgroundColor = `${this.getValueColor(value)}08`; // 8% opacity
    }
  }

  removeValueCardHighlight() {
    const cards = document.querySelectorAll('.value-card-mini');
    cards.forEach(card => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.borderColor = '';
      card.style.backgroundColor = '';
    });
  }

  animateToValueDetail(value) {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // 対応する詳細カードまでスムーズスクロール
    const targetCard = document.querySelector(`.value-card-full[data-value="${value}"]`);
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
      // スクロール完了後にカードを強調
      setTimeout(() => {
        this.pulseValueCard(targetCard);
        this.isAnimating = false;
      }, 1000);
    } else {
      this.isAnimating = false;
    }
  }

  pulseValueCard(card) {
    const originalTransform = card.style.transform;
    const originalBoxShadow = card.style.boxShadow;
    
    // パルス効果
    card.style.transform = 'translateY(-12px) scale(1.05)';
    card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
    
    setTimeout(() => {
      card.style.transform = originalTransform;
      card.style.boxShadow = originalBoxShadow;
    }, 600);
  }

  playFusionAnimation() {
    const image = document.querySelector('.hero-illustration');
    const points = document.querySelectorAll('.point');
    
    if (!image || !points.length) return;
    
    // 全体的な融合エフェクト
    image.style.filter = 'brightness(1.2) saturate(1.3) blur(0.5px)';
    image.style.transform = 'scale(1.1)';
    
    // 全ポイントを同時に光らせる
    points.forEach((point, index) => {
      setTimeout(() => {
        const dot = point.querySelector('.point-dot');
        const pulse = point.querySelector('.point-pulse');
        
        if (dot && pulse) {
          dot.style.transform = 'translate(-50%, -50%) scale(2)';
          dot.style.boxShadow = '0 0 50px rgba(214, 158, 46, 0.8)';
          pulse.style.transform = 'translate(-50%, -50%) scale(3)';
          pulse.style.opacity = '0.8';
        }
      }, index * 100);
    });
    
    // 2秒後に元に戻す
    setTimeout(() => {
      image.style.filter = '';
      image.style.transform = '';
      
      points.forEach(point => {
        const dot = point.querySelector('.point-dot');
        const pulse = point.querySelector('.point-pulse');
        
        if (dot && pulse) {
          dot.style.transform = '';
          dot.style.boxShadow = '';
          pulse.style.transform = '';
          pulse.style.opacity = '';
        }
      });
    }, 2000);
  }

  getValueColor(value) {
    const colors = {
      nature: '#8AE108',        // 明るい緑
      culture: '#EC25A7',       // マゼンダ
      community: '#F7E106',     // 鮮やかな黄色
      learning: '#F9595C',      // サーモンピンク
      craftsmanship: '#05C7F3'  // 明るい青
    };
    return colors[value] || '#FF6F00';
  }
}

// CSS Animation for slide in up effect
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .animate-in {
    animation: slideInUp 0.8s ease-out forwards;
  }
  
  /* ポイントのホバー時の追加エフェクト */
  .point:hover .point-pulse {
    animation-duration: 0.8s !important;
    background: rgba(214, 158, 46, 0.3) !important;
  }
  
  /* 価値カードの詳細版アニメーション */
  .value-card-full {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.3s ease-out;
  }
  
  .value-card-full.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NaganoDynamicExperience();
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`ダイナミック版ページロード時間: ${loadTime}ms`);
    
    // 大型画像のロード時間も監視
    const heroImage = document.querySelector('.hero-illustration');
    if (heroImage) {
      heroImage.addEventListener('load', () => {
        console.log('メイン画像ロード完了');
      });
    }
  });
}
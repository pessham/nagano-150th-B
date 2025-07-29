/**
 * 長野県150周年記念事業 - プレミアムインタラクション
 * 品格のあるマイクロアニメーションと意味のあるユーザー体験
 */

class NaganoPremiumExperience {
  constructor() {
    this.init();
  }

  init() {
    this.setupValueIndicators();
    this.setupValueCards();
    this.setupScrollEffects();
    this.setupHeaderBehavior();
    this.setupImageInteraction();
    this.setupAccessibility();
    
    console.log('長野県150周年 プレミアム体験 初期化完了');
  }

  /**
   * 価値インジケーターのインタラクション
   */
  setupValueIndicators() {
    const indicators = document.querySelectorAll('.value-indicator');
    const centralImage = document.querySelector('.central-image');
    
    if (!indicators.length || !centralImage) return;

    // 色彩フィルター定義
    const valueFilters = {
      nature: 'sepia(0.3) saturate(1.2) hue-rotate(-10deg) brightness(1.05)',
      culture: 'sepia(0.4) saturate(1.1) hue-rotate(15deg) brightness(1.02)',
      community: 'sepia(0.2) saturate(1.3) hue-rotate(5deg) brightness(1.03)',
      learning: 'sepia(0.1) saturate(1.1) hue-rotate(-5deg) brightness(0.98)',
      craftsmanship: 'sepia(0.2) saturate(1.2) hue-rotate(-15deg) brightness(1.01)'
    };

    indicators.forEach(indicator => {
      const value = indicator.dataset.value;
      
      indicator.addEventListener('mouseenter', () => {
        // 画像にフィルター効果を適用
        if (valueFilters[value]) {
          centralImage.style.filter = valueFilters[value];
          centralImage.style.transform = 'scale(1.02)';
        }
        
        // 他のインジケーターを薄くする
        indicators.forEach(other => {
          if (other !== indicator) {
            other.style.opacity = '0.4';
          }
        });
        
        // 対応する価値カードをハイライト
        this.highlightValueCard(value);
      });
      
      indicator.addEventListener('mouseleave', () => {
        // 画像を元に戻す
        centralImage.style.filter = 'brightness(1.02) saturate(1.05)';
        centralImage.style.transform = 'scale(1)';
        
        // 全てのインジケーターを元に戻す
        indicators.forEach(other => {
          other.style.opacity = '';
        });
        
        // 価値カードのハイライトを解除
        this.removeValueCardHighlight();
      });
      
      // クリック時にスムーズスクロール
      indicator.addEventListener('click', () => {
        const targetCard = document.querySelector(`[data-value="${value}"]`);
        if (targetCard && targetCard.classList.contains('value-card')) {
          targetCard.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          
          // カードを一時的にハイライト
          this.pulseValueCard(value);
        }
      });
    });
  }

  /**
   * 価値カードのインタラクション
   */
  setupValueCards() {
    const cards = document.querySelectorAll('.value-card');
    
    cards.forEach(card => {
      const value = card.dataset.value;
      
      // ホバー時のリッチなアニメーション
      card.addEventListener('mouseenter', () => {
        this.animateCardHover(card, true);
        this.highlightIndicator(value);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateCardHover(card, false);
        this.removeIndicatorHighlight();
      });
      
      // カードクリック時の詳細表示（将来拡張用）
      card.addEventListener('click', () => {
        this.showValueDetails(value);
      });
    });
  }

  /**
   * スクロール効果の実装
   */
  setupScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // 観察対象要素を追加
    const animateElements = document.querySelectorAll('.value-card, .section-header');
    animateElements.forEach(el => observer.observe(el));

    // パララックス効果（軽微）
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      
      const centralImage = document.querySelector('.central-image');
      if (centralImage) {
        centralImage.style.transform = `translateY(${rate}px) scale(1)`;
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
   * ヘッダーの挙動制御
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
      const opacity = Math.min(scrollTop / 100, 0.95);
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
   * 中央画像のインタラクション
   */
  setupImageInteraction() {
    const imageWrapper = document.querySelector('.central-image-wrapper');
    const image = document.querySelector('.central-image');
    
    if (!imageWrapper || !image) return;

    // マウス追従効果
    imageWrapper.addEventListener('mousemove', (e) => {
      const rect = imageWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;
      
      image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    imageWrapper.addEventListener('mouseleave', () => {
      image.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  /**
   * アクセシビリティの強化
   */
  setupAccessibility() {
    // キーボードナビゲーション
    document.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '5') {
        const valueIndex = parseInt(e.key) - 1;
        const indicators = document.querySelectorAll('.value-indicator');
        
        if (indicators[valueIndex]) {
          indicators[valueIndex].click();
        }
      }
    });

    // フォーカス表示の強化
    const focusableElements = document.querySelectorAll('a, button, .value-indicator, .value-card');
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid #D69E2E';
        element.style.outlineOffset = '4px';
      });
      
      element.addEventListener('blur', () => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      });
    });
  }

  /**
   * ヘルパーメソッド
   */
  highlightValueCard(value) {
    const targetCard = document.querySelector(`.value-card[data-value="${value}"]`);
    if (targetCard) {
      targetCard.style.transform = 'translateY(-4px) scale(1.02)';
      targetCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
      targetCard.style.borderColor = this.getValueColor(value);
    }
  }

  removeValueCardHighlight() {
    const cards = document.querySelectorAll('.value-card');
    cards.forEach(card => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.borderColor = '';
    });
  }

  pulseValueCard(value) {
    const targetCard = document.querySelector(`.value-card[data-value="${value}"]`);
    if (targetCard) {
      targetCard.style.animation = 'none';
      targetCard.offsetHeight; // Trigger reflow
      targetCard.style.animation = 'cardPulse 0.6s ease-out';
      
      setTimeout(() => {
        targetCard.style.animation = '';
      }, 600);
    }
  }

  highlightIndicator(value) {
    const targetIndicator = document.querySelector(`.value-indicator[data-value="${value}"]`);
    if (targetIndicator) {
      const dot = targetIndicator.querySelector('.indicator-dot');
      const label = targetIndicator.querySelector('.indicator-label');
      
      dot.style.transform = 'scale(1.4)';
      dot.style.boxShadow = `0 0 20px ${this.getValueColor(value)}`;
      label.style.color = 'var(--color-primary-text)';
      label.style.fontWeight = '600';
    }
  }

  removeIndicatorHighlight() {
    const indicators = document.querySelectorAll('.value-indicator');
    indicators.forEach(indicator => {
      const dot = indicator.querySelector('.indicator-dot');
      const label = indicator.querySelector('.indicator-label');
      
      dot.style.transform = '';
      dot.style.boxShadow = '';
      label.style.color = '';
      label.style.fontWeight = '';
    });
  }

  animateCardHover(card, isHovering) {
    const overlay = card.querySelector('.card-overlay');
    const icon = card.querySelector('.value-icon');
    
    if (isHovering) {
      card.style.transform = 'translateY(-8px) scale(1.02)';
      overlay.style.opacity = '1';
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(3deg)';
      }
    } else {
      card.style.transform = '';
      overlay.style.opacity = '';
      if (icon) {
        icon.style.transform = '';
      }
    }
  }

  showValueDetails(value) {
    // 将来のモーダル実装用
    console.log(`価値「${value}」の詳細を表示`);
    
    // 一時的なフィードバック
    const card = document.querySelector(`.value-card[data-value="${value}"]`);
    if (card) {
      const originalTransform = card.style.transform;
      card.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
        card.style.transform = originalTransform;
      }, 150);
    }
  }

  getValueColor(value) {
    const colors = {
      nature: '#1B4D3E',
      culture: '#D4A574',
      community: '#8B4513',
      learning: '#4A5568',
      craftsmanship: '#2C5282'
    };
    return colors[value] || '#D69E2E';
  }
}

// CSS Animation for card pulse effect
const style = document.createElement('style');
style.textContent = `
  @keyframes cardPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2); }
    100% { transform: scale(1); }
  }
  
  .animate-in {
    animation: slideInUp 0.8s ease-out forwards;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NaganoPremiumExperience();
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
  });
}
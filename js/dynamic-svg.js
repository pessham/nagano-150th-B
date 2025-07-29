/**
 * 長野県150周年記念事業 - SVG色パーツアニメーション
 * イラストを色パーツごとに分離して順番に登場させる
 */

class NaganoDynamicSVGExperience {
  constructor() {
    this.currentValue = null;
    this.isAnimating = false;
    this.init();
  }

  init() {
    this.setupColorPartsInteraction();
    this.setupValueCardsInteraction();
    this.setupScrollEffects();
    this.setupHeaderBehavior();
    this.setupImageInteraction();
    this.setupAccessibility();
    this.setupIntersectionObserver();
    
    console.log('長野県150周年 SVGダイナミック体験 初期化完了');
  }

  /**
   * SVG色パーツのインタラクション設定
   */
  setupColorPartsInteraction() {
    const colorParts = document.querySelectorAll('.color-part');
    const valueCards = document.querySelectorAll('.value-card-mini');
    
    if (!colorParts.length) return;

    // 各SVG色パーツのインタラクション
    colorParts.forEach(part => {
      const value = part.dataset.value;
      
      // ホバー時のエフェクト
      part.addEventListener('mouseenter', () => {
        // 他のパーツを薄くする
        colorParts.forEach(otherPart => {
          if (otherPart !== part) {
            otherPart.style.opacity = '0.3';
          }
        });
        
        // 対応する価値カードをハイライト
        this.highlightValueCard(value);
      });
      
      part.addEventListener('mouseleave', () => {
        // 全パーツを元に戻す
        colorParts.forEach(otherPart => {
          otherPart.style.opacity = '';
        });
        
        // 価値カードのハイライトを解除
        this.removeValueCardHighlight();
      });
      
      // クリック時のアクション
      part.addEventListener('click', () => {
        this.animateToValueDetail(value);
      });
    });
  }

  /**
   * 価値カードとSVGパーツの連動設定
   */
  setupValueCardsInteraction() {
    const valueCards = document.querySelectorAll('.value-card-mini');
    const colorParts = document.querySelectorAll('.color-part');
    
    valueCards.forEach(card => {
      const value = card.dataset.value;
      
      card.addEventListener('mouseenter', () => {
        // 対応するSVGパーツをハイライト
        const correspondingPart = document.querySelector(`.part-${value}`);
        if (correspondingPart) {
          correspondingPart.classList.add('highlighted');
          
          // 他のパーツを薄くする
          colorParts.forEach(otherPart => {
            if (otherPart !== correspondingPart) {
              otherPart.style.opacity = '0.4';
            }
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        // ハイライトを解除
        const correspondingPart = document.querySelector(`.part-${value}`);
        if (correspondingPart) {
          correspondingPart.classList.remove('highlighted');
        }
        
        // 全パーツを元に戻す
        colorParts.forEach(otherPart => {
          otherPart.style.opacity = '';
        });
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
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const svgImage = document.querySelector('.hero-illustration-svg');
      const timelineOverlay = document.querySelector('.timeline-overlay');
      
      if (svgImage) {
        const rate = scrolled * -0.2;
        svgImage.style.transform = `translateY(${rate}px) scale(1)`;
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
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
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
   * SVGイラストのインタラクション
   */
  setupImageInteraction() {
    const imageContainer = document.querySelector('.main-illustration');
    const svgImage = document.querySelector('.hero-illustration-svg');
    
    if (!imageContainer || !svgImage) return;

    // SVG全体のマウス追従効果
    imageContainer.addEventListener('mousemove', (e) => {
      const rect = imageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -2;
      const rotateY = (x - centerX) / centerX * 2;
      
      svgImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    imageContainer.addEventListener('mouseleave', () => {
      svgImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });

    // クリック時の融合アニメーション
    svgImage.addEventListener('click', () => {
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
      'a, button, .color-part, .value-card-mini, .value-card-full'
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
      targetCard.style.transform = 'translateY(-4px) scale(1.03)';
      targetCard.style.boxShadow = '0 15px 40px rgba(255, 111, 0, 0.25)';
      targetCard.style.borderColor = this.getValueColor(value);
      targetCard.style.backgroundColor = `${this.getValueColor(value)}08`;
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
    
    const targetCard = document.querySelector(`.value-card-full[data-value="${value}"]`);
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
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
    
    card.style.transform = 'translateY(-12px) scale(1.05)';
    card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
    
    setTimeout(() => {
      card.style.transform = originalTransform;
      card.style.boxShadow = originalBoxShadow;
    }, 600);
  }

  playFusionAnimation() {
    const colorParts = document.querySelectorAll('.color-part');
    const centerGlow = document.querySelector('.center-glow');
    
    if (!colorParts.length) return;
    
    // 中央の光りを強化
    if (centerGlow) {
      centerGlow.style.opacity = '1';
      centerGlow.style.transform = 'scale(2)';
    }
    
    // 全パーツを同時に光らせる
    colorParts.forEach((part, index) => {
      setTimeout(() => {
        part.style.transform = 'scale(1.3)';
        part.style.filter = 'brightness(1.5) saturate(1.6) drop-shadow(0 0 30px currentColor)';
      }, index * 100);
    });
    
    // 2秒後に元に戻す
    setTimeout(() => {
      if (centerGlow) {
        centerGlow.style.opacity = '0.6';
        centerGlow.style.transform = 'scale(1)';
      }
      
      colorParts.forEach(part => {
        part.style.transform = '';
        part.style.filter = '';
      });
    }, 2000);
  }

  getValueColor(value) {
    const colors = {
      nature: '#2E5D47',        // 深い緑
      culture: '#E8A852',       // 明るい黄橙
      community: '#C95B3C',     // 温かい赤橙
      learning: '#4A7BA7',      // 知的な青
      craftsmanship: '#6B4C93'  // 技術の紫
    };
    return colors[value] || '#FF6F00';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NaganoDynamicSVGExperience();
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`SVGダイナミック版ページロード時間: ${loadTime}ms`);
  });
}
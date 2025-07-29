// Emergency Alert Banner Management
function closeAlert() {
    const alertBanner = document.getElementById('alert-banner');
    if (alertBanner) {
        alertBanner.classList.add('hiding');
        setTimeout(() => {
            alertBanner.style.display = 'none';
        }, 300);
    }
}

function checkAlertExpiry() {
    const alertBanner = document.getElementById('alert-banner');
    if (alertBanner) {
        const expiryDate = alertBanner.getAttribute('data-expires');
        if (expiryDate) {
            const now = new Date();
            const expiry = new Date(expiryDate);
            if (now > expiry) {
                alertBanner.style.display = 'none';
            }
        }
    }
}

// 管理者向け：アラート表示関数（ブラウザコンソールで実行可能）
function showAlert(type = 'important', category = '【重要】', title = '', message = '', linkUrl = '/news/', linkText = '詳細を見る', expiryDate = '') {
    const alertBanner = document.getElementById('alert-banner');
    if (!alertBanner) return false;
    
    // クラスをリセット
    alertBanner.className = 'alert-banner alert-' + type;
    
    // 内容を更新
    alertBanner.querySelector('.alert-category').textContent = category;
    alertBanner.querySelector('.alert-title').textContent = title;
    alertBanner.querySelector('.alert-message').textContent = message;
    alertBanner.querySelector('.alert-link').href = linkUrl;
    alertBanner.querySelector('.alert-link').textContent = linkText;
    
    // 有効期限を設定
    if (expiryDate) {
        alertBanner.setAttribute('data-expires', expiryDate);
    } else {
        alertBanner.removeAttribute('data-expires');
    }
    
    // 表示
    alertBanner.style.display = 'block';
    
    console.log('Alert displayed:', {type, category, title, message, expiryDate});
    return true;
}

// 管理者向け：アラート非表示関数
function hideAlert() {
    const alertBanner = document.getElementById('alert-banner');
    if (alertBanner) {
        alertBanner.style.display = 'none';
        console.log('Alert hidden');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // アラートの有効期限チェック
    checkAlertExpiry();
    
    // 定期的に有効期限をチェック（1分ごと）
    setInterval(checkAlertExpiry, 60000);

    // ヒーローテキストのアニメーション
    const phrases = document.querySelectorAll('.hero-text .phrase');
    
    // タイムラインノードのキーボードナビゲーション
    const timelineNodes = document.querySelectorAll('.timeline-node');
    timelineNodes.forEach(node => {
        node.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                node.click();
            }
        });
    });
    phrases.forEach((phrase, index) => {
        setTimeout(() => {
            phrase.style.opacity = 1;
            phrase.style.transform = 'translateY(0)';
        }, index * 800 + 500); // 0.8秒ごとに出現
    });

    // スクロールで要素をフェードインさせる
    const valueItems = document.querySelectorAll('.value-item');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // 一度表示したら監視を解除
            }
        });
    }, {
        threshold: 0.2
    });

    valueItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(item);
    });
});

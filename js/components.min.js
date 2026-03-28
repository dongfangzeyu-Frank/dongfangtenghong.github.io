/**
 * Shared Navigation and Footer Components
 * Renders unified nav and footer across all pages
 * Supports Chinese (root), English (/en/), and Spanish (/es/) versions
 */

// Detect current language from URL path
var currentLang = 'zh';
(function() {
    var path = window.location.pathname;
    if (path.includes('/en/')) currentLang = 'en';
    else if (path.includes('/es/')) currentLang = 'es';
    else if (path.includes('/ja/')) currentLang = 'ja';
    else if (path.includes('/ko/')) currentLang = 'ko';
    else if (path.includes('/fr/')) currentLang = 'fr';
})();
var isSubLang = (currentLang !== 'zh');

// Build language switch URL for any target language
function getLangSwitchURL(targetLang) {
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    if (targetLang === currentLang) return page; // same language, stay
    if (targetLang === 'zh') {
        // From sub-language → Chinese root
        return isSubLang ? '../' + page : page;
    } else {
        // From any → sub-language (en or es)
        if (isSubLang) {
            // From one sub-lang to another: go up then into target
            return '../' + targetLang + '/' + page;
        }
        return targetLang + '/' + page;
    }
}

// Language-specific labels
var langData = {
    zh: {
        logo: '东方腾弘',
        nav: [
            {href: 'works.html', key: 'works', label: '作品'},
            {href: 'about.html', key: 'about', label: '关于'},
            {href: 'exhibitions.html', key: 'exhibitions', label: '展览'},
            {href: 'news.html', key: 'news', label: '资讯'},
            {href: 'collections.html', key: 'collections', label: '收藏'},
            {href: 'memories.html', key: 'memories', label: '回忆'},
            {href: 'contact.html', key: 'contact', label: '联系'}
        ],
        social: '社交媒体',
        tagline: 'Eastern Mystical Imagery Painting'
    },
    en: {
        logo: 'Dongfang Tenghong',
        nav: [
            {href: 'works.html', key: 'works', label: 'Works'},
            {href: 'about.html', key: 'about', label: 'About'},
            {href: 'exhibitions.html', key: 'exhibitions', label: 'Exhibitions'},
            {href: 'news.html', key: 'news', label: 'News'},
            {href: 'collections.html', key: 'collections', label: 'Collections'},
            {href: 'memories.html', key: 'memories', label: 'Memories'},
            {href: 'contact.html', key: 'contact', label: 'Contact'}
        ],
        social: 'Social Media',
        tagline: 'Eastern Mystical Imagery Painting'
    },
    es: {
        logo: 'Dongfang Tenghong',
        nav: [
            {href: 'works.html', key: 'works', label: 'Obras'},
            {href: 'about.html', key: 'about', label: 'Acerca de'},
            {href: 'exhibitions.html', key: 'exhibitions', label: 'Exposiciones'},
            {href: 'news.html', key: 'news', label: 'Noticias'},
            {href: 'collections.html', key: 'collections', label: 'Colecciones'},
            {href: 'memories.html', key: 'memories', label: 'Memorias'},
            {href: 'contact.html', key: 'contact', label: 'Contacto'}
        ],
        social: 'Redes Sociales',
        tagline: 'Pintura de Imaginería Mística Oriental'
    },
    ja: {
        logo: '東方騰弘',
        nav: [
            {href: 'works.html', key: 'works', label: '作品'},
            {href: 'about.html', key: 'about', label: 'について'},
            {href: 'exhibitions.html', key: 'exhibitions', label: '展覧会'},
            {href: 'news.html', key: 'news', label: 'ニュース'},
            {href: 'collections.html', key: 'collections', label: 'コレクション'},
            {href: 'memories.html', key: 'memories', label: '思い出'},
            {href: 'contact.html', key: 'contact', label: 'お問い合わせ'}
        ],
        social: 'ソーシャルメディア',
        tagline: '東洋神秘意象絵画'
    },
    ko: {
        logo: '동방등홍',
        nav: [
            {href: 'works.html', key: 'works', label: '작품'},
            {href: 'about.html', key: 'about', label: '소개'},
            {href: 'exhibitions.html', key: 'exhibitions', label: '전시'},
            {href: 'news.html', key: 'news', label: '뉴스'},
            {href: 'collections.html', key: 'collections', label: '소장'},
            {href: 'memories.html', key: 'memories', label: '추억'},
            {href: 'contact.html', key: 'contact', label: '연락처'}
        ],
        social: '소셜 미디어',
        tagline: '동양 신비 의상 회화'
    },
    fr: {
        logo: 'Dongfang Tenghong',
        nav: [
            {href: 'works.html', key: 'works', label: 'Œuvres'},
            {href: 'about.html', key: 'about', label: 'À propos'},
            {href: 'exhibitions.html', key: 'exhibitions', label: 'Expositions'},
            {href: 'news.html', key: 'news', label: 'Actualités'},
            {href: 'collections.html', key: 'collections', label: 'Collections'},
            {href: 'memories.html', key: 'memories', label: 'Souvenirs'},
            {href: 'contact.html', key: 'contact', label: 'Contact'}
        ],
        social: 'Réseaux Sociaux',
        tagline: 'Peinture d\'Imagerie Mystique Orientale'
    }
};

/**
 * Render navigation bar with active page highlighting
 */
function renderNav(activePage) {
    const navPlaceholder = document.getElementById('site-nav-placeholder');
    if (!navPlaceholder) return;

    const data = langData[currentLang];
    const navItems = data.nav;

    const navLinksHTML = navItems.map(item =>
        `<li><a href="${item.href}" class="${activePage === item.key ? 'active' : ''}" data-i18n="nav_${item.key}">${item.label}</a></li>`
    ).join('\n                    ');

    // Build language dropdown
    var langLabels = {zh:'中文', en:'EN', es:'ES', ja:'日本語', ko:'한국어', fr:'FR'};
    var langFull = {zh:'中文', en:'English', es:'Español', ja:'日本語', ko:'한국어', fr:'Français'};
    var currentLabel = langLabels[currentLang] || '中文';
    var langs = ['zh','en','es','ja','ko','fr'];
    var dropdownItems = langs.map(function(lang) {
        var cls = lang === currentLang ? 'lang-btn active' : 'lang-btn';
        return '<a href="' + getLangSwitchURL(lang) + '" class="' + cls + '" aria-label="' + langFull[lang] + '">' + langFull[lang] + '</a>';
    }).join('\n                            ');

    const navHTML = `
        <nav class="site-nav" role="navigation" aria-label="Main navigation">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="index.html" class="logo-text" data-i18n="logo">${data.logo}</a>
                </div>
                <ul class="nav-menu" id="navMenu">
                    ${navLinksHTML}
                </ul>
                <div class="nav-controls">
                    <div class="language-toggle" id="languageToggle">
                        <button class="lang-current" aria-expanded="false" aria-haspopup="true">
                            ${currentLabel} <span class="lang-arrow">▼</span>
                        </button>
                        <div class="lang-dropdown" role="menu">
                            ${dropdownItems}
                        </div>
                    </div>
                    <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </nav>
    `;

    navPlaceholder.innerHTML = navHTML;
}

/**
 * Render footer with links and social media
 */
function renderFooter() {
    const footerPlaceholder = document.getElementById('site-footer-placeholder');
    if (!footerPlaceholder) return;

    const data = langData[currentLang];

    const footerNavHTML = data.nav.filter(item => item.key !== 'memories').map(item =>
        `<li><a href="${item.href}" data-i18n="nav_${item.key}">${item.label}</a></li>`
    ).join('\n                            ');

    const footerHTML = `
        <footer class="site-footer" role="contentinfo">
            <div class="footer-container">
                <div class="footer-section footer-brand">
                    <h3 class="footer-logo" data-i18n="footer_logo">${data.logo}</h3>
                    <p class="footer-tagline" data-i18n="footer_tagline">${data.tagline}</p>
                </div>
                <div class="footer-section footer-nav">
                    <nav aria-label="Footer navigation">
                        <ul>
                            ${footerNavHTML}
                        </ul>
                    </nav>
                </div>
                <div class="footer-section footer-social">
                    <div class="social-title" data-i18n="social_title">${data.social}</div>
                    <div class="social-links">
                        <a href="mailto:dongfangzeyu@gmail.com" class="social-link" aria-label="Email">Email</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p class="copyright" data-i18n="footer_copyright">© 2026 Dongfang Tenghong. All rights reserved.</p>
                <div class="footer-links">
                    <a href="contact.html" class="inquire-link" data-i18n="footer_inquire">Inquire</a>
                </div>
            </div>
        </footer>
    `;

    footerPlaceholder.innerHTML = footerHTML;
}

/**
 * Setup mobile hamburger menu and language dropdown
 */
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        });
    });

    // Language dropdown toggle
    const langToggle = document.getElementById('languageToggle');
    if (langToggle) {
        const langBtn = langToggle.querySelector('.lang-current');
        if (langBtn) {
            langBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                langToggle.classList.toggle('open');
                var expanded = langToggle.classList.contains('open');
                langBtn.setAttribute('aria-expanded', expanded);
            });
        }
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!langToggle.contains(e.target)) {
                langToggle.classList.remove('open');
                var btn = langToggle.querySelector('.lang-current');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Auto-detect active page from URL
    const path = window.location.pathname;
    let activePage = 'index';
    if (path.includes('works')) activePage = 'works';
    else if (path.includes('about')) activePage = 'about';
    else if (path.includes('exhibitions')) activePage = 'exhibitions';
    else if (path.includes('news')) activePage = 'news';
    else if (path.includes('collections')) activePage = 'collections';
    else if (path.includes('memories')) activePage = 'memories';
    else if (path.includes('contact')) activePage = 'contact';

    renderNav(activePage);
    renderFooter();
    setupMobileMenu();
});

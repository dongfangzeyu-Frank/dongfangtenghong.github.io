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

    // Build language toggle: 中 / EN / ES
    const zhClass = currentLang === 'zh' ? 'active' : '';
    const enClass = currentLang === 'en' ? 'active' : '';
    const esClass = currentLang === 'es' ? 'active' : '';

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
                        <a href="${getLangSwitchURL('zh')}" class="lang-btn ${zhClass}" aria-label="中文">中</a>
                        <span class="lang-divider">/</span>
                        <a href="${getLangSwitchURL('en')}" class="lang-btn ${enClass}" aria-label="English">EN</a>
                        <span class="lang-divider">/</span>
                        <a href="${getLangSwitchURL('es')}" class="lang-btn ${esClass}" aria-label="Español">ES</a>
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
 * Setup mobile hamburger menu functionality
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

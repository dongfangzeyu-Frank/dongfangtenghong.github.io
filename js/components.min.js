/**
 * Shared Navigation and Footer Components
 * Renders unified nav and footer across all pages
 * Supports Chinese (root) and English (/en/) versions
 */

// Detect if current page is in the English subdirectory
var isEnglishSite = window.location.pathname.includes('/en/');
// Path prefix for links: English pages link to same dir, Chinese pages link to root
var linkPrefix = isEnglishSite ? '' : '';
// Path to switch language: maps current page to its counterpart
function getLangSwitchURL(targetLang) {
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    if (targetLang === 'en') {
        // From Chinese → English: go to /en/page.html
        if (isEnglishSite) return page; // already in English
        return 'en/' + page;
    } else {
        // From English → Chinese: go to ../page.html
        if (!isEnglishSite) return page; // already in Chinese
        return '../' + page;
    }
}

/**
 * Render navigation bar with active page highlighting
 * @param {string} activePage - Current page: 'index', 'works', 'about', 'exhibitions', 'collections', 'contact'
 */
function renderNav(activePage) {
    const navPlaceholder = document.getElementById('site-nav-placeholder');
    if (!navPlaceholder) return;

    const zhActive = isEnglishSite ? '' : 'active';
    const enActive = isEnglishSite ? 'active' : '';
    const logoText = isEnglishSite ? 'Dongfang Tenghong' : '东方腾弘';

    const navItems = isEnglishSite ? [
        {href: 'works.html', key: 'works', label: 'Works'},
        {href: 'about.html', key: 'about', label: 'About'},
        {href: 'exhibitions.html', key: 'exhibitions', label: 'Exhibitions'},
        {href: 'news.html', key: 'news', label: 'News'},
        {href: 'collections.html', key: 'collections', label: 'Collections'},
        {href: 'memories.html', key: 'memories', label: 'Memories'},
        {href: 'contact.html', key: 'contact', label: 'Contact'}
    ] : [
        {href: 'works.html', key: 'works', label: '作品'},
        {href: 'about.html', key: 'about', label: '关于'},
        {href: 'exhibitions.html', key: 'exhibitions', label: '展览'},
        {href: 'news.html', key: 'news', label: '资讯'},
        {href: 'collections.html', key: 'collections', label: '收藏'},
        {href: 'memories.html', key: 'memories', label: '回忆'},
        {href: 'contact.html', key: 'contact', label: '联系'}
    ];

    const navLinksHTML = navItems.map(item =>
        `<li><a href="${item.href}" class="${activePage === item.key ? 'active' : ''}" data-i18n="nav_${item.key}">${item.label}</a></li>`
    ).join('\n                    ');

    const navHTML = `
        <nav class="site-nav" role="navigation" aria-label="Main navigation">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="index.html" class="logo-text" data-i18n="logo">${logoText}</a>
                </div>
                <ul class="nav-menu" id="navMenu">
                    ${navLinksHTML}
                </ul>
                <div class="nav-controls">
                    <div class="language-toggle" id="languageToggle">
                        <a href="${getLangSwitchURL('zh')}" class="lang-btn ${zhActive}" aria-label="中文">中</a>
                        <span class="lang-divider">/</span>
                        <a href="${getLangSwitchURL('en')}" class="lang-btn ${enActive}" aria-label="English">EN</a>
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

    const footerLogoText = isEnglishSite ? 'Dongfang Tenghong' : '东方腾弘';
    const socialTitle = isEnglishSite ? 'Social Media' : '社交媒体';

    const footerNavItems = isEnglishSite ? [
        {href: 'works.html', label: 'Works'},
        {href: 'about.html', label: 'About'},
        {href: 'exhibitions.html', label: 'Exhibitions'},
        {href: 'news.html', label: 'News'},
        {href: 'collections.html', label: 'Collections'},
        {href: 'contact.html', label: 'Contact'}
    ] : [
        {href: 'works.html', label: '作品'},
        {href: 'about.html', label: '关于'},
        {href: 'exhibitions.html', label: '展览'},
        {href: 'news.html', label: '资讯'},
        {href: 'collections.html', label: '收藏'},
        {href: 'contact.html', label: '联系'}
    ];

    const footerNavHTML = footerNavItems.map(item =>
        `<li><a href="${item.href}" data-i18n="nav_${item.label.toLowerCase()}">${item.label}</a></li>`
    ).join('\n                            ');

    const footerHTML = `
        <footer class="site-footer" role="contentinfo">
            <div class="footer-container">
                <div class="footer-section footer-brand">
                    <h3 class="footer-logo" data-i18n="footer_logo">${footerLogoText}</h3>
                    <p class="footer-tagline" data-i18n="footer_tagline">Eastern Mystical Imagery Painting</p>
                </div>
                <div class="footer-section footer-nav">
                    <nav aria-label="Footer navigation">
                        <ul>
                            ${footerNavHTML}
                        </ul>
                    </nav>
                </div>
                <div class="footer-section footer-social">
                    <div class="social-title" data-i18n="social_title">${socialTitle}</div>
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
    else if (path.includes('contact')) activePage = 'contact';

    renderNav(activePage);
    renderFooter();
    setupMobileMenu();
});

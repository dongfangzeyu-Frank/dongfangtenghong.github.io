/**
 * Shared Navigation and Footer Components
 * Renders unified nav and footer across all pages
 */

/**
 * Render navigation bar with active page highlighting
 * @param {string} activePage - Current page: 'index', 'works', 'about', 'exhibitions', 'collections', 'contact'
 */
function renderNav(activePage) {
    const navPlaceholder = document.getElementById('site-nav-placeholder');
    if (!navPlaceholder) return;

    const navHTML = `
        <nav class="site-nav" role="navigation" aria-label="Main navigation">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="index.html" class="logo-text" data-i18n="logo">东方腾弘</a>
                </div>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="works.html" class="${activePage === 'works' ? 'active' : ''}" data-i18n="nav_works">作品</a></li>
                    <li><a href="about.html" class="${activePage === 'about' ? 'active' : ''}" data-i18n="nav_about">关于</a></li>
                    <li><a href="exhibitions.html" class="${activePage === 'exhibitions' ? 'active' : ''}" data-i18n="nav_exhibitions">展览</a></li>
                    <li><a href="news.html" class="${activePage === 'news' ? 'active' : ''}" data-i18n="nav_news">资讯</a></li>
                    <li><a href="collections.html" class="${activePage === 'collections' ? 'active' : ''}" data-i18n="nav_collections">收藏</a></li>
                    <li><a href="contact.html" class="${activePage === 'contact' ? 'active' : ''}" data-i18n="nav_contact">联系</a></li>
                </ul>
                <div class="nav-controls">
                    <div class="language-toggle" id="languageToggle">
                        <button class="lang-btn active" data-lang="zh" aria-label="中文">中</button>
                        <span class="lang-divider">/</span>
                        <button class="lang-btn" data-lang="en" aria-label="English">EN</button>
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

    const footerHTML = `
        <footer class="site-footer" role="contentinfo">
            <div class="footer-container">
                <div class="footer-section footer-brand">
                    <h3 class="footer-logo" data-i18n="footer_logo">东方腾弘</h3>
                    <p class="footer-tagline" data-i18n="footer_tagline">Eastern Mystical Imagery Painting</p>
                </div>
                <div class="footer-section footer-nav">
                    <nav aria-label="Footer navigation">
                        <ul>
                            <li><a href="works.html" data-i18n="nav_works">作品</a></li>
                            <li><a href="about.html" data-i18n="nav_about">关于</a></li>
                            <li><a href="exhibitions.html" data-i18n="nav_exhibitions">展览</a></li>
                            <li><a href="news.html" data-i18n="nav_news">资讯</a></li>
                            <li><a href="collections.html" data-i18n="nav_collections">收藏</a></li>
                            <li><a href="contact.html" data-i18n="nav_contact">联系</a></li>
                        </ul>
                    </nav>
                </div>
                <div class="footer-section footer-social">
                    <div class="social-title" data-i18n="social_title">社交媒体</div>
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

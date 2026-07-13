(function () {
    const DISPLAY_DURATION = 1800;
    const FADE_DURATION = 450;

    function createFanBlades() {
        return Array.from({ length: 6 }, (_, index) => `
            <span class="industrial-loader-blade" style="--blade-index: ${index}"></span>
        `).join('');
    }

    function initializeIndustrialLoader() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen || loadingScreen.dataset.industrialLoaderReady === 'true') return;

        loadingScreen.dataset.industrialLoaderReady = 'true';
        loadingScreen.className = 'industrial-loading-screen';
        loadingScreen.removeAttribute('style');
        loadingScreen.setAttribute('role', 'status');
        loadingScreen.setAttribute('aria-live', 'polite');
        loadingScreen.setAttribute('aria-label', '頁面載入中');

        loadingScreen.innerHTML = `
            <div class="industrial-loader-grid" aria-hidden="true"></div>
            <div class="industrial-loader-panel">
                <div class="industrial-loader-status">
                    <img src="../images/company/logo.png" alt="" class="industrial-loader-logo">
                    <span>貝達國際貿易有限公司</span>
                </div>
                <div class="industrial-loader-machine" aria-hidden="true">
                    <div class="industrial-loader-housing">
                        <div class="industrial-loader-bolts">
                            <span></span><span></span><span></span><span></span>
                        </div>
                        <div class="industrial-loader-rotor">
                            ${createFanBlades()}
                            <span class="industrial-loader-hub"></span>
                        </div>
                    </div>
                    <div class="industrial-loader-stand"></div>
                </div>
                <div class="industrial-loader-progress" aria-hidden="true">
                    <span></span>
                </div>
            </div>
        `;

        requestAnimationFrame(() => {
            document.documentElement.classList.remove('industrial-loader-pending');
        });

        window.setTimeout(() => {
            loadingScreen.classList.add('is-exiting');

            window.setTimeout(() => {
                loadingScreen.style.setProperty('display', 'none', 'important');
                loadingScreen.setAttribute('aria-hidden', 'true');
            }, FADE_DURATION);
        }, DISPLAY_DURATION);
    }

    function showLoaderBeforeNavigation(url) {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) {
            window.location.href = url;
            return;
        }

        loadingScreen.removeAttribute('style');
        loadingScreen.removeAttribute('aria-hidden');
        loadingScreen.classList.remove('is-exiting');
        document.documentElement.classList.add('industrial-loader-pending');

        const progress = loadingScreen.querySelector('.industrial-loader-progress span');
        if (progress) {
            progress.style.animation = 'none';
            void progress.offsetWidth;
            progress.style.animation = '';
        }

        requestAnimationFrame(() => {
            window.setTimeout(() => {
                window.location.href = url;
            }, 60);
        });
    }

    function hideLoaderForPageRestore() {
        const loadingScreen = document.getElementById('loadingScreen');
        document.documentElement.classList.remove('industrial-loader-pending');
        if (!loadingScreen) return;

        loadingScreen.classList.add('is-exiting');
        loadingScreen.style.setProperty('display', 'none', 'important');
        loadingScreen.setAttribute('aria-hidden', 'true');
    }

    function handleInternalNavigation(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const link = event.target.closest('a[href]');
        if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

        const rawHref = link.getAttribute('href');
        if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;

        event.preventDefault();
        showLoaderBeforeNavigation(url.href);
    }

    initializeIndustrialLoader();

    if (!document.getElementById('loadingScreen')) {
        document.addEventListener('DOMContentLoaded', initializeIndustrialLoader, { once: true });
    }

    document.addEventListener('click', handleInternalNavigation);
    window.addEventListener('pagehide', (event) => {
        if (event.persisted) {
            hideLoaderForPageRestore();
        }
    });
    window.addEventListener('pageshow', (event) => {
        const navigationEntry = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
        if (event.persisted || (navigationEntry && navigationEntry.type === 'back_forward')) {
            hideLoaderForPageRestore();
        }
    });
})();

(function () {
    const DISPLAY_DURATION = 1800;
    const FADE_DURATION = 450;
    const loaderCopyByLang = {
        'zh-TW': {
            loadingLabel: '\u9801\u9762\u8f09\u5165\u4e2d',
            companyName: '\u8c9d\u9054\u570b\u969b\u8cbf\u6613\u6709\u9650\u516c\u53f8'
        },
        en: {
            loadingLabel: 'Page loading',
            companyName: 'BESTAR SV CO.LTD'
        },
        ja: {
            loadingLabel: '\u30da\u30fc\u30b8\u3092\u8aad\u307f\u8fbc\u307f\u4e2d',
            companyName: '\u30d9\u30b9\u30bf\u56fd\u969b\u8cbf\u6613\u682a\u5f0f\u4f1a\u793e'
        },
        vn: {
            loadingLabel: '\u0110ang t\u1ea3i trang',
            companyName: 'C\u00d4NG TY TNHH TM SX & DV BESTAR SV'
        }
    };

    function normalizeLanguage(lang) {
        if (!lang) return 'zh-TW';
        if (lang === 'zh' || lang.toLowerCase().startsWith('zh-')) return 'zh-TW';
        if (lang === 'jp') return 'ja';
        return lang;
    }

    function getCurrentLanguage() {
        return normalizeLanguage(document.documentElement.dataset.lang || document.documentElement.lang);
    }

    function getLoaderCopy() {
        return loaderCopyByLang[getCurrentLanguage()] || loaderCopyByLang['zh-TW'];
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

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
        const copy = getLoaderCopy();
        loadingScreen.setAttribute('aria-label', copy.loadingLabel);

        loadingScreen.innerHTML = `
            <div class="industrial-loader-grid" aria-hidden="true"></div>
            <div class="industrial-loader-panel">
                <div class="industrial-loader-status">
                    <img src="../images/company/logo.png" alt="" class="industrial-loader-logo">
                    <span>${escapeHtml(copy.companyName)}</span>
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

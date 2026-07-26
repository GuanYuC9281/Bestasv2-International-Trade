(function () {
    const switcherCopyByLang = {
        'zh-TW': {
            label: '\u5feb\u901f\u5207\u63db\u7522\u54c1',
            fallback: '\u9078\u64c7\u7522\u54c1'
        },
        en: {
            label: 'Quick Product Switch',
            fallback: 'Select product'
        },
        vn: {
            label: 'Chuy\u1ec3n s\u1ea3n ph\u1ea9m nhanh',
            fallback: 'Ch\u1ecdn s\u1ea3n ph\u1ea9m'
        },
        ja: {
            label: '\u88fd\u54c1\u3092\u3059\u3070\u3084\u304f\u5207\u308a\u66ff\u3048',
            fallback: '\u88fd\u54c1\u3092\u9078\u629e'
        }
    };

    function normalizeLanguage(lang) {
        if (!lang) return 'zh-TW';
        if (lang === 'zh' || lang.toLowerCase().startsWith('zh-')) return 'zh-TW';
        if (lang === 'jp') return 'ja';
        return lang;
    }

    function getSwitcherCopy() {
        const lang = normalizeLanguage(document.documentElement.dataset.lang || document.documentElement.lang);
        return switcherCopyByLang[lang] || switcherCopyByLang['zh-TW'];
    }

    function initializeProductSwitcher() {
        const sidebar = document.querySelector('.industrial-detail-page .product-detail-sidebar');
        if (!sidebar || sidebar.dataset.mobileSwitcherReady === 'true') return;

        const nav = sidebar.querySelector(':scope > nav');
        const heading = sidebar.querySelector(':scope > h2');
        const activeLink = nav ? nav.querySelector('.product-sidebar-link.is-active') : null;
        if (!nav || !heading) return;
        const copy = getSwitcherCopy();

        sidebar.dataset.mobileSwitcherReady = 'true';
        nav.id = 'mobileProductSwitcherList';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mobile-product-switcher-toggle';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', nav.id);
        button.innerHTML = `
            <span class="mobile-product-switcher-copy">
                <span class="mobile-product-switcher-label">${copy.label}</span>
                <strong>${activeLink ? activeLink.textContent.trim() : copy.fallback}</strong>
            </span>
            <span class="mobile-product-switcher-icon" aria-hidden="true">
                <i class="fas fa-chevron-down"></i>
            </span>
        `;

        heading.insertAdjacentElement('afterend', button);

        function setOpen(open) {
            sidebar.classList.toggle('is-mobile-open', open);
            button.setAttribute('aria-expanded', String(open));
        }

        button.addEventListener('click', () => {
            setOpen(!sidebar.classList.contains('is-mobile-open'));
        });

        nav.addEventListener('click', (event) => {
            if (event.target.closest('a')) setOpen(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) setOpen(false);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProductSwitcher, { once: true });
    } else {
        initializeProductSwitcher();
    }
})();

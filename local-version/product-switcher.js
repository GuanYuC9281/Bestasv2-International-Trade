(function () {
    function initializeProductSwitcher() {
        const sidebar = document.querySelector('.industrial-detail-page .product-detail-sidebar');
        if (!sidebar || sidebar.dataset.mobileSwitcherReady === 'true') return;

        const nav = sidebar.querySelector(':scope > nav');
        const heading = sidebar.querySelector(':scope > h2');
        const activeLink = nav ? nav.querySelector('.product-sidebar-link.is-active') : null;
        if (!nav || !heading) return;

        sidebar.dataset.mobileSwitcherReady = 'true';
        nav.id = 'mobileProductSwitcherList';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mobile-product-switcher-toggle';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', nav.id);
        button.innerHTML = `
            <span class="mobile-product-switcher-copy">
                <span class="mobile-product-switcher-label">快速切換產品</span>
                <strong>${activeLink ? activeLink.textContent.trim() : '選擇產品'}</strong>
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

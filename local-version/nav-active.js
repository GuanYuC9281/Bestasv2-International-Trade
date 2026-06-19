(function () {
    const solutionHashes = [
        'air-pollution-control',
        'construction-engineering',
        'industry-application',
        'oil-smoke-treatment',
        'chemical-gas-treatment',
        'paint-dust-treatment',
        'spray-equipment',
        'chemical-plant-solution',
        'electrostatic-oil-smoke',
        'metal-industry-solution',
        'chemical-industry-solution',
        'kitchen-exhaust-solution',
        'electronic-industry-solution',
        'plastic-rubber-industry-solution',
        'food-processing-industry-solution'
    ];

    function getCurrentPage() {
        return window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    }

    function getCurrentHash() {
        return window.location.hash.replace('#', '').toLowerCase();
    }

    const pageGroups = {
        home: ['index.html', ''],
        about: ['about.html'],
        products: ['services.html'],
        faq: ['faq.html'],
        contact: ['contact.html', 'contact-success.html'],
        solutions: [
            'product.html',
            'chemical-gas-treatment.html',
            'chemical-industry-solution.html',
            'chemical-plant-solution.html',
            'collector-solution.html',
            'custom-parts-solution.html',
            'duct-solution.html',
            'electronic-industry-solution.html',
            'electrostatic-oil-smoke.html',
            'fan-solution.html',
            'filter-solution.html',
            'food-processing-industry-solution.html',
            'kitchen-exhaust-solution.html',
            'metal-industry-solution.html',
            'oil-smoke-treatment.html',
            'paint-dust-treatment.html',
            'plastic-rubber-industry-solution.html',
            'spray-equipment.html'
        ]
    };

    const desktopIds = {
        home: 'nav-home',
        about: 'nav-about',
        products: 'nav-products',
        solutions: 'nav-news',
        faq: 'nav-faq',
        contact: 'nav-contact'
    };

    const mobileIds = {
        home: 'mobile-nav-home',
        about: 'mobile-nav-about',
        products: 'mobile-nav-products',
        solutions: 'mobile-nav-news',
        faq: 'mobile-nav-faq',
        contact: 'mobile-nav-contact'
    };

    function getNavControl(id) {
        const label = document.getElementById(id);
        return label ? (label.closest('a, button') || label) : null;
    }

    function getCurrentGroup() {
        const page = getCurrentPage();
        const hash = getCurrentHash();

        if (page === 'product.html' && solutionHashes.includes(hash)) {
            return 'solutions';
        }

        return Object.keys(pageGroups).find((group) => pageGroups[group].includes(page));
    }

    function updateActiveNav() {
        const currentGroup = getCurrentGroup();

        document.querySelectorAll('nav .nav-link-active').forEach((item) => {
            item.classList.remove('nav-link-active');
            item.classList.add('nav-link');
            item.removeAttribute('aria-current');
        });

        Object.values(mobileIds).forEach((id) => {
            const item = getNavControl(id);
            if (!item) return;

            item.classList.remove('mobile-nav-link-active', 'text-teal-700', 'bg-teal-50');
            item.removeAttribute('aria-current');
        });

        if (!currentGroup) return;

        const desktopItem = getNavControl(desktopIds[currentGroup]);
        if (desktopItem) {
            desktopItem.classList.remove('nav-link');
            desktopItem.classList.add('nav-link-active');
            desktopItem.setAttribute('aria-current', 'page');
        }

        const mobileItem = getNavControl(mobileIds[currentGroup]);
        if (mobileItem) {
            mobileItem.classList.add('mobile-nav-link-active');
            mobileItem.setAttribute('aria-current', 'page');
        }
    }

    updateActiveNav();
    window.addEventListener('hashchange', updateActiveNav);
})();

(function () {
    const suffixByLang = {
        en: '-en',
        ja: '-jp',
        vi: '-vi'
    };

    const labelByLang = {
        'zh-TW': '\u4e2d\u6587',
        en: 'English',
        ja: '\u65e5\u672c\u8a9e',
        vi: 'Ti\u1ebfng Vi\u1ec7t'
    };

    const languageOrder = ['zh-TW', 'vi', 'en', 'ja'];

    const languageOptionMeta = {
        'zh-TW': { flag: 'TW', label: '\u7e41\u9ad4\u4e2d\u6587' },
        vi: { flag: 'VN', label: 'Ti\u1ebfng Vi\u1ec7t' },
        en: { flag: 'US', label: 'English' },
        ja: { flag: 'JP', label: '\u65e5\u672c\u8a9e' }
    };

    const companyNameByLang = {
        'zh-TW': '\u8c9d\u9054\u570b\u969b\u8cbf\u6613\u6709\u9650\u516c\u53f8',
        en: 'BESTAR SV CO.LTD',
        ja: 'BESTAR SV CO.LTD',
        vi: 'C\u00d4NG TY TNHH TM SX & DV BESTAR SV'
    };

    const companyNameMarkupByLang = {
        vi: 'C\u00d4NG TY TNHH TM SX &<br>DV BESTAR SV'
    };

    function getCurrentLanguage() {
        return document.documentElement.dataset.lang || 'zh-TW';
    }

    function splitHref(href) {
        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) {
            return { path: href, hash: '' };
        }

        return {
            path: href.slice(0, hashIndex),
            hash: href.slice(hashIndex)
        };
    }

    function localizeHref(href, lang) {
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
            return href;
        }

        const parts = splitHref(href);
        if (!parts.path.endsWith('.html')) {
            return href;
        }

        const cleanPath = parts.path.replace(/-(en|jp|vi)(?=\.html$)/, '');
        if (lang === 'zh-TW') {
            return cleanPath + parts.hash;
        }

        return cleanPath.replace(/\.html$/, `${suffixByLang[lang]}.html`) + parts.hash;
    }

    function applyCompanyName(lang) {
        const companyName = companyNameByLang[lang] || companyNameByLang['zh-TW'];
        const companyMarkup = companyNameMarkupByLang[lang] || companyName;
        ['companyName', 'companyName-footer'].forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = companyMarkup;
            }
        });

        const copyrightName = document.getElementById('companyName-footer-2');
        if (copyrightName) {
            copyrightName.textContent = companyName;
        }

        document.querySelectorAll('img[alt]').forEach((image) => {
            if (image.getAttribute('src') && image.getAttribute('src').includes('images/company/logo')) {
                image.setAttribute('alt', companyName);
            }
        });
    }

    function applyBrandHomeLink(lang) {
        const brandName = document.getElementById('companyName');
        const brandLink = brandName ? brandName.closest('a') : null;
        if (brandLink) {
            brandLink.setAttribute('href', localizeHref('index.html', lang));
            brandLink.setAttribute('aria-label', companyNameByLang[lang] || companyNameByLang['zh-TW']);
        }
    }

    function hideQualityCertification() {
        document.querySelectorAll('#nav-about-certifications, #mobile-nav-about-certifications, #quality-certifications').forEach((element) => {
            element.hidden = true;
            element.setAttribute('aria-hidden', 'true');
        });
    }

    function getLanguageButtonLang(button) {
        const onclick = button.getAttribute('onclick') || '';
        const match = onclick.match(/changeLanguage\((?:'|&quot;|&#x27;|\")([^'\"&]+)(?:'|&quot;|&#x27;|\")\)/);
        return match ? match[1] : '';
    }

    function normalizeLanguageButton(button, lang, isDesktop) {
        const meta = languageOptionMeta[lang];
        if (!meta) {
            return;
        }

        button.setAttribute('onclick', `changeLanguage('${lang}')`);
        button.classList.remove('first:rounded-t-lg', 'last:rounded-b-lg');
        if (lang === languageOrder[0]) {
            button.classList.add('first:rounded-t-lg');
        }
        if (lang === languageOrder[languageOrder.length - 1]) {
            button.classList.add('last:rounded-b-lg');
        }

        const spans = button.querySelectorAll('span');
        if (spans.length >= 2) {
            spans[0].textContent = meta.flag;
            spans[1].textContent = meta.label;
        } else {
            button.innerHTML = `<span class="${isDesktop ? 'text-lg' : 'text-xs font-semibold uppercase tracking-wide'}">${meta.flag}</span><span>${meta.label}</span>`;
        }
    }

    function createLanguageButton(lang, isDesktop) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = isDesktop
            ? 'language-btn w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2'
            : 'w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md flex items-center space-x-2';
        normalizeLanguageButton(button, lang, isDesktop);
        return button;
    }

    function orderLanguageButtons(container, isDesktop) {
        if (!container) {
            return;
        }

        const existingButtons = Array.from(container.querySelectorAll('button')).filter((button) => getLanguageButtonLang(button));
        const buttonsByLang = new Map(existingButtons.map((button) => [getLanguageButtonLang(button), button]));
        const orderedButtons = languageOrder.map((lang) => {
            const button = buttonsByLang.get(lang) || createLanguageButton(lang, isDesktop);
            normalizeLanguageButton(button, lang, isDesktop);
            return button;
        });

        orderedButtons.forEach((button) => container.appendChild(button));
    }

    function ensureMobileLanguageMenu() {
        const mobileMenuBody = document.querySelector('#mobileMenu > div');
        if (!mobileMenuBody || document.getElementById('mobile-language')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'px-3 py-2 border-t border-gray-200 mt-2 pt-4';
        wrapper.innerHTML = `
            <div class="flex items-center space-x-2 text-gray-700 py-2">
                <i class="fas fa-globe text-blue-600"></i>
                <span class="language-current" id="mobile-currentLangDisplay">${labelByLang[getCurrentLanguage()] || labelByLang['zh-TW']}</span>
            </div>
            <div id="mobile-language" class="mobile-submenu-panel pl-4 space-y-1 mt-1"></div>
        `;
        mobileMenuBody.appendChild(wrapper);
    }

    function applyLanguageMenuOrder() {
        orderLanguageButtons(document.getElementById('languageDropdown'), true);
        ensureMobileLanguageMenu();
        orderLanguageButtons(document.getElementById('mobile-language'), false);
    }

    function applyLanguageRouting() {
        const lang = getCurrentLanguage();
        document.querySelectorAll('.language-current').forEach((element) => {
            element.textContent = labelByLang[lang] || labelByLang['zh-TW'];
        });

        applyCompanyName(lang);
        applyBrandHomeLink(lang);
        hideQualityCertification();
        applyLanguageMenuOrder();

        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            link.setAttribute('href', localizeHref(href, lang));
        });
    }

    window.changeLanguage = function changeLanguage(lang) {
        localStorage.setItem('preferredLanguage', lang);
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const target = localizeHref(currentPath + window.location.hash, lang);
        window.location.href = target;
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLanguageRouting);
    } else {
        applyLanguageRouting();
    }
})();

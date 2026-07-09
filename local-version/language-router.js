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

    const companyNameByLang = {
        'zh-TW': '\u8c9d\u9054\u570b\u969b\u8cbf\u6613\u6709\u9650\u516c\u53f8',
        en: 'BESTAR SV CO.LTD',
        ja: 'BESTAR SV CO.LTD',
        vi: 'C\u00d4NG TY TNHH TM SX & DV BESTAR SV'
    };

    const companyNameMarkupByLang = {
        vi: 'C\u00d4NG TY TNHH TM SX & DV<br>BESTAR SV'
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

    function applyLanguageRouting() {
        const lang = getCurrentLanguage();
        document.querySelectorAll('.language-current').forEach((element) => {
            element.textContent = labelByLang[lang] || labelByLang['zh-TW'];
        });

        applyCompanyName(lang);
        applyBrandHomeLink(lang);
        hideQualityCertification();

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

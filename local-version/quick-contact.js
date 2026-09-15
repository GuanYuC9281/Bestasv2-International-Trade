(function () {
    const ZALO_LINK_SELECTOR = 'a[href^="https://zalo.me/"], a[href^="http://zalo.me/"], a[href^="zalo://conversation"], a[href^="intent://zalo.me/"]';
    const ZALO_CLICK_LOCK_MS = 1600;
    let lastZaloOpenAt = 0;

    function extractZaloPhone(rawHref) {
        if (!rawHref) return '';

        const normalizedHref = rawHref.trim();
        const directMatch = normalizedHref.match(/^zalo:\/\/conversation\?phone=(\d+)/i);
        if (directMatch) return directMatch[1];

        const intentMatch = normalizedHref.match(/^intent:\/\/zalo\.me\/(\d{8,15})/i);
        if (intentMatch) return intentMatch[1];

        try {
            const url = new URL(normalizedHref, window.location.href);
            if (url.hostname.toLowerCase() !== 'zalo.me') return '';

            const pathMatch = url.pathname.match(/^\/(\d{8,15})\/?$/);
            return pathMatch ? pathMatch[1] : '';
        } catch (error) {
            return '';
        }
    }

    function getZaloWebHref(phone) {
        return `https://zalo.me/${encodeURIComponent(phone)}`;
    }

    function isAndroidDevice() {
        return /Android/i.test((window.navigator && window.navigator.userAgent) || '');
    }

    function getZaloProfileLink(phone) {
        const webHref = getZaloWebHref(phone);
        if (isAndroidDevice()) {
            return `intent://zalo.me/${encodeURIComponent(phone)}#Intent;scheme=https;package=com.zing.zalo;S.browser_fallback_url=${encodeURIComponent(webHref)};end`;
        }

        return webHref;
    }

    function normalizeZaloLinks(root) {
        root.querySelectorAll(ZALO_LINK_SELECTOR).forEach((link) => {
            const phone = link.dataset.zaloPhone || extractZaloPhone(link.getAttribute('href'));
            if (!phone) return;

            link.dataset.zaloPhone = phone;
            link.dataset.zaloWebHref = getZaloWebHref(phone);
            link.dataset.zaloProfileHref = getZaloProfileLink(phone);
            link.setAttribute('href', link.dataset.zaloProfileHref);
            link.removeAttribute('target');
        });
    }

    function openZaloProfile(phone) {
        const now = Date.now();
        if (now - lastZaloOpenAt < ZALO_CLICK_LOCK_MS) return;

        lastZaloOpenAt = now;
        window.location.href = getZaloProfileLink(phone);
    }

    function handleZaloClick(event) {
        const link = event.target.closest ? event.target.closest('a') : null;
        if (!link) return;

        const phone = link.dataset.zaloPhone || extractZaloPhone(link.getAttribute('href'));
        if (!phone) return;

        event.preventDefault();
        openZaloProfile(phone);
    }

    function createQuickContact() {
        if (document.getElementById('quickContactWidget')) return;

        const lang = document.documentElement.dataset.lang || document.documentElement.lang || 'zh-TW';
        const labels = {
            en: {
                widget: 'Quick contact',
                open: 'Open quick contact',
                close: 'Close quick contact',
                closedText: 'Quick contact',
                openText: 'Close contact'
            },
            ja: {
                widget: 'クイック連絡',
                open: 'クイック連絡を開く',
                close: 'クイック連絡を閉じる',
                closedText: 'クイック連絡',
                openText: '連絡を閉じる'
            },
            vn: {
                widget: 'Liên hệ nhanh',
                open: 'Mở liên hệ nhanh',
                close: 'Đóng liên hệ nhanh',
                closedText: 'Liên hệ nhanh',
                openText: 'Đóng liên hệ'
            },
            'zh-TW': {
                widget: '快速聯絡',
                open: '展開快速聯絡',
                close: '收起快速聯絡',
                closedText: '快速聯絡',
                openText: '收起聯絡'
            }
        };
        const t = labels[lang] || labels['zh-TW'];

        const widget = document.createElement('aside');
        widget.id = 'quickContactWidget';
        widget.className = 'quick-contact-widget';
        widget.setAttribute('aria-label', t.widget);
        widget.innerHTML = `
            <div id="quickContactPanel" class="quick-contact-panel" aria-hidden="true">
                <a href="https://line.me/ti/p/@942oqhpe" target="_blank" rel="noopener noreferrer" class="quick-contact-link">
                    <span class="quick-contact-link-icon quick-contact-line"><i class="fab fa-line"></i></span>
                    <span>LINE</span>
                    <i class="fas fa-arrow-up-right-from-square quick-contact-link-arrow"></i>
                </a>
                <a href="https://wa.me/886985328164" target="_blank" rel="noopener noreferrer" class="quick-contact-link">
                    <span class="quick-contact-link-icon quick-contact-whatsapp"><i class="fab fa-whatsapp"></i></span>
                    <span>WhatsApp</span>
                    <i class="fas fa-arrow-up-right-from-square quick-contact-link-arrow"></i>
                </a>
                <a href="https://zalo.me/84903373583" target="_blank" rel="noopener noreferrer" class="quick-contact-link">
                    <span class="quick-contact-link-icon quick-contact-zalo">Zalo</span>
                    <span>Zalo</span>
                    <i class="fas fa-arrow-up-right-from-square quick-contact-link-arrow"></i>
                </a>
            </div>
            <button id="quickContactBtn" class="quick-contact-button" type="button" aria-label="${t.open}" aria-expanded="false" aria-controls="quickContactPanel">
                <span class="quick-contact-button-icon"><i class="fas fa-comments"></i></span>
                <span id="quickContactText" class="quick-contact-button-text">${t.closedText}</span>
            </button>
        `;

        document.body.appendChild(widget);
        normalizeZaloLinks(widget);

        const panel = widget.querySelector('#quickContactPanel');
        const button = widget.querySelector('#quickContactBtn');
        const icon = button.querySelector('.quick-contact-button-icon i');
        const text = widget.querySelector('#quickContactText');

        function setOpen(open) {
            widget.classList.toggle('is-open', open);
            panel.setAttribute('aria-hidden', String(!open));
            button.setAttribute('aria-expanded', String(open));
            button.setAttribute('aria-label', open ? t.close : t.open);
            icon.className = open ? 'fas fa-times' : 'fas fa-comments';
            text.textContent = open ? t.openText : t.closedText;
        }

        button.addEventListener('click', () => {
            setOpen(!widget.classList.contains('is-open'));
        });

        document.addEventListener('click', (event) => {
            if (widget.classList.contains('is-open') && !widget.contains(event.target)) {
                setOpen(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && widget.classList.contains('is-open')) {
                setOpen(false);
                button.focus();
            }
        });
    }

    normalizeZaloLinks(document);
    document.addEventListener('click', handleZaloClick, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createQuickContact, { once: true });
    } else {
        createQuickContact();
    }
})();

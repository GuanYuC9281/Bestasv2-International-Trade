(function () {
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
            vi: {
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
                <a href="https://wa.me/842837790881" target="_blank" rel="noopener noreferrer" class="quick-contact-link">
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createQuickContact, { once: true });
    } else {
        createQuickContact();
    }
})();

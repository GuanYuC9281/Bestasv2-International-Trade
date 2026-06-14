(function () {
    function createQuickContact() {
        if (document.getElementById('quickContactWidget')) return;

        const widget = document.createElement('aside');
        widget.id = 'quickContactWidget';
        widget.className = 'quick-contact-widget';
        widget.setAttribute('aria-label', '快速聯絡');
        widget.innerHTML = `
            <div id="quickContactPanel" class="quick-contact-panel" aria-hidden="true">
                <a href="https://line.me/ti/p/@bestas-intl" target="_blank" rel="noopener noreferrer" class="quick-contact-link">
                    <span class="quick-contact-link-icon quick-contact-line"><i class="fab fa-line"></i></span>
                    <span>LINE</span>
                    <i class="fas fa-arrow-up-right-from-square quick-contact-link-arrow"></i>
                </a>
                <a href="https://wa.me/886985328164" target="_blank" rel="noopener noreferrer" class="quick-contact-link">
                    <span class="quick-contact-link-icon quick-contact-whatsapp"><i class="fab fa-whatsapp"></i></span>
                    <span>WhatsApp</span>
                    <i class="fas fa-arrow-up-right-from-square quick-contact-link-arrow"></i>
                </a>
                <a href="https://zalo.me/886985328164" target="_blank" rel="noopener noreferrer" class="quick-contact-link">
                    <span class="quick-contact-link-icon quick-contact-zalo">Zalo</span>
                    <span>Zalo</span>
                    <i class="fas fa-arrow-up-right-from-square quick-contact-link-arrow"></i>
                </a>
            </div>
            <button id="quickContactBtn" class="quick-contact-button" type="button" aria-label="展開快速聯絡" aria-expanded="false" aria-controls="quickContactPanel">
                <span class="quick-contact-button-icon"><i class="fas fa-comments"></i></span>
                <span id="quickContactText" class="quick-contact-button-text">快速聯絡</span>
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
            button.setAttribute('aria-label', open ? '收起快速聯絡' : '展開快速聯絡');
            icon.className = open ? 'fas fa-times' : 'fas fa-comments';
            text.textContent = open ? '收起聯絡' : '快速聯絡';
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

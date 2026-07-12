(function () {
    var carouselTypes = [
        {
            cardSelector: '.product-equipment-card-numbered',
            trackClass: 'product-equipment-track',
            wrapperClass: 'product-equipment-mobile-carousel',
            arrowClass: 'product-equipment-carousel-arrow',
            leftClass: 'product-equipment-carousel-arrow-left',
            rightClass: 'product-equipment-carousel-arrow-right',
            readyKey: 'equipmentCarouselReady',
            prevLabel: '\u5411\u5de6\u700f\u89bd\u7522\u54c1',
            nextLabel: '\u5411\u53f3\u700f\u89bd\u7522\u54c1'
        },
        {
            cardSelector: '.industry-result-card',
            trackClass: 'industry-result-track',
            wrapperClass: 'industry-result-mobile-carousel',
            arrowClass: 'industry-result-carousel-arrow',
            leftClass: 'industry-result-carousel-arrow-left',
            rightClass: 'industry-result-carousel-arrow-right',
            readyKey: 'industryResultCarouselReady',
            prevLabel: '\u5411\u5de6\u700f\u89bd\u6210\u679c\u6848\u4f8b',
            nextLabel: '\u5411\u53f3\u700f\u89bd\u6210\u679c\u6848\u4f8b'
        },
        {
            cardSelector: '.industrial-module-card',
            trackClass: 'industrial-module-track',
            wrapperClass: 'industrial-module-mobile-carousel',
            arrowClass: 'industrial-module-carousel-arrow',
            leftClass: 'industrial-module-carousel-arrow-left',
            rightClass: 'industrial-module-carousel-arrow-right',
            readyKey: 'industrialModuleCarouselReady',
            prevLabel: '\u5411\u5de6\u700f\u89bd\u5716\u5361',
            nextLabel: '\u5411\u53f3\u700f\u89bd\u5716\u5361'
        }
    ];

    function updateButtons(track, prevButton, nextButton) {
        var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
        prevButton.disabled = track.scrollLeft <= 2;
        nextButton.disabled = maxScroll <= 0 || track.scrollLeft >= maxScroll;
    }

    function getScrollStep(track, cardSelector) {
        var firstCard = track.querySelector(cardSelector);
        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
        return firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    }

    function scrollTrack(track, cardSelector, direction, prevButton, nextButton) {
        track.scrollBy({
            left: direction * getScrollStep(track, cardSelector),
            behavior: 'smooth'
        });

        window.setTimeout(function () {
            updateButtons(track, prevButton, nextButton);
        }, 280);
    }

    function makeArrow(config, sideClass, label, iconClass) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = config.arrowClass + ' ' + sideClass;
        button.setAttribute('aria-label', label);
        button.innerHTML = '<i class="' + iconClass + '" aria-hidden="true"></i>';
        return button;
    }

    function initCarousel(track, config) {
        if (!track || track.dataset[config.readyKey] === 'true') {
            return;
        }

        var cards = track.querySelectorAll(':scope > ' + config.cardSelector);
        if (cards.length < 2) {
            return;
        }

        track.dataset[config.readyKey] = 'true';
        track.classList.add(config.trackClass);

        var wrapper = document.createElement('div');
        wrapper.className = config.wrapperClass;
        track.parentNode.insertBefore(wrapper, track);
        wrapper.appendChild(track);

        var prevButton = makeArrow(config, config.leftClass, config.prevLabel, 'fas fa-chevron-left');
        var nextButton = makeArrow(config, config.rightClass, config.nextLabel, 'fas fa-chevron-right');

        wrapper.insertBefore(prevButton, track);
        wrapper.insertBefore(nextButton, track);

        prevButton.addEventListener('click', function () {
            if (!prevButton.disabled) {
                scrollTrack(track, config.cardSelector, -1, prevButton, nextButton);
            }
        });

        nextButton.addEventListener('click', function () {
            if (!nextButton.disabled) {
                scrollTrack(track, config.cardSelector, 1, prevButton, nextButton);
            }
        });

        track.addEventListener('scroll', function () {
            updateButtons(track, prevButton, nextButton);
        }, { passive: true });

        window.addEventListener('resize', function () {
            updateButtons(track, prevButton, nextButton);
        });

        requestAnimationFrame(function () {
            track.scrollLeft = 0;
            updateButtons(track, prevButton, nextButton);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        carouselTypes.forEach(function (config) {
            document.querySelectorAll('.industrial-detail-page ' + config.cardSelector + ', .services-metal-results-section ' + config.cardSelector).forEach(function (card) {
                initCarousel(card.parentElement, config);
            });
        });

        initIndustryResultGalleryModal();
    });

    function parseGallery(card) {
        var rawGallery = card.getAttribute('data-gallery') || '';
        return rawGallery.split('|').map(function (src) {
            return src.trim();
        }).filter(Boolean);
    }
    function getCurrentLanguage() {
        return document.documentElement.dataset.lang || document.documentElement.lang || 'zh-TW';
    }

    function getGalleryLabels() {
        var labels = {
            'zh-TW': {
                dialog: '\u5de5\u7a0b\u6210\u679c\u5716\u700f\u89bd',
                close: '\u95dc\u9589\u5de5\u7a0b\u6210\u679c\u5716',
                eyebrow: '\u5de5\u7a0b\u6210\u679c\u5716',
                previous: '\u4e0a\u4e00\u5f35\u5de5\u7a0b\u6210\u679c\u5716',
                next: '\u4e0b\u4e00\u5f35\u5de5\u7a0b\u6210\u679c\u5716',
                image: '\u5de5\u7a0b\u6210\u679c\u5716',
                dot: '\u67e5\u770b\u7b2c {index} \u5f35\u5de5\u7a0b\u6210\u679c\u5716',
                fallbackTitle: '\u5de5\u7a0b\u6210\u679c',
                card: '\u67e5\u770b\u516c\u53f8\u5de5\u7a0b\u6210\u679c\u5716',
                view: '\u67e5\u770b\u5de5\u7a0b\u6210\u679c'
            },
            en: {
                dialog: 'Project result gallery',
                close: 'Close project result gallery',
                eyebrow: 'Project Result Images',
                previous: 'Previous project image',
                next: 'Next project image',
                image: 'project result image',
                dot: 'View project image {index}',
                fallbackTitle: 'Project Results',
                card: 'View company project result images',
                view: 'View Project Results'
            },
            ja: {
                dialog: '\u65bd\u5de5\u5b9f\u7e3e\u753b\u50cf\u30ae\u30e3\u30e9\u30ea\u30fc',
                close: '\u65bd\u5de5\u5b9f\u7e3e\u753b\u50cf\u3092\u9589\u3058\u308b',
                eyebrow: '\u65bd\u5de5\u5b9f\u7e3e\u753b\u50cf',
                previous: '\u524d\u306e\u65bd\u5de5\u5b9f\u7e3e\u753b\u50cf',
                next: '\u6b21\u306e\u65bd\u5de5\u5b9f\u7e3e\u753b\u50cf',
                image: '\u65bd\u5de5\u5b9f\u7e3e\u753b\u50cf',
                dot: '{index} \u679a\u76ee\u306e\u65bd\u5de5\u5b9f\u7e3e\u753b\u50cf\u3092\u898b\u308b',
                fallbackTitle: '\u65bd\u5de5\u5b9f\u7e3e',
                card: '\u4f1a\u793e\u306e\u65bd\u5de5\u5b9f\u7e3e\u753b\u50cf\u3092\u898b\u308b',
                view: '\u65bd\u5de5\u5b9f\u7e3e\u3092\u898b\u308b'
            },
            vi: {
                dialog: 'B\u1ed9 s\u01b0u t\u1eadp h\u00ecnh \u1ea3nh k\u1ebft qu\u1ea3 d\u1ef1 \u00e1n',
                close: '\u0110\u00f3ng h\u00ecnh \u1ea3nh k\u1ebft qu\u1ea3 d\u1ef1 \u00e1n',
                eyebrow: 'H\u00ecnh \u1ea3nh k\u1ebft qu\u1ea3 d\u1ef1 \u00e1n',
                previous: 'H\u00ecnh tr\u01b0\u1edbc',
                next: 'H\u00ecnh ti\u1ebfp theo',
                image: 'h\u00ecnh \u1ea3nh k\u1ebft qu\u1ea3 d\u1ef1 \u00e1n',
                dot: 'Xem h\u00ecnh k\u1ebft qu\u1ea3 d\u1ef1 \u00e1n th\u1ee9 {index}',
                fallbackTitle: 'K\u1ebft qu\u1ea3 d\u1ef1 \u00e1n',
                card: 'Xem h\u00ecnh \u1ea3nh k\u1ebft qu\u1ea3 d\u1ef1 \u00e1n c\u1ee7a c\u00f4ng ty',
                view: 'Xem k\u1ebft qu\u1ea3 d\u1ef1 \u00e1n'
            }
        };
        return labels[getCurrentLanguage()] || labels['zh-TW'];
    }


    function createGalleryModal() {
        var labels = getGalleryLabels();
        var modal = document.createElement('div');
        modal.className = 'industry-gallery-modal hidden';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', labels.dialog);
        modal.innerHTML = [
            '<div class="industry-gallery-backdrop" data-gallery-close></div>',
            '<div class="industry-gallery-panel">',
            '  <button type="button" class="industry-gallery-close" aria-label="' + labels.close + '" data-gallery-close><i class="fas fa-times"></i></button>',
            '  <div class="industry-gallery-header">',
            '    <p>' + labels.eyebrow + '</p>',
            '    <h3 id="industryGalleryTitle"></h3>',
            '  </div>',
            '  <div class="industry-gallery-stage">',
            '    <button type="button" class="industry-gallery-nav industry-gallery-prev" aria-label="' + labels.previous + '"><i class="fas fa-chevron-left"></i></button>',
            '    <img id="industryGalleryImage" src="" alt="">',
            '    <button type="button" class="industry-gallery-nav industry-gallery-next" aria-label="' + labels.next + '"><i class="fas fa-chevron-right"></i></button>',
            '  </div>',
            '  <div class="industry-gallery-footer">',
            '    <span id="industryGalleryCounter"></span>',
            '    <div id="industryGalleryDots" class="industry-gallery-dots"></div>',
            '  </div>',
            '</div>'
        ].join('');
        document.body.appendChild(modal);
        return modal;
    }

    function initIndustryResultGalleryModal() {
        var cards = Array.prototype.slice.call(document.querySelectorAll('.industry-result-card[data-gallery]'));
        if (!cards.length) {
            return;
        }

        var modal = createGalleryModal();
        var title = modal.querySelector('#industryGalleryTitle');
        var image = modal.querySelector('#industryGalleryImage');
        var counter = modal.querySelector('#industryGalleryCounter');
        var dots = modal.querySelector('#industryGalleryDots');
        var prevButton = modal.querySelector('.industry-gallery-prev');
        var nextButton = modal.querySelector('.industry-gallery-next');
        var stage = modal.querySelector('.industry-gallery-stage');
        var activeGallery = [];
        var activeIndex = 0;
        var touchStartX = 0;
        var labels = getGalleryLabels();

        function renderGallery() {
            if (!activeGallery.length) {
                return;
            }

            image.src = activeGallery[activeIndex];
            image.alt = title.textContent + ' 工程成果圖 ' + (activeIndex + 1);
            counter.textContent = (activeIndex + 1) + ' / ' + activeGallery.length;
            dots.innerHTML = activeGallery.map(function (_, index) {
                return '<button type="button" class="' + (index === activeIndex ? 'is-active' : '') + '" aria-label="查看第 ' + (index + 1) + ' 張工程成果圖"></button>';
            }).join('');

            Array.prototype.forEach.call(dots.querySelectorAll('button'), function (button, index) {
                button.addEventListener('click', function () {
                    activeIndex = index;
                    renderGallery();
                });
            });
        }

        function moveGallery(direction) {
            activeIndex = (activeIndex + direction + activeGallery.length) % activeGallery.length;
            renderGallery();
        }

        function closeGallery() {
            modal.classList.add('hidden');
            document.body.classList.remove('industry-gallery-open');
        }

        function openGallery(card) {
            activeGallery = parseGallery(card);
            if (!activeGallery.length) {
                return;
            }

            activeIndex = 0;
            var cardTitle = card.getAttribute('data-gallery-title') || '';
            var heading = card.querySelector('.industry-result-body h3');
            title.textContent = cardTitle || (heading ? heading.textContent.trim() : '工程成果');
            modal.classList.remove('hidden');
            document.body.classList.add('industry-gallery-open');
            renderGallery();
        }

        cards.forEach(function (card) {
            var buttonOnly = card.getAttribute('data-gallery-trigger') === 'button';

            if (!buttonOnly) {
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', '查看公司工程成果圖');
            }

            var button = card.querySelector('.industry-result-view-button');
            if (button) {
                button.setAttribute('aria-haspopup', 'dialog');
                button.setAttribute('aria-label', labels.view);
                var buttonText = button.querySelector('span');
                if (buttonText) {
                    buttonText.textContent = labels.view;
                }
                button.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    openGallery(card);
                });
            }

            if (buttonOnly) {
                return;
            }

            card.addEventListener('click', function (event) {
                if (event.target.closest('button')) {
                    return;
                }
                openGallery(card);
            });

            card.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openGallery(card);
                }
            });
        });

        prevButton.addEventListener('click', function () {
            moveGallery(-1);
        });

        nextButton.addEventListener('click', function () {
            moveGallery(1);
        });

        stage.addEventListener('touchstart', function (event) {
            touchStartX = event.touches[0].clientX;
        }, { passive: true });

        stage.addEventListener('touchend', function (event) {
            var deltaX = event.changedTouches[0].clientX - touchStartX;
            if (Math.abs(deltaX) > 42) {
                moveGallery(deltaX > 0 ? -1 : 1);
            }
        }, { passive: true });

        modal.addEventListener('click', function (event) {
            if (event.target.closest('[data-gallery-close]')) {
                closeGallery();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (modal.classList.contains('hidden')) {
                return;
            }

            if (event.key === 'Escape') {
                closeGallery();
            } else if (event.key === 'ArrowLeft') {
                moveGallery(-1);
            } else if (event.key === 'ArrowRight') {
                moveGallery(1);
            }
        });
    }
}());

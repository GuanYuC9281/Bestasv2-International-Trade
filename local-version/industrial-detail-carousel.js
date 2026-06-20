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
            document.querySelectorAll('.industrial-detail-page ' + config.cardSelector).forEach(function (card) {
                initCarousel(card.parentElement, config);
            });
        });
    });
}());

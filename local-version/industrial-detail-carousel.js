(function () {
    function updateButtons(track, prevButton, nextButton) {
        var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
        prevButton.disabled = track.scrollLeft <= 2;
        nextButton.disabled = track.scrollLeft >= maxScroll;
    }

    function scrollTrack(track, direction) {
        var firstCard = track.querySelector('.product-equipment-card-numbered');
        var step = firstCard ? firstCard.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
        track.scrollBy({ left: direction * step, behavior: 'smooth' });
    }

    function initEquipmentCarousel(track) {
        if (!track || track.dataset.equipmentCarouselReady === 'true') {
            return;
        }

        var cards = track.querySelectorAll(':scope > .product-equipment-card-numbered');
        if (cards.length < 2) {
            return;
        }

        track.dataset.equipmentCarouselReady = 'true';
        track.classList.add('product-equipment-track');

        var wrapper = document.createElement('div');
        wrapper.className = 'product-equipment-mobile-carousel';
        track.parentNode.insertBefore(wrapper, track);
        wrapper.appendChild(track);

        var prevButton = document.createElement('button');
        prevButton.type = 'button';
        prevButton.className = 'product-equipment-carousel-arrow product-equipment-carousel-arrow-left';
        prevButton.setAttribute('aria-label', '\u5411\u5de6\u700f\u89bd\u7522\u54c1');
        prevButton.innerHTML = '<i class="fas fa-chevron-left" aria-hidden="true"></i>';

        var nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.className = 'product-equipment-carousel-arrow product-equipment-carousel-arrow-right';
        nextButton.setAttribute('aria-label', '\u5411\u53f3\u700f\u89bd\u7522\u54c1');
        nextButton.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';

        wrapper.insertBefore(prevButton, track);
        wrapper.insertBefore(nextButton, track);

        prevButton.addEventListener('click', function () {
            if (!prevButton.disabled) {
                scrollTrack(track, -1);
            }
        });

        nextButton.addEventListener('click', function () {
            if (!nextButton.disabled) {
                scrollTrack(track, 1);
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
        document.querySelectorAll('.industrial-detail-page .product-equipment-card-numbered').forEach(function (card) {
            var track = card.parentElement;
            if (track) {
                initEquipmentCarousel(track);
            }
        });
    });
}());

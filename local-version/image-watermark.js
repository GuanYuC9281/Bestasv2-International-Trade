(function () {
    const WATERMARK_SRC = '../images/company/logo.png';
    const MIN_VISIBLE_SIZE = 34;
    const CASE_IMAGE_SELECTOR = '.home-cases-section, .home-client-section, .client-marquee, .client-marquee-item';
    const TITLE_BACKGROUND_SELECTOR = [
        '.home-industrial-hero',
        '.services-hero',
        '.contact-hero',
        '.privacy-hero',
        '.faq-hero',
        '.about-hero',
        '.product-detail-hero'
    ].join(', ');
    const imageEntries = new Map();
    const backgroundEntries = new Map();
    const resizeObserver = window.ResizeObserver ? new ResizeObserver(scheduleUpdate) : null;
    let updateQueued = false;
    let logoUrl = '';

    function getLogoUrl() {
        if (!logoUrl) {
            try {
                logoUrl = new URL(WATERMARK_SRC, document.baseURI).href;
            } catch (error) {
                logoUrl = WATERMARK_SRC;
            }
        }

        return logoUrl;
    }

    function cssUrl(url) {
        return 'url("' + String(url).replace(/"/g, '\\"') + '")';
    }

    function normalizeSource(source) {
        return String(source || '').replace(/\\/g, '/').toLowerCase();
    }

    function isCompanyLogo(source) {
        const normalized = normalizeSource(source);
        return normalized.includes('/images/company/logo') || normalized.includes('images/company/logo');
    }

    function isWatermarkableImage(image) {
        if (!image || image.dataset.watermark === 'off' || image.closest('.site-watermark-mark')) {
            return false;
        }

        const source = normalizeSource(image.currentSrc || image.getAttribute('src'));
        if (!source || !source.includes('images/') || isCompanyLogo(source)) {
            return false;
        }

        if (image.closest(CASE_IMAGE_SELECTOR)) {
            return false;
        }

        return /\.(png|jpe?g|webp|gif|avif)(?:[?#].*)?$/.test(source);
    }

    function isWatermarkableBackground(element) {
        if (!element || element.dataset.watermark === 'off' || element.classList.contains('site-watermark-mark')) {
            return false;
        }

        if (element.matches(TITLE_BACKGROUND_SELECTOR)) {
            return false;
        }

        const styleText = normalizeSource(element.getAttribute('style'));
        return styleText.includes('background-image')
            && styleText.includes('url(')
            && styleText.includes('images/')
            && !isCompanyLogo(styleText);
    }

    function ensurePositionAnchor(element) {
        if (!element || element.dataset.watermarkPositionAnchored === 'true') {
            return;
        }

        if (window.getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }

        element.dataset.watermarkPositionAnchored = 'true';
    }

    function createMark(className) {
        const mark = document.createElement('span');
        mark.className = 'site-watermark-mark ' + className;
        mark.setAttribute('aria-hidden', 'true');
        mark.style.setProperty('--site-watermark-logo', cssUrl(getLogoUrl()));
        return mark;
    }

    function configureMark(mark, rect, isBackground) {
        const shortestSide = Math.min(rect.width, rect.height);
        const compact = !isBackground && (rect.width < 130 || rect.height < 92);
        const idealWidth = isBackground
            ? rect.width * 0.13
            : Math.min(rect.width * 0.26, rect.height * 0.4);
        const minWidth = isBackground ? 92 : (compact ? 30 : 48);
        const maxWidth = isBackground ? 174 : 118;
        const width = Math.round(Math.min(maxWidth, Math.max(minWidth, idealWidth)));
        const offset = Math.round(Math.min(isBackground ? 32 : 18, Math.max(compact ? 5 : 8, shortestSide * 0.045)));
        const padding = Math.round(Math.min(22, Math.max(8, width * 0.18)));

        mark.dataset.watermarkCompact = compact ? 'true' : 'false';
        mark.style.setProperty('--site-watermark-width', width + 'px');
        mark.style.setProperty('--site-watermark-offset', offset + 'px');
        mark.style.setProperty('--site-watermark-padding', padding + 'px');
    }

    function applyImageWatermark(image) {
        if (!isWatermarkableImage(image) || imageEntries.has(image)) {
            return;
        }

        const parent = image.parentElement;
        if (!parent) {
            return;
        }

        ensurePositionAnchor(parent);
        parent.classList.add('site-has-image-watermark');

        const mark = createMark('site-image-watermark-mark');
        parent.appendChild(mark);

        const entry = { image, parent, mark };
        imageEntries.set(image, entry);

        image.addEventListener('load', scheduleUpdate);
        if (resizeObserver) {
            resizeObserver.observe(image);
            resizeObserver.observe(parent);
        }

        scheduleUpdate();
    }

    function applyBackgroundWatermark(element) {
        if (!isWatermarkableBackground(element) || backgroundEntries.has(element)) {
            return;
        }

        ensurePositionAnchor(element);
        element.classList.add('site-has-background-watermark');

        const mark = createMark('site-background-watermark-mark');
        element.appendChild(mark);

        const entry = { element, mark };
        backgroundEntries.set(element, entry);

        if (resizeObserver) {
            resizeObserver.observe(element);
        }

        scheduleUpdate();
    }

    function removeImageEntry(image, entry) {
        if (resizeObserver) {
            resizeObserver.unobserve(entry.image);
            resizeObserver.unobserve(entry.parent);
        }

        entry.mark.remove();
        imageEntries.delete(image);
    }

    function removeBackgroundEntry(element, entry) {
        if (resizeObserver) {
            resizeObserver.unobserve(entry.element);
        }

        entry.mark.remove();
        backgroundEntries.delete(element);
    }

    function updateImageEntry(image, entry) {
        if (!document.documentElement.contains(image) || !document.documentElement.contains(entry.mark)) {
            removeImageEntry(image, entry);
            return;
        }

        if (!isWatermarkableImage(image)) {
            removeImageEntry(image, entry);
            return;
        }

        const imageRect = image.getBoundingClientRect();
        const parentRect = entry.parent.getBoundingClientRect();

        if (imageRect.width < MIN_VISIBLE_SIZE || imageRect.height < MIN_VISIBLE_SIZE || parentRect.width <= 0 || parentRect.height <= 0) {
            entry.mark.hidden = true;
            return;
        }

        const left = imageRect.left - parentRect.left + entry.parent.scrollLeft - entry.parent.clientLeft;
        const top = imageRect.top - parentRect.top + entry.parent.scrollTop - entry.parent.clientTop;

        entry.mark.hidden = false;
        entry.mark.style.left = Math.max(0, Math.round(left)) + 'px';
        entry.mark.style.top = Math.max(0, Math.round(top)) + 'px';
        entry.mark.style.width = Math.round(imageRect.width) + 'px';
        entry.mark.style.height = Math.round(imageRect.height) + 'px';
        entry.mark.style.borderRadius = window.getComputedStyle(image).borderRadius;
        configureMark(entry.mark, imageRect, false);
    }

    function updateBackgroundEntry(element, entry) {
        if (!document.documentElement.contains(element) || !document.documentElement.contains(entry.mark)) {
            removeBackgroundEntry(element, entry);
            return;
        }

        if (!isWatermarkableBackground(element)) {
            removeBackgroundEntry(element, entry);
            return;
        }

        const rect = element.getBoundingClientRect();
        if (rect.width < MIN_VISIBLE_SIZE || rect.height < MIN_VISIBLE_SIZE) {
            entry.mark.hidden = true;
            return;
        }

        entry.mark.hidden = false;
        configureMark(entry.mark, rect, true);
    }

    function updateAllMarks() {
        imageEntries.forEach(function (entry, image) {
            updateImageEntry(image, entry);
        });
        backgroundEntries.forEach(function (entry, element) {
            updateBackgroundEntry(element, entry);
        });
    }

    function scheduleUpdate() {
        if (updateQueued) {
            return;
        }

        updateQueued = true;
        window.requestAnimationFrame(function () {
            updateQueued = false;
            updateAllMarks();
        });
    }

    function scanImages(root) {
        if (root instanceof HTMLImageElement) {
            applyImageWatermark(root);
            return;
        }

        if (!root.querySelectorAll) {
            return;
        }

        root.querySelectorAll('img').forEach(applyImageWatermark);
    }

    function scanBackgrounds(root) {
        if (root instanceof HTMLElement) {
            applyBackgroundWatermark(root);
        }

        if (!root.querySelectorAll) {
            return;
        }

        root.querySelectorAll('[style*="background-image"]').forEach(applyBackgroundWatermark);
    }

    function scan(root) {
        scanImages(root);
        scanBackgrounds(root);
        scheduleUpdate();
    }

    function watchForNewImages() {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            scan(node);
                        }
                    });
                    return;
                }

                if (mutation.target instanceof HTMLImageElement) {
                    applyImageWatermark(mutation.target);
                    scheduleUpdate();
                } else if (mutation.target instanceof HTMLElement) {
                    applyBackgroundWatermark(mutation.target);
                    scheduleUpdate();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['src', 'srcset', 'style', 'class'],
            childList: true,
            subtree: true
        });
    }

    function initWatermarks() {
        scan(document);
        watchForNewImages();
        window.addEventListener('load', scheduleUpdate, { once: true });
        window.addEventListener('resize', scheduleUpdate, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWatermarks, { once: true });
    } else {
        initWatermarks();
    }
}());

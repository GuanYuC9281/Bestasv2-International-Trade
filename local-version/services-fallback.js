(function () {
    function closeFallbackModal() {
        const modal = document.getElementById('productModal');
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function openCardModal(button) {
        const card = button.closest('.group');
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const content = document.getElementById('productModalContent');
        if (!card || !modal || !title || !content) return;

        const cardTitle = card.querySelector('h3')?.textContent?.trim() || '產品詳情';
        const cardDescription = card.querySelector('h4')?.textContent?.trim() || '歡迎聯繫我們了解更多產品與工程服務內容。';
        const cardImage = card.querySelector('img')?.getAttribute('src') || '';

        title.textContent = cardTitle;
        content.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8">
                <div class="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center">
                    <img src="${cardImage}" alt="${cardTitle}" class="w-full max-h-80 object-contain">
                </div>
                <div class="flex flex-col justify-center">
                    <h4 class="text-2xl font-bold text-[#0f2742] mb-4">${cardTitle}</h4>
                    <p class="text-gray-600 leading-relaxed mb-6">${cardDescription}</p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="contact.html" class="flex-1 bg-[#0f2742] text-white py-3 px-6 rounded-lg hover:bg-[#17395c] transition-colors duration-200 text-center font-semibold">
                            <i class="fas fa-envelope mr-2"></i>
                            聯繫詢問
                        </a>
                        <button type="button" onclick="closeProductModal()" class="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold">
                            關閉
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function showFallbackProductDetail(productId) {
        const button = document.querySelector(`#categoriesContainer button[onclick*="${productId}"]`);
        if (button) openCardModal(button);
    }

    window.closeProductModal = window.closeProductModal || closeFallbackModal;
    window.showProductDetail = window.showProductDetail || showFallbackProductDetail;

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof window.showProductDetail === 'function' && window.showProductDetail !== showFallbackProductDetail) {
            return;
        }

        document.querySelectorAll('#categoriesContainer button').forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                openCardModal(button);
            }, true);
        });
    });

    document.addEventListener('click', function (event) {
        const modal = document.getElementById('productModal');
        if (modal && event.target === modal && !modal.classList.contains('hidden')) {
            window.closeProductModal();
        }
    });
})();

// International Trade Website - Local Version
// Complete functionality without Node.js dependency

// Multi-language Support
const translations = {
    'zh-TW': {
        companyName: '貝達國際貿易有限公司',
        phone: '+886-985-328-164',
        address: '台北市文山區木柵路二段',
        nav: {
            home: '首頁',
            about: '關於我們',
            products: '產品與服務',
            process: '合作流程',
            news: '最新消息',
            faq: '常見問題',
            contact: '聯絡我們',
            admin: '管理後台'
        },
        hero: {
            title: '專業國際貿易解決方案',
            subtitle: '貝達國際貿易有限公司提供全方位的採購代理、進出口服務，為您連接全球商機',
            cta: '立即諮詢'
        },
        services: {
            title: '服務總覽',
            procurement: '採購代理',
            procurementDesc: '專業的全球採購服務，為您找到最優質的供應商',
            importExport: '進出口服務',
            importExportDesc: '完整的進出口流程管理，確保貨物順利通關',
            matching: '供應商媒合',
            matchingDesc: '精準匹配供應商需求，提升合作效率',
            quotation: '報價與樣品',
            quotationDesc: '快速報價與樣品安排，加速決策流程'
        },
        about: {
            title: '關於我們',
            intro: '貝達國際貿易有限公司成立以來，致力於提供專業的國際貿易服務',
            vision: '願景',
            visionDesc: '打造全球領先的貿易服務平台，促進國際商業交流',
            mission: '使命',
            missionDesc: '成為客戶最信賴的國際貿易夥伴，創造最大商業價值'
        },
        contact: {
            title: '聯絡我們',
            formTitle: '送出聯絡表單',
            form: {
                name: '姓名',
                email: '電子郵件',
                phone: '電話',
                company: '公司名稱',
                subject: '主題',
                message: '訊息內容',
                submit: '送出表單'
            },
            info: {
                title: '聯絡資訊',
                phone: '電話',
                email: '電子郵件',
                address: '地址'
            }
        },
        footer: {
            about: '關於我們',
            services: '服務項目',
            contact: '聯絡方式'
        },
        social: {
            title: '關注我們',
            desc: '透過社群媒體了解我們的最新動態'
        },
        common: {
            learnMore: '了解更多',
            save: '儲存',
            cancel: '取消',
            edit: '編輯',
            delete: '刪除',
            success: '成功',
            error: '錯誤',
            loading: '載入中...'
        }
    },
    'en': {
        companyName: 'Bestas International Trade Co., Ltd.',
        phone: '+886-985-328-164',
        address: 'Section 2, Muzha Road, Wenshan District, Taipei City',
        nav: {
            home: 'Home',
            about: 'About Us',
            products: 'Products & Services',
            process: 'Process',
            news: 'News',
            faq: 'FAQ',
            contact: 'Contact',
            admin: 'Admin'
        },
        hero: {
            title: 'Professional International Trade Solutions',
            subtitle: 'Bestas International Trade provides comprehensive procurement and import-export services, connecting you to global business opportunities',
            cta: 'Contact Now'
        },
        services: {
            title: 'Services Overview',
            procurement: 'Procurement Agency',
            procurementDesc: 'Professional global procurement services to find the best suppliers for you',
            importExport: 'Import-Export Services',
            importExportDesc: 'Complete import-export process management ensuring smooth customs clearance',
            matching: 'Supplier Matching',
            matchingDesc: 'Precise supplier matching to improve cooperation efficiency',
            quotation: 'Quotation & Samples',
            quotationDesc: 'Fast quotation and sample arrangement to accelerate decision-making'
        },
        about: {
            title: 'About Us',
            intro: 'Since its establishment, Bestas International Trade has been committed to providing professional international trade services',
            vision: 'Vision',
            visionDesc: 'To build a globally leading trade service platform, promoting international business exchange',
            mission: 'Mission',
            missionDesc: 'To become the most trusted international trade partner for clients, creating maximum business value'
        },
        contact: {
            title: 'Contact Us',
            formTitle: 'Send Contact Form',
            form: {
                name: 'Name',
                email: 'Email',
                phone: 'Phone',
                company: 'Company Name',
                subject: 'Subject',
                message: 'Message',
                submit: 'Submit Form'
            },
            info: {
                title: 'Contact Information',
                phone: 'Phone',
                email: 'Email',
                address: 'Address'
            }
        },
        footer: {
            about: 'About Us',
            services: 'Services',
            contact: 'Contact'
        },
        social: {
            title: 'Follow Us',
            desc: 'Follow us on social media for latest updates'
        },
        common: {
            learnMore: 'Learn More',
            save: 'Save',
            cancel: 'Cancel',
            edit: 'Edit',
            delete: 'Delete',
            success: 'Success',
            error: 'Error',
            loading: 'Loading...'
        }
    },
    'ja': {
        companyName: 'ベスタス国際貿易有限公司',
        phone: '+886-985-328-164',
        address: '台北市文山区木柵路二段',
        nav: {
            home: 'ホーム',
            about: '会社概要',
            products: '製品・サービス',
            process: 'プロセス',
            news: 'ニュース',
            faq: 'よくある質問',
            contact: 'お問い合わせ',
            admin: '管理'
        },
        hero: {
            title: 'プロフェッショナルな国際貿易ソリューション',
            subtitle: 'ベスタス国際貿易は包括的な調達・輸出入サービスを提供し、グローバルなビジネスチャンスにつなぎます',
            cta: '今すぐ相談'
        },
        services: {
            title: 'サービス概要',
            procurement: '調達代理',
            procurementDesc: '最高のサプライヤーを見つけるためのプロフェッショナルなグローバル調達サービス',
            importExport: '輸出入サービス',
            importExportDesc: '円滑な通関を確保する完全な輸出入プロセス管理',
            matching: 'サプライヤーマッチング',
            matchingDesc: '協力効率を向上させる精密なサプライヤーマッチング',
            quotation: '見積もりとサンプル',
            quotationDesc: '意思決定を加速する迅速な見積もりとサンプル手配'
        },
        about: {
            title: '会社概要',
            intro: '設立以来、ベスタス国際貿易はプロフェッショナルな国際貿易サービスの提供に尽力してきました',
            vision: 'ビジョン',
            visionDesc: 'グローバルリーディングの貿易サービスプラットフォームを構築し、国際ビジネス交流を促進する',
            mission: '使命',
            missionDesc: '顧客にとって最も信頼できる国際貿易パートナーとなり、最大のビジネス価値を創造する'
        },
        contact: {
            title: 'お問い合わせ',
            formTitle: 'お問い合わせフォーム',
            form: {
                name: 'お名前',
                email: 'メール',
                phone: '電話番号',
                company: '会社名',
                subject: '件名',
                message: 'メッセージ内容',
                submit: 'フォーム送信'
            },
            info: {
                title: '連絡先情報',
                phone: '電話',
                email: 'メール',
                address: '住所'
            }
        },
        footer: {
            about: '会社概要',
            services: 'サービス項目',
            contact: '連絡方法'
        },
        social: {
            title: 'フォローする',
            desc: 'ソーシャルメディアで最新情報をフォローしてください'
        },
        common: {
            learnMore: '詳細を見る',
            save: '保存',
            cancel: 'キャンセル',
            edit: '編集',
            delete: '削除',
            success: '成功',
            error: 'エラー',
            loading: '読み込み中...'
        }
    },
    'vi': {
        companyName: 'Công Ty TNHH Thương Mại Quốc Tế Bestas',
        phone: '+886-985-328-164',
        address: 'Đoạn 2, Đường Muzha, Quận Wenshan, Thành phố Đài Bắc',
        nav: {
            home: 'Trang chủ',
            about: 'Về chúng tôi',
            products: 'Sản phẩm & Dịch vụ',
            process: 'Quy trình',
            news: 'Tin tức',
            faq: 'Câu hỏi thường gặp',
            contact: 'Liên hệ',
            admin: 'Quản trị'
        },
        hero: {
            title: 'Giải pháp Thương mại Quốc tế Chuyên nghiệp',
            subtitle: 'Bestas International Trade cung cấp dịch vụ mua hàng và xuất nhập khẩu toàn diện, kết nối bạn với cơ hội kinh doanh toàn cầu',
            cta: 'Liên hệ ngay'
        },
        services: {
            title: 'Tổng quan Dịch vụ',
            procurement: 'Đại lý Mua hàng',
            procurementDesc: 'Dịch vụ mua hàng toàn cầu chuyên nghiệp để tìm nhà cung cấp tốt nhất cho bạn',
            importExport: 'Dịch vụ Xuất nhập khẩu',
            importExportDesc: 'Quản lý quy trình xuất nhập khẩu hoàn chỉnh đảm bảo thông quan suôn sẻ',
            matching: 'Kết nối Nhà cung cấp',
            matchingDesc: 'Kết nối chính xác nhà cung cấp để cải thiện hiệu quả hợp tác',
            quotation: 'Báo giá & Mẫu',
            quotationDesc: 'Báo giá nhanh và sắp xếp mẫu để tăng tốc độ ra quyết định'
        },
        about: {
            title: 'Về chúng tôi',
            intro: 'Kể từ khi thành lập, Bestas International Trade đã cam kết cung cấp dịch vụ thương mại quốc tế chuyên nghiệp',
            vision: 'Tầm nhìn',
            visionDesc: 'Xây dựng nền tảng dịch vụ thương mại hàng đầu thế giới, thúc đẩy trao đổi kinh doanh quốc tế',
            mission: 'Sứ mệnh',
            missionDesc: 'Trở thành đối tác thương mại quốc tế đáng tin cậy nhất cho khách hàng, tạo ra giá trị kinh doanh tối đa'
        },
        contact: {
            title: 'Liên hệ',
            formTitle: 'Gửi Form Liên hệ',
            form: {
                name: 'Tên',
                email: 'Email',
                phone: 'Điện thoại',
                company: 'Tên công ty',
                subject: 'Chủ đề',
                message: 'Nội dung tin nhắn',
                submit: 'Gửi Form'
            },
            info: {
                title: 'Thông tin Liên hệ',
                phone: 'Điện thoại',
                email: 'Email',
                address: 'Địa chỉ'
            }
        },
        footer: {
            about: 'Về chúng tôi',
            services: 'Dịch vụ',
            contact: 'Liên hệ'
        },
        social: {
            title: 'Theo dõi chúng tôi',
            desc: 'Theo dõi chúng tôi trên mạng xã hội để cập nhật mới nhất'
        },
        common: {
            learnMore: 'Tìm hiểu thêm',
            save: 'Lưu',
            cancel: 'Hủy',
            edit: 'Chỉnh sửa',
            delete: 'Xóa',
            success: 'Thành công',
            error: 'Lỗi',
            loading: 'Đang tải...'
        }
    }
};

// Global State
let currentLanguage = 'zh-TW';
let isMenuOpen = false;
let isLoading = true;

// DOM Elements
const elements = {
    loadingScreen: null,
    mainContent: null,
    navbar: null,
    languageBtn: null,
    langDropdown: null,
    mobileMenuBtn: null,
    mobileMenu: null,
    contactForm: null,
    adminLoginForm: null
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    loadLanguage();
    
    // Simulate loading
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
});

function initializeElements() {
    elements.loadingScreen = document.getElementById('loadingScreen');
    elements.mainContent = document.getElementById('mainContent');
    elements.navbar = document.getElementById('navbar');
    elements.languageBtn = document.getElementById('languageBtn');
    elements.langDropdown = document.getElementById('langDropdown');
    elements.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    elements.mobileMenu = document.getElementById('mobileMenu');
    elements.contactForm = document.getElementById('contactForm');
    elements.adminLoginForm = document.getElementById('adminLoginForm');
}

function initializeEventListeners() {
    // Language selector
    if (elements.languageBtn) {
        elements.languageBtn.addEventListener('click', toggleLanguageDropdown);
    }

    // Language options
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', function() {
            changeLanguage(this.dataset.lang);
        });
    });

    // Mobile menu
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Contact form
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Admin login form
    if (elements.adminLoginForm) {
        elements.adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    // Navigation scroll effect
    window.addEventListener('scroll', handleNavScroll);

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!elements.languageBtn.contains(e.target)) {
            elements.langDropdown.classList.add('hidden');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function hideLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.style.opacity = '0';
        elements.loadingScreen.style.visibility = 'hidden';
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
        }, 500);
    }
    
    if (elements.mainContent) {
        elements.mainContent.classList.remove('hidden');
        elements.mainContent.classList.add('fade-in');
    }
    
    isLoading = false;
}

function loadLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'zh-TW';
    changeLanguage(savedLang);
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update language button
    const langNames = {
        'zh-TW': '繁體中文',
        'en': 'English',
        'ja': '日本語',
        'vi': 'Tiếng Việt'
    };
    
    if (elements.languageBtn) {
        document.getElementById('currentLang').textContent = langNames[lang];
    }
    
    // Update all translatable elements
    updateTranslations();
    
    // Close dropdown
    if (elements.langDropdown) {
        elements.langDropdown.classList.add('hidden');
    }
}

function updateTranslations() {
    const t = translations[currentLanguage];
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        const value = getNestedValue(t, key);
        if (value) {
            element.textContent = value;
        }
    });
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

function toggleLanguageDropdown() {
    if (elements.langDropdown) {
        elements.langDropdown.classList.toggle('hidden');
        document.getElementById('langChevron').classList.toggle('rotate-180');
    }
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    if (elements.mobileMenu) {
        elements.mobileMenu.classList.toggle('hidden');
    }
    
    // Update menu button icon
    const icon = elements.mobileMenuBtn.querySelector('i');
    if (icon) {
        icon.className = isMenuOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl';
    }
}

function handleNavScroll() {
    if (elements.navbar) {
        if (window.scrollY > 20) {
            elements.navbar.classList.add('nav-scrolled');
        } else {
            elements.navbar.classList.remove('nav-scrolled');
        }
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!data.name || !data.email || !data.phone || !data.subject || !data.message) {
        showToast('請填寫所有必填欄位', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showToast('請輸入有效的電子郵件地址', 'error');
        return;
    }
    
    // Save to localStorage (simulating backend)
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push({
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        language: currentLanguage
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    // Show success message
    showToast('表單已成功提交！我們會盡快回覆您。', 'success');
    
    // Reset form
    elements.contactForm.reset();
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.adminLoginForm);
    const data = Object.fromEntries(formData);
    
    // Debug: 添加調試信息
    console.log('登入資料:', data);
    console.log('用戶名:', data.username);
    console.log('密碼:', data.password);
    
    // Simple validation (in real app, this would be server-side)
    if (data.username === 'admin' && data.password === 'admin123') {
        showToast('登入成功！', 'success');
        setTimeout(() => {
            showAdminDashboard();
        }, 1000);
    } else {
        showToast('用戶名或密碼錯誤', 'error');
    }
}

function showAdminDashboard() {
    // Hide admin login form
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (loginSection) {
        loginSection.classList.add('hidden');
    }
    
    if (dashboardSection) {
        dashboardSection.classList.remove('hidden');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Load recent contacts
    loadRecentContacts();
}

// ...

function getRecentContacts() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const recent = submissions.slice(-5).reverse();
    
    if (recent.length === 0) {
        return '<p class="text-gray-500 text-center py-8">暫無聯絡記錄</p>';
    }
    
    return recent.map(contact => `
        <div class="border-b border-gray-200 pb-4 last:border-b-0">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-semibold text-gray-900">${contact.name}</h4>
                    <p class="text-sm text-gray-600">${contact.email}</p>
                    <p class="text-sm text-gray-500 mt-1">${contact.subject}</p>
                </div>
                <div class="text-right">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        新
                    </span>
                    <p class="text-xs text-gray-500 mt-1">
                        ${new Date(contact.timestamp).toLocaleDateString('zh-TW')}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${getToastIcon(type)} mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Add CSS class for rotation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .rotate-180 {
            transform: rotate(180deg);
        }
    </style>
`);

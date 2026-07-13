// js/main.js - সম্পূর্ণ নতুন সংস্করণ (তারিখ ও সময় সমস্যার স্থায়ী সমাধানসহ)

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM সম্পূর্ণভাবে লোড হয়েছে');
    
    loadHeader();
    loadFooter();
    loadSidebar();
    setupNavigation();
    setupSearch();
    setupArchiveToggle();
    
    // প্রতি সেকেন্ডে সময় আপডেট করার জন্য ইন্টারভাল সেট করা হলো
    setInterval(updateDateTime, 1000);
});

// হেডার লোড করুন
async function loadHeader() {
    const headerContainer = document.getElementById('headerContainer');
    if (!headerContainer) {
        console.error('headerContainer এলিমেন্ট পাওয়া যায়নি');
        return;
    }
    
    try {
        console.log('হেডার লোড করা হচ্ছে...');
        const response = await fetch('./header.html');
        
        if (!response.ok) {
            console.warn('হেডার fetch ব্যর্থ:', response.status);
            headerContainer.innerHTML = getHeaderHTML();
            updateDateTime(); // ফলব্যাক লোড হলেও ঘড়ি প্রথমবার রান করাবে
            return;
        }
        
        const html = await response.text();
        headerContainer.innerHTML = html;
        console.log('✅ হেডার সফলভাবে লোড হয়েছে');
        
        // হেডার পেজে সফলভাবে বসার ঠিক পর পরই ঘড়িটি প্রথমবার রান করানো হলো
        updateDateTime();
        
    } catch (error) {
        console.error('হেডার লোড ত্রুটি:', error);
        console.log('ফলব্যাক হেডার ব্যবহার করছি...');
        headerContainer.innerHTML = getHeaderHTML();
        updateDateTime(); // এরর আসলেও ঘড়ি রান করাবে
    }
}

// ফুটার লোড করুন
async function loadFooter() {
    const footerContainer = document.getElementById('footerContainer');
    if (!footerContainer) {
        console.error('footerContainer এলিমেন্ট পাওয়া যায়নি');
        return;
    }
    
    try {
        console.log('ফুটার লোড করা হচ্ছে...');
        const response = await fetch('./footer.html');
        
        if (!response.ok) {
            console.warn('ফুটার fetch ব্যর্থ:', response.status);
            footerContainer.innerHTML = getFooterHTML();
            return;
        }
        
        const html = await response.text();
        footerContainer.innerHTML = html;
        console.log('✅ ফুটার সফলভাবে লোড হয়েছে');
        
    } catch (error) {
        console.error('ফুটার লোড ত্রুটি:', error);
        footerContainer.innerHTML = getFooterHTML();
    }
}

// সাইডবার লোড করুন
async function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    if (!sidebarContainer) {
        console.error('sidebarContainer এলিমেন্ট পাওয়া যায়নি');
        return;
    }
    
    try {
        console.log('সাইডবার লোড করা হচ্ছে...');
        const response = await fetch('./sidebar.html');
        
        if (!response.ok) {
            console.warn('সাইডবার fetch ব্যর্থ:', response.status);
            sidebarContainer.innerHTML = getSidebarHTML();
            return;
        }
        
        const html = await response.text();
        sidebarContainer.innerHTML = html;
        console.log('✅ সাইডবার সফলভাবে লোড হয়েছে');
        
    } catch (error) {
        console.error('সাইডবার লোড ত্রুটি:', error);
        sidebarContainer.innerHTML = getSidebarHTML();
    }
}

// বর্তমান তারিখ এবং সময় আপডেট করুন (লাইভ বাংলা ঘড়িসহ নিরাপদ লজিক)
function updateDateTime() {
    const dateTimeEl = document.getElementById('dateTime');
    
    // হেডার লোড হতে দেরি হলে বা এলিমেন্ট পেজে না থাকলে ফাংশনটি এরর না দিয়ে এখানেই থেমে যাবে
    if (!dateTimeEl) return; 

    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    // আন্তর্জাতিক স্ট্যান্ডার্ড অনুযায়ী বাংলা লোকাল ফরম্যাট তৈরি
    let bengaliDate = new Intl.DateTimeFormat('bn-BD', options).format(now);
    
    // AM/PM টেক্সট ফরম্যাট ঠিক রাখা হলো
    bengaliDate = bengaliDate.replace('AM', 'AM').replace('PM', 'PM');

    dateTimeEl.textContent = bengaliDate;
}

// নেভিগেশন সেটআপ 
function setupNavigation() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mi-nav-link') || e.target.classList.contains('mi-nav-item')) {
            const navLinks = document.querySelectorAll('.mi-nav-link, .mi-nav-item');
            navLinks.forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

// সার্চ বক্স এবং নতুন ফুল-স্ক্রিন সার্চ ওভারলে সেটআপ
function setupSearch() {
    // প্রজেক্টের যদি কোনো ট্র্যাডিশনাল সার্চ ফর্ম থাকে তার হ্যান্ডলার
    const searchForm = document.getElementById('headerSearchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input[name="q"]').value;
            if (query.trim()) {
                window.location.href = `./search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }

    // কিবোর্ডের 'Escape' বাটন চাপলে ফুল-স্ক্রিন সার্চ ওভারলে বন্ধ করার গ্লোবাল লিসেনার
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('searchOverlay');
            if (overlay && overlay.classList.contains('active')) {
                toggleSearchOverlay();
            }
        }
    });
}

// নতুন গ্লোবাল ফাংশন: সার্চ ওভারলে খোলা/বন্ধ করা (HTML এর ক্লিক ইভেন্ট থেকে কল হবে)
function toggleSearchOverlay() {
    const overlay = document.getElementById('searchOverlay');
    const searchField = document.getElementById('searchField');
    
    if (overlay) {
        overlay.classList.toggle('active');
        
        // সার্চ বক্স ওপেন হলে ইনপুটে অটোমেটিক কার্সার ফোকাস হবে
        if (overlay.classList.contains('active') && searchField) {
            setTimeout(() => {
                searchField.focus();
            }, 100);
            
            // মোবাইল বুটস্ট্র্যাপ অফক্যানভাস ড্রয়ার খোলা থাকলে তা নিজে থেকে বন্ধ করে দেবে
            const mobileMenu = document.getElementById('miMobileMenu');
            if (mobileMenu && typeof bootstrap !== 'undefined') {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            }
        }
    }
}

// архив টগল সেটআপ
function setupArchiveToggle() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mi-month-toggle')) {
            e.preventDefault();
            const monthContent = e.target.parentElement.nextElementSibling;
            if (monthContent) {
                monthContent.style.display = monthContent.style.display === 'none' ? 'block' : 'none';
            }
        }
    });
}

// =============== ফলব্যাক HTML কন্টেন্ট (সার্ভার ফেইল করলে বা সরাসরি ফাইল ওপেন করলে এটি দেখাবে) ===============

function getHeaderHTML() {
    return `<!-- ১. টপ বার -->
<div class="mi-top-bar">
    <div class="mi-top-left">
        <span class="mi-date-time" id="dateTime">লোড হচ্ছে...</span>
    </div>
    <div class="mi-top-right">
        <a href="https://facebook.com" target="_blank" class="mi-social-icon-top fb"><i class="fab fa-facebook-f"></i></a>
        <a href="https://youtube.com" target="_blank" class="mi-social-icon-top yt"><i class="fab fa-youtube"></i></a>
        <a href="https://twitter.com" target="_blank" class="mi-social-icon-top tw"><i class="fab fa-x-twitter"></i></a>
        <a href="https://instagram.com" target="_blank" class="mi-social-icon-top insta"><i class="fab fa-instagram"></i></a>
        <a href="https://linkedin.com" target="_blank" class="mi-social-icon-top ln"><i class="fab fa-linkedin-in"></i></a>
        <a href="https://whatsapp.com" target="_blank" class="mi-social-icon-top wa"><i class="fab fa-whatsapp"></i></a>
    </div>
</div>

<!-- ২. লোগো ও বিজ্ঞাপন -->
<div class="mi-logo-section">
    <div class="mi-logo-container">
        <div class="mi-logo">
            <a href="index.html">
                <img src="img/logo.JPG" alt="sottokontho Logo" class="mi-logo-img">
            </a>
        </div>
    </div>
    <div class="mi-banner-ad">
        <a href="https://sottokothon.com" target="_blank" class="mi-ad-image-link">
            <img src="img/ads.JPG" alt="বিজ্ঞাপন" class="mi-responsive-ad-img">
        </a>
    </div>
</div>

<!-- ৩. মোবাইল অ্যাকশন বার -->
<div class="mi-mobile-action-bar">
    <button class="mi-mobile-menu-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#miMobileMenu">
        <i class="fas fa-bars"></i>
    </button>
    <span class="fw-bold text-danger d-block d-sm-none">সত্য কণ্ঠ</span>
    <button class="mi-search-btn-trigger" type="button" onclick="toggleSearchOverlay()">
        <i class="fas fa-search"></i>
    </button>
</div>

<!-- ৪. ডেস্কটপ নেভিগেশন বার -->
<nav class="mi-main-nav">
    <div class="mi-nav-wrapper">
        <a href="./index.html" class="mi-nav-item active">🏠 সর্বশেষ</a>
        <a href="./category.html?cat=national" class="mi-nav-item">জাতীয়</a>
        <a href="./category.html?cat=world" class="mi-nav-item">বিশ্ব</a>
        <a href="./category.html?cat=politics" class="mi-nav-item">রাজনীতি</a>
        <a href="./category.html?cat=country" class="mi-nav-item">সারাদেশ</a>
        <a href="./category.html?cat=sports" class="mi-nav-item">খেলা</a>
        <a href="./category.html?cat=business" class="mi-nav-item">অর্থ-বাণিজ্য</a>
        <a href="./category.html?cat=lifestyle" class="mi-nav-item">লাইফস্টাইল</a>
        <a href="./category.html?cat=tech" class="mi-nav-item">তথ্য-প্রযুক্তি</a>
        <a href="./category.html?cat=entertainment" class="mi-nav-item">বিনোদন</a>
    </div>
    <div class="mi-search-icon">
        <button class="mi-search-btn-trigger" type="button" onclick="toggleSearchOverlay()">🔍</button>
    </div>
</nav>

<!-- ৫. ফুল-স্ক্রিন সার্চ বক্স ওভারলে -->
<div class="mi-search-overlay" id="searchOverlay">
    <button class="mi-search-close" onclick="toggleSearchOverlay()">&times;</button>
    <div class="mi-search-form-wrapper">
        <form action="./search.html" method="GET">
            <div class="mi-search-input-group">
                <input type="text" name="q" class="mi-search-field" placeholder="যা খুঁজছেন তা এখানে লিখুন..." required autocomplete="off" id="searchField">
                <button type="submit" class="mi-search-submit-btn">🔍</button>
            </div>
        </form>
    </div>
</div>

<!-- ৬. ব্রেকিং নিউজ -->
<div class="mi-breaking-news">
    <div class="mi-breaking-label">
        <span class="mi-breaking-dot">●</span> সদ্য প্রাপ্ত:
    </div>
    <div class="mi-ticker-content">
        <div class="mi-ticker-item"><a href="./single-post.html?id=1">দেশের অর্থনৈতিক উন্নয়ন নতুন উচ্চতায় পৌঁছেছে</a></div>
        <div class="mi-ticker-item"><a href="./single-post.html?id=2">ভারী বর্ষণের কারণে পর্যটন কেন্দ্র বন্ধ ঘোষণা</a></div>
    </div>
</div>`;
}

function getFooterHTML() {
    return `<footer class="mi-footer">
    <div class="mi-footer-content">
        <div class="row">
            <div class="col-md-3">
                <h6>আমাদের সম্পর্কে</h6>
                <p>আমরা একটি নির্ভরযোগ্য বাংলা সংবাদ মাধ্যম যা সত্যিকারের খবর নিয়ে আসে।</p>
            </div>
            <div class="col-md-3">
                <h6>কুইক লিংক</h6>
                <ul class="mi-footer-links">
                    <li><a href="./index.html">হোম</a></li>
                    <li><a href="./search.html">সার্চ</a></li>
                    <li><a href="./archive.html">আর্কাইভ</a></li>
                    <li><a href="#contact">যোগাযোগ</a></li>
                </ul>
            </div>
            <div class="col-md-3">
                <h6>জনপ্রিয় ক্যাটাগরি</h6>
                <ul class="mi-footer-links">
                    <li><a href="./category.html?cat=politics">জাতীয় খবর</a></li>
                    <li><a href="./category.html?cat=business">ব্যবসা</a></li>
                    <li><a href="./category.html?cat=tech">প্রযুক্তি</a></li>
                    <li><a href="./category.html?cat=sports">খেলাধুলা</a></li>
                </ul>
            </div>
            <div class="col-md-3">
                <h6>সো셜 মিডিয়া</h6>
                <div class="mi-social-links">
                    <a href="https://facebook.com" class="mi-social-icon" target="_blank">📘</a>
                    <a href="https://twitter.com" class="mi-social-icon" target="_blank">🐦</a>
                    <a href="https://instagram.com" class="mi-social-icon" target="_blank">📷</a>
                    <a href="https://youtube.com" class="mi-social-icon" target="_blank">▶️</a>
                </div>
            </div>
        </div>
    </div>
    <div class="mi-footer-bottom">
        <p>&copy; ২০২৬ সত্য কণ্ঠ। সর্বাধিকার সংরক্ষিত।</p>
    </div>
</footer>`;
}

function getSidebarHTML() {
    return `<aside class="mi-sidebar">
    <div class="mi-widget">
        <h5>সর্বশেষ খবর</h5>
        <ul class="mi-widget-list">
            <li><a href="./single-post.html?id=1">দেশে নতুন অর্থনৈতিক নীতি ঘোষণা</a></li>
            <li><a href="./single-post.html?id=2">বন্যা পরিস্থিতি খারাপ হচ্ছে</a></li>
            <li><a href="./single-post.html?id=3">শিক্ষা ক্ষেত্রে বড় সংস্কার আসছে</a></li>
            <li><a href="./single-post.html?id=4">নতুন প্রযুক্তি স্টার্টআপ চালু</a></li>
            <li><a href="./single-post.html?id=5">জাতীয় ক্রীড়া দলের জয়</a></li>
        </ul>
    </div>
    <div class="mi-widget">
        <h5>বিভাগসমূহ</h5>
        <ul class="mi-widget-list">
            <li><a href="./category.html?cat=politics">জাতীয়</a></li>
            <li><a href="./category.html?cat=world">আন্তর্জাতিক</a></li>
            <li><a href="./category.html?cat=business">ব্যবসা</a></li>
            <li><a href="./category.html?cat=tech">বিজ্ঞান ও প্রযুক্তি</a></li>
            <li><a href="./category.html?cat=health">স্বাস্থ্য</a></li>
            <li><a href="./category.html?cat=sports">খেলাধুলা</a></li>
        </ul>
    </div>
    <div class="mi-widget">
        <h5>বিজ্ঞাপন</h5>
        <div class="mi-ad-placeholder">
            <p>আপনার বিজ্ঞাপন এখানে</p>
        </div>
    </div>
</aside>`;
}

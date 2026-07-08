// js/main.js - সম্পূর্ণ নতুন সংস্করণ (ত্রুটিমুক্ত)

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM সম্পূর্ণভাবে লোড হয়েছে');
    
    loadHeader();
    loadFooter();
    loadSidebar();
    setupNavigation();
    setupSearch();
    setupArchiveToggle();
    updateDateTime();
    
    // প্রতি সেকেন্ডে সময় আপডেট করুন
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
            return;
        }
        
        const html = await response.text();
        headerContainer.innerHTML = html;
        console.log('✅ হেডার সফলভাবে লোড হয়েছে');
        
    } catch (error) {
        console.error('হেডার লোড ত্রুটি:', error);
        console.log('ফলব্যাক হেডার ব্যবহার করছি...');
        headerContainer.innerHTML = getHeaderHTML();
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

// বর্তমান তারিখ এবং সময় আপডেট করুন
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    
    const bengaliDate = new Intl.DateTimeFormat('bn-BD', options).format(now);
    const dateTimeEl = document.getElementById('dateTime');
    if (dateTimeEl) {
        dateTimeEl.textContent = bengaliDate;
    }
}

// নেভিগেশন সেটআপ (ملاحظة: নিশ্চিত করুন আপনার HTML এ mi-nav-link ক্লাসটি আছে)
function setupNavigation() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mi-nav-link') || e.target.classList.contains('mi-nav-item')) {
            const navLinks = document.querySelectorAll('.mi-nav-link, .mi-nav-item');
            navLinks.forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

// সার্চ ফর্ম সেটআপ
function setupSearch() {
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
}

// আর্কাইভ টগল সেটআপ
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

// =============== ফলব্যাক HTML কন্টেন্ট ===============

function getHeaderHTML() {
    return `<div class="mi-top-bar">
    <div class="mi-top-left">
        <span class="mi-date-time" id="dateTime">বুধবার, ৮ জুলাই ২০২৬ | ৩:০১:৪৩ PM</span>
    </div>
    <div class="mi-top-right">
        <a href="https://facebook.com" target="_blank" class="mi-social-icon-top">f</a>
        <a href="https://youtube.com" target="_blank" class="mi-social-icon-top">▶</a>
        <a href="https://twitter.com" target="_blank" class="mi-social-icon-top">𝕏</a>
        <a href="https://instagram.com" target="_blank" class="mi-social-icon-top">📷</a>
        <a href="https://linkedin.com" target="_blank" class="mi-social-icon-top">in</a>
        <a href="https://whatsapp.com" target="_blank" class="mi-social-icon-top">💬</a>
    </div>
</div>

<div class="mi-logo-section">
    <div class="mi-logo-container">
        <div class="mi-logo">
            <h1>📰 আমাদের<span class="mi-logo-bd">নিউজ</span></h1>
            <p class="mi-slogan">সবার আগে সব খবর জানাতে</p>
        </div>
    </div>
    
    <div class="mi-banner-ad">
        <div class="mi-ad-content">
            <div class="mi-ad-icon">🌐</div>
            <div class="mi-ad-text">
                <h3>জনসংযোগাই আমাদের শক্তি</h3>
                <p>পরিবেশ রক্ষা করুন, সুস্থ থাকুন</p>
                <a href="#" class="mi-ad-btn">আরও জানুন</a>
            </div>
        </div>
    </div>
</div>

<nav class="mi-main-nav">
    <div class="mi-nav-wrapper">
        <a href="./index.html" class="mi-nav-item">
            <span class="mi-nav-icon">🏠</span>
            সর্বশেষ
        </a>
        <a href="./category.html?cat=national" class="mi-nav-item">জাতীয়</a>
        <a href="./category.html?cat=world" class="mi-nav-item">বিশ্ব</a>
        <a href="./category.html?cat=politics" class="mi-nav-item">রাজনীতি</a>
        <a href="./category.html?cat=sports" class="mi-nav-item">খেলা</a>
        <a href="./category.html?cat=business" class="mi-nav-item">ব্যবসা</a>
        <a href="./category.html?cat=entertainment" class="mi-nav-item">বিনোদন</a>
        <a href="./category.html?cat=education" class="mi-nav-item">শিক্ষা</a>
    </div>
    
    <form id="headerSearchForm" action="./search.html" method="GET" style="display: flex; align-items: center; margin-left: 15px;">
        <input type="text" name="q" placeholder="খুঁজুন..." style="padding: 3px 8px; border-radius: 4px; border: 1px solid #ccc;">
        <button type="submit" style="background: none; border: none; cursor: pointer; margin-left: 5px;">🔍</button>
    </form>
</nav>

<div class="mi-breaking-news">
    <div class="mi-breaking-label">
        <span class="mi-breaking-dot">●</span>
        সাড়া প্রথম:
    </div>
    <div class="mi-ticker-content">
        <div class="mi-ticker-item">
            <a href="./single-post.html?id=1">
                <strong>খ খবর ১:</strong> দেশে নতুন অর্থনৈতিক নীতি ঘোষণা করা হয়েছে
            </a>
        </div>
        <div class="mi-ticker-item">
            <a href="./single-post.html?id=2">
                <strong>খবর ২:</strong> শিক্ষা ক্ষেত্রে বড় সংস্কার আসতে চলেছে
            </a>
        </div>
    </div>
</div>`; // <--- এই ব্যাকটিকটি ঠিক করা হয়েছে
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
                <h6>সোশ্যাল মিডিয়া</h6>
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
        <p>&copy; ২০২৬ আমাদের নিউজ। সর্বাধিকার সংরক্ষিত।</p>
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
        <h5>জনপ্রিয় খবর</h5>
        <ul class="mi-widget-list">
            <li><a href="./single-post.html?id=10">এই মাসের সবচেয়ে পড়া খবর</a></li>
            <li><a href="./single-post.html?id=11">ভাইরাল খবর - বিশেষ রিপোর্ট</a></li>
            <li><a href="./single-post.html?id=12">পাঠকদের পছন্দের খবর</a></li>
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

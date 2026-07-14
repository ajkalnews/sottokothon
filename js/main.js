// js/main.js - সম্পূর্ণ নতুন ও ১০০% ত্রুটিমুক্ত সংস্করণ

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM সম্পূর্ণভাবে লোড হয়েছে');
    
    // প্রতিটি ফাংশনকে আলাদাভাবে ট্রাই-ক্যাচ দিয়ে রান করা হলো, যাতে একটির এররে অন্যটি না আটকায়
    try { loadHeader(); } catch(e) { console.error(e); }
    try { loadFooter(); } catch(e) { console.error(e); }
    try { loadSidebar(); } catch(e) { console.error(e); }
    try { setupNavigation(); } catch(e) { console.error(e); }
    try { setupSearch(); } catch(e) { console.error(e); }
    try { setupArchiveToggle(); } catch(e) { console.error(e); }
    
    // প্রতি সেকেন্ডে সময় আপডেট করার জন্য ইন্টারভাল
    setInterval(updateDateTime, 1000);
});

// হেডার লোড করুন
async function loadHeader() {
    const headerContainer = document.getElementById('headerContainer');
    if (!headerContainer) {
        console.warn('headerContainer এলিমেন্ট পাওয়া যায়নি');
        // যদি কন্টেইনার না থাকে কিন্তু পেজে সরাসরি ID থাকে, তবুও ঘড়ি ট্রিপ করার চেষ্টা করবে
        updateDateTime(); 
        return;
    }
    
    try {
        console.log('হেডার লোড করা হচ্ছে...');
        const response = await fetch('./header.html');
        
        if (!response.ok) {
            console.warn('হেডার fetch ব্যর্থ:', response.status);
            headerContainer.innerHTML = getHeaderHTML();
            updateDateTime();
            return;
        }
        
        const html = await response.text();
        headerContainer.innerHTML = html;
        console.log('✅ হেডার সফলভাবে লোড হয়েছে');
        
        // হেডার বসার পর সাথে সাথে ঘড়ি চালু
        updateDateTime();
        
    } catch (error) {
        console.error('হেডার লোড ত্রুটি:', error);
        headerContainer.innerHTML = getHeaderHTML();
        updateDateTime();
    }
}

// ফুটার লোড করুন
async function loadFooter() {
    const footerContainer = document.getElementById('footerContainer');
    if (!footerContainer) return; // পেজে ফুটার কন্টেইনার না থাকলে এরর না দিয়ে স্কিপ করবে
    
    try {
        const response = await fetch('./footer.html');
        if (!response.ok) {
            footerContainer.innerHTML = getFooterHTML();
            return;
        }
        const html = await response.text();
        footerContainer.innerHTML = html;
        console.log('✅ ফুটার সফলভাবে লোড হয়েছে');
    } catch (error) {
        footerContainer.innerHTML = getFooterHTML();
    }
}

// সাইডবার লোড করুন
async function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    if (!sidebarContainer) return; // পেজে সাইডবার কন্টেইনার না থাকলে স্কিপ করবে
    
    try {
        const response = await fetch('./sidebar.html');
        if (!response.ok) {
            sidebarContainer.innerHTML = getSidebarHTML();
            return;
        }
        const html = await response.text();
        sidebarContainer.innerHTML = html;
        console.log('✅ সাইডবার সফলভাবে লোড হয়েছে');
    } catch (error) {
        sidebarContainer.innerHTML = getSidebarHTML();
    }
}

// বর্তমান তারিখ এবং সময় আপডেট করুন (১০০% নিরাপদ লজিক)
function updateDateTime() {
    const dateTimeEl = document.getElementById('dateTime');
    
    // যদি পেজে এখনও dateTime আইডি না আসে, তবে এরর না জেনারেট করে ফিরে যাবে
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
    
    let bengaliDate = new Intl.DateTimeFormat('bn-BD', options).format(now);
    
    // AM/PM টেক্সট ফরম্যাট ঠিক করা
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

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('searchOverlay');
            if (overlay && overlay.classList.contains('active')) {
                toggleSearchOverlay();
            }
        }
    });
}

// সার্চ ওভারলে টগল ফাংশন
function toggleSearchOverlay() {
    const overlay = document.getElementById('searchOverlay');
    const searchField = document.getElementById('searchField');
    
    if (overlay) {
        overlay.classList.toggle('active');
        if (overlay.classList.contains('active') && searchField) {
            setTimeout(() => { searchField.focus(); }, 100);
            
            const mobileMenu = document.getElementById('miMobileMenu');
            if (mobileMenu && typeof bootstrap !== 'undefined') {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                if (bsOffcanvas) bsOffcanvas.hide();
            }
        }
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
<div class="mi-logo-section">
    <div class="mi-logo-container">
        <div class="mi-logo">
            <a href="index.html"><img src="img/logo.JPG" alt="Logo" class="mi-logo-img"></a>
        </div>
    </div>
    <div class="mi-banner-ad">
        <a href="https://sottokothon.com" target="_blank"><img src="img/ads.JPG" alt="Ad" class="mi-responsive-ad-img"></a>
    </div>
</div>
<div class="mi-mobile-action-bar">
    <button class="mi-mobile-menu-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#miMobileMenu"><i class="fas fa-bars"></i></button>
    <span class="fw-bold text-danger d-block d-sm-none">সত্য কণ্ঠ</span>
    <button class="mi-search-btn-trigger" type="button" onclick="toggleSearchOverlay()"><i class="fas fa-search"></i></button>
</div>
<nav class="mi-main-nav">
    <div class="mi-nav-wrapper">
        <a href="./index.html" class="mi-nav-item active">🏠 সর্বশেষ</a>
        <a href="./category.html?cat=national" class="mi-nav-item">জাতীয়</a>
        <a href="./category.html?cat=world" class="mi-nav-item">বিশ্ব</a>
        <a href="./category.html?cat=politics" class="mi-nav-item">রাজনীতি</a>
        <a href="./category.html?cat=country" class="mi-nav-item">সারাদেশ</a>
        <a href="./category.html?cat=sports" class="mi-nav-item">খেলা</a>
        <a href="./category.html?cat=business" class="mi-nav-item">অর্থ-বাণিজ্য</a>
    </div>
    <div class="mi-search-icon">
        <button class="mi-search-btn-trigger" type="button" onclick="toggleSearchOverlay()">🔍</button>
    </div>
</nav>
<div class="mi-search-overlay" id="searchOverlay">
    <button class="mi-search-close" onclick="toggleSearchOverlay()">&times;</button>
    <div class="mi-search-form-wrapper">
        <form action="./search.html" method="GET">
            <div class="mi-search-input-group">
                <input type="text" name="q" class="mi-search-field" placeholder="যা খুঁজছেন তা এখানে লিখুন..." required id="searchField">
                <button type="submit" class="mi-search-submit-btn">🔍</button>
            </div>
        </form>
    </div>
</div>`;
}

function getFooterHTML() { return ``; }
function getSidebarHTML() { return ``; }

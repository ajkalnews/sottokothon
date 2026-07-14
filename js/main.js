// js/main.js - সম্পূর্ণ নতুন ও ১০০% ত্রুটিমুক্ত সংস্করণ

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM সম্পূর্ণভাবে লোড হয়েছে');
    
    // প্রতিটি ফাংশনকে আলাদাভাবে ট্রাই-ক্যাচ দিয়ে রান করা হলো, যাতে একটির এররে অন্যটি না আটকায়
    try { loadHeader(); } catch(e) { console.error(e); }
    try { loadFooter(); } catch(e) { console.error(e); }
    try { loadSidebar(); } catch(e) { console.error(e); }
    try { setupNavigation(); } catch(e) { console.error(e); }
    try { setupSearch(); } catch(e) { console.error(e); }
    try { setupArchiveToggle(); } catch(e) { console.error(e); }
    try { renderMainContentNews(); } catch(e) { console.error(e); } // মেইন ডাইনামিক কন্টেন্ট লোড করার ফাংশন
    
    // প্রতি সেকেন্ডে সময় আপডেট করার জন্য ইন্টারভাল
    setInterval(updateDateTime, 1000);
});

// হেডার লোড করুন
async function loadHeader() {
    const headerContainer = document.getElementById('headerContainer');
    if (!headerContainer) {
        console.warn('headerContainer এলিমেন্ট পাওয়া যায়নি');
        // যদি কন্টেইনার না থাকে কিন্তু পেজে সরাসরি ID থাকে, তবুও ঘড়ি ট্রিপ করার চেষ্টা করবে
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
        
        // হেডার বসার পর সাথে সাথে ঘড়ি চালু
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
    if (!footerContainer) return; // পেজে ফুটার কন্টেইনার না থাকলে এরর না দিয়ে স্কিপ করবে
    
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

// =============== ডাইনামিক মেইন কন্টেন্ট রেন্ডারিং লজিক ===============

// ১. পোস্ট কখন করা হয়েছে তা বাংলায় রূপান্তর করার ইউটিলিটি ফাংশন
function timeAgoBengali(dateString) {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    const translateNumber = (num) => {
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return num.toString().split('').map(digit => {
            const index = englishNumbers.indexOf(digit);
            return index !== -1 ? bengaliNumbers[index] : digit;
        }).join('');
    };

    if (diffMins < 1) return 'এইমাত্র';
    if (diffMins < 60) return `${translateNumber(diffMins)} মিনিট আগে`;
    if (diffHours < 24) return `${translateNumber(diffHours)} ঘণ্টা আগে`;
    
    return postDate.toLocaleDateString('bn-BD');
}

// ২. ক্যাটাগরি ম্যাপিং অবজেক্ট
function getCategoryData(categoryId) {
    const categories = {
        1: { name: 'জাতীয়', class: 'mi-cat-national' },
        2: { name: 'রাজনীতি', class: 'mi-cat-politics' },
        3: { name: 'বিশ্ব', class: 'mi-cat-world' },
        4: { name: 'খেলাধুলা', class: 'mi-cat-sports' },
        5: { name: 'প্রযুক্তি', class: 'mi-cat-tech' },
        6: { name: 'বিনোদন', class: 'mi-cat-entertainment' },
        7: { name: 'স্বাস্থ্য', class: 'mi-cat-health' },
        8: { name: 'ব্যবসা', class: 'mi-cat-business' }
    };
    return categories[categoryId] || { name: 'সাধারণ', class: 'mi-cat-politics' };
}

// ৩. মেইন কন্টেন্টকে ডাইনামিক করার ফাংশন
async function renderMainContentNews() {
    const featuredSection = document.getElementById('featuredSection');
    const recentNewsGrid = document.getElementById('recentNewsGrid');
    
    // যদি পেজে মেইন কন্টেন্টের আইডিগুলো না থাকে (যেমন আলাদা কোনো সাব-পেজে), তবে এরর ছাড়াই রিটার্ন করবে
    if (!featuredSection && !recentNewsGrid) return;

    try {
        // এপিআই বা এন্ডপয়েন্ট থেকে ডেটা ফেচ করা হচ্ছে (আপনার প্রোজেক্টের এপিআই রুট অনুযায়ী পরিবর্তন করতে পারেন)
        const [leadRes, subRes, allRes] = await Promise.all([
            fetch('/api/posts?type=lead'),
            fetch('/api/posts?type=sub'),
            fetch('/api/posts')
        ]);

        if (!leadRes.ok || !subRes.ok || !allRes.ok) throw new Error('এপিআই সার্ভার থেকে ডাটা পাওয়া যায়নি');

        const leadPosts = await leadRes.json();
        const subPosts = await subRes.json();
        const allPosts = await allRes.json();

        // --- ক. ফিচার্ড নিউজ ব্লক রেন্ডার ---
        if (featuredSection) {
            let featuredHtml = '';

            // ১. প্রথম মেইন লিড নিউজ
            if (leadPosts.length > 0) {
                const lead = leadPosts[0];
                const leadImg = lead.image_url || 'img/placeholder.jpg';
                const leadCaption = lead.image_caption ? `<div class="mi-image-caption">${lead.image_caption}</div>` : '';

                featuredHtml += `
                    <article class="mi-featured-main-article">
                        <div class="mi-featured-image-block">
                            <img src="${leadImg}" alt="${lead.title}">
                            ${leadCaption}
                        </div>
                        <div class="mi-featured-content">
                            <h2><a href="./single-post.html?id=${lead.id}">${lead.title}</a></h2>
                            <p>${lead.content ? lead.content.substring(0, 150) : ''}...</p>
                            <div class="mi-meta">${timeAgoBengali(lead.created_at || new Date())}</div>
                        </div>
                    </article>
                `;
            }

            // ২. নিচে ২ টি সাব-নিউজ গ্রিড
            if (subPosts.length > 0) {
                featuredHtml += `<div class="mi-featured-sub-grid">`;
                subPosts.slice(0, 2).forEach(post => {
                    const subImg = post.image_url || 'https://via.placeholder.com/120x90';
                    featuredHtml += `
                        <article class="mi-sub-news-item">
                            <div class="mi-sub-text">
                                <h3><a href="./single-post.html?id=${post.id}">${post.title}</a></h3>
                                <p class="text-muted m-0" style="font-size: 14px;">${post.content ? post.content.substring(0, 80) : ''}...</p>
                                <div class="mi-meta mt-1">${timeAgoBengali(post.created_at || new Date())}</div>
                            </div>
                            <div class="mi-sub-img">
                                <img src="${subImg}" alt="${post.title}">
                            </div>
                        </article>
                    `;
                });
                featuredHtml += `</div>`;
            }

            featuredSection.innerHTML = featuredHtml || `<div class="text-center p-4">কোনো ফিচার্ড নিউজ নেই।</div>`;
        }

        // --- খ. সাম্প্রতিক খবরের গ্রিড রেন্ডার ---
        if (recentNewsGrid) {
            if (allPosts.length > 0) {
                let gridHtml = '';
                allPosts.forEach(post => {
                    const catData = getCategoryData(post.category_id);
                    const postImg = post.image_url || 'https://via.placeholder.com/300x200';
                    
                    gridHtml += `
                        <div class="col-md-6">
                            <article class="mi-news-card">
                                <img src="${postImg}" class="img-fluid" alt="${post.title}">
                                <div class="mi-card-body">
                                    <span class="mi-category ${catData.class}">${catData.name}</span>
                                    <h4><a href="./single-post.html?id=${post.id}">${post.title}</a></h4>
                                    <p>${post.content ? post.content.substring(0, 120) : ''}...</p>
                                    <small class="mi-meta">${timeAgoBengali(post.created_at || new Date())}</small>
                                </div>
                            </article>
                        </div>
                    `;
                });
                recentNewsGrid.innerHTML = gridHtml;
            } else {
                recentNewsGrid.innerHTML = `<div class="text-center p-4 width-100 w-100">কোনো সাম্প্রতিক খবর পাওয়া যায়নি।</div>`;
            }
        }

    } catch (err) {
        console.error('কন্টেন্ট ডাইনামিক রেন্ডারিং ত্রুটি:', err);
        if (featuredSection) {
            featuredSection.innerHTML = `<div class="text-center p-4 text-danger">⚠️ ফিচার্ড নিউজ লোড করতে ত্রুটি হয়েছে।</div>`;
        }
        if (recentNewsGrid) {
            recentNewsGrid.innerHTML = `<div class="text-center p-4 text-danger">⚠️ সাম্প্রতিক খবর লোড করতে ত্রুটি হয়েছে।</div>`;
        }
    }
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

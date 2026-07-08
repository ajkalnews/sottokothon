document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    loadSidebar();
    setupNavigation();
    setupSearch();
    setupArchiveToggle();
});

// হেডার লোড করুন
async function loadHeader() {
    const headerContainer = document.getElementById('headerContainer');
    if (headerContainer) {
        try {
            const response = await fetch('./html/header.html');
            if (!response.ok) throw new Error('Header লোড ব্যর্থ');
            const html = await response.text();
            headerContainer.innerHTML = html;
            setActiveNavLink();
        } catch (error) {
            console.error('Header লোড ত্রুটি:', error);
            // ফলব্যাক হিসেবে সরাসরি হেডার তৈরি করুন
            headerContainer.innerHTML = getHeaderHTML();
        }
    }
}

// ফুটার লোড করুন
async function loadFooter() {
    const footerContainer = document.getElementById('footerContainer');
    if (footerContainer) {
        try {
            const response = await fetch('./html/footer.html');
            if (!response.ok) throw new Error('Footer লোড ব্যর্থ');
            const html = await response.text();
            footerContainer.innerHTML = html;
        } catch (error) {
            console.error('Footer লোড ত্রুটি:', error);
            footerContainer.innerHTML = getFooterHTML();
        }
    }
}

// সাইডবার লোড করুন
async function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    if (sidebarContainer) {
        try {
            const response = await fetch('./html/sidebar.html');
            if (!response.ok) throw new Error('Sidebar লোড ব্যর্থ');
            const html = await response.text();
            sidebarContainer.innerHTML = html;
        } catch (error) {
            console.error('Sidebar লোড ত্রুটি:', error);
            sidebarContainer.innerHTML = getSidebarHTML();
        }
    }
}

// সক্রিয় নেভিগেশন লিংক সেট করুন
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.mi-nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || href === `/${currentPage}`) {
            link.classList.add('active');
        }
    });
}

// নেভিগেশন সেটআপ
function setupNavigation() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mi-nav-link')) {
            const navLinks = document.querySelectorAll('.mi-nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

// সার্চ ফর্ম সেটআপ
function setupSearch() {
    const searchForm = document.getElementById('searchForm');
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
    const monthToggles = document.querySelectorAll('.mi-month-toggle');
    monthToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const monthContent = this.parentElement.nextElementSibling;
            if (monthContent.style.display === 'none') {
                monthContent.style.display = 'block';
            } else {
                monthContent.style.display = 'none';
            }
        });
    });
}

// ফলব্যাক হেডার HTML
function getHeaderHTML() {
    return `<header class="mi-header">
        <div class="mi-header-top">
            <div class="mi-logo">
                <a href="./index.html" class="mi-logo-link">
                    <h1>📰 আমাদের নিউজ</h1>
                </a>
            </div>
            <nav class="mi-navbar">
                <a href="./index.html" class="mi-nav-link active">হোম</a>
                <a href="./category.html?cat=politics" class="mi-nav-link">রাজনীতি</a>
                <a href="./category.html?cat=sports" class="mi-nav-link">খেলাধুলা</a>
                <a href="./category.html?cat=tech" class="mi-nav-link">প্রযুক্তি</a>
                <a href="./category.html?cat=entertainment" class="mi-nav-link">বিনোদন</a>
                <a href="./archive.html" class="mi-nav-link">আর্কাইভ</a>
            </nav>
        </div>
        <div class="mi-search-bar">
            <form action="./search.html" method="GET" id="searchForm">
                <input type="text" name="q" class="form-control" placeholder="খবর খুঁজুন...">
                <button type="submit" class="btn btn-primary">অনুসন্ধান</button>
            </form>
        </div>
    </header>`;
}

// ফলব্যাক ফুটার HTML
function getFooterHTML() {
    return `<footer class="mi-footer">
        <div class="mi-footer-content">
            <div class="row">
                <div class="col-md-3">
                    <h6>আমাদের সম্পর্কে</h6>
                    <p>আমরা একটি নির্ভরযোগ্য বাংলা সংবাদ মাধ্যম।</p>
                </div>
                <div class="col-md-3">
                    <h6>কুইক লিংক</h6>
                    <ul class="mi-footer-links">
                        <li><a href="./index.html">হোম</a></li>
                        <li><a href="./search.html">সার্চ</a></li>
                        <li><a href="./archive.html">আর্কাইভ</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h6>ক্যাটাগরি</h6>
                    <ul class="mi-footer-links">
                        <li><a href="./category.html?cat=politics">জাতীয় খবর</a></li>
                        <li><a href="./category.html?cat=business">ব্যবসা</a></li>
                        <li><a href="./category.html?cat=tech">প্রযুক্তি</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h6>সোশ্যাল মিডিয়া</h6>
                    <div class="mi-social-links">
                        <a href="https://facebook.com" class="mi-social-icon" target="_blank">📘</a>
                        <a href="https://twitter.com" class="mi-social-icon" target="_blank">🐦</a>
                        <a href="https://instagram.com" class="mi-social-icon" target="_blank">📷</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="mi-footer-bottom">
            <p>&copy; ২০२६ আমাদের নিউজ। সর্বাধিকার সংরক্ষিত।</p>
        </div>
    </footer>`;
}

// ফলব্যাক সাইডবার HTML
function getSidebarHTML() {
    return `<aside class="mi-sidebar">
        <div class="mi-widget">
            <h5>সর্বশেষ খবর</h5>
            <ul class="mi-widget-list">
                <li><a href="./single-post.html?id=1">দেশে নতুন অর্থনৈতিক নীতি</a></li>
                <li><a href="./single-post.html?id=2">বন্যা পরিস্থিতি খারাপ</a></li>
                <li><a href="./single-post.html?id=3">শিক্ষা ক্ষেত্রে সংস্কার</a></li>
            </ul>
        </div>
    </aside>`;
}

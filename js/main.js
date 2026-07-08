// js/main.js

// ডকুমেন্ট লোড হওয়ার পর এক্সিকিউট করুন
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Main.js loaded');
    
    // সব কম্পোনেন্ট লোড করুন
    await loadHeader();
    await loadSidebar();
    await loadFooter();
    
    // অন্যান্য ফাংশন সেটআপ করুন
    setupNavigation();
    setupSearch();
    setupArchiveToggle();
    updateDateTime();
    
    // প্রতি সেকেন্ডে সময় আপডেট করুন
    setInterval(updateDateTime, 1000);
});

// ========================
// হেডার লোড করুন
// ========================
async function loadHeader() {
    const headerContainer = document.getElementById('headerContainer');
    
    if (!headerContainer) {
        console.error('headerContainer element not found');
        return;
    }
    
    try {
        console.log('Loading header...');
        const response = await fetch('./html/header.html');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        headerContainer.innerHTML = html;
        console.log('Header loaded successfully');
        
        // হেডার লোড হওয়ার পর নেভিগেশন লিংক সেট করুন
        setActiveNavLink();
        
    } catch (error) {
        console.error('Header loading failed:', error);
        // ফলব্যাক হেডার দেখান
        headerContainer.innerHTML = getHeaderFallback();
    }
}

// ========================
// সাইডবার লোড করুন
// ========================
async function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    
    if (!sidebarContainer) {
        console.log('sidebarContainer not found (mobile view)');
        return;
    }
    
    try {
        console.log('Loading sidebar...');
        const response = await fetch('./html/sidebar.html');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        sidebarContainer.innerHTML = html;
        console.log('Sidebar loaded successfully');
        
    } catch (error) {
        console.error('Sidebar loading failed:', error);
        sidebarContainer.innerHTML = '<div class="alert alert-info">সাইডবার লোড হয়নি</div>';
    }
}

// ========================
// ফুটার লোড করুন
// ========================
async function loadFooter() {
    const footerContainer = document.getElementById('footerContainer');
    
    if (!footerContainer) {
        console.error('footerContainer element not found');
        return;
    }
    
    try {
        console.log('Loading footer...');
        const response = await fetch('./html/footer.html');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        footerContainer.innerHTML = html;
        console.log('Footer loaded successfully');
        
    } catch (error) {
        console.error('Footer loading failed:', error);
        footerContainer.innerHTML = getFooterFallback();
    }
}

// ========================
// সক্রিয় নেভিগেশন লিংক সেট করুন
// ========================
function setActiveNavLink() {
    try {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        const navLinks = document.querySelectorAll('.mi-nav-item');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // পাথ ম্যাচ করুন
            if (href && (
                href.includes(currentPage) || 
                href.endsWith(currentPage) || 
                (currentPage === '' && href.includes('index.html'))
            )) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        console.error('setActiveNavLink error:', error);
    }
}

// ========================
// নেভিগেশন সেটআপ
// ========================
function setupNavigation() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mi-nav-item')) {
            const navLinks = document.querySelectorAll('.mi-nav-item');
            navLinks.forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

// ========================
// সার্চ ফাংশনালিটি
// ========================
function setupSearch() {
    // হেডার সার্চ ফর্ম
    const headerSearchForm = document.getElementById('headerSearchForm');
    if (headerSearchForm) {
        headerSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[name="q"]');
            const query = input ? input.value.trim() : '';
            
            if (query) {
                window.location.href = `./search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // বিকল্প সার্চ ফর্ম
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[name="q"]');
            const query = input ? input.value.trim() : '';
            
            if (query) {
                window.location.href = `./search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}

// ========================
// আর্কাইভ টগল সেটআপ
// ========================
function setupArchiveToggle() {
    const monthToggles = document.querySelectorAll('.mi-month-toggle');
    monthToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const monthContent = this.closest('.mi-month-archive').querySelector('.mi-month-content');
            
            if (monthContent) {
                const isHidden = monthContent.style.display === 'none';
                monthContent.style.display = isHidden ? 'block' : 'none';
            }
        });
    });
}

// ========================
// বর্তমান তারিখ এবং সময় আপডেট করুন
// ========================
function updateDateTime() {
    try {
        const now = new Date();
        
        // বাংলা ফরম্যাট
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
        
        // ডেট টাইম এলিমেন্ট আপডেট করুন
        const dateTimeElement = document.getElementById('dateTime');
        if (dateTimeElement) {
            dateTimeElement.textContent = bengaliDate;
        }
        
        // বিকল্প ID
        const currentDateTimeElement = document.getElementById('currentDateTime');
        if (currentDateTimeElement) {
            currentDateTimeElement.textContent = bengaliDate;
        }
        
    } catch (error) {
        console.error('updateDateTime error:', error);
    }
}

// ========================
// ফলব্যাক কম্পোনেন্ট
// ========================

function getHeaderFallback() {
    return `
    <div style="padding: 20px; background: #fff9e6; border: 2px solid #ffc107; border-radius: 8px; margin: 10px;">
        <p style="margin: 0; color: #856404;">
            <strong>⚠️ নোটিস:</strong> হেডার লোড করতে সমস্যা হচ্ছে। 
            <br>কনসোল দেখুন ত্রুটির জন্য বা <a href="./index.html">পেজ রিফ্রেশ</a> করুন।
        </p>
    </div>
    `;
}

function getFooterFallback() {
    return `
    <footer style="background: #333; color: white; padding: 20px; text-align: center; margin-top: 40px;">
        <p>&copy; ২০२६ আমাদের নিউজ। সর্বাধিকার সংরক্ষিত।</p>
    </footer>
    `;
}

// ========================
// ডেবাগিং ফাংশন
// ========================
function debugInfo() {
    console.group('🔍 ডেবাগ ইনফরমেশন');
    console.log('Current URL:', window.location.href);
    console.log('Current Path:', window.location.pathname);
    console.log('Header Container:', document.getElementById('headerContainer'));
    console.log('Sidebar Container:', document.getElementById('sidebarContainer'));
    console.log('Footer Container:', document.getElementById('footerContainer'));
    console.groupEnd();
}

// ড্যাশবোর্ড খোললে debugInfo() চলবে
if (window.location.search.includes('debug=true')) {
    debugInfo();
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    loadSidebar();
    setupNavigation();
    setupSearch();
    setupArchiveToggle();
});

// হেডার লোড করুন
function loadHeader() {
    const headerContainer = document.getElementById('headerContainer');
    if (headerContainer) {
        fetch('html/header.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
                setActiveNavLink();
            })
            .catch(error => console.log('Header লোড ব্যর্থ:', error));
    }
}

// ফুটার লোড করুন
function loadFooter() {
    const footerContainer = document.getElementById('footerContainer');
    if (footerContainer) {
        fetch('html/footer.html')
            .then(response => response.text())
            .then(html => footerContainer.innerHTML = html)
            .catch(error => console.log('Footer লোড ব্যর্থ:', error));
    }
}

// সাইডবার লোড করুন
function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    if (sidebarContainer) {
        fetch('html/sidebar.html')
            .then(response => response.text())
            .then(html => sidebarContainer.innerHTML = html)
            .catch(error => console.log('Sidebar লোড ব্যর্থ:', error));
    }
}

// সক্রিয় নেভিগেশন লিংক সেট করুন
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.mi-nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// নেভিগেশন সেটআপ
function setupNavigation() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mi-nav-link')) {
            e.target.classList.add('active');
            document.querySelectorAll('.mi-nav-link').forEach(link => {
                if (link !== e.target) link.classList.remove('active');
            });
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
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
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

// সার্চ পেজে ফিল্টার সেটআপ
function setupSearchFilters() {
    const filterGroups = document.querySelectorAll('.mi-filter-group select');
    filterGroups.forEach(select => {
        select.addEventListener('change', function() {
            console.log('ফিল্টার পরিবর্তিত হয়েছে:', this.value);
            // API কল করতে পারেন এখানে
        });
    });
}

// ক্যাটাগরি পেজে ফিল্টার সেটআপ
function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.mi-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log('সাজানো হয়েছে:', this.dataset.sort);
        });
    });
}

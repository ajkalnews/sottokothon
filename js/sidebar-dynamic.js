// সংখ্যার জন্য বাংলা রূপান্তর
function toBanglaNum(num) {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, d => banglaDigits[d]);
}

// ট্যাব সুইচ ফাংশন
function switchModernTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("mi-modern-pane");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("mi-modern-tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

async function loadDynamicSidebar() {
    try {
        const res = await fetch('/api/posts');
        if (!res.ok) return;

        const posts = await res.json();
        if (!posts || posts.length === 0) return;

        // --- স্মার্ট ফিল্টার হেল্পার ফাংশন (ID, Name, Slug যেকোনো একটা মিললেই পোস্ট ফিল্টার করবে) ---
        const filterByCat = (targetId, targetSlug, targetName) => {
            return posts.filter(p => 
                String(p.category_id) === String(targetId) || 
                (p.category_slug && p.category_slug.toLowerCase() === targetSlug.toLowerCase()) ||
                (p.category_name && p.category_name.trim() === targetName)
            );
        };

        // --- ১. সর্বশেষ ৪টি খবর (ট্যাব ১) ---
        const latest = posts.slice(0, 4);
        const latestContainer = document.getElementById('sidebarLatestList');
        if (latestContainer) {
            latestContainer.innerHTML = latest.map((post, idx) => `
                <li>
                    <span class="mi-news-number">${toBanglaNum(idx + 1)}</span>
                    <a href="single-post.html?id=${post.id}">${post.title}</a>
                </li>
            `).join('');
        }

        // --- ২. পঠিত ৪টি খবর (ট্যাব ২) ---
        const popular = posts.slice(4, 8).length > 0 ? posts.slice(4, 8) : posts.slice(0, 4);
        const popularContainer = document.getElementById('sidebarPopularList');
        if (popularContainer) {
            popularContainer.innerHTML = popular.map((post, idx) => `
                <li>
                    <span class="mi-news-number">${toBanglaNum(idx + 1)}</span>
                    <a href="single-post.html?id=${post.id}">${post.title}</a>
                </li>
            `).join('');
        }

        // --- ৩. আলোচিত খবর (ট্যাব ৩) ---
        const commented = posts.slice(2, 6);
        const commentContainer = document.getElementById('sidebarCommentedList');
        if (commentContainer) {
            commentContainer.innerHTML = commented.map((post, idx) => `
                <li>
                    <span class="mi-news-number">${toBanglaNum(idx + 1)}</span>
                    <a href="single-post.html?id=${post.id}">${post.title} <span class="mi-comment-count">${toBanglaNum(Math.floor(Math.random() * 50) + 10)}</span></a>
                </li>
            `).join('');
        }

        // --- ৪. বিশ্ব ক্যাটাগরি (ID: 18, Slug: 'world', Name: 'বিশ্ব') ---
        const worldPosts = filterByCat(18, 'world', 'বিশ্ব');
        const finalWorld = worldPosts.length > 0 ? worldPosts : posts.slice(0, 3);

        const worldFeatured = document.getElementById('worldFeaturedPost');
        if (worldFeatured && finalWorld[0]) {
            worldFeatured.innerHTML = `
                <a href="single-post.html?id=${finalWorld[0].id}">
                    <img src="${finalWorld[0].image_url || 'img/p2.JPG'}" alt="${finalWorld[0].title}">
                </a>
                <div class="mi-card-body">
                    <h4><a href="single-post.html?id=${finalWorld[0].id}">${finalWorld[0].title}</a></h4>
                </div>
            `;
        }

        const worldList = document.getElementById('worldPostList');
        if (worldList && finalWorld.length > 1) {
            worldList.innerHTML = finalWorld.slice(1, 3).map(post => `
                <li>
                    <h4><a href="single-post.html?id=${post.id}">${post.title}</a></h4>
                </li>
            `).join('');
        }

        // --- ৫. বিনোদন ক্যাটাগরি (ID: 6, Slug: 'entertainment', Name: 'বিনোদন') ---
        const entPosts = filterByCat(6, 'entertainment', 'বিনোদন');
        const finalEnt = entPosts.length > 0 ? entPosts.slice(0, 4) : posts.slice(1, 5);

        const entContainer = document.getElementById('entertainmentList');
        if (entContainer) {
            entContainer.innerHTML = finalEnt.map(post => `
                <article class="mi-sidebar-thumb-item">
                    <div class="mi-sidebar-thumb-img">
                        <img src="${post.image_url || 'img/p2.JPG'}" alt="${post.title}">
                    </div>
                    <div class="mi-sidebar-thumb-text">
                        <h4><a href="single-post.html?id=${post.id}">${post.title}</a></h4>
                    </div>
                </article>
            `).join('');
        }

        // --- ৬. মতামত উইজেট (ID: 19, Slug: 'opinion', Name: 'মতামত') ---
        const opinionPosts = filterByCat(19, 'opinion', 'মতামত');
        const finalOpinion = opinionPosts.length > 0 ? opinionPosts.slice(0, 4) : posts.slice(0, 4);

        const opinionContainer = document.getElementById('opinionList');
        if (opinionContainer) {
            opinionContainer.innerHTML = finalOpinion.map(post => `
                <li>
                    <div class="mi-author-avatar">
                        <i class="fas fa-pencil-alt"></i>
                    </div>
                    <div class="mi-opinion-content">
                        <h4 class="mi-opinion-title">
                            <span class="mi-op-tag">${post.category_name || 'মতামত'}</span> • <a href="single-post.html?id=${post.id}">${post.title}</a>
                        </h4>
                        <span class="mi-op-author">লেখা: <a href="#">${post.author || 'সত্যকথন ডেস্ক'}</a></span>
                    </div>
                </li>
            `).join('');
        }

    } catch (err) {
        console.error('সাইডবার লোড করতে সমস্যা হয়েছে:', err);
    }
}

// সাইডবার লোড হওয়ার পর এক্সিকিউট হবে
document.addEventListener('DOMContentLoaded', loadDynamicSidebar);

// ১. বাংলা সংখ্যা রূপান্তর
function toBanglaNum(num) {
  if (num === null || num === undefined) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => banglaDigits[d]);
}

// ২. টাইম এগো (Time Ago) ফাংশন
function timeAgo(dateString) {
  if (!dateString) return '';
  const postDate = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return 'এইমাত্র';
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${toBanglaNum(minutes)} মিনিট আগে`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${toBanglaNum(hours)} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  return `${toBanglaNum(days)} দিন আগে`;
}

// ৩. ট্যাব সুইচ ফাংশন (সর্বশেষ, পঠিত, আলোচনা)
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
  const targetTab = document.getElementById(tabName);
  if (targetTab) targetTab.classList.add("active");
  if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");
}

// ৪. মূল সাইডবার ডাইনামিক ফাংশন
async function loadDynamicSidebar() {
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('সাইডবার ডাটা ফেচ করা যায়নি');

    const posts = await res.json();
    if (!posts || posts.length === 0) return;

    // স্মার্ট ক্যাটাগরি ফিল্টার হেল্পার (নাম বা আইডি উভয়টাই ম্যাচ করবে)
    const getPostsByCategory = (catTarget) => {
      return posts.filter(p => {
        const catName = p.category_name ? p.category_name.trim().toLowerCase() : '';
        const target = String(catTarget).trim().toLowerCase();
        return catName === target || String(p.category_id) === target || catName.includes(target);
      });
    };

    // --- ১. ট্যাবড নিউজ (সর্বশেষ, পঠিত, আলোচিত) ---
    const latest = posts.slice(0, 4);
    const latestContainer = document.getElementById('sidebarLatestList');
    if (latestContainer) {
      latestContainer.innerHTML = latest.map((post, idx) => `
        <li>
            <span class="mi-news-number">${toBanglaNum(idx + 1)}</span>
            <a href="./single-post.html?id=${post.id}">${post.title}</a>
        </li>
      `).join('');
    }

    const popular = posts.slice(4, 8).length > 0 ? posts.slice(4, 8) : posts.slice(0, 4);
    const popularContainer = document.getElementById('sidebarPopularList');
    if (popularContainer) {
      popularContainer.innerHTML = popular.map((post, idx) => `
        <li>
            <span class="mi-news-number">${toBanglaNum(idx + 1)}</span>
            <a href="./single-post.html?id=${post.id}">${post.title}</a>
        </li>
      `).join('');
    }

    const commented = posts.slice(2, 6);
    const commentContainer = document.getElementById('sidebarCommentedList');
    if (commentContainer) {
      commentContainer.innerHTML = commented.map((post, idx) => `
        <li>
            <span class="mi-news-number">${toBanglaNum(idx + 1)}</span>
            <a href="./single-post.html?id=${post.id}">${post.title} <span class="mi-comment-count">${toBanglaNum(Math.floor(Math.random() * 40) + 10)}</span></a>
        </li>
      `).join('');
    }

    // --- ২. বিশ্ব ক্যাটাগরি (ID: 18) ---
    const worldPosts = getPostsByCategory('18').length > 0 ? getPostsByCategory('18') : getPostsByCategory('বিশ্ব');
    const finalWorld = worldPosts.length > 0 ? worldPosts : posts.slice(0, 3);

    const worldFeatured = document.getElementById('worldFeaturedPost');
    if (worldFeatured && finalWorld[0]) {
      worldFeatured.innerHTML = `
        <a href="./single-post.html?id=${finalWorld[0].id}">
            <img src="${finalWorld[0].image_url || 'img/default.jpg'}" alt="${finalWorld[0].title}">
        </a>
        <div class="mi-card-body">
            <h4><a href="./single-post.html?id=${finalWorld[0].id}">${finalWorld[0].title}</a></h4>
        </div>
      `;
    }

    const worldList = document.getElementById('worldPostList');
    if (worldList && finalWorld.length > 1) {
      worldList.innerHTML = finalWorld.slice(1, 3).map(post => `
        <li>
            <h4><a href="./single-post.html?id=${post.id}">${post.title}</a></h4>
        </li>
      `).join('');
    }

    // --- ৩. বিনোদন ক্যাটাগরি (ID: 6) ---
    const entPosts = getPostsByCategory('6').length > 0 ? getPostsByCategory('6') : getPostsByCategory('বিনোদন');
    const finalEnt = entPosts.length > 0 ? entPosts.slice(0, 4) : posts.slice(1, 5);

    const entContainer = document.getElementById('entertainmentList');
    if (entContainer) {
      entContainer.innerHTML = finalEnt.map(post => `
        <article class="mi-sidebar-thumb-item">
            <div class="mi-sidebar-thumb-img">
                <img src="${post.image_url || 'img/default.jpg'}" alt="${post.title}">
            </div>
            <div class="mi-sidebar-thumb-text">
                <h4><a href="./single-post.html?id=${post.id}">${post.title}</a></h4>
            </div>
        </article>
      `).join('');
    }

    // --- ৪. মতামত ক্যাটাগরি (ID: 19) ---
    const opinionPosts = getPostsByCategory('19').length > 0 ? getPostsByCategory('19') : getPostsByCategory('মতামত');
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
                    <span class="mi-op-tag">${post.category_name || 'মতামত'}</span> • <a href="./single-post.html?id=${post.id}">${post.title}</a>
                </h4>
                <span class="mi-op-author">লেখা: <a href="#">${post.author || 'সত্যকথন ডেস্ক'}</a></span>
            </div>
        </li>
      `).join('');
    }

  } catch (error) {
    console.error('সাইডবার ডাটা লোড করতে ব্যর্থ:', error);
  }
}

// ডোমে লোড হওয়ামাত্র এক্সিকিউট হবে
document.addEventListener('DOMContentLoaded', loadDynamicSidebar);

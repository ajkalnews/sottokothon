// ১. সাহায্যকারী সময় ও সংখ্যা রূপান্তর
function toBanglaNum(num) {
  if (num === null || num === undefined) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => banglaDigits[d]);
}

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

// ২. ক্যাটাগরি পোস্ট লোডার
async function loadCategoryPosts() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('id') || urlParams.get('cat');

  const newsListContainer = document.getElementById('newsListContainer');
  const categoryTitleElem = document.getElementById('categoryTitle');
  const categoryDescElem = document.getElementById('categoryDesc');

  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('API Response Error');

    const posts = await res.json();
    console.log("ডাটাবেজের পোস্টসমূহ:", posts); // ব্রাউজার কনসোলে পোস্ট দেখাবে

    if (!posts || posts.length === 0) {
      if (newsListContainer) newsListContainer.innerHTML = '<p class="text-muted p-3">কোনো পোস্ট পাওয়া যায়নি।</p>';
      return;
    }

    // ফিল্টারিং লজিক (ID এবং Name উভয় দিয়েই ম্যাচ করা হবে)
    let filteredPosts = posts;
    if (categoryId) {
      filteredPosts = posts.filter(p => {
        const catId = p.category_id || p.cat_id || p.category;
        const catName = p.category_name ? p.category_name.trim().toLowerCase() : '';
        const target = String(categoryId).trim().toLowerCase();

        return String(catId) === target || catName === target || catName.includes(target);
      });
    }

    // শিরোনাম সেট করা
    if (categoryTitleElem) {
      if (filteredPosts.length > 0 && filteredPosts[0].category_name) {
        categoryTitleElem.innerText = filteredPosts[0].category_name;
      } else {
        categoryTitleElem.innerText = 'সংবাদ তালিকা';
      }
    }

    if (categoryDescElem) {
      categoryDescElem.innerText = 'সর্বশেষ খবর এবং আপডেট';
    }

    // পোস্ট রেন্ডার
    if (newsListContainer) {
      if (filteredPosts.length === 0) {
        newsListContainer.innerHTML = `<div class="alert alert-warning my-3">এই বিভাগে বর্তমানে কোনো পোস্ট নেই।</div>`;
        return;
      }

      newsListContainer.innerHTML = filteredPosts.map(post => `
        <article class="mi-list-item">
            <img src="${post.image_url || 'img/default.jpg'}" alt="${post.title}">
            <div class="mi-list-content">
                <span class="mi-category">${post.category_name || 'সংবাদ'}</span>
                <h3><a href="./single-post.html?id=${post.id}">${post.title}</a></h3>
                <p>${post.content ? post.content.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + '...' : ''}</p>
                <div class="mi-list-meta">
                    <small>${timeAgo(post.created_at)} | লেখক: ${post.author || 'সত্যকথন ডেস্ক'}</small>
                </div>
            </div>
        </article>
      `).join('');
    }

  } catch (error) {
    console.error('ক্যাটাগরি পোস্ট লোডে সমস্যা:', error);
    if (newsListContainer) {
      newsListContainer.innerHTML = `<p class="text-danger p-3">পোস্ট লোড করতে সমস্যা হয়েছে।</p>`;
    }
  }
}

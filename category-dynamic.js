// ১. সময় হিসাবের হেল্পার ফাংশন
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

function toBanglaNum(num) {
  if (num === null || num === undefined) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => banglaDigits[d]);
}

// ২. মূল ক্যাটাগরি পোস্ট লোডার ফাংশন
async function loadCategoryPosts() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('id') || urlParams.get('cat'); // URL থেকে id বা cat প্যারামিটার নেওয়া

  const newsListContainer = document.getElementById('newsListContainer');
  const categoryTitleElem = document.getElementById('categoryTitle');
  const categoryDescElem = document.getElementById('categoryDesc');

  if (!categoryId) {
    if (categoryTitleElem) categoryTitleElem.innerText = 'সর্বশেষ সংবাদ';
    if (categoryDescElem) categoryDescElem.innerText = 'সকল বিষয়ের আপডেট সংবাদসমূহ';
  }

  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('ডাটা লোড করা যায়নি');

    const posts = await res.json();
    if (!posts || posts.length === 0) {
      if (newsListContainer) newsListContainer.innerHTML = '<p class="text-muted p-3">কোনো পোস্ট পাওয়া যায়নি।</p>';
      return;
    }

    // ফিল্টারিং: category_id বা category_name ম্যাচ করানো
    let filteredPosts = posts;
    if (categoryId) {
      filteredPosts = posts.filter(p => {
        const catName = p.category_name ? p.category_name.trim().toLowerCase() : '';
        const target = String(categoryId).trim().toLowerCase();
        return String(p.category_id) === target || catName === target || catName.includes(target);
      });
    }

    // শিরোনাম ও ডেসক্রিপশন সেট করা
    if (filteredPosts.length > 0 && categoryTitleElem) {
      const activeCatName = filteredPosts[0].category_name || 'সংবাদ তালিকা';
      categoryTitleElem.innerText = activeCatName;
      if (categoryDescElem) categoryDescElem.innerText = `${activeCatName} বিভাগের সর্বশেষ খবর এবং আপডেট`;
    } else if (categoryTitleElem) {
      categoryTitleElem.innerText = 'ক্যাটাগরি পোস্ট';
      if (categoryDescElem) categoryDescElem.innerText = 'এই বিভাগে বর্তমানে কোনো পোস্ট নেই।';
    }

    // পোস্ট রেন্ডার করা
    if (newsListContainer) {
      if (filteredPosts.length === 0) {
        newsListContainer.innerHTML = `<div class="alert alert-info my-3">এই বিভাগে এখনও কোনো খবর পোস্ট করা হয়নি।</div>`;
        return;
      }

      newsListContainer.innerHTML = filteredPosts.map(post => `
        <article class="mi-list-item">
            <img src="${post.image_url || 'img/default.jpg'}" alt="${post.title}">
            <div class="mi-list-content">
                <span class="mi-category">${post.category_name || 'সংবাদ'}</span>
                <h3><a href="./single-post.html?id=${post.id}">${post.title}</a></h3>
                <p>${post.content ? post.content.substring(0, 160) + '...' : ''}</p>
                <div class="mi-list-meta">
                    <small>${timeAgo(post.created_at)} | লেখক: ${post.author || 'সত্যকথন ডেস্ক'}</small>
                </div>
            </div>
        </article>
      `).join('');
    }

  } catch (error) {
    console.error('ক্যাটাগরি ডাটা লোড করতে সমস্যা:', error);
    if (newsListContainer) {
      newsListContainer.innerHTML = `<p class="text-danger p-3">ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।</p>`;
    }
  }
}

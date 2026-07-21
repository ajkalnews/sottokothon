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

// ২. গ্রিড অনুযায়ী পোস্ট সাজানো
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

    if (!posts || posts.length === 0) {
      if (newsListContainer) newsListContainer.innerHTML = '<p class="text-muted p-3">কোনো পোস্ট পাওয়া যায়নি।</p>';
      return;
    }

    // ফিল্টারিং
    let filteredPosts = posts;
    if (categoryId) {
      filteredPosts = posts.filter(p => {
        const catId = p.category_id || p.cat_id || p.category;
        const catName = p.category_name ? p.category_name.trim().toLowerCase() : '';
        const target = String(categoryId).trim().toLowerCase();
        return String(catId) === target || catName === target || catName.includes(target);
      });
    }

    // টাইটেল আপডেট
    if (categoryTitleElem) {
      if (filteredPosts.length > 0 && filteredPosts[0].category_name) {
        categoryTitleElem.innerText = filteredPosts[0].category_name;
      } else {
        categoryTitleElem.innerText = 'সংবাদ তালিকা';
      }
    }

    if (!newsListContainer) return;

    if (filteredPosts.length === 0) {
      newsListContainer.innerHTML = `<div class="alert alert-warning my-3">এই বিভাগে বর্তমানে কোনো পোস্ট নেই।</div>`;
      return;
    }

    // --- ছবির মত গ্রিড তৈরির লজিক ---
    const topPost1 = filteredPosts[0];
    const topPost2 = filteredPosts[1];
    const otherPosts = filteredPosts.slice(2);

    let htmlContent = '';

    // ১. টপ সেকশন (প্রথম ২টি পোস্ট)
    if (topPost1) {
      htmlContent += `<div class="mi-cat-top-grid">`;
      
      // বামের পোস্ট (ওভারলে ডিজাইন)
      htmlContent += `
        <div class="mi-top-news-overlay">
            <img src="${topPost1.image_url || 'img/default.jpg'}" alt="${topPost1.title}">
            <div class="mi-overlay-content">
                <h2><a href="./single-post.html?id=${topPost1.id}">${topPost1.title}</a></h2>
                <span class="mi-time">${timeAgo(topPost1.created_at)}</span>
            </div>
        </div>
      `;

      // ডানের পোস্ট (সাধারণ সাইড কার্ড)
      if (topPost2) {
        htmlContent += `
          <div class="mi-top-news-card">
              <img src="${topPost2.image_url || 'img/default.jpg'}" alt="${topPost2.title}">
              <h3><a href="./single-post.html?id=${topPost2.id}">${topPost2.title}</a></h3>
              <p>${topPost2.content ? topPost2.content.replace(/(<([^>]+)>)/gi, "").substring(0, 110) + '...' : ''}</p>
              <span class="mi-cat-time">${timeAgo(topPost2.created_at)}</span>
          </div>
        `;
      }
      
      htmlContent += `</div>`;
    }

    // ২. বটম সেকশন (৩ কলাম গ্রিড)
    if (otherPosts.length > 0) {
      htmlContent += `<div class="mi-cat-bottom-grid">`;
      
      otherPosts.forEach(post => {
        htmlContent += `
          <div class="mi-grid-card">
              <img src="${post.image_url || 'img/default.jpg'}" alt="${post.title}">
              <h4><a href="./single-post.html?id=${post.id}">${post.title}</a></h4>
              <p>${post.content ? post.content.replace(/(<([^>]+)>)/gi, "").substring(0, 80) + '...' : ''}</p>
              <span class="mi-cat-time">${timeAgo(post.created_at)}</span>
          </div>
        `;
      });

      htmlContent += `</div>`;
    }

    newsListContainer.innerHTML = htmlContent;

  } catch (error) {
    console.error('ক্যাটাগরি পোস্ট সাজাতে সমস্যা:', error);
    if (newsListContainer) {
      newsListContainer.innerHTML = `<p class="text-danger p-3">পোস্ট লোড করতে সমস্যা হয়েছে।</p>`;
    }
  }
}

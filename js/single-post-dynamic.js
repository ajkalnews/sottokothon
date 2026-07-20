// সময়কে বাংলায় পরিবর্তন করার ফাংশন
function formatDateInBangla(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  
  const day = toBanglaNum(date.getDate());
  const month = months[date.getMonth()];
  const year = toBanglaNum(date.getFullYear());
  
  let hours = date.getHours();
  const minutes = toBanglaNum(date.getMinutes().toString().padStart(2, '0'));
  const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
  hours = hours % 12 || 12;
  
  return `${day} ${month} ${year}, ${ampm} ${toBanglaNum(hours)}:${minutes}`;
}

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => banglaDigits[d]);
}

// সোশ্যাল শেয়ার লিংক আপডেট করার ফাংশন
function setupShareButtons(title, url) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  document.getElementById('shareFb').href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  document.getElementById('shareTw').href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  document.getElementById('shareWa').href = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href);
  alert('খবরের লিংক কপি করা হয়েছে!');
}

async function loadSinglePost() {
  // URL Parameter থেকে ID ধরা
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) {
    document.getElementById('loadingSpinner').innerHTML = '<h4 class="text-danger">সংবাদের আইডি পাওয়া যায়নি!</h4>';
    return;
  }

  try {
    // API থেকে পোস্ট ডাটা নিয়ে আসা
    const res = await fetch(`/api/posts?id=${postId}`);
    if (!res.ok) throw new Error('খবর পাওয়া যায়নি');

    const postData = await res.json();
    // যদি API অবজেক্ট বা অ্যারে দেয় তা হ্যান্ডেল করা
    const post = Array.isArray(postData) ? postData.find(p => String(p.id) === String(postId)) : postData;

    if (!post) {
      document.getElementById('loadingSpinner').innerHTML = '<h4 class="text-danger font-bold">অনুরোধকৃত খবরটি পাওয়া যায়নি।</h4>';
      return;
    }

    // টাইটেল ও পেজ টাইটেল সেট করা
    document.title = `${post.title} - সত্য কথন`;
    document.getElementById('postTitle').innerText = post.title;

    // ক্যাটাগরি সেট করা
    const catElem = document.getElementById('postCategory');
    catElem.innerText = post.category_name || 'সংবাদ';

    // সময় ও লেখক
    document.getElementById('postTime').innerText = formatDateInBangla(post.created_at);
    if (post.author) {
      document.getElementById('postAuthor').innerText = post.author;
      document.getElementById('authorName').innerText = post.author;
    }

    // ফিচার ইমেজ
    const imgElem = document.getElementById('postImage');
    imgElem.src = post.image_url || 'https://via.placeholder.com/800x450';
    imgElem.alt = post.title;

    if (post.image_caption) {
      document.getElementById('postCaption').innerText = post.image_caption;
    }

    // বিস্তারিত কনটেন্ট ফরম্যাটিং (\n লাইনব্রেকগুলোকে <p> ট্যাগে রূপান্তর)
    const contentElem = document.getElementById('postContent');
    if (post.content) {
      const paragraphs = post.content.split('\n').filter(p => p.trim() !== '');
      contentElem.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    // শেয়ার বাটন সেটআপ
    setupShareButtons(post.title, window.location.href);

    // পোস্ট রেন্ডার করার পর স্পিনার হাইড করে পোস্ট ভিজিবল করা
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('postArticle').style.display = 'block';

    // সংক্রান্ত খবর (Related Posts) লোড
    loadRelatedPosts(post.category_id || post.category_name, post.id);

  } catch (err) {
    console.error(err);
    document.getElementById('loadingSpinner').innerHTML = `<h4 class="text-danger">ত্রুটি: ${err.message}</h4>`;
  }
}

// সংক্রান্ত ৩টি খবর দেখানোর ফাংশন
async function loadRelatedPosts(categoryId, currentPostId) {
  const container = document.getElementById('relatedPostsContainer');
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) return;

    const allPosts = await res.json();
    
    // বর্তমান পোস্ট বাদে একই ক্যাটাগরির ৩টি পোস্ট ফিল্টার
    const related = allPosts
      .filter(p => String(p.id) !== String(currentPostId) && 
                  (String(p.category_id) === String(categoryId) || p.category_name === categoryId))
      .slice(0, 3);

    // যদি একই ক্যাটাগরির পোস্ট কম থাকে, অন্য সাম্প্রতিক ৩টি পোস্ট দেখানো
    const finalRelated = related.length >= 3 ? related : allPosts.filter(p => String(p.id) !== String(currentPostId)).slice(0, 3);

    if (finalRelated.length === 0) {
      container.innerHTML = '<p class="text-muted">কোনো সংক্রান্ত খবর পাওয়া যায়নি।</p>';
      return;
    }

    container.innerHTML = finalRelated.map(post => `
      <div class="col-md-4">
          <a href="single-post.html?id=${post.id}" class="mi-related-item">
              <img src="${post.image_url || 'https://via.placeholder.com/250x150'}" alt="${post.title}">
              <h6>${post.title}</h6>
          </a>
      </div>
    `).join('');

  } catch (err) {
    console.error('সংক্রান্ত খবর লোড করতে সমস্যা:', err);
    container.innerHTML = '';
  }
}

// পেজ লোড হলে ফাংশন কল হবে
document.addEventListener('DOMContentLoaded', loadSinglePost);

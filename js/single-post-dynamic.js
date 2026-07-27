// ==========================================
// HELPER FUNCTIONS & UTILITIES
// ==========================================

// HTML Escaping Function for XSS Protection
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Convert Digits to Bangla
function toBanglaNum(num) {
  if (num === null || num === undefined) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => banglaDigits[d]);
}

// Format Date String into Bangla Format
function formatDateInBangla(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const day = toBanglaNum(date.getDate());
  const month = months[date.getMonth()];
  const year = toBanglaNum(date.getFullYear());

  let hours = date.getHours();
  const minutes = toBanglaNum(date.getMinutes().toString().padStart(2, '0'));
  const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
  hours = hours % 12 || 12;

  return `${day} ${month} ${year}, ${ampm} ${toBanglaNum(hours)}:${minutes}`;
}

// DOM Cache Singleton
const DOM = {
  get elements() {
    if (!this._cache) {
      this._cache = {
        loadingSpinner: document.getElementById('loadingSpinner'),
        postArticle: document.getElementById('postArticle'),
        postTitle: document.getElementById('postTitle'),
        postCategory: document.getElementById('postCategory'),
        postTime: document.getElementById('postTime'),
        postAuthor: document.getElementById('postAuthor'),
        authorName: document.getElementById('authorName'),
        postImage: document.getElementById('postImage'),
        postCaption: document.getElementById('postCaption'),
        postContent: document.getElementById('postContent'),
        relatedPostsContainer: document.getElementById('relatedPostsContainer'),
        shareFb: document.getElementById('shareFb'),
        shareTw: document.getElementById('shareTw'),
        shareWa: document.getElementById('shareWa'),
        ogTitle: document.getElementById('ogTitle'),
        ogDesc: document.getElementById('ogDesc'),
        ogImage: document.getElementById('ogImage'),
        ogUrl: document.getElementById('ogUrl')
      };
    }
    return this._cache;
  }
};

// Meta Element Helper (Update or Inject Meta/Link Elements)
function setMetaTag(selector, attributeName, attributeValue, contentValue) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    if (selector.startsWith('meta[name=')) {
      element.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
    } else if (selector.startsWith('meta[property=')) {
      element.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
    } else if (selector.startsWith('link[rel=')) {
      element.setAttribute('rel', selector.match(/rel="([^"]+)"/)[1]);
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attributeName, contentValue);
}

// Extract Plain Text Excerpt safely
function extractExcerpt(htmlOrText, length = 160) {
  if (!htmlOrText) return '';
  const div = document.createElement('div');
  div.innerHTML = htmlOrText;
  const text = div.textContent || div.innerText || '';
  return text.trim().slice(0, length);
}

// ==========================================
// SEO & METADATA MANAGEMENT
// ==========================================

function updateMetaTags(post) {
  const currentUrl = window.location.href;
  const siteName = 'সত্য কথন';
  const cleanTitle = post.title ? post.title.trim() : 'সংবাদ';
  const fullTitle = `${cleanTitle} - ${siteName}`;
  const rawContent = post.excerpt || post.content || cleanTitle;
  const description = extractExcerpt(rawContent, 160);
  const keywords = post.keywords || `${post.category_name || 'সংবাদ'}, খবর, সত্য কথন, বাংলা খবর, ${cleanTitle}`;
  const imageUrl = post.image_url || 'https://sottokothon.pages.dev/img/logo.png';

  // 1. Title
  document.title = fullTitle;

  // 2. Standard Meta Tags
  setMetaTag('meta[name="description"]', 'content', description);
  setMetaTag('meta[name="keywords"]', 'content', keywords);
  setMetaTag('link[rel="canonical"]', 'href', currentUrl);

  // 3. Open Graph Tags
  setMetaTag('meta[property="og:title"]', 'content', fullTitle);
  setMetaTag('meta[property="og:description"]', 'content', description);
  setMetaTag('meta[property="og:image"]', 'content', imageUrl);
  setMetaTag('meta[property="og:url"]', 'content', currentUrl);
  setMetaTag('meta[property="og:type"]', 'content', 'article');
  setMetaTag('meta[property="og:site_name"]', 'content', siteName);

  // Fallback support for legacy DOM element references
  const { ogTitle, ogDesc, ogImage, ogUrl } = DOM.elements;
  if (ogTitle) ogTitle.setAttribute('content', fullTitle);
  if (ogDesc) ogDesc.setAttribute('content', description);
  if (ogImage) ogImage.setAttribute('content', imageUrl);
  if (ogUrl) ogUrl.setAttribute('content', currentUrl);

  // 4. Twitter Card Tags
  setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
  setMetaTag('meta[name="twitter:description"]', 'content', description);
  setMetaTag('meta[name="twitter:image"]', 'content', imageUrl);

  // 5. JSON-LD NewsArticle Schema
  updateNewsArticleSchema(post, fullTitle, description, imageUrl, currentUrl);
}

function updateNewsArticleSchema(post, title, description, imageUrl, currentUrl) {
  let schemaScript = document.getElementById('newsArticleSchema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'newsArticleSchema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "headline": title,
    "description": description,
    "image": [imageUrl],
    "datePublished": post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString(),
    "dateModified": post.updated_at ? new Date(post.updated_at).toISOString() : (post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString()),
    "author": {
      "@type": "Person",
      "name": post.author || "সত্য কথন ডেস্ক"
    },
    "publisher": {
      "@type": "Organization",
      "name": "সত্য কথন",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sottokothon.pages.dev/img/logo.png"
      }
    }
  };

  schemaScript.textContent = JSON.stringify(schemaData);
}

// Update Dynamic Breadcrumb Components
function updateBreadcrumbs(categoryName, postTitle) {
  const breadcrumbCat = document.getElementById('breadcrumbCategory');
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');

  if (breadcrumbCat) breadcrumbCat.innerText = categoryName || 'সংবাদ';
  if (breadcrumbTitle) breadcrumbTitle.innerText = postTitle || '';
}

// ==========================================
// SOCIAL SHARING & INTERACTIONS
// ==========================================

function setupShareButtons(title, url) {
  const currentUrl = url || window.location.href;
  const encodedTitle = encodeURIComponent(title || document.title);
  const encodedUrl = encodeURIComponent(currentUrl);

  const { shareFb, shareTw, shareWa } = DOM.elements;

  if (shareFb) shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  if (shareTw) shareTw.href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  if (shareWa) shareWa.href = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
}

function copyLink() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('খবরের লিংক কপি করা হয়েছে!'))
      .catch(() => fallbackCopyLink());
  } else {
    fallbackCopyLink();
  }
}

function fallbackCopyLink() {
  const tempInput = document.createElement('input');
  tempInput.value = window.location.href;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    alert('খবরের লিংক কপি করা হয়েছে!');
  } catch (err) {
    alert('লিংক কপি করতে ব্যর্থ হয়েছে।');
  }
  document.body.removeChild(tempInput);
}

// ==========================================
// DATA FETCHING & RENDERING LOGIC
// ==========================================

async function loadSinglePost() {
  const {
    loadingSpinner,
    postArticle,
    postTitle,
    postCategory,
    postTime,
    postAuthor,
    authorName,
    postImage,
    postCaption,
    postContent
  } = DOM.elements;

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) {
    if (loadingSpinner) {
      loadingSpinner.innerHTML = '<h4 class="text-danger">সংবাদের আইডি পাওয়া যায়নি!</h4>';
    }
    return;
  }

  try {
    const res = await fetch(`/api/posts?id=${encodeURIComponent(postId)}`);
    if (!res.ok) throw new Error('খবর পাওয়া যায়নি');

    const postData = await res.json();
    const post = Array.isArray(postData)
      ? postData.find(p => String(p.id) === String(postId))
      : postData;

    if (!post || !post.id) {
      if (loadingSpinner) {
        loadingSpinner.innerHTML = '<h4 class="text-danger font-bold">অনুরোধকৃত খবরটি পাওয়া যায়নি।</h4>';
      }
      return;
    }

    // Update SEO Meta Tags, Schemas, and Breadcrumbs
    updateMetaTags(post);
    updateBreadcrumbs(post.category_name, post.title);

    // Render Title
    if (postTitle) postTitle.innerText = post.title || '';

    // Render Category
    const categoryName = post.category_name || 'সংবাদ';
    if (postCategory) postCategory.innerText = categoryName;

    // Render Time & Author
    if (postTime) postTime.innerText = formatDateInBangla(post.created_at);
    if (post.author) {
      if (postAuthor) postAuthor.innerText = post.author;
      if (authorName) authorName.innerText = post.author;
    }

    // Render Featured Image safely with Performance Optimization
    if (postImage) {
      const fallbackImage = 'https://via.placeholder.com/800x450';
      postImage.src = post.image_url || fallbackImage;
      postImage.alt = post.title || 'সংবাদ চিত্র';
      postImage.loading = 'eager';
      postImage.setAttribute('fetchpriority', 'high');
      postImage.setAttribute('decoding', 'async');
      postImage.onerror = function () {
        this.onerror = null;
        this.src = fallbackImage;
      };
    }

    // Render Image Caption
    if (postCaption) {
      if (post.image_caption) {
        postCaption.innerText = post.image_caption;
        postCaption.style.display = 'block';
      } else {
        postCaption.style.display = 'none';
      }
    }

    // Render Safe Post Content
    if (postContent) {
      if (!post.content) {
        postContent.innerHTML = '<p class="text-muted">কোনো কন্টেন্ট পাওয়া যায়নি।</p>';
      } else if (post.content.includes('<p>') || post.content.includes('<div>')) {
        postContent.innerHTML = post.content;
      } else {
        const paragraphs = post.content.split('\n').filter(p => p.trim() !== '');
        postContent.innerHTML = paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('');
      }
    }

    // Configure Social Sharing Buttons
    setupShareButtons(post.title, window.location.href);

    // Display Article & Hide Loader
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (postArticle) postArticle.style.display = 'block';

    // Fetch and Display Related Posts
    loadRelatedPosts(post.category_id || post.category_name, post.id);

  } catch (err) {
    console.error('Error fetching post:', err);
    if (loadingSpinner) {
      loadingSpinner.innerHTML = `<h4 class="text-danger">ত্রুটি: ${escapeHTML(err.message)}</h4>`;
    }
  }
}

// Fetch and Render Related Posts
async function loadRelatedPosts(categoryId, currentPostId) {
  const container = DOM.elements.relatedPostsContainer;
  if (!container) return;

  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('সংক্রান্ত খবর পাওয়া যায়নি');

    const allPosts = await res.json();
    if (!Array.isArray(allPosts)) return;

    // Filter posts from same category, excluding current post
    const related = allPosts
      .filter(p => String(p.id) !== String(currentPostId) &&
        (String(p.category_id) === String(categoryId) || p.category_name === categoryId))
      .slice(0, 3);

    // Fallback: If not enough related posts, fill with other recent posts
    const finalRelated = related.length >= 3
      ? related
      : allPosts.filter(p => String(p.id) !== String(currentPostId)).slice(0, 3);

    if (finalRelated.length === 0) {
      container.innerHTML = '<p class="text-muted">কোনো সংক্রান্ত খবর পাওয়া যায়নি।</p>';
      return;
    }

    const fallbackImg = 'https://via.placeholder.com/250x150';

    container.innerHTML = finalRelated.map(post => {
      const safeTitle = escapeHTML(post.title || '');
      const safeImg = post.image_url || fallbackImg;
      const safeId = encodeURIComponent(post.id);

      return `
        <div class="col-md-4">
            <a href="single-post.html?id=${safeId}" class="mi-related-item">
                <img src="${safeImg}" alt="${safeTitle}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallbackImg}';">
                <h6>${safeTitle}</h6>
            </a>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('সংক্রান্ত খবর লোড করতে সমস্যা:', err);
    container.innerHTML = '';
  }
}

// Dynamic Event Listeners Setup
document.addEventListener('DOMContentLoaded', loadSinglePost);

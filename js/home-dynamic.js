// ১. বাংলা সংখ্যা রূপান্তরকারী
function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => banglaDigits[d]);
}

// ২. রিয়েল-টাইম টাইম কাউন্টার (এইমাত্র, X মিনিট/ঘণ্টা/দিন আগে)
function timeAgo(dateString) {
  if (!dateString) return '';
  const postDate = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  // ১ মিনিটের কম হলে
  if (diffInSeconds < 60) return 'এইমাত্র';

  // মিনিট কাউন্ট
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${toBanglaNum(minutes)} মিনিট আগে`;

  // ঘণ্টা কাউন্ট
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${toBanglaNum(hours)} ঘণ্টা আগে`;

  // দিন কাউন্ট
  const days = Math.floor(hours / 24);
  if (days < 30) return `${toBanglaNum(days)} দিন আগে`;

  // মাস কাউন্ট
  const months = Math.floor(days / 30);
  if (months < 12) return `${toBanglaNum(months)} মাস আগে`;

  // বছর কাউন্ট
  const years = Math.floor(months / 12);
  return `${toBanglaNum(years)} বছর আগে`;
}

// ৩. ডাইনামিক ক্যাটাগরি ফিল্টার হেল্পার
function getPostsByCategory(posts, catTarget) {
  return posts.filter(p => {
    const catName = p.category_name ? p.category_name.trim().toLowerCase() : '';
    const target = catTarget.trim().toLowerCase();
    return catName === target || String(p.category_id) === String(catTarget) || catName.includes(target);
  });
}

// ৪. ক্যাটাগরি ব্লক রেন্ডারার
function renderCategoryBlock(catName, catPosts) {
  if (!catPosts || catPosts.length === 0) return;
  const block = document.querySelector(`.mi-category-block[data-category="${catName}"]`);
  
  if (block) {
    const featured = catPosts[0];
    const list = catPosts.slice(1, 3);

    const featElem = block.querySelector('.mi-block-featured');
    const listElem = block.querySelector('.mi-block-list');

    if (featElem && featured) {
      featElem.innerHTML = `
        <a href="./single-post.html?id=${featured.id}">
            <img src="${featured.image_url || 'img/default.jpg'}" alt="${featured.title}">
        </a>
        <h3><a href="./single-post.html?id=${featured.id}">${featured.title}</a></h3>
      `;
    }

    if (listElem && list.length > 0) {
      listElem.innerHTML = list.map(post => `
        <li>
            <h4><a href="./single-post.html?id=${post.id}">${post.title}</a></h4>
        </li>
      `).join('');
    }
  }
}

// ৫. টু-কলাম সেকশন রেন্ডারার
function renderTwoColSection(catName, catPosts) {
  if (!catPosts || catPosts.length === 0) return;
  const block = document.querySelector(`.mi-two-col-block[data-category="${catName}"]`);

  if (block) {
    const main = catPosts[0];
    const list = catPosts.slice(1, 4);

    const mainElem = block.querySelector('.mi-two-col-main');
    const listElem = block.querySelector('.mi-two-col-list');

    if (mainElem && main) {
      mainElem.innerHTML = `
        <a href="./single-post.html?id=${main.id}">
            <img src="${main.image_url || 'img/default.jpg'}" alt="${main.title}">
        </a>
        <h3><a href="./single-post.html?id=${main.id}">${main.title}</a></h3>
      `;
    }

    if (listElem && list.length > 0) {
      listElem.innerHTML = list.map(post => `
        <article class="mi-two-col-list-item">
            <h4><a href="./single-post.html?id=${post.id}">${post.title}</a></h4>
            <img src="${post.image_url || 'img/default.jpg'}" alt="${post.title}">
        </article>
      `).join('');
    }
  }
}

// ৬. মূল হোমপেজ ডাটা লোডিং ফাংশন
async function loadDynamicHome() {
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('ডাটা ফেচ করা যায়নি');
    
    const posts = await res.json();
    
    const loader = document.getElementById('loading-spinner');
    if (loader) loader.style.display = 'none';

    if (!posts || posts.length === 0) return;

    // ১. ফিচার্ড মেইন লিড
    const mainLead = posts.find(p => p.is_lead === 1) || posts[0];
    const subLeads = posts.filter(p => p.is_sub_lead === 1 && p.id !== mainLead.id).slice(0, 2);

    if (mainLead) {
      const leadImg = document.getElementById('lead-img');
      if (leadImg) {
        leadImg.src = mainLead.image_url || 'img/default.jpg';
        leadImg.alt = mainLead.title;
      }
      
      const captionElem = document.getElementById('lead-caption');
      if (captionElem) {
        if (mainLead.image_caption) {
          captionElem.innerText = mainLead.image_caption;
          captionElem.style.display = 'block';
        } else {
          captionElem.style.display = 'none';
        }
      }

      const titleElem = document.getElementById('lead-title');
      if (titleElem) {
        titleElem.innerText = mainLead.title;
        titleElem.href = `./single-post.html?id=${mainLead.id}`;
      }

      const excerptElem = document.getElementById('lead-excerpt');
      if (excerptElem) {
        excerptElem.innerText = mainLead.content ? mainLead.content.substring(0, 160) + '...' : '';
      }

      const timeElem = document.getElementById('lead-time');
      if (timeElem) {
        timeElem.innerText = timeAgo(mainLead.created_at);
      }
    }

    // সাব-লিড পোস্ট
    const subContainer = document.getElementById('sub-lead-container');
    if (subContainer && subLeads.length > 0) {
      subContainer.innerHTML = subLeads.map(post => `
        <article class="mi-sub-news-item">
            <div class="mi-sub-text">
                <h3><a href="./single-post.html?id=${post.id}">${post.title}</a></h3>
                <div class="mi-meta">${timeAgo(post.created_at)}</div>
            </div>
            <div class="mi-sub-img">
                <img src="${post.image_url || 'img/default.jpg'}" alt="${post.title}">
            </div>
        </article>
      `).join('');
    }

    // ২. শিক্ষা ও চাকরি
    renderCategoryBlock('শিক্ষা', getPostsByCategory(posts, 'শিক্ষা'));
    renderCategoryBlock('চাকরি', getPostsByCategory(posts, 'চাকরি'));

    // ৩. সারাদেশ
    const saradeshPosts = getPostsByCategory(posts, 'সারাদেশ');
    if (saradeshPosts.length > 0) {
      const entMain = saradeshPosts[0];
      const entSubs = saradeshPosts.slice(1, 4);

      const sectionElem = document.querySelector('section[data-category="সারাদেশ"]');
      if (sectionElem) {
        const leftCol = sectionElem.querySelector('.mi-ent-left-column');
        const rightCol = sectionElem.querySelector('.mi-ent-right-column');

        if (leftCol && entSubs.length > 0) {
          leftCol.innerHTML = entSubs.map(post => `
            <article class="mi-ent-sub-item">
                <div class="mi-ent-sub-text">
                    <h3><a href="./single-post.html?id=${post.id}">${post.title}</a></h3>
                    <div class="mi-meta">${timeAgo(post.created_at)}</div>
                </div>
                <div class="mi-ent-sub-img">
                    <img src="${post.image_url || 'img/default.jpg'}" alt="${post.title}">
                </div>
            </article>
          `).join('');
        }

        if (rightCol && entMain) {
          rightCol.innerHTML = `
            <article class="mi-ent-main-article">
                <div class="mi-ent-main-img">
                    <img src="${entMain.image_url || 'img/default.jpg'}" alt="${entMain.title}">
                </div>
                <div class="mi-ent-main-content">
                    <h2><a href="./single-post.html?id=${entMain.id}">${entMain.title}</a></h2>
                    <p>${entMain.content ? entMain.content.substring(0, 130) + '...' : ''}</p>
                    <div class="mi-meta">${timeAgo(entMain.created_at)}</div>
                </div>
            </article>
          `;
        }
      }
    }

    // ৪. লাইফস্টাইল ও টেক
    renderTwoColSection('লাইফস্টাইল', getPostsByCategory(posts, 'লাইফস্টাইল'));
    renderTwoColSection('টেক', getPostsByCategory(posts, 'টেক'));

    // ৫. খেলা
    const sportsPosts = getPostsByCategory(posts, 'খেলা');
    if (sportsPosts.length > 0) {
      const sportsMain = sportsPosts[0];
      const sportsSubFeat = sportsPosts[1];
      const sportsList = sportsPosts.slice(2, 5);

      const sportsSection = document.querySelector('section[data-category="খেলা"]');
      if (sportsSection) {
        const leftCol = sportsSection.querySelector('.mi-sports-left-col');
        const rightCol = sportsSection.querySelector('.mi-sports-right-col');

        if (leftCol && sportsMain) {
          leftCol.innerHTML = `
            <article class="mi-sports-main-feat">
                <div class="mi-sports-main-img">
                    <img src="${sportsMain.image_url || 'img/default.jpg'}" alt="${sportsMain.title}">
                </div>
                <div class="mi-sports-main-content">
                    <h3><a href="./single-post.html?id=${sportsMain.id}">${sportsMain.title}</a></h3>
                    <p>${sportsMain.content ? sportsMain.content.substring(0, 100) + '...' : ''}</p>
                </div>
            </article>

            ${sportsSubFeat ? `
            <article class="mi-sports-sub-feat">
                <div class="mi-sports-sub-feat-img">
                    <img src="${sportsSubFeat.image_url || 'img/default.jpg'}" alt="${sportsSubFeat.title}">
                </div>
                <div class="mi-sports-sub-feat-text">
                    <h4><a href="./single-post.html?id=${sportsSubFeat.id}">${sportsSubFeat.title}</a></h4>
                    <p>${sportsSubFeat.content ? sportsSubFeat.content.substring(0, 60) + '...' : ''}</p>
                </div>
            </article>
            ` : ''}
          `;
        }

        if (rightCol && sportsList.length > 0) {
          rightCol.innerHTML = sportsList.map(post => `
            <article class="mi-sports-list-item">
                <div class="mi-sports-list-img">
                    <img src="${post.image_url || 'img/default.jpg'}" alt="${post.title}">
                </div>
                <div class="mi-sports-list-text">
                    <h4><a href="./single-post.html?id=${post.id}">${post.title}</a></h4>
                    <p>${post.content ? post.content.substring(0, 60) + '...' : ''}</p>
                </div>
            </article>
          `).join('');
        }
      }
    }

  } catch (error) {
    console.error('ডাটা লোড করতে ব্যর্থ:', error);
  }
}

// ৭. পেজ লোড হলে এবং প্রতি ১ মিনিটে স্বয়ংক্রিয়ভাবে সময় আপডেট হওয়া
document.addEventListener('DOMContentLoaded', () => {
  loadDynamicHome();
  
  // প্রতি ১ মিনিট (৬০০০০ মিলিসেকেন্ড) পর পর লাইভ আপডেট করবে
  setInterval(loadDynamicHome, 60000);
});

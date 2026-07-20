// সময় হিসাব করার হেল্পার ফাংশন
function timeAgo(dateString) {
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
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => banglaDigits[d]);
}

// ডাটাবেজ থেকে হোমপেজের পোস্ট লোড করার মূল ফাংশন
async function loadDynamicHome() {
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('ডাটা ফেচ করা যায়নি');
    
    const posts = await res.json();
    if (!posts || posts.length === 0) return;

    // ১. ফিচার্ড সেকশন (Main Lead & Sub Leads)
    const mainLead = posts.find(p => p.is_lead === 1) || posts[0];
    const subLeads = posts.filter(p => p.is_sub_lead === 1 && p.id !== mainLead.id).slice(0, 2);

    const mainLeadElem = document.querySelector('.mi-featured-main-article');
    if (mainLeadElem) {
      mainLeadElem.innerHTML = `
        <div class="mi-featured-image-block">
            <img src="${mainLead.image_url || 'img/default.jpg'}" alt="${mainLead.title}">
            ${mainLead.image_caption ? `<div class="mi-image-caption">${mainLead.image_caption}</div>` : ''}
        </div>
        <div class="mi-featured-content">
            <h2><a href="./single-post.html?id=${mainLead.id}">${mainLead.title}</a></h2>
            <p>${mainLead.content.substring(0, 180)}...</p>
            <div class="mi-meta">${timeAgo(mainLead.created_at)}</div>
        </div>
      `;
    }

    const subGridElem = document.querySelector('.mi-featured-sub-grid');
    if (subGridElem && subLeads.length > 0) {
      subGridElem.innerHTML = subLeads.map(post => `
        <article class="mi-sub-news-item">
            <div class="mi-sub-text">
                <h3><a href="./single-post.html?id=${post.id}">${post.title}</a></h3>
                <p>${post.content.substring(0, 90)}...</p>
                <div class="mi-meta">${timeAgo(post.created_at)}</div>
            </div>
            <div class="mi-sub-img">
                <img src="${post.image_url || 'img/default.jpg'}" alt="${post.title}">
            </div>
        </article>
      `).join('');
    }

    const getPostsByCategory = (catName) => {
      return posts.filter(p => p.category_name === catName || p.category_id === catName);
    };

    // ২. শিক্ষা ও চাকরি
    renderCategoryBlock('শিক্ষা', getPostsByCategory('শিক্ষা'));
    renderCategoryBlock('চাকরি', getPostsByCategory('চাকরি'));

    // ৩. সারাদেশ / বিনোদন
    const saradeshPosts = getPostsByCategory('সারাদেশ');
    if (saradeshPosts.length > 0) {
      const entMain = saradeshPosts[0];
      const entSubs = saradeshPosts.slice(1, 4);

      const leftCol = document.querySelector('.mi-ent-left-column');
      const rightCol = document.querySelector('.mi-ent-right-column');

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
                  <p>${entMain.content.substring(0, 150)}...</p>
                  <div class="mi-meta">${timeAgo(entMain.created_at)}</div>
              </div>
          </article>
        `;
      }
    }

    // ৪. লাইফস্টাইল ও টেক
    renderTwoColSection('লাইফস্টাইল', getPostsByCategory('লাইফস্টাইল'));
    renderTwoColSection('টেক', getPostsByCategory('টেক'));

    // ৫. খেলা
    const sportsPosts = getPostsByCategory('খেলা');
    if (sportsPosts.length > 0) {
      const sportsMain = sportsPosts[0];
      const sportsSubFeat = sportsPosts[1];
      const sportsList = sportsPosts.slice(2, 5);

      const leftCol = document.querySelector('.mi-sports-left-col');
      const rightCol = document.querySelector('.mi-sports-right-col');

      if (leftCol && sportsMain) {
        leftCol.innerHTML = `
          <article class="mi-sports-main-feat">
              <div class="mi-sports-main-img">
                  <img src="${sportsMain.image_url || 'img/default.jpg'}" alt="${sportsMain.title}">
              </div>
              <div class="mi-sports-main-content">
                  <h3><a href="./single-post.html?id=${sportsMain.id}">${sportsMain.title}</a></h3>
                  <p>${sportsMain.content.substring(0, 120)}...</p>
              </div>
          </article>

          ${sportsSubFeat ? `
          <article class="mi-sports-sub-feat">
              <div class="mi-sports-sub-feat-img">
                  <img src="${sportsSubFeat.image_url || 'img/default.jpg'}" alt="${sportsSubFeat.title}">
              </div>
              <div class="mi-sports-sub-feat-text">
                  <h4><a href="./single-post.html?id=${sportsSubFeat.id}">${sportsSubFeat.title}</a></h4>
                  <p>${sportsSubFeat.content.substring(0, 80)}...</p>
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
                  <p>${post.content.substring(0, 80)}...</p>
              </div>
          </article>
        `).join('');
      }
    }

  } catch (error) {
    console.error('ডাটা লোড করতে ব্যর্থ:', error);
  }
}

function renderCategoryBlock(catName, catPosts) {
  if (!catPosts || catPosts.length === 0) return;
  const blocks = document.querySelectorAll('.mi-category-block');
  
  blocks.forEach(block => {
    const titleElem = block.querySelector('.mi-block-title');
    if (titleElem && titleElem.innerText.includes(catName)) {
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
  });
}

function renderTwoColSection(catName, catPosts) {
  if (!catPosts || catPosts.length === 0) return;
  const blocks = document.querySelectorAll('.mi-two-col-block');

  blocks.forEach(block => {
    const titleElem = block.querySelector('.mi-two-col-title');
    if (titleElem && titleElem.innerText.includes(catName)) {
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
  });
}

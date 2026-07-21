// ১. বর্তমান বাংলা তারিখ তৈরি
function updateBanglaDate() {
    const dateElem = document.getElementById('dateTime');
    if (!dateElem) return;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('bn-BD', options);
    dateElem.innerText = today;
}

// ২. ডাইনামিক ব্রেকিং নিউজ লোড
async function loadBreakingNews() {
    try {
        const res = await fetch('/api/posts');
        if (!res.ok) return;

        const posts = await res.json();
        if (!posts || posts.length === 0) return;

        // সর্বশেষ ৫টি খবর ব্রেকিং নিউজ হিসেবে দেখাবে
        const breakingPosts = posts.slice(0, 5);
        const tickerContainer = document.getElementById('breakingTickerContainer');

        if (tickerContainer) {
            tickerContainer.innerHTML = breakingPosts.map(post => `
                <div class="mi-ticker-item">
                    <a href="./single-post.html?id=${post.id}">${post.title}</a>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('ব্রেকিং নিউজ লোড করতে সমস্যা হয়েছে:', err);
    }
}

// ডোমে লোড হওয়ার সাথে সাথে চালানো
document.addEventListener('DOMContentLoaded', () => {
    updateBanglaDate();
    loadBreakingNews();
});

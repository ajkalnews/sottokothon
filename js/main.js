// ১. বাংলা লাইভ ঘড়ি এবং লাইভ তারিখ লজিক
function updateLiveDateTime() {
    const now = new Date();
    
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // ১২ ঘন্টার ফরম্যাট
    
    // সংখ্যাকে বাংলায় রূপান্তর করার ফাংশন
    const toBanglaNum = (num) => {
        const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return num.toString().split('').map(digit => banglaDigits[digit] || digit).join('');
    };

    const formattedTime = `${toBanglaNum(hours)}:${toBanglaNum(minutes.toString().padStart(2, '0'))}:${toBanglaNum(seconds.toString().padStart(2, '0'))} ${ampm}`;
    const formattedDate = `${dayName}, ${toBanglaNum(date)} ${monthName} ${toBanglaNum(year)}`;
    
    const dateTimeElement = document.getElementById('dateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = `${formattedDate} | ${formattedTime}`;
    }
}

// প্রতি সেকেন্ডে ঘড়ি আপডেট হবে
setInterval(updateLiveDateTime, 1000);
document.addEventListener('DOMContentLoaded', updateLiveDateTime); // পেজ লোড হলে রান হবে

// ২. সার্চ ওভারলে টগল ফাংশন
function toggleSearchOverlay() {
    const overlay = document.getElementById('searchOverlay');
    const searchField = document.getElementById('searchField');
    
    if (overlay) {
        overlay.classList.toggle('active');
        
        // সার্চ বক্স ওপেন হলে অটোমেটিক কার্সার ফোকাস হবে
        if(overlay.classList.contains('active') && searchField) {
            setTimeout(() => {
                searchField.focus();
            }, 100);
            
            // মোবাইল ড্রয়ার মেনু খোলা থাকলে তা অটো বন্ধ করে দেবে
            const mobileMenu = document.getElementById('miMobileMenu');
            if (mobileMenu && typeof bootstrap !== 'undefined') {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            }
        }
    }
}

// 'ESC' বাটন চাপলে সার্চ ওভারলে যেন বন্ধ হয়ে যায়
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('searchOverlay');
        if(overlay && overlay.classList.contains('active')) {
            toggleSearchOverlay();
        }
    }
});

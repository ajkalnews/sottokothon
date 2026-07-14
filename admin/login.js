// ১. ব্রাউজার ফ্রেন্ডলি Base64Url এনকোড ফাংশন
function base64UrlEncode(obj) {
  const str = JSON.stringify(obj);
  // UTF-8 ক্যারেক্টার সাপোর্ট নিশ্চিত করতে btoa ব্যবহার
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// ২. একটি সিকিউর ক্রিপ্টোগ্রাফিক HMAC-SHA256 সিগনেচার তৈরি করা
async function generateSignature(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(data)
  );
  
  // সিগনেচার বাফারকে Base64Url-এ রূপান্তর
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hashString = String.fromCharCode.apply(null, hashArray);
  return btoa(hashString).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// ৩. JWT টোকেন জেনারেটর
async function generateJWT(secret, payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  
  const signature = await generateSignature(secret, `${encodedHeader}.${encodedPayload}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// ৪. মূল ক্লাউডফ্লেয়ার রিকোয়েস্ট হ্যান্ডলার (POST)
export async function onRequestPost(context) {
  try {
    const { password } = await context.request.json();
    
    // ক্লাউডফ্লেয়ার ড্যাশবোর্ড থেকে পাসওয়ার্ড এবং সিক্রেট কি রিড করা হচ্ছে
    const correctPassword = context.env.ADMIN_PASSWORD; 
    const secret = context.env.JWT_SECRET;

    // পাসওয়ার্ড বা সিক্রেট সেট করা না থাকলে বা ভুল হলে এরর হ্যান্ডলিং
    if (!correctPassword || !secret) {
      return new Response(JSON.stringify({ 
        error: 'সার্ভারে পাসওয়ার্ড বা সিক্রেট কি কনফিগার করা নেই! দয়া করে ক্লাউডফ্লেয়ার ড্যাশবোর্ড চেক করুন।' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (password !== correctPassword) {
      return new Response(JSON.stringify({ error: 'ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড দিন।' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ১ দিনের মেয়াদ দিয়ে টোকেন পে-লোড তৈরি (exp = Expiration Time)
    const payload = { 
      admin: true, 
      exp: Math.floor(Date.now() / 1000) + 86400 
    };
    
    const token = await generateJWT(secret, payload);

    return new Response(JSON.stringify({ success: true, token }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: 'অভ্যন্তরীণ সার্ভার সমস্যা: ' + err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

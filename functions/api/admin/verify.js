// ১. ক্রিপ্টোগ্রাফিক সিগনেচার ভেরিফাই করার ফাংশন
async function verifySignature(secret, data, signature) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  // Base64Url সিগনেচারকে বাইনারি বাফারে রূপান্তর
  const binarySignature = Uint8Array.from(
    atob(signature.replace(/-/g, "+").replace(/_/g, "/")),
    c => c.charCodeAt(0)
  );

  return await crypto.subtle.verify(
    "HMAC",
    key,
    binarySignature,
    enc.encode(data)
  );
}

// ২. মূল ক্লাউডফ্লেয়ার রিকোয়েস্ট হ্যান্ডলার (POST)
export async function onRequestPost(context) {
  try {
    const { token } = await context.request.json();
    const secret = context.env.JWT_SECRET;

    // টোকেন বা সিক্রেট কি না থাকলে রিজেক্ট করা হবে
    if (!token || !secret) {
      return new Response(JSON.stringify({ valid: false, error: 'টোকেন বা সিক্রেট কি অনুপস্থিত' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return new Response(JSON.stringify({ valid: false, error: 'অবৈধ টোকেন ফরম্যাট' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // সিগনেচার ঠিক আছে কি না তা যাচাই করা
    const isSignatureValid = await verifySignature(secret, `${encodedHeader}.${encodedPayload}`, signature);

    if (!isSignatureValid) {
      return new Response(JSON.stringify({ valid: false, error: 'টোকেন ভেরিফিকেশন ব্যর্থ' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // পে-লোড ডিকোড করা এবং মেয়াদ (Expiration) চেক করা
    const payloadJson = atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);

    // বর্তমান সময়ের সাথে টোকেনের মেয়াদ মিলিয়ে দেখা (exp < বর্তমান সময়)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTimestamp) {
      return new Response(JSON.stringify({ valid: false, error: 'টোকেনের মেয়াদ শেষ হয়ে গেছে' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // টোকেনটি সম্পূর্ণ বৈধ হলে
    return new Response(JSON.stringify({ valid: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ valid: false, error: 'সার্ভার সমস্যা: ' + err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

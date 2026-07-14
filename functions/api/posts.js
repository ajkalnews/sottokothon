// ১. নতুন নিউজ পোস্ট করা (POST)
export async function onRequestPost(context) {
  try {
    const { 
      title, 
      slug, 
      content, 
      imageUrl, 
      imageCaption, 
      categoryId, 
      isLead, 
      isSubLead 
    } = await context.request.json();

    if (!title || !slug || !content) {
      return new Response(JSON.stringify({ error: 'শিরোনাম, স্লাগ এবং খবরের বিবরণ আবশ্যক!' }), { status: 400 });
    }

    // D1 ডাটাবেজে ডাটা সেভ করা
    await context.env.DB.prepare(
      `INSERT INTO posts (title, slug, content, image_url, image_caption, category_id, is_lead, is_sub_lead) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      title, 
      slug, 
      content, 
      imageUrl || null, 
      imageCaption || null, 
      categoryId || null, 
      isLead ? 1 : 0, 
      isSubLead ? 1 : 0
    ).run();

    return new Response(JSON.stringify({ success: true, message: 'নিউজটি সফলভাবে পাবলিশ হয়েছে!' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'ডাটাবেজ ত্রুটি: ' + err.message }), { status: 500 });
  }
}

// ২. নিউজ ভিউ করা বা ডিলিট করা (GET & DELETE)
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;

  // --- নিউজ ডিলিট করার হ্যান্ডলার (DELETE) ---
  if (method === 'DELETE') {
    try {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'পোস্ট আইডি প্রয়োজন!' }), { status: 400 });
      }

      await context.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
      return new Response(JSON.stringify({ success: true, message: 'পোস্টটি ডিলিট করা হয়েছে।' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  // --- নিউজ রিড করার হ্যান্ডলার (GET) ---
  if (method === 'GET') {
    try {
      const type = url.searchParams.get('type'); // lead, sub, বা সাধারণ নিউজ আলাদা করার জন্য
      let query = `
        SELECT posts.*, categories.name as category_name 
        FROM posts 
        LEFT JOIN categories ON posts.category_id = categories.id 
      `;

      if (type === 'lead') {
        // শুধুমাত্র মেইন লিড নিউজটি আনবে (সর্বশেষটি)
        query += " WHERE is_lead = 1 ORDER BY posts.id DESC LIMIT 1";
      } else if (type === 'sub') {
        // সাব-নিউজ গ্রিডের সর্বশেষ ২টি নিউজ আনবে
        query += " WHERE is_sub_lead = 1 ORDER BY posts.id DESC LIMIT 2";
      } else {
        // সব নিউজ ক্রমানুসারে আনবে
        query += " ORDER BY posts.id DESC";
      }

      const { results } = await context.env.DB.prepare(query).all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
}

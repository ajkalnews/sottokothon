// ১. নতুন পোস্ট তৈরি করা (POST Request)
export async function onRequestPost(context) {
  try {
    const { title, content, imageUrl } = await context.request.json();

    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'টাইটেল এবং কনটেন্ট আবশ্যক' }), { status: 400 });
    }

    // D1 ডাটাবেজে ডাটা ইনসার্ট করা
    await context.env.DB.prepare(
      "INSERT INTO posts (title, content, image_url) VALUES (?, ?, ?)"
    ).bind(title, content, imageUrl || null).run();

    return new Response(JSON.stringify({ success: true, message: 'পোস্ট সফল হয়েছে!' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ২. সকল পোস্ট ডাটাবেজ থেকে নিয়ে আসা (GET Request - এটি ফ্রন্টএন্ডে দেখানোর জন্য লাগবে)
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM posts ORDER BY id DESC"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

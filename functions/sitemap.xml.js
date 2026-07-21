export async function onRequest(context) {
  try {
    // ১. তোমার ডাটাবেজ API থেকে পোস্ট নিয়ে আসা
    // (এখানে তোমার আসল API URL টি বসাও যা থেকে সব পোস্ট পাওয়া যায়)
    const apiResponse = await fetch('https://sottokothon.pages.dev/api/posts');
    const posts = await apiResponse.json();

    const siteUrl = 'https://sottokothon.pages.dev';

    // ২. হেডারের ১৮টি ক্যাটাগরি আইডি (১ থেকে ২৪)
    const categoryIds = [1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // হোমপেজ
    xml += `  <url><loc>${siteUrl}/</loc><changefreq>always</changefreq><priority>1.0</priority></url>\n`;

    // ক্যাটাগরি পেজসমূহ
    categoryIds.forEach(id => {
      xml += `  <url><loc>${siteUrl}/category.html?id=${id}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>\n`;
    });

    // ডাইনামিক পোস্টসমূহ
    if (Array.isArray(posts)) {
      posts.forEach(post => {
        const postDate = post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : '2026-07-21';
        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/single-post.html?id=${post.id}</loc>\n`;
        xml += `    <lastmod>${postDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.9</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    xml += `</urlset>`;

    // XML হেডারে রেসপন্স ব্যাক করা
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600' // ১ ঘণ্টা ক্যাশ থাকবে
      }
    });

  } catch (error) {
    console.error('Sitemap Error:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}

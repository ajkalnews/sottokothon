export async function onRequest(context) {
  const siteUrl = "https://sottokothon.pages.dev";

  try {
    // গত 48 ঘণ্টার পোস্ট
    const { results: posts } = await context.env.DB.prepare(`
      SELECT
        id,
        title,
        created_at
      FROM posts
      WHERE datetime(created_at) >= datetime('now', '-2 days')
      ORDER BY created_at DESC
    `).all();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

    for (const post of posts) {

      const publishDate = new Date(post.created_at).toISOString();

      // XML Escape
      const title = (post.title || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      xml += `
  <url>
    <loc>${siteUrl}/single-post.html?id=${post.id}</loc>

    <news:news>

      <news:publication>

        <news:name>সত্য কথন</news:name>

        <news:language>bn</news:language>

      </news:publication>

      <news:publication_date>${publishDate}</news:publication_date>

      <news:title>${title}</news:title>

    </news:news>

  </url>`;
    }

    xml += `
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
        "Cache-Control": "public, max-age=900"
      }
    });

  } catch (err) {

    console.error(err);

    return new Response("News Sitemap Error", {
      status: 500
    });

  }

}

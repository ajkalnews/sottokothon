export async function onRequest(context) {
  const siteUrl = "https://sottokothon.pages.dev";

  const escapeXml = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const getFormattedDate = (dateStr) => {
    try {
      if (!dateStr) return new Date().toISOString().split("T")[0];
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? new Date().toISOString().split("T")[0] : d.toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  try {
    let posts = [];
    if (context.env && context.env.DB) {
      const { results } = await context.env.DB.prepare(`
        SELECT id, created_at
        FROM posts
        ORDER BY created_at DESC
      `).all();
      posts = results || [];
    }

    const categoryIds = [
      1, 2, 3, 4, 5, 6,
      11, 12, 13, 14, 15,
      18, 19, 20, 21, 22, 23, 24
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url>\n    <loc>${escapeXml(siteUrl)}/</loc>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Category Pages
    for (const id of categoryIds) {
      xml += `  <url>\n    <loc>${escapeXml(`${siteUrl}/category.html?id=${id}`)}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // Posts
    for (const post of posts) {
      const lastmod = getFormattedDate(post.created_at);
      xml += `  <url>\n    <loc>${escapeXml(`${siteUrl}/single-post.html?id=${post.id}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600"
      }
    });

  } catch (err) {
    console.error("Sitemap Error:", err);

    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=UTF-8"
      }
    });
  }
}

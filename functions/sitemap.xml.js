export async function onRequest(context) {
  const siteUrl = "https://sottokothon.pages.dev";

  try {
    // D1 Database থেকে পোস্ট আনা
    const { results: posts } = await context.env.DB.prepare(`
      SELECT id, created_at
      FROM posts
      ORDER BY created_at DESC
    `).all();

    // আপনার ক্যাটাগরি ID
    const categoryIds = [
      1, 2, 3, 4, 5, 6,
      11, 12, 13, 14, 15,
      18, 19, 20, 21, 22, 23, 24
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `
<url>
  <loc>${siteUrl}/</loc>
  <changefreq>hourly</changefreq>
  <priority>1.0</priority>
</url>`;

    // Category Pages
    for (const id of categoryIds) {
      xml += `
<url>
  <loc>${siteUrl}/category.html?id=${id}</loc>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>`;
    }

    // News Posts
    for (const post of posts) {
      const lastmod = post.created_at
        ? new Date(post.created_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      xml += `
<url>
  <loc>${siteUrl}/single-post.html?id=${post.id}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>`;
    }

    xml += `\n</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
        "Cache-Control": "public, max-age=3600"
      }
    });

  } catch (err) {
    console.error("Sitemap Error:", err);

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>${err.message}</message>
</error>`,
      {
        status: 500,
        headers: {
          "Content-Type": "application/xml; charset=UTF-8"
        }
      }
    );
  }
}

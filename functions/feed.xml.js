export async function onRequest(context) {

  const siteUrl = "https://sottokothon.pages.dev";

  const { results: posts } = await context.env.DB.prepare(`
      SELECT id,title,created_at
      FROM posts
      ORDER BY created_at DESC
      LIMIT 50
  `).all();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>

<rss version="2.0">

<channel>

<title>সত্য কথন</title>

<link>${siteUrl}</link>

<description>বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ</description>

<language>bn</language>
`;

  for (const post of posts) {

    xml += `
<item>

<title><![CDATA[${post.title}]]></title>

<link>${siteUrl}/single-post.html?id=${post.id}</link>

<guid>${siteUrl}/single-post.html?id=${post.id}</guid>

<pubDate>${new Date(post.created_at).toUTCString()}</pubDate>

</item>`;
  }

  xml += `
</channel>

</rss>`;

  return new Response(xml, {

    headers: {

      "Content-Type":"application/rss+xml"

    }

  });

}

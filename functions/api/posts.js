export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;
  const postId = url.searchParams.get('id');

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ১. সব পোস্ট লোড করা (GET)
    if (method === 'GET') {
      const { results } = await env.DB.prepare(`
        SELECT posts.*, categories.name as category_name 
        FROM posts 
        LEFT JOIN categories ON posts.category_id = categories.id 
        ORDER BY posts.created_at DESC
      `).all();

      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ২. নতুন পোস্ট তৈরি করা (POST)
    if (method === 'POST') {
      const body = await request.json();
      const { title, slug, content, imageUrl, imageCaption, categoryId, isLead, isSubLead } = body;

      await env.DB.prepare(`
        INSERT INTO posts (title, slug, content, image_url, image_caption, category_id, is_lead, is_sub_lead)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        title,
        slug,
        content,
        imageUrl || null,
        imageCaption || null,
        categoryId ? parseInt(categoryId) : null,
        isLead ? 1 : 0,
        isSubLead ? 1 : 0
      ).run();

      return new Response(JSON.stringify({ success: true, message: 'Post created successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ৩. পোস্ট আপডেট করা (PUT)
    if (method === 'PUT') {
      if (!postId) {
        return new Response(JSON.stringify({ error: 'Post ID required' }), { status: 400, headers: corsHeaders });
      }

      const body = await request.json();
      const { title, slug, content, imageUrl, imageCaption, categoryId, isLead, isSubLead } = body;

      await env.DB.prepare(`
        UPDATE posts 
        SET title = ?, slug = ?, content = ?, image_url = ?, image_caption = ?, category_id = ?, is_lead = ?, is_sub_lead = ?
        WHERE id = ?
      `).bind(
        title,
        slug,
        content,
        imageUrl,
        imageCaption,
        categoryId ? parseInt(categoryId) : null,
        isLead ? 1 : 0,
        isSubLead ? 1 : 0,
        postId
      ).run();

      return new Response(JSON.stringify({ success: true, message: 'Post updated successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ৪. পোস্ট মুছে ফেলা (DELETE)
    if (method === 'DELETE') {
      if (!postId) {
        return new Response(JSON.stringify({ error: 'Post ID required' }), { status: 400, headers: corsHeaders });
      }

      await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(postId).run();

      return new Response(JSON.stringify({ success: true, message: 'Post deleted successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

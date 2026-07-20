export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400, headers: corsHeaders });
    }

    // ইউনিক ফাইল নেম জেনারেট
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // Cloudflare Pages Bindings অনুযায়ী 'Bucket' নাম ব্যবহার করা হয়েছে
    await env.Bucket.put(fileName, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    const imageUrl = `https://pub-816839de565241cf8cd280b8f2f52eab.r2.dev/${fileName}`;

    return new Response(JSON.stringify({ url: imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

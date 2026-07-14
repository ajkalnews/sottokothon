export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: 'কোনো ফাইল পাওয়া যায়নি' }), { status: 400 });
    }

    // একটি ইউনিক ফাইল নাম তৈরি করা
    const fileKey = `${Date.now()}-${file.name}`;

    // R2-তে ছবি আপলোড করা (আমরা IMAGES বাইন্ডিং ব্যবহার করছি)
    await context.env.IMAGES.put(fileKey, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    // আপনার R2 বাকেটের পাবলিক ডোমেনটি এখানে বসাবেন
    const publicDomain = 'https://আপনার-R2-পাবলিক-ডোমেন.r2.dev'; 
    const imageUrl = `${publicDomain}/${fileKey}`;

    return new Response(JSON.stringify({ url: imageUrl }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    // ড্যাশবোর্ডের R2 বাইন্ডিং ঠিক আছে কিনা চেক করা
    if (!context.env.Bucket) {
      return new Response(JSON.stringify({ error: "R2 Bucket Binding ড্যাশবোর্ডে সেট করা নেই!" }), { status: 500 });
    }

    const formData = await context.request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: "কোনো ফাইল পাওয়া যায়নি!" }), { status: 400 });
    }

    // একটি ইউনিক ফাইলের নাম তৈরি করা (টাইমস্ট্যাম্প সহ)
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

    // ফাইলটি R2 বাকেটে আপলোড করা
    await context.env.Bucket.put(uniqueFileName, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    // আপনার দেওয়া R2 পাবলিক ইউআরএল
    const publicUrl = `https://pub-816839de565241cf8cd280b8f2f52eab.r2.dev/${uniqueFileName}`;

    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "সার্ভার ত্রুটি: " + err.message }), { status: 500 });
  }
}

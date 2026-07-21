export async function onRequestPost(context) {
  try {
    const { url } = await context.request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), { status: 400 });
    }

    const apiKey = "sottokothonkey1234567890abcdef"; // তোমার ৩২ অক্ষরের API Key
    const host = "sottokothon.pages.dev";

    // IndexNow API Endpoint-এ পিং পাঠানো
    const indexNowUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${apiKey}`;

    const response = await fetch(indexNowUrl);

    return new Response(JSON.stringify({ success: true, status: response.status }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

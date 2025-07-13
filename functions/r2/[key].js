export async function onRequest(context) {
  const url = new URL(context.request.url);
  const key = url.pathname.replace("/r2/", ""); // extract everything after /r2/

  const object = await context.env.MY_BUCKET.get(key);
  if (!object || !object.body) {
    return new Response("File not found", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename="${key.split("/").pop()}"`
    }
  });
}

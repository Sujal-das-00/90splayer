export async function onRequest(context) {
  const key = context.params.key.join("/"); // song/sujal/mysong.mp3

  const object = await context.env.MY_BUCKET.get(key);
  if (!object || !object.body) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename="${key.split("/").pop()}"`
    }
  });
}

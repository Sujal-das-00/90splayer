export async function onRequest(context) {
  const folder = context.params.folder;     // e.g., "sujal"
  const prefix = `song/${folder}/`;        // looks inside that folder in R2

  const list = await context.env.MY_BUCKET.list({ prefix });
  let html = "";
  for (const obj of list.objects) {
    if (obj.key.endsWith(".mp3")) {
      const name = obj.key.substring(prefix.length);
      html += `<a href="/r2/${obj.key}">${name}</a><br/>`;
    }
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}

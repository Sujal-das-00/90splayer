export async function onRequest(context) {
  const folder = context.params.folder;
  const prefix = `song/${folder}/`;

  const list = await context.env.MY_BUCKET.list({ prefix });
  console.log("Found objects:", list.objects);

  let html = "<h2>Available Songs:</h2><ul>";
  let found = false;

  for (const obj of list.objects) {
    if (obj.key.endsWith(".mp3")) {
      found = true;
      const name = obj.key.substring(prefix.length);
      html += `<li><a href="/r2/${obj.key}">${name}</a></li>`;
    }
  }

  html += "</ul>";

  if (!found) {
    html += "<p>No .mp3 files found in the folder.</p>";
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}

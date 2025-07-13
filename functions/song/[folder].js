export async function onRequest(context) {
  const folder = context.params.folder;  // e.g., "bangla"
  const prefix = `${folder}/`;           // e.g., "bangla/"

  const list = await context.env.MY_BUCKET.list({ prefix });
  let html = "Available Songs:<br/><br/>";

  for (const obj of list.objects) {
    if (obj.key.endsWith(".mp3")) {
      const name = obj.key.substring(prefix.length);
      html += `<a href="https://pub-b86b85e62d694281abf1beea6f3fd311.r2.dev/${obj.key}" target="_blank">${name}</a><br/>`;
    }
  }

  if (list.objects.length === 0) {
    html += "No .mp3 files found in the folder.";
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}

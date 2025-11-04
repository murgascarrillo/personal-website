function escapeHtml(s){ return s
  .replaceAll('&','&amp;').replaceAll('<','&lt;')
  .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll(/'/g, '&#39;'); ; }
document.body.innerText = escapeHtml(userProvided);
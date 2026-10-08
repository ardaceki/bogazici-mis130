export const query = (selector) => document.querySelector(selector);
export const escapeHtml = (text) =>
  String(text ?? '').replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  );
export const renderInline = (text) => escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');
export const renderParagraphs = (text) =>
  String(text)
    .split('\n\n')
    .map(
      (p) => /* HTML */ `
        <p>${renderInline(p).replace(/\n/g, '<br>')}</p>
      `,
    )
    .join('');

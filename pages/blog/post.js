document.addEventListener('DOMContentLoaded', () => {
  loadPost(getSlugFromURL());
});

function getSlugFromURL() {
  return new URLSearchParams(window.location.search).get('slug');
}

function loadPost(slug) {
  const meta = blogPosts.find(post => post.slug === slug);
  const container = document.getElementById('post-content');

  if (!meta) {
    container.innerHTML = '<p>Post not found.</p>';
    return;
  }

  document.title = meta.title;

  fetch(`./posts/${slug}.md`)
    .then(response => response.text())
    .then(markdown => renderPost(container, meta, markdown));
}

function renderPost(container, meta, markdown) {
  container.innerHTML = `
    <h1>${meta.title}</h1>
    <time datetime="${meta.date}">${formatDate(meta.date)}</time>
    ${parseMarkdown(markdown)}
  `;
}

function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* >>> Tiny Markdown parser <<< */
/* Supports: #/##/### headings, **bold**, *italic*, [links](url),
   ![images](src), > blockquotes, - lists, and paragraphs. */

function parseMarkdown(markdown) {
  const blocks = markdown
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .filter(Boolean);

  return blocks.map(parseBlock).join('\n');
}

function parseBlock(block) {
  if (block.startsWith('### ')) return `<h3>${parseInline(block.slice(4))}</h3>`;
  if (block.startsWith('## ')) return `<h2>${parseInline(block.slice(3))}</h2>`;
  if (block.startsWith('# ')) return `<h1>${parseInline(block.slice(2))}</h1>`;
  if (block.startsWith('![')) return parseImage(block);
  if (block.startsWith('> ')) return parseBlockquote(block);
  if (/^[-*] /.test(block)) return parseList(block);

  return `<p>${parseInline(block)}</p>`;
}

function parseImage(block) {
  const match = block.match(/^!\[(.*?)\]\((.*?)\)/);
  if (!match) return '';
  const [, alt, src] = match;
  const caption = alt ? `<figcaption>${alt}</figcaption>` : '';
  return `<figure><img src="${src}" alt="${alt}" loading="lazy" />${caption}</figure>`;
}

function parseBlockquote(block) {
  const text = block
    .split('\n')
    .map(line => line.replace(/^> ?/, ''))
    .join(' ');
  return `<blockquote>${parseInline(text)}</blockquote>`;
}

function parseList(block) {
  const items = block
    .split('\n')
    .map(line => `<li>${parseInline(line.replace(/^[-*] /, ''))}</li>`)
    .join('');
  return `<ul>${items}</ul>`;
}

function parseInline(text) {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, ' ');
}

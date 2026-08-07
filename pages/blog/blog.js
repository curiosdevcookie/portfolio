document.addEventListener('DOMContentLoaded', () => {
  renderPostList(blogPosts);
});

function renderPostList(posts) {
  const list = document.getElementById('blog-list');
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  sorted.forEach(post => {
    list.appendChild(createPostPreview(post));
  });
}

function createPostPreview(post) {
  const item = document.createElement('li');
  item.classList.add('blog-post-preview');

  item.innerHTML = `
    <a href="./post.html?slug=${post.slug}">
      <h4>${post.title}</h4>
      <time datetime="${post.date}">${formatDate(post.date)}</time>
      <p class="excerpt">${post.excerpt}</p>
      <span class="read-more">Read more →</span>
    </a>
  `;

  return item;
}

function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

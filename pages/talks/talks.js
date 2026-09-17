document.addEventListener('DOMContentLoaded', () => {
  renderTalkList(talks);
});

function renderTalkList(talks) {
  const list = document.getElementById('talk-list');
  talks.forEach(talk => {
    list.appendChild(createTalkPreview(talk));
  });
}

function createTalkPreview(talk) {
  const item = document.createElement('li');
  item.classList.add('talk-preview');

  item.innerHTML = `
    <a
      class="talk-embed-link"
      href="${talk.pdf}"
      target="_blank"
      rel="noopener"
      aria-label="${talk.title}">
      <embed src="${talk.pdf}" type="application/pdf" title="${talk.title}" />
    </a>
    <a class="download-button" href="${talk.pdf}" download>Download</a>
  `;

  return item;
}

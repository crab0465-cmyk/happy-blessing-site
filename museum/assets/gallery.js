const tabs = [...document.querySelectorAll('[role="tab"][data-collection]')];
const panels = [...document.querySelectorAll('.collection-panel')];

function activateCollection(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => {
    const selected = panel.id === `panel-${tab.dataset.collection}`;
    panel.hidden = !selected;
    panel.classList.toggle('is-active', selected);
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateCollection(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const next = tabs[(index + direction + tabs.length) % tabs.length];
    activateCollection(next);
    next.focus();
  });
});

const referenceButtons = [...document.querySelectorAll('.reference-thumb')];
const referenceImage = document.querySelector('#referenceImage');
const referenceTitle = document.querySelector('#referenceTitle');
const referenceSource = document.querySelector('#referenceSource');
const dockTitle = document.querySelector('#dockTitle');
const compareButton = document.querySelector('#compareButton');

referenceButtons.forEach(button => {
  button.addEventListener('click', () => {
    referenceButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    referenceImage.src = button.dataset.image;
    referenceImage.alt = `${button.dataset.source}：${button.dataset.title}`;
    referenceTitle.textContent = button.dataset.title;
    referenceSource.textContent = button.dataset.source;
    dockTitle.textContent = button.dataset.title;
    if (compareButton.getAttribute('aria-pressed') !== 'true') compareButton.click();
  });
});

compareButton.addEventListener('click', () => {
  queueMicrotask(() => {
    compareButton.textContent = compareButton.getAttribute('aria-pressed') === 'true' ? '返回模型' : '实拍对照';
  });
});

const dialog = document.querySelector('#imageDialog');
const dialogImage = document.querySelector('#dialogImage');
const dialogTitle = document.querySelector('#dialogTitle');
const closeButton = dialog.querySelector('.dialog-close');

function imageCredit(source) {
  if (source.includes('/collections/kong-')) return '授权来源 @土豆薄荷糖';
  if (source.includes('/collections/henan-')) return '授权来源 @红';
  if (source.includes('/collections/yuzhou-')) return '授权来源 @内观自在';
  return '经授权使用';
}

document.querySelectorAll('img').forEach(image => {
  if (image.id === 'dialogImage') return;
  const container = image.parentElement;
  if (!container || container.querySelector(':scope > .source-credit-badge')) return;
  container.classList.add('has-source-credit');
  const badge = document.createElement('span');
  badge.className = 'source-credit-badge';
  badge.textContent = imageCredit(image.getAttribute('src') || '');
  badge.setAttribute('aria-label', `${badge.textContent}，图片内含完整水印`);
  container.appendChild(badge);
});

document.querySelectorAll('[data-lightbox]').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    const label = button.querySelector('span').textContent;
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogTitle.textContent = label;
    dialog.showModal();
    closeButton.focus();
  });
});

closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

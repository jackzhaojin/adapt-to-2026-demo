import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Optimize only same-origin / content-bus images. createOptimizedPicture rewrites
 * the src into the AEM media pipeline, which breaks absolute external URLs
 * (e.g. images.unsplash.com used by the showcase), so those are left untouched.
 * @param {string} src image src
 * @returns {boolean} true when the image can be safely optimized
 */
function isOptimizable(src) {
  try {
    return new URL(src, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * loads and decorates the cards block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-card';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });

    const body = li.querySelector('.cards-card-body');
    if (body) {
      const paragraphs = [...body.querySelectorAll(':scope > p')];

      // meta line(s): contain a middot separator e.g. "8.2 mi · Hard · Sierra Nevada"
      paragraphs.forEach((p) => {
        if (p.textContent.includes('·')) p.classList.add('cards-card-meta');
      });

      // category chip: the first paragraph, when it is a short label (not the meta/excerpt)
      const firstP = paragraphs[0];
      if (firstP
        && !firstP.classList.contains('cards-card-meta')
        && firstP.textContent.trim().length <= 50) {
        firstP.classList.add('cards-card-category');
      }

      // remaining body paragraphs are excerpt copy
      paragraphs.forEach((p) => {
        if (!p.classList.contains('cards-card-meta') && !p.classList.contains('cards-card-category')) {
          p.classList.add('cards-card-excerpt');
        }
      });

      // headings are card titles
      body.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => h.classList.add('cards-card-title'));

      // a trailing link becomes the "read story" affordance and is stretched to
      // cover the whole card, giving a single, keyboard-accessible tab stop.
      const links = body.querySelectorAll('a');
      const link = links[links.length - 1];
      if (link && !link.querySelector('img')) {
        link.classList.add('cards-card-link');
        li.classList.add('cards-card-has-link');
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    if (isOptimizable(img.src)) {
      img.closest('picture').replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
      );
    }
  });

  block.replaceChildren(ul);
}

import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Returns true when the image src points to a different origin than the page.
 * External (e.g. images.unsplash.com) URLs must NOT be run through
 * createOptimizedPicture, which only works on same-origin / content-bus assets.
 * @param {string} src image source
 * @returns {boolean}
 */
function isExternal(src) {
  try {
    return new URL(src, window.location.href).origin !== window.location.origin;
  } catch (e) {
    return false;
  }
}

/**
 * Builds a <figure> for a single photo + optional caption cell.
 * Caption convention (relative to an optional heading):
 *   text before the heading  -> eyebrow (location / category label)
 *   the heading itself        -> title
 *   text after the heading    -> caption / quote
 * @param {Element} picture the authored <picture>
 * @param {Element} [captionCell] the optional caption cell
 * @returns {HTMLElement}
 */
function buildFigure(picture, captionCell) {
  const figure = document.createElement('figure');
  figure.className = 'gallery-item';

  const frame = document.createElement('div');
  frame.className = 'gallery-image';
  const img = picture.querySelector('img');
  if (img) img.loading = 'lazy';
  frame.append(picture);
  figure.append(frame);

  if (captionCell && captionCell.textContent.trim()) {
    const caption = document.createElement('figcaption');
    caption.className = 'gallery-caption';
    const hasHeading = !!captionCell.querySelector('h1,h2,h3,h4,h5,h6');
    let seenHeading = false;
    [...captionCell.children].forEach((el) => {
      if (/^H[1-6]$/.test(el.tagName)) {
        el.classList.add('gallery-title');
        seenHeading = true;
      } else if (el.tagName === 'P') {
        el.classList.add(hasHeading && !seenHeading ? 'gallery-eyebrow' : 'gallery-text');
      }
      caption.append(el);
    });
    figure.append(caption);
  }

  return figure;
}

/**
 * loads and decorates the gallery block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const figures = [];

  [...block.children].forEach((row) => {
    const pictures = [...row.querySelectorAll('picture')];
    if (!pictures.length) return;
    // the caption is the first non-empty cell that carries no image
    const captionCell = [...row.children]
      .find((cell) => !cell.querySelector('picture') && cell.textContent.trim());
    // one figure per picture; only the first picture in a row keeps the caption
    pictures.forEach((picture, i) => {
      figures.push(buildFigure(picture, i === 0 ? captionCell : null));
    });
  });

  block.replaceChildren(...figures);

  // optimize only same-origin images; leave external (unsplash) <picture> intact
  block.querySelectorAll('picture > img').forEach((img) => {
    if (isExternal(img.src)) {
      img.loading = 'lazy';
      return;
    }
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });
}

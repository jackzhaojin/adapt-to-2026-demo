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
 * loads and decorates the hero block
 *
 * Author contract (rows/cells are flattened, so depth/order is forgiving):
 *  - the first cell holding a <picture> becomes the full-bleed background image
 *  - a <p> before the heading            -> eyebrow / category chip
 *  - the first heading                   -> headline
 *  - a <p> after the heading with a `·`  -> meta line (author · date)
 *  - any other <p> after the heading     -> subtitle
 *  - bold/italic links (pre-decorated by scripts.js) -> grouped CTA buttons
 * The `minimal` variant omits the image and renders a solid forest band.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // 1. Background image layer — behind a legibility scrim. Absent for `minimal`.
  const picture = block.querySelector('picture');
  const bg = document.createElement('div');
  bg.className = 'hero-bg';
  if (picture) {
    const img = picture.querySelector('img');
    if (img && isOptimizable(img.src)) {
      bg.append(createOptimizedPicture(img.src, img.alt, true, [
        { media: '(min-width: 900px)', width: '1600' },
        { width: '900' },
      ]));
    } else {
      if (img) img.loading = 'eager';
      bg.append(picture);
    }
    block.classList.add('hero-has-image');
  }

  // 2. Overlaid foreground content.
  const content = document.createElement('div');
  content.className = 'hero-content';
  const actions = document.createElement('div');
  actions.className = 'hero-actions';

  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  let passedHeading = false;

  [...block.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote')].forEach((el) => {
    if (el === heading) {
      el.classList.add('hero-title');
      passedHeading = true;
      content.append(el);
    } else if (el.classList.contains('button-wrapper') || el.querySelector('a.button')) {
      actions.append(el);
    } else if (!passedHeading) {
      el.classList.add('hero-eyebrow');
      content.append(el);
    } else if (el.tagName === 'P' && el.textContent.includes('·')) {
      el.classList.add('hero-meta');
      content.append(el);
    } else {
      el.classList.add('hero-subtitle');
      content.append(el);
    }
  });

  if (actions.children.length) content.append(actions);

  // 3. Replace the authored rows/cells with the flattened layers.
  block.textContent = '';
  if (bg.children.length) block.append(bg);
  block.append(content);
}

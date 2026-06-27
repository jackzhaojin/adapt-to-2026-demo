/**
 * Quote block — a Playfair Display pull-quote for the Wild Trails Journal.
 *
 * Author contract (rows / cells):
 *   Row 1: the quotation text (a <p>)
 *   Row 2: the attribution — first <p> is the name, an optional second <p>
 *          carries the role / location.
 *   `feature` variant: an additional first cell holding a <picture>, used as a
 *          full-bleed background behind a light, scrim-darkened quote.
 *
 * Renders a semantic <figure><blockquote>…</blockquote><figcaption>…</figcaption></figure>.
 * The decorative quote mark and the moss attribution rule are drawn in CSS.
 *
 * NOTE: the showcase uses external (Unsplash) images, so we deliberately do NOT
 * run createOptimizedPicture — it only works on same-origin/content-bus images
 * and would break external URLs. The authored <picture> is kept intact.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Pull out an optional background image (feature variant).
  const picture = block.querySelector('picture');

  // The text rows, in author order: [0] = quote, [1] = attribution.
  // A row that only holds the background picture is not a text row.
  const textRows = [...block.children].filter((row) => {
    if (picture && row.contains(picture) && row.textContent.trim() === '') return false;
    return row.textContent.trim() !== '';
  });
  const [quoteRow, attribRow] = textRows;

  const figure = document.createElement('figure');

  // Background image → full-bleed layer for the feature variant.
  if (picture) {
    const bg = document.createElement('div');
    bg.className = 'quote-bg';
    bg.setAttribute('aria-hidden', 'true');
    const img = picture.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
    bg.append(picture);
    figure.append(bg);
    block.classList.add('has-image');
  }

  const content = document.createElement('div');
  content.className = 'quote-content';

  // Quotation.
  const blockquote = document.createElement('blockquote');
  if (quoteRow) {
    const cell = quoteRow.querySelector(':scope > div') || quoteRow;
    while (cell.firstChild) blockquote.append(cell.firstChild);
  }
  content.append(blockquote);

  // Attribution.
  if (attribRow) {
    const figcaption = document.createElement('figcaption');
    const cell = attribRow.querySelector(':scope > div') || attribRow;
    while (cell.firstChild) figcaption.append(cell.firstChild);
    figcaption.querySelectorAll('p').forEach((p, i) => {
      p.className = i === 0 ? 'quote-attribution-name' : 'quote-attribution-role';
    });
    content.append(figcaption);
  }

  figure.append(content);
  block.replaceChildren(figure);
}

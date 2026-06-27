/**
 * Author Bio block.
 *
 * Authored as one row, two cells:
 *   cell 1 — the avatar <picture>
 *   cell 2 — the body: an eyebrow <p> ("WRITTEN BY"), an <h_> name, a role <p>,
 *            a bio <p> (one or more), and a <ul> of social links.
 *
 * Variant `center` stacks everything in a centered column (end-of-article use).
 *
 * Note: avatars are typically external author portraits, so we intentionally do
 * NOT run createOptimizedPicture on them (it only works on content-bus images).
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const avatarCell = cells.find((cell) => cell.querySelector('picture, img'));
  const bodyCell = cells.find((cell) => cell !== avatarCell) || cells[0];

  if (avatarCell && avatarCell !== bodyCell) {
    avatarCell.classList.add('author-bio-avatar');
  }

  if (!bodyCell) return;
  bodyCell.classList.add('author-bio-body');

  const name = bodyCell.querySelector('h1, h2, h3, h4, h5, h6');
  if (name) name.classList.add('author-bio-name');

  // Classify body content by document order relative to the name heading:
  // paragraphs before the name are the eyebrow, the first after it is the role,
  // and any remaining paragraphs make up the bio.
  let passedName = false;
  let roleAssigned = false;
  [...bodyCell.children].forEach((el) => {
    if (el === name) {
      passedName = true;
      return;
    }
    if (el.tagName === 'P') {
      if (!passedName) {
        el.classList.add('author-bio-eyebrow');
      } else if (!roleAssigned) {
        el.classList.add('author-bio-role');
        roleAssigned = true;
      } else {
        el.classList.add('author-bio-bio');
      }
    } else if (el.tagName === 'UL') {
      el.classList.add('author-bio-social');
      el.querySelectorAll(':scope > li > a').forEach((a) => {
        a.classList.add('author-bio-social-link');
        // open absolute (external) profile links safely in a new tab
        if (/^https?:\/\//i.test(a.getAttribute('href') || '')) {
          a.target = '_blank';
          a.rel = 'noopener';
        }
      });
    }
  });
}

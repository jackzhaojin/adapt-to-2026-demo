export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // decorate each column: image-only columns drive the layout, text columns
  // get an eyebrow class on the leading label paragraph (the "Solo Expedition"
  // kicker that sits above the headline).
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const picWrapper = pic ? pic.closest('div') : null;
      if (pic && picWrapper && picWrapper.children.length === 1) {
        // picture is the only content in the column
        picWrapper.classList.add('columns-img-col');
        return;
      }

      // text column: tag any paragraph that precedes the first heading as an
      // eyebrow so it renders as an uppercase moss kicker. Authors simply type
      // the label as the first paragraph of the cell.
      col.classList.add('columns-text-col');
      const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        let node = col.firstElementChild;
        while (node && node !== heading) {
          if (node.tagName === 'P' && !node.querySelector('a')) {
            node.classList.add('columns-eyebrow');
          }
          node = node.nextElementSibling;
        }
      }
    });
  });
}

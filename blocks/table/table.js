/*
 * Table Block
 * Recreate a semantic <table> from authored rows.
 * https://www.aem.live/developer/block-collection/table
 *
 * Initial content (authoring contract): the first row is the table header by
 * default. Add the `no-header` variant to treat every row as a body row.
 * Variants (space-separated in the block name): striped, bordered, no-header.
 */

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) table.append(thead);
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });

  block.innerHTML = '';
  block.append(table);
}

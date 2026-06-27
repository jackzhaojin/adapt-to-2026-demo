/**
 * Stats — a horizontal band of trail-highlight statistics.
 *
 * Author contract (each block row):
 *   - a lone cell containing a heading (h2–h6) → optional band title
 *   - otherwise a stat: cell 1 = value (big number, e.g. "2,400 ft"),
 *     cell 2 = label (e.g. "Elevation Gain"). A value-only (single-cell,
 *     non-heading) row renders without a label.
 *
 * The `forest` variation paints a solid forest-green band with light text.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.replaceChildren();

  const band = document.createElement('div');
  band.className = 'stats-band';

  rows.forEach((row) => {
    const cells = [...row.children];
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');

    // Optional title row: a lone cell whose content is a heading.
    if (cells.length === 1 && heading) {
      const title = document.createElement('div');
      title.className = 'stats-title';
      title.append(heading);
      block.append(title);
      return;
    }

    const valueText = (cells[0]?.textContent || '').trim();
    if (!valueText) return;

    const item = document.createElement('div');
    item.className = 'stats-item';

    const value = document.createElement('div');
    value.className = 'stats-value';
    // Render a trailing unit token (ft, mi, hrs…) smaller, like the design.
    const lastSpace = valueText.lastIndexOf(' ');
    const main = lastSpace > 0 ? valueText.slice(0, lastSpace) : valueText;
    const unit = lastSpace > 0 ? valueText.slice(lastSpace + 1) : '';
    if (unit && unit.length <= 4 && /\d/.test(main)) {
      value.append(`${main} `);
      const unitEl = document.createElement('span');
      unitEl.className = 'stats-unit';
      unitEl.textContent = unit;
      value.append(unitEl);
    } else {
      value.textContent = valueText;
    }
    item.append(value);

    const labelText = (cells[1]?.textContent || '').trim();
    if (labelText) {
      const label = document.createElement('div');
      label.className = 'stats-label';
      label.textContent = labelText;
      item.append(label);
    }

    band.append(item);
  });

  if (band.children.length) block.append(band);
}

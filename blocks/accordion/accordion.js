/**
 * Accordion (FAQ) block.
 *
 * Author contract — each row is one FAQ item with two cells:
 *   | question text | answer (rich: paragraphs / lists / links) |
 *
 * Each row is transformed into a native <details>/<summary> so the
 * expand/collapse is accessible and works without JavaScript. The chevron
 * is drawn and rotated purely in CSS (details[open]); items toggle
 * independently (no sibling auto-close). Variant: `minimal`.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [questionCell, answerCell] = row.children;

    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-summary';

    // question becomes the summary label; unwrap a single wrapping <p>
    const question = document.createElement('span');
    question.className = 'accordion-question';
    const qSource = (questionCell?.children.length === 1
      && questionCell.firstElementChild.tagName === 'P')
      ? questionCell.firstElementChild
      : questionCell;
    if (qSource) {
      while (qSource.firstChild) question.append(qSource.firstChild);
    }
    summary.append(question);
    details.append(summary);

    // answer keeps its authored rich content
    const body = document.createElement('div');
    body.className = 'accordion-body';
    if (answerCell) {
      while (answerCell.firstChild) body.append(answerCell.firstChild);
    }
    details.append(body);

    row.replaceWith(details);
  });
}

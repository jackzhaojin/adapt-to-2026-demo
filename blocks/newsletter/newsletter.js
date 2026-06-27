/*
 * Newsletter CTA block — a forest-green call-to-action band with an email
 * signup form. The form never posts anywhere: on submit it prevents default,
 * validates the email natively, and confirms inline.
 *
 * Content model (author contract):
 *   Row 1 ............. heading text
 *   Row 2 ............. supporting paragraph
 *   Row 3 (optional) .. cell 1 = button label, cell 2 = input placeholder
 *
 * Variant: `newsletter split` lays the text and form side by side on desktop.
 */

const DEFAULT_LABEL = 'Subscribe';
const DEFAULT_PLACEHOLDER = 'you@trailmail.com';

// monotonic counter so each input/label pairing gets a unique, stable id
let fieldSeq = 0;

function cellText(cell) {
  return cell ? cell.textContent.trim() : '';
}

// small, dependency-free mail glyph that sits inside the input (decorative)
function mailIcon() {
  const span = document.createElement('span');
  span.className = 'newsletter-icon';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  return span;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const headingCell = rows[0]?.querySelector(':scope > div');
  const textCell = rows[1]?.querySelector(':scope > div');
  const optsCells = rows[2] ? [...rows[2].querySelectorAll(':scope > div')] : [];

  const buttonLabel = cellText(optsCells[0]) || DEFAULT_LABEL;
  const placeholder = cellText(optsCells[1]) || DEFAULT_PLACEHOLDER;

  // --- text column (eyebrow-free per the contract) ---
  const textCol = document.createElement('div');
  textCol.className = 'newsletter-text';

  if (headingCell) {
    // reuse an authored heading element, otherwise promote the plain text
    let heading = headingCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading) {
      heading = document.createElement('h2');
      heading.textContent = cellText(headingCell);
    }
    heading.classList.add('newsletter-heading');
    textCol.append(heading);
  }

  if (textCell && cellText(textCell)) {
    // a div wrapper preserves authored paragraphs/links without nesting <p>
    const supporting = document.createElement('div');
    supporting.className = 'newsletter-supporting';
    supporting.append(...textCell.childNodes);
    textCol.append(supporting);
  }

  // --- action column (the form) ---
  const fieldId = `newsletter-email-${(fieldSeq += 1)}`;

  const form = document.createElement('form');
  form.className = 'newsletter-form';

  const field = document.createElement('div');
  field.className = 'newsletter-field';

  const label = document.createElement('label');
  label.className = 'newsletter-label';
  label.setAttribute('for', fieldId);
  label.textContent = 'Email address';

  const input = document.createElement('input');
  input.type = 'email';
  input.id = fieldId;
  input.name = 'email';
  input.required = true;
  input.autocomplete = 'email';
  input.placeholder = placeholder;
  input.className = 'newsletter-input';

  field.append(label, mailIcon(), input);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button primary newsletter-submit';
  submit.textContent = buttonLabel;

  form.append(field, submit);

  // inline, polite confirmation — revealed in place of the form on success
  const confirmation = document.createElement('p');
  confirmation.className = 'newsletter-confirmation';
  confirmation.setAttribute('role', 'status');
  confirmation.setAttribute('aria-live', 'polite');
  confirmation.tabIndex = -1;
  confirmation.hidden = true;
  confirmation.textContent = 'Thanks — you’re on the list.';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  });

  const action = document.createElement('div');
  action.className = 'newsletter-action';
  action.append(form, confirmation);

  // --- assemble ---
  const content = document.createElement('div');
  content.className = 'newsletter-content';
  content.append(textCol, action);

  block.textContent = '';
  block.append(content);
}

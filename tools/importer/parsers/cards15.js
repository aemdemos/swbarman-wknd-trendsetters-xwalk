/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block: 2 columns, header first row, then 1 row per card
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Find all direct <a> children (each is a card)
  const cards = element.querySelectorAll(':scope > a.utility-link-content-block');

  cards.forEach((card) => {
    // First cell: image or icon (required)
    const imageContainer = card.querySelector(':scope > div'); // wrap with parent div for aspect ratio

    // Second cell: text content (tag, date, heading)
    const textContent = document.createElement('div');
    // Tag and date (may be present)
    const horiz = card.querySelector(':scope > .flex-horizontal');
    if (horiz) {
      textContent.appendChild(horiz);
    }
    // Heading (h3)
    const heading = card.querySelector('h3');
    if (heading) {
      textContent.appendChild(heading);
    }
    rows.push([imageContainer, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
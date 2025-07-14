/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header as in the example
  const headerRow = ['Cards'];
  const rows = [headerRow];

  // Get all direct children divs representing cards
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach((card) => {
    // Each card has an icon div and a <p> description
    // Only the text content (the <p>) should be captured, not the icon SVG
    const p = card.querySelector('p');
    if (p) {
      rows.push([p]);
    }
  });

  // Only create the block if at least one card row exists
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  } else {
    // Remove the empty element if no cards detected
    element.remove();
  }
}

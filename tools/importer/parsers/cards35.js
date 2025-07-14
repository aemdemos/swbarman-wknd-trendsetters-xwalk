/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards35)'];

  // Find all direct card divs
  const cardDivs = element.querySelectorAll(':scope > div');
  const rows = [];

  cardDivs.forEach((cardDiv) => {
    // Each card div contains an image only; no text nodes in this variant
    const img = cardDiv.querySelector('img');
    // For edge cases, ensure img exists
    if (img) {
      rows.push([img, '']); // Image in first cell, empty string in second cell for text content
    } else {
      // If no image, push two empty cells (should never occur in this HTML)
      rows.push(['', '']);
    }
  });

  // Compose the table rows
  const cells = [headerRow, ...rows];
  // Create block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

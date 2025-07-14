/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: block name exactly as specified
  const headerRow = ['Hero (hero6)'];

  // 2. Background image row (only image, not overlay)
  let backgroundImg = element.querySelector('img.cover-image') || '';

  // 3. Content row: includes heading, subheading, CTA (all inside the .card)
  // Reference the existing .card element directly, if present
  const card = element.querySelector('.card');
  let contentCell = '';
  if (card) {
    contentCell = card;
  }

  // Table structure: header, bg image, content
  const rows = [
    headerRow,
    [backgroundImg],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

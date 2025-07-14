/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must match exactly)
  const headerRow = ['Hero (hero29)'];

  // Get the grid element that contains both content and image
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Determine which child is the image and which is the content
  let img = null;
  let contentDiv = null;
  const children = Array.from(grid.children);
  for (const child of children) {
    if (child.tagName === 'IMG' && !img) {
      img = child;
    } else if (!contentDiv && child.tagName !== 'IMG') {
      contentDiv = child;
    }
  }

  // 2nd row: single cell with image if present
  const imageRow = [img ? img : ''];

  // 3rd row: single cell with all content (headline, subheading, cta, etc.) if present
  const contentRow = [contentDiv ? contentDiv : ''];

  // Build the block table
  const rows = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match the example exactly
  const headerRow = ['Hero (hero29)'];

  // Find the grid that contains the left (text) and right (image) columns
  const grid = element.querySelector('.grid-layout, .w-layout-grid');
  let contentDiv = null;
  let img = null;
  if (grid) {
    // Find all direct children divs of the grid
    const gridChildren = Array.from(grid.children);
    // Find the first div (text) and the first img (image)
    for (const child of gridChildren) {
      if (!contentDiv && child.tagName === 'DIV') {
        contentDiv = child;
      }
      if (!img && child.tagName === 'IMG') {
        img = child;
      }
    }
  }
  // Fallback: look for img in the section if not found in grid
  if (!img) {
    img = element.querySelector('img');
  }
  // Fallback: look for contentDiv in the section if not found in grid
  if (!contentDiv) {
    contentDiv = element.querySelector('div');
  }

  // 2nd row: Background image (optional)
  const imageRow = [img ? img : ''];

  // 3rd row: Content (title, subheading, CTA, etc)
  const contentRow = [contentDiv ? contentDiv : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Table row 1: header
  const headerRow = ['Hero (hero14)'];

  // Table row 2: Background Image (optional)
  // Try to find the grid and each direct child
  let bgImg = null;
  let contentCell = '';
  const grids = element.querySelectorAll(':scope > div');
  for (const grid of grids) {
    // Look for possible grid layout
    if (grid.classList.contains('w-layout-grid')) {
      // Get all immediate children of the grid
      const gridChildren = grid.querySelectorAll(':scope > div');
      // Typically, first child = bg, second = content
      if (gridChildren.length > 0) {
        // Find first image in the first child (background)
        const bgDiv = gridChildren[0];
        const img = bgDiv.querySelector('img');
        if (img) bgImg = img;
      }
      if (gridChildren.length > 1) {
        // Content cell is the headline + possible buttons inside the second grid area
        const contentDiv = gridChildren[1];
        // Usually content is in a .utility-margin-bottom-6rem, but fallback to contentDiv
        const headlineBlock = contentDiv.querySelector('.utility-margin-bottom-6rem') || contentDiv;
        contentCell = headlineBlock;
      }
    }
  }
  // If no grid found fallback to whole element for edge cases
  if (!bgImg) {
    const fallbackImg = element.querySelector('img');
    if (fallbackImg) bgImg = fallbackImg;
  }
  if (!contentCell || contentCell === '') {
    contentCell = element;
  }

  // Always use the DOM element reference, do not clone
  const cells = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

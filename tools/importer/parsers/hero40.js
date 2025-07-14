/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name exactly as specified
  const headerRow = ['Hero (hero40)'];

  // 2. Background image row
  // Find the background image (img)
  let bgImg = element.querySelector('img.cover-image') || element.querySelector('img');
  
  // If no image exists, pass null so the cell is empty
  const bgImgRow = [bgImg || ''];

  // 3. Content row: Title, Subheading, CTA
  // Find the grid cell with heading/text/button group
  // The layout is: header > .w-layout-grid > [img cell, text cell]
  let contentCell = null;
  const grids = element.querySelectorAll(':scope > .w-layout-grid');
  grids.forEach(grid => {
    const children = grid.querySelectorAll(':scope > div');
    children.forEach(child => {
      if (
        (child.querySelector('h1, h2, h3, h4, h5, h6') ||
        child.querySelector('p') ||
        child.querySelector('a')) && !contentCell
      ) {
        contentCell = child;
      }
    });
  });
  // If not found, fallback to any container with h1
  if (!contentCell) {
    const h1 = element.querySelector('h1');
    if (h1) {
      contentCell = h1.closest('div');
    }
  }
  
  // If not found, leave empty
  const contentRow = [contentCell || ''];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow
  ], document);

  element.replaceWith(table);
}

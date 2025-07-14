/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row
  const cells = [['Hero (hero13)']];

  // Find all direct grid children
  const grid = element.querySelector('.w-layout-grid');
  const gridItems = grid ? grid.querySelectorAll(':scope > div') : [];

  // Row 2: Background image (optional)
  let bgImg = null;
  if (gridItems.length > 0) {
    // Find first <img> in the first grid item (background image)
    bgImg = gridItems[0].querySelector('img') || null;
  }
  cells.push([bgImg]);

  // Row 3: Content (headline, features, CTA, etc)
  let contentCell = null;
  if (gridItems.length > 1) {
    // Look for '.card' (and card body) inside the second grid item
    const card = gridItems[1].querySelector('.card');
    if (card) {
      contentCell = card;
    } else {
      // Fallback: reference the whole 2nd grid cell
      contentCell = gridItems[1];
    }
  }
  cells.push([contentCell]);

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

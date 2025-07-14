/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero33)'];

  // Find the grid layout (main content holder)
  const grid = element.querySelector('.w-layout-grid');
  let image = null;
  let textBlock = null;

  if (grid) {
    // Find all top-level children of grid
    const children = Array.from(grid.children);
    // Find first img for the image
    image = children.find(el => el.tagName && el.tagName.toLowerCase() === 'img') || null;
    // Find the first non-img (likely the text block)
    textBlock = children.find(el => el !== image) || null;
  }

  // Edge cases: if grid missing, try fallback
  if (!image) {
    image = element.querySelector('img');
  }
  if (!textBlock) {
    // Look for a <div> with headings as fallback
    textBlock = element.querySelector('h1, h2, h3, h4, h5, h6')?.closest('div');
  }

  // 2nd row: image only if present
  const imageRow = [image ? image : ''];
  // 3rd row: text block (headings, meta) if present
  const textRow = [textBlock ? textBlock : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

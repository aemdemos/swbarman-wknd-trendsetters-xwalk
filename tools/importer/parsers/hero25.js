/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with correct block name
  const headerRow = ['Hero (hero25)'];

  // Find the top-level grid in the section
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;

  // Find the background image: the direct img child of the grid
  const img = grid.querySelector('img');
  // If no image is found, insert null so the row is still present

  // Find the inner grid that contains the textual content
  const innerGrid = grid.querySelector('.w-layout-grid.grid-layout.container');
  // The actual content is the direct child .section in the inner grid
  let textContentBlock = null;
  if (innerGrid) {
    const section = innerGrid.querySelector('.section');
    if (section) {
      textContentBlock = section;
    } else {
      textContentBlock = innerGrid;
    }
  }

  // Table: 1 column, 3 rows (header, image, text content)
  const cells = [
    headerRow,
    [img || ''],
    [textContentBlock || '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}

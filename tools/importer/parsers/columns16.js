/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell with block name
  const headerRow = ['Columns (columns16)'];

  // Get the first main grid: text/content left and right
  const topGrid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  if (!topGrid) return;

  const col1 = topGrid.children[0];
  const col2 = topGrid.children[1];
  if (!col1 || !col2) return;

  // Get the bottom images grid
  const bottomGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column');
  let imgCol1 = document.createElement('div');
  let imgCol2 = document.createElement('div');
  if (bottomGrid) {
    imgCol1 = bottomGrid.children[0] || imgCol1;
    imgCol2 = bottomGrid.children[1] || imgCol2;
  }

  // Structure rows: header (single col), second row (2 cols), third row (2 cols)
  const rows = [
    headerRow,
    [col1, col2],
    [imgCol1, imgCol2]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

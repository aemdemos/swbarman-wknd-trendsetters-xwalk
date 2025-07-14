/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout within the footer
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) {
    // Fallback: include the entire element in a single cell
    const fallbackCells = [
      ['Columns (columns11)'],
      [element]
    ];
    const table = WebImporter.DOMUtils.createTable(fallbackCells, document);
    element.replaceWith(table);
    return;
  }

  // Each direct child of the grid is a column
  const columns = Array.from(grid.children);

  // The header row must be a single cell, not equal to the number of columns
  const headerRow = ['Columns (columns11)'];
  const contentRow = columns;

  // Ensure the header row is a single-cell row (one column), the content row has as many as needed
  const cells = [
    headerRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

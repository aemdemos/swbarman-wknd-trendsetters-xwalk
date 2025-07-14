/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row: must be a single cell (first row), even if there are multiple columns
  const headerRow = ['Columns (columns8)'];

  // Find the .container and its .w-layout-grid for columns content
  const container = element.querySelector('.container');
  let columnsContent = [];
  if (container) {
    const grid = container.querySelector('.w-layout-grid');
    if (grid) {
      columnsContent = Array.from(grid.children);
    }
  }

  // Fallback: if columns not found, treat whole element as one column
  if (!columnsContent.length) columnsContent = [element];

  // Compose table: header is a single cell, second row is array of columns
  const rows = [
    headerRow,
    columnsContent
  ];

  // Create table, then set colspan on the header cell to match column count
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Set colspan on the header cell if needed
  const headerTh = table.querySelector('tr:first-child > th');
  if (headerTh && columnsContent.length > 1) {
    headerTh.setAttribute('colspan', columnsContent.length);
  }

  element.replaceWith(table);
}

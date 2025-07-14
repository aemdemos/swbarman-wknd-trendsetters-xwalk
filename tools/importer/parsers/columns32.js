/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout within the container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get direct children as columns
  const columns = Array.from(grid.children);

  // Build the header row as a single cell, per spec
  const headerRow = ['Columns (columns32)'];

  // Content row: each cell is a column's content
  const contentRow = columns.map(col => col);

  // The cells array: single header cell row, then N content cells row
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

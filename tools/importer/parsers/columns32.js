/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid element which contains columns (direct child of container)
  const grid = element.querySelector(':scope > .grid-layout');
  if (!grid) {
    // Fallback: if grid not found, do not process further
    return;
  }
  // Get all immediate children of grid - these are the columns
  const columnElements = Array.from(grid.children).filter(el => el.nodeType === 1);

  // If no columns, do not process
  if (columnElements.length === 0) {
    return;
  }

  // Table header as specified
  const headerRow = ['Columns (columns32)'];
  // Compose one row with each column cell being the full original column element
  const contentRow = columnElements;

  const cells = [
    headerRow,
    contentRow
  ];
  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the table
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Get columns: immediate child divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const columnCount = columns.length;

  // Create a header row with one cell and set its colspan to span all columns
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Columns (columns30)';
  if (columnCount > 1) {
    headerCell.setAttribute('colspan', columnCount);
  }
  const headerRow = [headerCell];

  // Content row: one cell for each column, referencing the actual column elements
  const contentRow = columns;

  const tableArr = [
    headerRow,
    contentRow
  ];

  // Use WebImporter.DOMUtils.createTable to create the table
  const block = WebImporter.DOMUtils.createTable(tableArr, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}

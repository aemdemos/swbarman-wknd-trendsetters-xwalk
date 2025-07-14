/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that contains the footer columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get all direct child elements of the grid as columns
  const columns = Array.from(grid.children);
  // Compose the header row with only ONE cell
  const headerRow = ['Columns (columns11)'];
  // Compose the content row with each column in its own cell
  const contentRow = columns;
  // Create the table structure
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  // Replace the original element with the new table
  element.replaceWith(table);
}

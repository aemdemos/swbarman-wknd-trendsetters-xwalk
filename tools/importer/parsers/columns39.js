/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // For each column: if it contains only an img, use the img directly; else, use the whole column
  const columnCells = columns.map(col => {
    const childElements = Array.from(col.children);
    if (childElements.length === 1 && childElements[0].tagName.toLowerCase() === 'img') {
      return childElements[0];
    }
    return col;
  });
  // Build the table: header row is a single cell, then second row is the columns
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns39)'], // header row: single cell
    columnCells              // single array: as many columns as needed
  ], document);
  element.replaceWith(table);
}

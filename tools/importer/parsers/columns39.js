/* global WebImporter */
export default function parse(element, { document }) {
  // Extract immediate child divs representing columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // The header row is a single cell array, per requirements
  const headerRow = ['Columns (columns39)'];

  // The content row is a single array, but that array contains multiple elements (for multiple columns)
  // So, for createTable, the second row is an array of the column content (each column in its own cell)
  const contentRow = columns.map(col => {
    // If the column contains only an image, just use the image
    const img = col.querySelector('img');
    if (img && col.children.length === 1 && col.firstElementChild === img) {
      return img;
    }
    // Otherwise, use the whole column so we don't miss any content
    return col;
  });

  // Compose the table: header row (one cell), then content row (N cells for N columns)
  const tableRows = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}

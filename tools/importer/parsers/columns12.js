/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs, each represents a column
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column div, extract its main content (image or full div)
  const colCells = columns.map((col) => {
    const img = col.querySelector('img');
    if (img) return img;
    return col;
  });

  // Header row: exactly one column as required by the spec
  const headerRow = ['Columns (columns12)'];

  const tableCells = [
    headerRow,
    colCells
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}

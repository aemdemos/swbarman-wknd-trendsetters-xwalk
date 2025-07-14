/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all direct child divs (the columns)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));
  // For each column, include its contents (images, etc.) directly in the cell
  const cells = [
    ['Columns (columns12)'],
    columnDivs.map(col => {
      // If the column div is empty, return an empty string
      if (!col.hasChildNodes()) return '';
      // If the column has only one child, return the element directly
      if (col.childNodes.length === 1) {
        return col.firstElementChild || col.firstChild;
      }
      // Otherwise, gather all children into an array
      return Array.from(col.childNodes);
    })
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

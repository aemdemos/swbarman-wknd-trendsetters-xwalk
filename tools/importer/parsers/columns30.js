/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs, which represent columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, extract the main content (use inner img if present)
  const contentRow = columns.map((col) => {
    const img = col.querySelector('img');
    if (img) return img;
    return col;
  });

  // Header row: must be a single cell array
  const headerRow = ['Columns (columns30)'];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}

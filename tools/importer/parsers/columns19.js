/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that contains the columns
  const grid = element.querySelector('.w-layout-grid');
  let columns = [];
  if (grid) {
    const gridChildren = Array.from(grid.children);
    // The content structure in the HTML:
    // [0]: div (headings & paragraph)
    // [1]: ul (contact list)
    // [2]: img (image)
    // But visually in the screenshot, the text (headings/para) is left, contact list is right, image is bottom.
    // The Columns block, however, expects all the main content columns in the 2nd row.
    // Here, combine intro info and contacts into two columns, and image in a third column, as in the HTML structure.

    // Column 1: Heading and subheading
    const column1 = gridChildren[0] ? [gridChildren[0]] : [];
    // Column 2: Contact list (ul)
    const column2 = gridChildren[1] ? [gridChildren[1]] : [];
    // Column 3: Image
    const column3 = gridChildren[2] ? [gridChildren[2]] : [];

    columns = [column1, column2, column3];
  } else {
    // fallback if no grid found, use element's children as single column
    columns = [[...element.children]];
  }

  // Flatten empty columns to empty string, otherwise reference the elements array
  const colRow = columns.map(col => (col && col.length ? col : ''));
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns19)'],
    colRow
  ], document);
  element.replaceWith(table);
}

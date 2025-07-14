/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container
  const grid = element.querySelector('.w-layout-grid');
  let columns = [];
  if (grid) {
    // .w-layout-grid > div/ul/img are direct children and represent columns (content left, list right, image)
    // We'll capture them in order as columns
    const gridChildren = Array.from(grid.children);
    // For each child, push as is
    columns = gridChildren.map((col) => col);
  } else {
    // fallback to entire element as single column
    columns = [element];
  }
  // Build the block table
  const cells = [
    ['Columns (columns19)'],
    columns
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

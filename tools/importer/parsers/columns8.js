/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout containing columns
  const grid = element.querySelector('.grid-layout');
  let colElements = [];

  if (grid) {
    // For flexibility, treat each immediate child of the grid as a column
    const gridChildren = Array.from(grid.children);
    // Each column's content should include ALL of its content (text, image, etc.)
    colElements = gridChildren.map(col => {
      // Get all children (to include all text and structure)
      // If the column has only text nodes, wrap in a div to preserve block structure
      if (col.children.length === 0 && col.textContent.trim() !== '') {
        const wrapper = document.createElement('div');
        wrapper.textContent = col.textContent;
        return wrapper;
      }
      return col;
    });
  } else {
    // fallback: treat all direct children of element as columns
    colElements = Array.from(element.children);
  }

  // If nothing was found, fallback to the whole element
  if (colElements.length === 0) {
    colElements = [element];
  }

  // The header row, always a single cell EXACTLY as the spec
  const headerRow = ['Columns (columns8)'];
  const cells = [
    headerRow,
    colElements
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

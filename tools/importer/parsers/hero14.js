/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row with the exact block name
  const headerRow = ['Hero (hero14)'];

  // Get the grid columns (top-level grid -> two children)
  // :scope > div.w-layout-grid > div
  let grid;
  if (element.matches('.w-layout-grid')) {
    grid = element;
  } else {
    grid = element.querySelector(':scope > .w-layout-grid');
  }
  // Fallback if not found
  if (!grid) {
    grid = element;
  }
  const gridChildren = grid.querySelectorAll(':scope > div');

  // Row 2: background image (optional)
  let bgImg = null;
  if (gridChildren.length > 0) {
    // Find img (first one in subtree)
    const img = gridChildren[0].querySelector('img');
    if (img) bgImg = img;
  }

  // Row 3: title/subhead/cta group (optional)
  let contentCell = null;
  if (gridChildren.length > 1) {
    // Content typically inside a container div
    // Find the div that contains the headline and button group
    // We'll include all content in that child div
    contentCell = gridChildren[1];
  }

  // Compose the rows (1 col, 3 rows)
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentCell ? contentCell : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

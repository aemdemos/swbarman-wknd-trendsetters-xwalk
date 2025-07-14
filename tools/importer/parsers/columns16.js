/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Columns (columns16)'];

  // === Extract two main columns in the first content row ===
  // Find the grid with two columns at the top
  const grids = element.querySelectorAll('.w-layout-grid.grid-layout');
  // Find the grid with class 'tablet-1-column' (top grid)
  let topGrid = null;
  for (const g of grids) {
    if (g.classList.contains('tablet-1-column')) {
      topGrid = g;
      break;
    }
  }
  // Defensive: if topGrid not found, fallback to first grid
  if (!topGrid) topGrid = grids[0];

  // Get top two columns (should be two children)
  const topCols = Array.from(topGrid.children);
  const leftCol = topCols[0];
  const rightCol = topCols[1];

  // Reference the existing elements, NOT clones
  // This ensures no content is missed, and DOM structure is preserved
  // Remove them from their parent so they can be reused in the table
  if (leftCol.parentNode) leftCol.parentNode.removeChild(leftCol);
  if (rightCol.parentNode) rightCol.parentNode.removeChild(rightCol);

  // === Extract bottom grid images (second content row) ===
  // Find the grid with 'mobile-portrait-1-column' (bottom grid)
  let bottomGrid = null;
  for (const g of grids) {
    if (g.classList.contains('mobile-portrait-1-column')) {
      bottomGrid = g;
      break;
    }
  }
  // Defensive: fallback if not found
  if (!bottomGrid && grids.length > 1) bottomGrid = grids[1];
  if (!bottomGrid) return; // abort if no image grid

  // Get each cell's image element
  const imgCells = Array.from(bottomGrid.querySelectorAll('.utility-aspect-1x1'));
  // For each, reference the existing <img>
  const imgElements = imgCells.map(cell => {
    const img = cell.querySelector('img');
    if (img && img.parentNode) img.parentNode.removeChild(img);
    return img;
  });

  // Clean up: remove bottom grid from DOM so we don't double-use nodes
  if (bottomGrid.parentNode) bottomGrid.parentNode.removeChild(bottomGrid);

  // Assemble the table: header, then two rows, each with two columns
  const cells = [
    headerRow,
    [leftCol, rightCol],
    imgElements
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

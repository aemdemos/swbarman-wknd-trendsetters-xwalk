/* global WebImporter */
export default function parse(element, { document }) {
  // The main container
  const container = element.querySelector(':scope > .container');
  if (!container) return;

  // Find the main grid inside the container
  const mainGrid = container.querySelector(':scope > .w-layout-grid.grid-layout');
  if (!mainGrid) return;

  // The first two children are the columns for heading and quote
  const mainGridChildren = Array.from(mainGrid.children);
  // Defensive: only proceed if we have at least three children (heading, quote, bottom grid)
  if (mainGridChildren.length < 3) return;

  const firstCol = mainGridChildren[0]; // heading
  const secondCol = mainGridChildren[1]; // quote
  const bottomGrid = mainGridChildren[2]; // grid for avatar/meta and logo/svg

  // Bottom grid, expect two columns: left has avatar/name/title, right has logo (svg)
  let bottomLeft = null;
  let bottomRight = null;
  if (bottomGrid && bottomGrid.classList.contains('w-layout-grid')) {
    const bottomChildren = Array.from(bottomGrid.children);
    // left: avatar/name/title, right: logo/svg
    // Let's be flexible: left is the one with ".avatar", right is the one with "svg"
    bottomLeft = bottomChildren.find(div => div.querySelector('.avatar'));
    bottomRight = bottomChildren.find(div => div.querySelector('svg'));
    // fallback: just get first and second
    if (!bottomLeft && bottomChildren.length > 0) bottomLeft = bottomChildren[0];
    if (!bottomRight && bottomChildren.length > 1) bottomRight = bottomChildren[1];
  }

  // Build the 2D array for the table
  const cells = [
    ['Columns (columns27)'],
    [firstCol, secondCol],
    [bottomLeft, bottomRight],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container div which holds the main grid
  const container = element.querySelector(':scope > .container');
  if (!container) return;

  // Find the main grid-layout block (holds the columns)
  const mainGrid = container.querySelector(':scope > .grid-layout');
  if (!mainGrid) return;

  // Get the direct children of the main grid
  const gridChildren = mainGrid.querySelectorAll(':scope > *');
  // Defensive: verify there are at least 3 children
  if (gridChildren.length < 3) return;

  // gridChildren[0]: heading (h2)
  // gridChildren[1]: testimonial/quote (p)
  // gridChildren[2]: nested grid for bottom row with avatar/name and logo
  const h2 = gridChildren[0];
  const quote = gridChildren[1];
  const bottomGrid = gridChildren[2];

  // bottomGrid contains: [divider, flex: avatar+name, logo/svg]
  let leftBottom = null;
  let rightBottom = null;
  if (bottomGrid && bottomGrid.classList.contains('grid-layout')) {
    const bottomGridChildren = bottomGrid.querySelectorAll(':scope > *');
    // Find the avatar+name flex (typically at 1), logo/svg (typically at 2)
    leftBottom = bottomGridChildren[1] || null;
    rightBottom = bottomGridChildren[2] || null;
  }

  // Left column: heading + leftBottom (avatar+name)
  const leftCol = document.createElement('div');
  if (h2) leftCol.appendChild(h2);
  if (leftBottom) leftCol.appendChild(leftBottom);

  // Right column: quote + rightBottom (logo/svg)
  const rightCol = document.createElement('div');
  if (quote) rightCol.appendChild(quote);
  if (rightBottom) rightCol.appendChild(rightBottom);

  // Compose the columns block
  const cells = [
    ['Columns (columns27)'],
    [leftCol, rightCol]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

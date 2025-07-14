/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the exact block header
  const headerRow = ['Hero (hero3)'];

  // Background image row (none in the HTML example)
  const backgroundImageRow = [''];

  // Find content container
  const container = element.querySelector('.container');
  let contentEls = [];

  // Try to find the grid layout
  const grid = container && container.querySelector('.w-layout-grid');
  if (grid) {
    // The left column: heading and subheading
    const leftCol = grid.children[0];
    // The right column: buttons/links
    const rightCol = grid.children[1];

    // Collect heading and subheading if present
    if (leftCol) {
      const heading = leftCol.querySelector('h2, h1, h3, h4, h5, h6');
      if (heading) contentEls.push(heading);
      const subheading = leftCol.querySelector('p');
      if (subheading) contentEls.push(subheading);
    }

    // Collect CTAs as links if present
    if (rightCol) {
      const ctas = Array.from(rightCol.querySelectorAll('a'));
      if (ctas.length) contentEls.push(...ctas);
    }
  }

  // Ensure at least something is in the content cell (fallback for robustness)
  if (contentEls.length === 0) {
    // Place the entire element as fallback if extraction fails (robustness)
    contentEls = [element];
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundImageRow,
    [contentEls]
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}

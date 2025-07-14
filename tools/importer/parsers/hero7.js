/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as per example
  const headerRow = ['Hero (hero7)'];

  // 2. Background image row (empty, as none in source HTML)
  const backgroundRow = [''];

  // 3. Content row: Heading (required), Subheading (optional), CTA (optional)
  // Find the grid
  const grid = element.querySelector('.w-layout-grid');
  let title = null;
  let subheading = null;
  let cta = null;
  if (grid) {
    // Find all direct children of the grid
    const children = Array.from(grid.children);
    children.forEach((child) => {
      // The heading is likely a heading element (h1/h2/h3)
      if (/^H[1-6]$/.test(child.tagName)) {
        title = child;
      } else {
        // Look for subheading (p) and CTA (a)
        const p = child.querySelector('p');
        if (p) subheading = p;
        const a = child.querySelector('a');
        if (a) cta = a;
      }
    });
  }

  // Compose the content cell with referenced elements
  const contentParts = [];
  if (title) contentParts.push(title);
  if (subheading) contentParts.push(subheading);
  if (cta) contentParts.push(cta);
  const contentRow = [contentParts];

  // Final table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, exact as specified
  const headerRow = ['Hero (hero7)'];

  // Second row: background image (not present in this HTML)
  const bgRow = [''];

  // Third row: Title, Subheading, CTA (all optional)
  // For this HTML, get the relevant elements as described
  // Find the grid container (robust to class order/names)
  const grid = element.querySelector(
    '.w-layout-grid, .grid-layout, [class*="grid"]'
  );

  const contentEls = [];

  if (grid) {
    // Find direct children (to keep structure)
    const children = Array.from(grid.children);
    children.forEach((child) => {
      // Headline
      if (/^H[1-6]$/i.test(child.tagName)) {
        contentEls.push(child);
      }
      // Paragraph/CTA group
      else if (child.querySelector) {
        // Paragraph(s)
        child.querySelectorAll('p').forEach(p => contentEls.push(p));
        // CTA(s) (links)
        child.querySelectorAll('a').forEach(a => contentEls.push(a));
      }
    });
  }

  const contentRow = [contentEls];

  // Compose the block table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

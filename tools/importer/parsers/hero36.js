/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row exactly as specified
  const headerRow = ['Hero (hero36)'];

  // 2. Background image row (empty, as there is no bg img in this HTML)
  const bgRow = [''];

  // 3. Content row: Title, Subheading, CTA
  // The actual content is inside a .grid-layout grid with two children:
  //   - First child: heading + subheading
  //   - Second child: CTA link
  const grid = element.querySelector('.grid-layout');
  let contentParts = [];
  if (grid) {
    // First col: heading and subheading
    const gridChildren = Array.from(grid.children);
    if (gridChildren[0]) {
      // preserve all children (e.g. h2, p)
      contentParts.push(...Array.from(gridChildren[0].childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE));
    }
    if (gridChildren[1]) {
      // CTA button (a)
      contentParts.push(gridChildren[1]);
    }
  }
  // Fallback: if grid structure missing, just use direct children
  if (contentParts.length === 0) {
    contentParts = Array.from(element.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);
  }
  const contentRow = [contentParts];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);
  element.replaceWith(table);
}

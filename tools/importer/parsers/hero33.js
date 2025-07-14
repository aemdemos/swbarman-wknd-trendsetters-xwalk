/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout
  const container = element.querySelector(':scope > .container');
  const grid = container && container.querySelector(':scope > .grid-layout');
  if (!grid) return;

  // Find image and content
  const children = Array.from(grid.children);
  let img = null;
  let contentDiv = null;
  for (const child of children) {
    if (child.tagName === 'IMG' && !img) {
      img = child;
    } else if (!contentDiv) {
      contentDiv = child;
    }
  }

  // Compose the table rows as required
  const rows = [];
  rows.push(['Hero (hero33)']);
  rows.push([img || '']);
  rows.push([contentDiv || '']);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

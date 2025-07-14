/* global WebImporter */
export default function parse(element, { document }) {
  // Get the first .w-tab-pane (active tab)
  const firstPane = element.querySelector('.w-tab-pane');
  if (!firstPane) return;

  // Get the first .w-layout-grid inside the pane
  const grid = firstPane.querySelector('.w-layout-grid');
  if (!grid) return;

  // Find the image (background image)
  const img = grid.querySelector('img');

  // Collect all child elements except for images (headings, subheadings, paragraphs, etc.)
  // Use an array of references to existing elements in the DOM
  const textNodes = Array.from(grid.children).filter(el => el.tagName.toLowerCase() !== 'img');

  // If more than one text node, put them directly in an array (no wrapper),
  // so all of them are included in the same cell
  let textContent = '';
  if (textNodes.length === 1) {
    textContent = textNodes[0];
  } else if (textNodes.length > 1) {
    textContent = textNodes;
  }

  const rows = [
    ['Hero (hero23)'],
    [img ? img : ''],
    [textContent]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

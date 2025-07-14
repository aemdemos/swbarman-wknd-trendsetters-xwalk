/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first (active) tab pane (the visible content)
  const activePane = element.querySelector('.w-tab-pane');
  if (!activePane) return;

  // Find the layout grid containing the hero content
  const grid = activePane.querySelector('.w-layout-grid');
  if (!grid) return;

  // Find the main image (acts as the background image for the hero)
  const image = grid.querySelector('img');

  // Gather all direct children under the grid
  const gridChildren = Array.from(grid.children);

  // Extract all heading elements (as title and possibly subtitle)
  const headingEls = gridChildren.filter(el => /^H[1-6]$/i.test(el.tagName));

  // Any other children could be subheading, paragraphs or CTAs (if present)
  const nonHeadingNonImageEls = gridChildren.filter(el => el !== image && !/^H[1-6]$/i.test(el.tagName));

  // Compose the content cell: all headings, then the rest (preserving order)
  const contentCell = [...headingEls, ...nonHeadingNonImageEls];

  const cells = [
    ['Hero (hero23)'],
    [image || ''],
    [contentCell.length ? contentCell : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

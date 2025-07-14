/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that contains the main content and buttons
  const grid = element.querySelector('.grid-layout');

  // Defensive: If no grid found, don't proceed
  if (!grid) return;

  // The block expects 3 rows: header, background image (optional), and main content (headline, subheading, CTA)

  // 1. Header row
  const headerRow = ['Hero (hero3)'];

  // 2. Background image row (none in this HTML, so empty string)
  const backgroundRow = [''];

  // 3. Content row: Headline, subheading, buttons
  // Gather content from both grid children
  const gridChildren = Array.from(grid.children);
  // The text block is the one with h2, the other is button group
  const contentBlock = gridChildren.find(div => div.querySelector('h1, h2, h3, h4, h5, h6'));
  const buttonBlock = gridChildren.find(div => div.classList.contains('button-group'));
  
  const contentElems = [];

  if (contentBlock) {
    // Heading
    const heading = contentBlock.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentElems.push(heading);
    // Subheading (p or .subheading)
    // Grab all elements except the heading
    // Subheading could be in <p> or .subheading
    const paras = Array.from(contentBlock.querySelectorAll('p, .subheading'));
    paras.forEach(p => {
      if (p !== heading && !contentElems.includes(p)) contentElems.push(p);
    });
  }
  // Buttons (all <a> in button group)
  if (buttonBlock) {
    const buttons = Array.from(buttonBlock.querySelectorAll('a'));
    contentElems.push(...buttons);
  }

  const contentRow = [contentElems];

  // Compose the table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

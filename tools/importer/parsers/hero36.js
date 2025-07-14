/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must exactly match the example
  const headerRow = ['Hero (hero36)'];

  // Background image row (optional) - none in provided HTML
  const bgRow = [''];

  // Extract content: Heading, Subheading, CTA (button)
  // The relevant content is inside grid-layout or directly in the element
  let grid = element.querySelector('.w-layout-grid');
  if (!grid) grid = element;
  const gridChildren = Array.from(grid.children);

  // The left block with headings and subheading is the first grid child
  const textCol = gridChildren[0];
  const contentArr = [];
  if (textCol) {
    // Title
    const title = textCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) contentArr.push(title);
    // Subheading -- require it's not the same as title
    const subheading = textCol.querySelector('p, .subheading');
    if (subheading && (!title || subheading !== title)) contentArr.push(subheading);
  }
  // The right block with the CTA is likely the second grid child
  const ctaCol = gridChildren[1];
  if (ctaCol && ctaCol.tagName === 'A') {
    contentArr.push(ctaCol);
  } else if (ctaCol) {
    // If it's not an <a>, look for an <a> inside
    const cta = ctaCol.querySelector('a');
    if (cta) contentArr.push(cta);
  }

  // If no content found, ensure the row is not empty
  if (contentArr.length === 0) contentArr.push(document.createTextNode(''));

  const contentRow = [contentArr];

  const rows = [headerRow, bgRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

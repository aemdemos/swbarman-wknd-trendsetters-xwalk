/* global WebImporter */
export default function parse(element, { document }) {
  // Find the layout grid containing the image and content
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const gridChildren = grid.querySelectorAll(':scope > *');

  let imageEl = null;
  let contentEl = null;

  // Identify which child is the image, which is the content
  for (const child of gridChildren) {
    if (child.tagName === 'IMG') {
      imageEl = child;
    } else {
      contentEl = child;
    }
  }

  // Build the image row cell
  const imageRowCell = imageEl ? [imageEl] : [''];

  // Build the content row cell
  const contentFragments = [];
  if (contentEl) {
    // Retain all content in order: heading, subheading, CTAs
    // Heading
    const heading = contentEl.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentFragments.push(heading);
    // Subheading or paragraph
    const subheading = contentEl.querySelector('p');
    if (subheading) contentFragments.push(subheading);
    // Button group (CTAs)
    const buttonGroup = contentEl.querySelector('.button-group');
    if (buttonGroup) contentFragments.push(buttonGroup);
  }
  const contentRowCell = contentFragments.length ? [contentFragments] : [''];

  // Compose table rows
  const cells = [
    ['Hero (hero2)'],
    imageRowCell,
    contentRowCell
  ];

  // Create and replace with the structured table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

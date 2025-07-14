/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid containing image and text
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get immediate children (typically [image, content])
  const children = grid.querySelectorAll(':scope > *');
  if (children.length < 2) return;
  const imageEl = children[0]; // Should be <img>
  const contentEl = children[1]; // Contains headline, subheading, buttons

  // Build table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl];
  const contentRow = [contentEl];

  // Construct table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}

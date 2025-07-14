/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content wrapper (container > grid-layout)
  const container = element.querySelector(':scope > .container');
  let grid = null;
  if (container) {
    grid = container.querySelector(':scope > .grid-layout');
  }

  // Initialize content pieces
  let headline = null;
  let richText = null;

  // Find headline (usually h2 with h1-heading class)
  if (grid) {
    headline = grid.querySelector('h1, h2, h3, .h1-heading');
  }

  // Find rich text (paragraphs)
  if (grid) {
    // Prefer the rich text block as a whole, preserving structure
    richText = grid.querySelector('.w-richtext, .rich-text, .paragraph-lg');
  }

  // Compose row content (headline + rich text)
  const content = [];
  if (headline) content.push(headline);
  if (richText) content.push(richText);

  // Table header as in the example
  const headerRow = ['Hero (hero31)'];

  // Second row is for background image (none in this HTML, so empty string)
  const bgImageRow = [''];

  // Third row is the text content (headline + paragraphs)
  const contentRow = [content];

  const rows = [headerRow, bgImageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}

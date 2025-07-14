/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Carousel
  const headerRow = ['Carousel (carousel24)'];

  // Find the immediate card-body container (holds content)
  const cardBody = element.querySelector('.card-body');
  if (!cardBody) return;

  // Get the image element (mandatory)
  const img = cardBody.querySelector('img');

  // Get the heading (optional)
  const heading = cardBody.querySelector('.h4-heading');

  // For slide row: first cell is image, second cell is text (can be empty string if absent)
  const slideRow = [img, heading ? heading : ''];

  // Build table rows array
  const rows = [headerRow, slideRow];

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

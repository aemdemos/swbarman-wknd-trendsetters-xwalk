/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Carousel block
  const headerRow = ['Carousel (carousel24)'];

  // Get the deepest .card-body (structure may vary)
  let cardBody = element.querySelector('.card-body');
  if (!cardBody) {
    // fallback: just use the main element
    cardBody = element;
  }

  // Find the mandatory image inside cardBody
  const img = cardBody.querySelector('img');

  // Find heading or title-like element
  // Accept common heading classes or tags, fallback to empty if not found
  let heading = null;
  // Try to find by class
  heading = cardBody.querySelector('.h4-heading, .heading, h1, h2, h3, h4, h5, h6');

  // Prepare the slide row (image in first cell, text in second cell if present)
  const slideRow = [img,
    heading ? heading : ''
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    slideRow
  ], document);

  // Replace original element with the new table
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly the specification
  const headerRow = ['Carousel (carousel17)'];

  // Find grid container that holds all the image slides
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Each direct child of grid is a slide wrapper
  const slides = Array.from(grid.children);

  const rows = slides.map((slide) => {
    // Each slide should have an image inside
    const img = slide.querySelector('img');
    // If no image found, skip this row
    if (!img) return null;
    // Reference the actual image element only (no text for these slides)
    return [img, ''];
  }).filter(Boolean); // Remove any null rows

  // Compose the table as per spec
  const cells = [headerRow, ...rows];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // --- Extract images for background ---
  let images = [];
  // Find the grid that contains hero images
  const grid = element.querySelector('.grid-layout.desktop-3-column');
  if (grid) {
    const imgs = grid.querySelectorAll('img');
    images = Array.from(imgs);
  }
  // If no images, create empty fragment
  let imagesContent;
  if (images.length) {
    const frag = document.createDocumentFragment();
    images.forEach(img => frag.appendChild(img));
    imagesContent = frag;
  } else {
    imagesContent = document.createTextNode('');
  }

  // --- Extract headline, subheading, buttons ---
  // Find the hero content container
  let contentCell = [];
  const contentDiv = element.querySelector('.ix-hero-scale-3x-to-1x-content');
  if (contentDiv) {
    const container = contentDiv.querySelector('.container');
    if (container) {
      // Heading
      const heading = container.querySelector('h1');
      if (heading) contentCell.push(heading);
      // Subheading
      const subheading = container.querySelector('p');
      if (subheading) contentCell.push(subheading);
      // Button(s)
      const buttonGroup = container.querySelector('.button-group');
      if (buttonGroup) {
        // reference each <a> directly
        const links = Array.from(buttonGroup.querySelectorAll('a'));
        contentCell = contentCell.concat(links);
      }
    }
  }

  // If nothing found for content, provide empty content
  if (!contentCell.length) contentCell = [''];

  // --- Compose block table as per block definition ---
  const rows = [
    ['Hero (hero10)'],
    [imagesContent],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
